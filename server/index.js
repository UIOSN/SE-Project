const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// 初始化应用
const app = express();
app.use(bodyParser.json());
app.use(cors());

// 连接 MongoDB 数据库
mongoose.connect('mongodb://localhost:27017/universities', { useNewUrlParser: true, useUnifiedTopology: true });

// 定义院校数据模型
const UniversitySchema = new mongoose.Schema({
  name: String,
  location: String,
});
const University = mongoose.model('University', UniversitySchema);

// API 路由
app.get('/api/universities', async (req, res) => {
  const query = req.query.q || '';
  const universities = await University.find({
    $or: [
      { name: new RegExp(query, 'i') },
      { location: new RegExp(query, 'i') },
    ],
  });
  res.json(universities);
});

app.post('/api/universities', async (req, res) => {
  const { name, location } = req.body;
  const university = new University({ name, location });
  await university.save();
  res.status(201).json(university);
});

// 启动服务
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});