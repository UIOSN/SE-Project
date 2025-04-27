<template>
  <div class="app-container">
    <header class="app-header">
      <h1>高考志愿填报助手</h1>
      <nav class="nav-menu">
        <router-link to="/">首页</router-link>
        <router-link to="/search">院校查询</router-link>
        <router-link to="/volunteer">志愿填报</router-link>
      </nav>
    </header>
    
    <main class="app-main">
      <router-view></router-view>
    </main>
    
    <footer class="app-footer">
      <p>© 2025 高考志愿填报助手 - 仅供演示使用</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Microsoft YaHei', sans-serif;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #1976d2;
  color: white;
  padding: 1rem;
  text-align: center;
}

.nav-menu {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.nav-menu a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-menu a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-menu a.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.3);
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background-color: #f5f5f5;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}
</style>