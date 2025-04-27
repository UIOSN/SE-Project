<template>
  <div class="home-container">
    <!-- 新版英雄区 -->
    <section class="ai-hero">
      <div class="hero-content">
        <div class="title-group">
          <h1>AI高考志愿规划专家</h1>
          <p class="subtitle">基于大语言模型的智能推荐系统，为您量身定制最佳志愿方案</p>
        </div>
        
        <div class="cta-card">
          <h3>开始智能填报</h3>
          <p>只需3步获取个性化方案：</p>
          <ol>
            <li>输入成绩和选科</li>
            <li>描述您的偏好</li>
            <li>获取AI推荐方案</li>
          </ol>
          <router-link to="/volunteer" class="cta-button">
            立即体验 AI 填报 →
          </router-link>
        </div>
      </div>
      <!-- <div class="hero-image">
        <img src="@/assets/ai-education.png" alt="AI志愿填报示意图">
      </div> -->
    </section>

    <!-- 核心优势展示 -->
    <section class="advantages">
      <h2>为什么选择AI志愿填报？</h2>
      <div class="advantage-grid">
        <div class="advantage-card">
          <div class="icon">🤖</div>
          <h3>智能算法推荐</h3>
          <p>结合历年录取数据和实时就业趋势，为您推荐最优组合</p>
        </div>
        <div class="advantage-card">
          <div class="icon">📊</div>
          <h3>多维数据分析</h3>
          <p>考虑院校、专业、地域、就业等20+维度</p>
        </div>
        <div class="advantage-card">
          <div class="icon">⚡</div>
          <h3>实时方案优化</h3>
          <p>根据您的反馈实时调整推荐策略</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.ai-hero {
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-bottom: 4rem;
}

.hero-content {
  flex: 1;
}

.hero-image {
  flex: 1;
}
.cta-card {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
}
.hero-image img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.title-group {
  display: grid;
  place-items: center;
}
h1 {
  font-size: 2.8rem;
  color: #1a365d;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #4a5568;
  margin-bottom: 2rem;
}

.cta-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  margin-top: 2rem;
}

.cta-card h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.cta-card ol {
  margin: 1rem 0 1.5rem;
  padding-left: 1.5rem;
}

.cta-card li {
  margin-bottom: 0.5rem;
}

.cta-button {
  display: inline-block;
  background: #4299e1;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
}

.cta-button:hover {
  background: #3182ce;
  transform: translateY(-2px);
}

.advantages {
  margin-top: 4rem;
}

.advantage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.advantage-card {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: all 0.3s;
}

.advantage-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.advantage-card .icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.advantage-card h3 {
  font-size: 1.3rem;
  color: #2d3748;
  margin-bottom: 0.8rem;
}

.advantage-card p {
  color: #4a5568;
  line-height: 1.6;
}
</style>