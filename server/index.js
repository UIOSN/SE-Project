const express = require('express');
const cors = require('cors'); // 引入 CORS 中间件
const { exec } = require('child_process');
const bcrypt = require('bcrypt'); // 添加密码哈希
const jwt = require('jsonwebtoken'); // 添加 JWT
const mysql = require('mysql2/promise'); // 添加 MySQL
require('dotenv').config(); // 添加环境变量支持
const env = {...process.env, PYTHONIOENCODING: 'utf-8'}; // 设置环境变量

const app = express();
app.use(express.json());
app.use(cors()); // 启用 CORS

// 数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'se_project',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 现有的大学查询端点
app.get('/api/universities', (req, res) => {
  const query = req.query.q || '';
  const type = req.query.type || '';
  const location = req.query.location || '';
  const level = req.query.level || '';

  console.log(`Received query: ${query}, type: ${type}, location: ${location}, level: ${level}`); // 调试信息

  // 构建 Python 脚本命令
  let command = `python3 data.py "${query}" "${type}" "${location}" "${level}"`;
  // linux 和 macOS 使用 python3
  exec(command, { encoding: 'utf8', env},(error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${stderr}`); // 调试信息
      res.status(500).send('Server error');
      return;
    }
    console.log(`Python script output: ${stdout}`); // 调试信息
    res.json(JSON.parse(stdout));
  });
});

// 用户注册端点
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstname, phone, email, password, userType } = req.body;
    
    // 验证必填字段
    if (!firstname || !phone || !email || !password || !userType) {
      return res.status(400).json({ error: '所有字段都是必填的' });
    }
    
    // 检查邮箱是否已被注册
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR phone = ?',
      [email, phone]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: '该邮箱或手机号已被注册' });
    }
    
    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 将用户数据插入数据库
    const [result] = await pool.query(
      'INSERT INTO users (name, phone, email, password, user_type) VALUES (?, ?, ?, ?, ?)',
      [firstname, phone, email, hashedPassword, userType.code]
    );
    
    res.status(201).json({
      message: '注册成功',
      userId: result.insertId
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '服务器错误，请稍后再试' });
  }
});

// 用户登录端点
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码都是必填的' });
    }
    
    // 查询用户
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: '邮箱或密码不正确' });
    }
    
    const user = users[0];
    
    // 验证密码
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: '邮箱或密码不正确' });
    }
    
    // 创建JWT令牌
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.user_type },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );
    
    // 返回用户信息和令牌
    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.user_type
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器错误，请稍后再试' });
  }
});

// 验证Token中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: '未提供认证令牌' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: '令牌无效或已过期' });
    }
    req.user = user;
    next();
  });
};

// 获取当前登录用户信息
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, phone, user_type FROM users WHERE id = ?',
      [req.user.userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '服务器错误，请稍后再试' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});