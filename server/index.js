const express = require('express');
const cors = require('cors'); // 引入 CORS 中间件
const { exec } = require('child_process');
const env = {...process.env, PYTHONIOENCODING: 'utf-8'}; // 设置环境变量
const app = express();
app.use(express.json());
app.use(cors()); // 启用 CORS

app.get('/api/universities', (req, res) => {
  const query = req.query.q || '';
  const type = req.query.type || '';
  const location = req.query.location || '';
  const level = req.query.level || '';

  console.log(`Received query: ${query}, type: ${type}, location: ${location}, level: ${level}`); // 调试信息

  // 构建 Python 脚本命令
  let command = `python data.py "${query}" "${type}" "${location}" "${level}"`;
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

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});