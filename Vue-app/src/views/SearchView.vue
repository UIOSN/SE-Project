<template>
    <div class="search-view">
      <div class="search-box">
        <input type="text" v-model="query" placeholder="输入院校名称或地区...">
        <button @click="searchUniversities">搜索</button>
      </div>
      
      <div class="filter-section">
        <div class="filter-group">
          <label>院校类型:</label>
          <select v-model="filters.type" @change="searchUniversities">
            <option value="">全部</option>
            <option value="综合类">综合类</option>
            <option value="理工类">理工类</option>
            <option value="师范类">师范类</option>
            <option value="医药类">医药类</option>
            <option value="语言类">语言类</option>
            <option value="艺术类">艺术类</option>
            <option value="财经类">财经类</option>
            <option value="政法类">政法类</option>
            <option value="农林类">农林类</option>
            <option value="体育类">体育类</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>所在地区:</label>
          <select v-model="filters.location" @change="searchUniversities">
            <option value="">全部</option>
            <option value="北京">北京</option>
            <option value="上海">上海</option>
            <option value="广东">广东</option>
            <option value="江苏">江苏</option>
            <option value="浙江">浙江</option>
            <option value="山东">山东</option>
            <option value="湖北">湖北</option>
            <option value="湖南">湖南</option>
            <option value="四川">四川</option>
            <option value="重庆">重庆</option>
            <option value="陕西">陕西</option>
            <option value="福建">福建</option>
            <option value="河北">河北</option>
            <option value="山西">山西</option>
            <option value="辽宁">辽宁</option>
            <option value="吉林">吉林</option>
            <option value="黑龙江">黑龙江</option>
            <option value="安徽">安徽</option>
            <option value="江西">江西</option>
            <option value="河南">河南</option>
            <option value="广西">广西</option>
            <option value="云南">云南</option>
            <option value="贵州">贵州</option>
            <option value="甘肃">甘肃</option>
            <option value="青海">青海</option>
            <option value="宁夏">宁夏</option>
            <option value="新疆">新疆</option>
            <option value="内蒙古">内蒙古</option>
            <option value="西藏">西藏</option>
            <option value="海南">海南</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>院校层次:</label>
          <select v-model="filters.level" @change="searchUniversities">
            <option value="">全部</option>
            <option value="985">985工程</option>
            <option value="211">211工程</option>
          </select>
        </div>
      </div>
      
      <div class="school-list">
        <div class="school-card" v-for="school in results" :key="school.id">
          <div class="school-badges">
            <div class="school-badge" v-if="school.is985">985</div>
            <div class="school-badge" v-if="school.is211">211</div>
          </div>
          <h3>{{ school.school_name }}</h3>
          <p class="school-location">{{ school.province_name }} · {{ school.school_type }}</p>
          <div class="school-stats">
          </div>
          <button class="detail-button">查看详情</button>
        </div>
      </div>
    </div>
</template>

<script src="./SearchView.script.js"></script>

<style scoped>
  .search-view {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .search-box {
    display: flex;
    gap: 1rem;
  }
  
  .search-box input {
    flex: 1;
    padding: 0.8rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .search-box button {
    padding: 0 2rem;
    background-color: #1976d2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .search-box button:hover {
    background-color: #1565c0;
  }
  
  .filter-section {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
  }
  
  .filter-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .filter-group label {
    font-weight: bold;
    color: #555;
  }
  
  .filter-group select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .school-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .school-card {
    background-color: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
  }
  
  .school-badges {
    display: flex;
    gap: 0.5rem;
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
  
  .school-badge {
    background-color: #ff9800;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
  }
  
  .school-card h3 {
    color: #1976d2;
    margin-bottom: 0.5rem;
  }
  
  .school-location {
    color: #666;
    margin-bottom: 1.5rem;
  }
  
  .school-stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  
  .school-stats div {
    text-align: center;
  }
  
  .school-stats span {
    display: block;
    font-size: 0.9rem;
    color: #888;
  }
  
  .school-stats strong {
    font-size: 1.2rem;
    color: #333;
  }
  
  .detail-button {
    width: 100%;
    padding: 0.8rem;
    background-color: #f5f5f5;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .detail-button:hover {
    background-color: #e0e0e0;
  }
</style>