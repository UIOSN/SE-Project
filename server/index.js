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
  user: 'pan',               // 数据库用户名
  password: '123456',           // 数据库密码
  database: 'se_project',
  charset: 'utf8mb4',
  port: 3306,
  connectTimeout:60000,
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

// **获取用户基本信息API**
app.get('/api/user/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: '请先登录' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // 获取用户基本信息
    const [userRows] = await pool.execute(
      'SELECT id, name, email, phone, user_type, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    const user = userRows[0];

    // 获取用户填写的学生信息（如果有）
    const [studentRows] = await pool.execute(
      'SELECT * FROM student_info WHERE user_id = ?',
      [userId]
    );

    let studentInfo = null;
    if (studentRows.length > 0) {
      const row = studentRows[0];
      
      // 安全解析JSON字段的函数
      const safeParseJSON = (jsonString) => {
        if (!jsonString) return [];
        try {
          // 如果已经是数组，直接返回
          if (Array.isArray(jsonString)) return jsonString;
          
          // 如果是JSON字符串，解析它
          if (typeof jsonString === 'string') {
            // 先尝试直接解析JSON
            try {
              return JSON.parse(jsonString);
            } catch {
              // 如果失败，可能是逗号分隔的字符串，转换为数组
              return jsonString.split(',').filter(item => item.trim() !== '');
            }
          }
          
          return [];
        } catch (error) {
          console.error('JSON解析失败:', error, 'Original data:', jsonString);
          return [];
        }
      };

      studentInfo = {
        name: row.name,
        score: row.score,
        region: row.region,
        rank: row.rank_in_region,
        selectedSubjects: safeParseJSON(row.selected_subjects),
        preferredMajors: safeParseJSON(row.preferred_majors),
        preferredRegions: safeParseJSON(row.preferred_regions),
        isArtStudent: row.is_art_student,
        remarks: row.remarks,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.name,
          email: user.email,
          phone: user.phone,
          userType: user.user_type,
          createdAt: user.created_at
        },
        studentInfo: studentInfo
      }
    });
  } catch (error) {
    console.error('获取用户资料失败:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: '无效的登录状态' });
    }
    res.status(500).json({ success: false, message: '获取失败' });
  }
});
//dify 调用API


// **添加收藏院校API**
app.post('/api/user/favorites', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: '请先登录' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    
    const { 
      school_id, 
      school_name, 
      province_name, 
      school_type, 
      is985, 
      is211, 
      score, 
      rank_num 
    } = req.body;
    
    // 打印调试信息
    console.log('收到的收藏数据:', {
      school_id, 
      school_name, 
      province_name, 
      school_type, 
      is985, 
      is211, 
      score, 
      rank_num
    });
    
    if (!school_id || !school_name) {
      return res.status(400).json({ 
        success: false, 
        message: '院校ID和名称是必填的' 
      });
    }

    // 检查是否已经收藏
    const [existing] = await pool.execute(
      'SELECT id FROM user_favorites WHERE user_id = ? AND school_id = ?',
      [userId, school_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: '该院校已在收藏列表中' 
      });
    }

    // 更严格地处理所有可能的 undefined 值
    const safeSchoolId = school_id || null;
    const safeSchoolName = school_name || null;
    const safeProvinceName = province_name === undefined ? null : province_name;
    const safeSchoolType = school_type === undefined ? null : school_type;
    const safeIs985 = is985 === true || is985 === 1 ? 1 : 0;
    const safeIs211 = is211 === true || is211 === 1 ? 1 : 0;
    const safeScore = (score === undefined || score === null || score === '') ? null : parseInt(score, 10);
    const safeRankNum = (rank_num === undefined || rank_num === null || rank_num === '') ? null : parseInt(rank_num, 10);

    console.log('处理后的安全值:', {
      userId,
      safeSchoolId,
      safeSchoolName,
      safeProvinceName,
      safeSchoolType,
      safeIs985,
      safeIs211,
      safeScore,
      safeRankNum
    });

    // 验证所有参数都不是 undefined
    const params = [
      userId,
      safeSchoolId,
      safeSchoolName,
      safeProvinceName,
      safeSchoolType,
      safeIs985,
      safeIs211,
      safeScore,
      safeRankNum
    ];

    // 检查是否有 undefined 值
    const hasUndefined = params.some(param => param === undefined);
    if (hasUndefined) {
      console.error('参数中包含 undefined 值:', params);
      return res.status(400).json({ 
        success: false, 
        message: '数据格式错误' 
      });
    }

    // 添加收藏
    await pool.execute(`
      INSERT INTO user_favorites (
        user_id, school_id, school_name, province_name, 
        school_type, is985, is211, score, rank_num
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, params);

    res.json({ success: true, message: '收藏成功' });
  } catch (error) {
    console.error('添加收藏失败:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: '无效的登录状态' });
    }
    res.status(500).json({ success: false, message: '收藏失败' });
  }
});

// **获取用户收藏列表API**
app.get('/api/user/favorites', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: '请先登录' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const [rows] = await pool.execute(`
      SELECT * FROM user_favorites 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, [userId]);

    // 转换数据格式以匹配前端期望
    const favorites = rows.map(row => ({
      id: row.school_id,
      school_id: row.school_id,
      name: row.school_name,
      school_name: row.school_name,
      location: row.province_name,
      province_name: row.province_name,
      school_type: row.school_type,
      tags: [
        ...(row.is985 ? ['985'] : []),
        ...(row.is211 ? ['211'] : [])
      ],
      score: row.score,
      rank: row.rank_num,
      logo: `/logo/${row.school_id}.jpg`,
      created_at: row.created_at
    }));

    res.json({ success: true, data: favorites });
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: '无效的登录状态' });
    }
    res.status(500).json({ success: false, message: '获取失败' });
  }
});

// **删除收藏院校API**
app.delete('/api/user/favorites/:schoolId', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: '请先登录' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const schoolId = req.params.schoolId;

    const [result] = await pool.execute(
      'DELETE FROM user_favorites WHERE user_id = ? AND school_id = ?',
      [userId, schoolId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: '该院校不在收藏列表中' 
      });
    }

    res.json({ success: true, message: '取消收藏成功' });
  } catch (error) {
    console.error('取消收藏失败:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: '无效的登录状态' });
    }
    res.status(500).json({ success: false, message: '取消收藏失败' });
  }
});

// **检查院校是否已收藏API**
app.get('/api/user/favorites/check/:schoolId', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: '请先登录' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const schoolId = req.params.schoolId;

    const [rows] = await pool.execute(
      'SELECT id FROM user_favorites WHERE user_id = ? AND school_id = ?',
      [userId, schoolId]
    );

    res.json({ 
      success: true, 
      isFavorited: rows.length > 0 
    });
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: '无效的登录状态' });
    }
    res.status(500).json({ success: false, message: '检查失败' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
