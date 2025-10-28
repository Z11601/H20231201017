<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <Navbar />
    
    <!-- 主要内容区域 -->
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
  --shadow-light: rgba(0, 0, 0, 0.1);
  --shadow-medium: rgba(0, 0, 0, 0.2);
  --shadow-heavy: rgba(0, 0, 0, 0.3);
  --border-radius-small: 8px;
  --border-radius-medium: 12px;
  --border-radius-large: 16px;
  --transition-fast: 0.2s ease;
  --transition-medium: 0.3s ease;
  --transition-slow: 0.5s ease;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>