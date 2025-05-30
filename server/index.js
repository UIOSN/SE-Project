const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');

const env = {...process.env, PYTHONIOENCODING: 'utf-8'};
const app = express();

app.use(express.json());
app.use(cors());

// **数据库配置** - 请替换为您的实际数据库信息
const dbConfig = {
  host: '117.72.218.50',     // 您的远程服务器地址
  user: 'sh',               // 数据库用户名
  password: '123456',           // 数据库密码
  database: 'se_project',
  charset: 'utf8mb4',
  port: 3306
};

// **JWT密钥** - 生产环境请使用环境变量
const JWT_SECRET = '2545166808';

// 创建数据库连接池
const pool = mysql.createPool(dbConfig);

// **用户注册API**
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, phone, email, password, userType } = req.body;
    
    // 基本验证
    if (!name || !phone || !email || !password || !userType) {
      return res.status(400).json({ 
        success: false, 
        message: '所有字段都是必填的' 
      });
    }

    // 检查用户是否已存在
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ? OR phone = ?',
      [email, phone]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: '邮箱或手机号已被注册' 
      });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入新用户
    const [result] = await pool.execute(
      'INSERT INTO users (name, phone, email, password, user_type) VALUES (?, ?, ?, ?, ?)',
      [name, phone, email, hashedPassword, userType]
    );

    res.json({ 
      success: true, 
      message: '注册成功',
      userId: result.insertId 
    });

  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

// **用户登录API**
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '邮箱和密码都是必填的' 
      });
    }

    // 查找用户
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: '邮箱或密码错误' 
      });
    }

    const user = users[0];

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: '邮箱或密码错误' 
      });
    }

    // 生成JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        userType: user.user_type 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      success: true, 
      message: '登录成功',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.user_type
      }
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

// 保持原有的大学查询API
app.get('/api/universities', (req, res) => {
  const query = req.query.q || '';
  const type = req.query.type || '';
  const location = req.query.location || '';
  const level = req.query.level || '';

  console.log(`Received query: ${query}, type: ${type}, location: ${location}, level: ${level}`);

  let command = `python3 data.py "${query}" "${type}" "${location}" "${level}"`;
  exec(command, { encoding: 'utf8', env}, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${stderr}`);
      res.status(500).send('Server error');
      return;
    }
    console.log(`Python script output: ${stdout}`);
    res.json(JSON.parse(stdout));
  });
});

// **院校详细信息API**
app.get('/api/school-detail/:id', async (req, res) => {
  try {
    const schoolId = req.params.id;

    const connection = await mysql.createConnection({
      host: "117.72.218.50",
      user: "pan",
      password: "123456",
      database: "gkvr_system"
    });

    const [rows] = await connection.execute(
      'SELECT * FROM school_info_detail WHERE school_id = ?',
      [schoolId]
    );

    await connection.end();

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: '未找到该院校的详细信息' });
    }
  } catch (error) {
    console.error('获取院校详细信息失败:', error);
    res.status(500).json({ 
      message: '服务器错误',
      error: error.message 
    });
  }
});

// **单个院校基本信息API**
app.get('/api/school/:id', async (req, res) => {
  try {
    const schoolId = req.params.id;
    
    const connection = await mysql.createConnection({
      host: "117.72.218.50",
      user: "pan", 
      password: "123456",
      database: "gkvr_system"
    });

    const [rows] = await connection.execute(
      'SELECT * FROM school_info WHERE school_id = ?',
      [schoolId]
    );

    await connection.end();

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: '未找到该院校信息' });
    }
  } catch (error) {
    console.error('获取院校基本信息失败:', error);
    res.status(500).json({ 
      message: '服务器错误',
      error: error.message 
    });
  }
});

// Added API to fetch major scores and province rankings
app.get('/api/school-majors/:id', async (req, res) => {
  try {
    const schoolId = req.params.id;

    const connection = await mysql.createConnection({
      host: "117.72.218.50",
      user: "pan",
      password: "123456",
      database: "gkvr_system"
    });

    const [rows] = await connection.execute(
      'SELECT * FROM major_score WHERE school_id = ?',
      [schoolId]
    );

    await connection.end();

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: '未找到该院校的专业分数线和省份排名' });
    }
  } catch (error) {
    console.error('获取专业分数线和省份排名失败:', error);
    res.status(500).json({ 
      message: '服务器错误',
      error: error.message 
    });
  }
});


//dify 调用API


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
