<template>
    <div class="search-view">
      <div class="search-box">
        <input type="text" placeholder="输入院校名称或地区...">
        <button>搜索</button>
      </div>
      
      <div class="filter-section">
        <div class="filter-group">
          <label>院校类型:</label>
          <select>
            <option>全部</option>
            <option>综合类</option>
            <option>理工类</option>
            <option>师范类</option>
            <option>医药类</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>所在地区:</label>
          <select>
            <option>全部</option>
            <option>北京</option>
            <option>上海</option>
            <option>广东</option>
            <option>江苏</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>院校层次:</label>
          <select>
            <option>全部</option>
            <option>985工程</option>
            <option>211工程</option>
            <option>双一流</option>
          </select>
        </div>
      </div>
      
      <div class="school-list">
        <div class="school-card" v-for="i in 6" :key="i">
          <div class="school-badge">985</div>
          <h3>北京大学</h3>
          <p class="school-location">北京 · 综合类</p>
          <div class="school-stats">
            <div>
              <span>2022最低分</span>
              <strong>680</strong>
            </div>
            <div>
              <span>位次</span>
              <strong>500</strong>
            </div>
          </div>
          <button class="detail-button">查看详情</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchView'
  }
  </script>
  
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
  
  .school-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
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