<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- Logo -->
      <router-link to="/" class="logo">百度贴吧</router-link>
      
      <!-- 汉堡菜单按钮（移动端） -->
      <button class="nav-toggle" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <!-- 导航链接 -->
      <ul class="nav-links" :class="{ active: menuOpen }">
        <li><router-link to="/" @click="closeMenu">首页</router-link></li>
        <li><router-link to="/search" @click="closeMenu">发现</router-link></li>
        <li><router-link to="/create-post" @click="closeMenu">发帖</router-link></li>
      </ul>
      
      <!-- 用户操作 -->
      <div class="nav-user">
        <!-- 未登录状态 -->
        <template v-if="!userStore.isLoggedIn">
          <router-link to="/login" class="btn btn-secondary">登录</router-link>
          <router-link to="/register" class="btn btn-primary">注册</router-link>
        </template>
        
        <!-- 已登录状态 -->
        <template v-else>
          <el-dropdown>
            <div class="user-info">
              <div class="user-avatar">{{ userStore.currentUser?.username.charAt(0) || '用' }}</div>
              <span class="user-name">{{ userStore.currentUser?.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToProfile">个人中心</el-dropdown-item>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'

const userStore = useUserStore()
const router = useRouter()
const menuOpen = ref(false)

// 切换菜单
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

// 关闭菜单
const closeMenu = () => {
  menuOpen.value = false
}

// 跳转到个人中心
const goToProfile = () => {
  router.push('/user/profile')
}

// 退出登录
const logout = () => {
  userStore.logout()
  router.push('/')
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  const navToggle = document.querySelector('.nav-toggle')
  const navLinks = document.querySelector('.nav-links')
  
  if (navToggle && !navToggle.contains(event.target) && 
      navLinks && !navLinks.contains(event.target)) {
    closeMenu()
  }
}

onMounted(() => {
  // 检查用户登录状态
  if (userStore.token) {
    userStore.fetchProfile()
  }
  
  // 添加点击外部事件监听
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--border-color);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
}

/* 汉堡菜单按钮 */
.nav-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  padding: 0.5rem;
  background: none;
  border: none;
  z-index: 1001;
}

.nav-toggle span {
  width: 25px;
  height: 3px;
  background: var(--text-primary);
  margin: 3px 0;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.nav-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.nav-toggle.active span:nth-child(2) {
  opacity: 0;
}

.nav-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  position: relative;
}

.nav-links a:hover {
  color: var(--primary-color);
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.nav-user {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.user-info:hover {
  background: rgba(0, 0, 0, 0.05);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.user-name {
  font-size: 14px;
  color: var(--text-primary);
}

/* 按钮样式 */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
}

/* 移动端导航样式 */
@media (max-width: 768px) {
  .nav-toggle {
    display: flex;
  }

  .nav-links {
    position: fixed;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100vh;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    transition: left 0.3s ease;
    z-index: 1000;
  }

  .nav-links.active {
    left: 0;
  }

  .nav-links a {
    font-size: 1.25rem;
    padding: 1rem 2rem;
    width: 80%;
    text-align: center;
    border: 1px solid var(--border-color);
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .nav-user {
    gap: 0.5rem;
  }

  .nav-user .btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}
</style>