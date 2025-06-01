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

// **保存用户填写信息API** - 也需要修复
app.post('/api/user/info', async (req, res) => {
  try {
    const { 
      name, score, region, rank, 
      selectedSubjects, preferredMajors, 
      preferredRegions, isArtStudent, remarks 
    } = req.body;
    
    // 从JWT token获取用户ID
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: '请先登录' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // 基本验证
    if (!name || !score || !region) {
      return res.status(400).json({ 
        success: false, 
        message: '姓名、分数和地区是必填项' 
      });
    }

    // 确保数组字段正确转换为JSON字符串
    const safeStringifyArray = (arr) => {
      if (!arr || !Array.isArray(arr)) return JSON.stringify([]);
      return JSON.stringify(arr);
    };

    // 检查是否已有记录，有则更新，没有则插入
    const [existing] = await pool.execute(
      'SELECT id FROM student_info WHERE user_id = ?',
      [userId]
    );

    if (existing.length > 0) {
      // 更新现有记录
      await pool.execute(`
        UPDATE student_info SET 
          name = ?, score = ?, region = ?, rank_in_region = ?,
          selected_subjects = ?, preferred_majors = ?, 
          preferred_regions = ?, is_art_student = ?, 
          remarks = ?, updated_at = NOW()
        WHERE user_id = ?
      `, [
        name, score, region, rank,
        safeStringifyArray(selectedSubjects), 
        safeStringifyArray(preferredMajors),
        safeStringifyArray(preferredRegions), 
        isArtStudent, remarks, userId
      ]);
    } else {
      // 插入新记录
      await pool.execute(`
        INSERT INTO student_info (
          user_id, name, score, region, rank_in_region,
          selected_subjects, preferred_majors, 
          preferred_regions, is_art_student, remarks
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId, name, score, region, rank,
        safeStringifyArray(selectedSubjects), 
        safeStringifyArray(preferredMajors),
        safeStringifyArray(preferredRegions), 
        isArtStudent, remarks
      ]);
    }

    res.json({ success: true, message: '信息保存成功' });
  } catch (error) {
    console.error('保存用户信息失败:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: '无效的登录状态' });
    }
    res.status(500).json({ success: false, message: '保存失败' });
  }
});

// **获取用户填写信息API** - 也需要修复
app.get('/api/user/info', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: '请先登录' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const [rows] = await pool.execute(
      'SELECT * FROM student_info WHERE user_id = ?',
      [userId]
    );

    if (rows.length > 0) {
      const info = rows[0];
      
      // 使用相同的安全解析函数
      const safeParseJSON = (jsonString) => {
        if (!jsonString) return [];
        try {
          if (Array.isArray(jsonString)) return jsonString;
          if (typeof jsonString === 'string') {
            try {
              return JSON.parse(jsonString);
            } catch {
              return jsonString.split(',').filter(item => item.trim() !== '');
            }
          }
          return [];
        } catch (error) {
          console.error('JSON解析失败:', error);
          return [];
        }
      };

      res.json({
        success: true,
        data: {
          name: info.name,
          score: info.score,
          region: info.region,
          rank: info.rank_in_region,
          selectedSubjects: safeParseJSON(info.selected_subjects),
          preferredMajors: safeParseJSON(info.preferred_majors),
          preferredRegions: safeParseJSON(info.preferred_regions),
          isArtStudent: info.is_art_student,
          remarks: info.remarks,
          createdAt: info.created_at,
          updatedAt: info.updated_at
        }
      });
    } else {
      res.json({ success: false, message: '暂无用户信息' });
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: '无效的登录状态' });
    }
    res.status(500).json({ success: false, message: '获取失败' });
  }
});

// **检查用户信息完整性API**
app.get('/api/user/info/status', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: '请先登录' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const [rows] = await pool.execute(
      'SELECT name, score, region FROM student_info WHERE user_id = ?',
      [userId]
    );

    const hasInfo = rows.length > 0 && rows[0].name && rows[0].score && rows[0].region;
    
    res.json({
      success: true,
      hasCompleteInfo: hasInfo,
      message: hasInfo ? '信息已完善' : '信息待完善'
    });
  } catch (error) {
    console.error('检查用户信息状态失败:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: '无效的登录状态' });
    }
    res.status(500).json({ success: false, message: '检查失败' });
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


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
