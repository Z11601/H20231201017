<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- 百度贴吧Logo -->
      <router-link to="/" class="logo">百度贴吧</router-link>
      
      <!-- 导航链接 - 桌面端 -->
      <ul class="nav-links" :class="{ active: isMenuOpen }">
        <li><router-link to="/">首页</router-link></li>
        <li><router-link to="/hot">热门</router-link></li>
        <li><router-link to="/follow">关注</router-link></li>
        <li><router-link to="/recommend">推荐</router-link></li>
      </ul>
      
      <!-- 用户操作区 -->
      <div class="nav-user">
        <el-button size="small" type="primary" plain>
          <router-link to="/post/create">发布</router-link>
        </el-button>
        
        <template v-if="isLoggedIn">
          <el-dropdown>
            <span class="user-avatar">
              <img src="/src/assets/avatar-placeholder.png" alt="用户头像">
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <router-link to="/user/profile">个人中心</router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <router-link to="/user/messages">消息通知</router-link>
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        
        <template v-else>
          <router-link to="/login" class="nav-link">登录</router-link>
          <router-link to="/register" class="nav-link">注册</router-link>
        </template>
      </div>
      
      <!-- 汉堡菜单按钮 - 移动端 -->
      <button class="nav-toggle" :class="{ active: isMenuOpen }" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const isMenuOpen = ref(false)
const isLoggedIn = ref(false)

// 切换菜单显示/隐藏
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 处理退出登录
const handleLogout = () => {
  // 清除登录状态
  localStorage.removeItem('userToken')
  localStorage.removeItem('userInfo')
  isLoggedIn.value = false
  ElMessage.success('退出登录成功')
  router.push('/')
}

// 检查登录状态
const checkLoginStatus = () => {
  const token = localStorage.getItem('userToken')
  if (token) {
    isLoggedIn.value = true
  }
}

// 处理点击外部关闭菜单
const handleClickOutside = (event) => {
  const navToggle = document.querySelector('.nav-toggle')
  const navLinks = document.querySelector('.nav-links')
  
  if (isMenuOpen.value && !navToggle.contains(event.target) && !navLinks.contains(event.target)) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  checkLoginStatus()
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
  box-shadow: var(--shadow-light);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--border-color);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1rem, 4vw, 2rem);
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.logo {
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
}

.nav-links {
  display: flex;
  gap: clamp(1rem, 3vw, 2rem);
  list-style: none;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-primary);
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-medium);
  position: relative;
}

.nav-links a:hover {
  color: var(--primary-color);
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.nav-user {
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  align-items: center;
  flex-shrink: 0;
}

.nav-link {
  text-decoration: none;
  color: var(--text-primary);
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: var(--primary-color);
}

.user-avatar {
  display: flex;
  cursor: pointer;
}

.user-avatar img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

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

/* 移动端样式 */
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