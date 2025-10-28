<template>
  <div class="app">
    <!-- 导航栏 -->
    <Navbar />
    
    <!-- 路由视图 -->
    <router-view />
    
    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './vue-components/Navbar.vue'
import Footer from './vue-components/Footer.vue'
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #007AFF;
  --secondary-color: #5856D6;
  --success-color: #34C759;
  --warning-color: #FF9500;
  --error-color: #FF3B30;
  --text-primary: #000000;
  --text-secondary: #8E8E93;
  --background-primary: #FFFFFF;
  --background-secondary: #F2F2F7;
  --border-color: #C6C6C8;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--background-secondary);
  color: var(--text-primary);
  line-height: 1.6;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>