<template>
    <div class="volunteer-container">
      <div class="ai-volunteer">
        <!-- 左侧输入表单 -->
        <div class="input-panel">
          <h2>填报信息录入</h2>
          
          <div class="form-group">
            <label>高考分数</label>
            <input type="number" v-model="score" placeholder="请输入高考总分">
          </div>
          
          <div class="form-group">
            <label>全省排名</label>
            <input type="number" v-model="rank" placeholder="请输入全省排名">
          </div>
          
          <div class="form-group">
            <label>选考科目</label>
            <div class="subject-selector">
              <label v-for="subject in subjects" :key="subject">
                <input type="checkbox" v-model="selectedSubjects" :value="subject">
                {{ subject }}
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label>意向地区</label>
            <select v-model="selectedRegion">
              <option v-for="region in regions" :key="region" :value="region">
                {{ region }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>专业偏好</label>
            <textarea v-model="preferences" placeholder="例如：想学计算机相关专业，倾向985高校..."></textarea>
          </div>
          
          <button class="submit-btn" @click="submitInfo">
            <span v-if="!loading">生成AI志愿方案</span>
            <span v-else>AI分析中...</span>
          </button>
        </div>
        
        <!-- 右侧AI对话区 -->
        <div class="ai-dialog">
          <div class="dialog-header">
            <div class="ai-avatar">AI</div>
            <h3>志愿规划助手</h3>
          </div>
          
          <div class="messages">
            <div v-for="(msg, index) in messages" :key="index" 
                 :class="['message', msg.role]">
              <div class="message-content">
                {{ msg.content }}
              </div>
            </div>
            
            <div v-if="loading" class="message ai">
              <div class="message-content typing">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>
          
          <div class="input-area">
            <input 
              v-model="userInput" 
              @keyup.enter="sendMessage"
              placeholder="与AI助手交流...">
            <button @click="sendMessage">发送</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'VolunteerView',
    data() {
      return {
        score: '',
        rank: '',
        selectedSubjects: [],
        selectedRegion: '',
        preferences: '',
        userInput: '',
        loading: false,
        subjects: ['物理', '化学', '生物', '历史', '地理', '政治'],
        regions: ['不限', '北京', '上海', '广东', '江苏', '浙江', '其他'],
        messages: [
          {
            role: 'ai',
            content: '您好！我是高考志愿AI助手，请先填写您的基本信息，我将为您生成个性化志愿方案。'
          }
        ]
      }
    },
    methods: {
      submitInfo() {
        if (!this.score || !this.rank) {
          this.addMessage('ai', '请先填写分数和排名信息');
          return;
        }
        
        this.loading = true;
        
        // 模拟AI分析过程
        setTimeout(() => {
          this.addMessage('ai', `已收到您的信息：
          - 分数: ${this.score}
          - 排名: ${this.rank}
          - 选科: ${this.selectedSubjects.join(',')}
          - 地区: ${this.selectedRegion}
          正在为您分析...`);
          
          // 模拟AI推荐结果
          setTimeout(() => {
            this.addMessage('ai', `根据您的信息，我为您推荐以下志愿方案：
            
            【冲一冲】
            1. XX大学 - 计算机科学与技术 (录取概率35%)
            2. XX大学 - 人工智能 (录取概率30%)
            
            【稳一稳】
            1. XX大学 - 软件工程 (录取概率65%)
            2. XX大学 - 数据科学 (录取概率60%)
            
            【保一保】
            1. XX大学 - 信息安全 (录取概率85%)
            2. XX大学 - 网络工程 (录取概率90%)`);
            this.loading = false;
          }, 1500);
        }, 800);
      },
      sendMessage() {
        if (!this.userInput.trim()) return;
        
        this.addMessage('user', this.userInput);
        const userMessage = this.userInput;
        this.userInput = '';
        
        this.loading = true;
        
        // 模拟AI回复
        setTimeout(() => {
          this.addMessage('ai', `关于"${userMessage}"，根据近年数据：
          1. 该专业就业率92%
          2. 平均起薪6500元
          3. 推荐院校: XX大学(排名前10)`);
          this.loading = false;
        }, 1000);
      },
      addMessage(role, content) {
        this.messages.push({ role, content });
        this.$nextTick(() => {
          const container = this.$el.querySelector('.messages');
          container.scrollTop = container.scrollHeight;
        });
      }
    }
  }
  </script>
  
  <style scoped>
  .volunteer-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .ai-volunteer {
    display: flex;
    gap: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 5px 30px rgba(0,0,0,0.1);
    overflow: hidden;
  }
  
  .input-panel {
    flex: 0 0 400px;
    padding: 2rem;
    background: #f8fafc;
    border-right: 1px solid #e2e8f0;
  }
  
  .input-panel h2 {
    color: #1a365d;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #2d3748;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
    font-size: 1rem;
  }
  
  .form-group textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  .subject-selector {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .subject-selector label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: normal;
    cursor: pointer;
  }
  
  .submit-btn {
    width: 100%;
    padding: 1rem;
    background: #4299e1;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 1rem;
  }
  
  .submit-btn:hover {
    background: #3182ce;
  }
  
  .ai-dialog {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 2rem;
  }
  
  .dialog-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .ai-avatar {
    width: 40px;
    height: 40px;
    background: #4299e1;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
  
  .messages {
    flex: 1;
    overflow-y: auto;
    padding-right: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .message {
    margin-bottom: 1.5rem;
    max-width: 80%;
  }
  
  .message.user {
    margin-left: auto;
  }
  
  .message-content {
    padding: 1rem;
    border-radius: 12px;
    line-height: 1.6;
  }
  
  .message.ai .message-content {
    background: #edf2f7;
    border-bottom-left-radius: 0;
  }
  
  .message.user .message-content {
    background: #4299e1;
    color: white;
    border-bottom-right-radius: 0;
  }
  
  .typing {
    display: flex;
    gap: 5px;
  }
  
  .dot {
    width: 8px;
    height: 8px;
    background: #a0aec0;
    border-radius: 50%;
    animation: bounce 1s infinite alternate;
  }
  
  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes bounce {
    to {
      transform: translateY(-5px);
      opacity: 0.5;
    }
  }
  
  .input-area {
    display: flex;
    gap: 0.5rem;
  }
  
  .input-area input {
    flex: 1;
    padding: 0.8rem 1rem;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
  }
  
  .input-area button {
    padding: 0 1.5rem;
    background: #4299e1;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  </style>