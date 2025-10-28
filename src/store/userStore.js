import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 用户信息
    userInfo: null,
    // 登录状态
    isLoggedIn: false,
    // 加载状态
    loading: false
  }),
  
  getters: {
    // 获取用户名
    username: (state) => {
      return state.userInfo?.username || '未登录用户'
    },
    
    // 获取用户ID
    userId: (state) => {
      return state.userInfo?.userId || ''
    },
    
    // 获取用户头像
    avatar: (state) => {
      return state.userInfo?.avatar || 'https://picsum.photos/200/200'
    }
  },
  
  actions: {
    // 登录
    async login(userData) {
      this.loading = true
      try {
        // 在实际应用中，这里应该调用API进行登录验证
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟登录成功后的用户数据
        const mockUserInfo = {
          userId: '10086',
          username: userData.username || userData.phone || '百度用户10086',
          avatar: 'https://picsum.photos/200/200',
          token: 'mock_token_' + Date.now(),
          level: 8,
          signature: '热爱生活，分享美好'
        }
        
        // 更新状态
        this.userInfo = mockUserInfo
        this.isLoggedIn = true
        
        // 保存到本地存储
        localStorage.setItem('user', JSON.stringify(mockUserInfo))
        
        ElMessage.success('登录成功')
        return true
      } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error('登录失败，请重试')
        return false
      } finally {
        this.loading = false
      }
    },
    
    // 注册
    async register(userData) {
      this.loading = true
      try {
        // 在实际应用中，这里应该调用API进行注册
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        ElMessage.success('注册成功！请登录')
        return true
      } catch (error) {
        console.error('注册失败:', error)
        ElMessage.error('注册失败，请重试')
        return false
      } finally {
        this.loading = false
      }
    },
    
    // 退出登录
    logout() {
      // 清除本地存储
      localStorage.removeItem('user')
      
      // 更新状态
      this.userInfo = null
      this.isLoggedIn = false
      
      ElMessage.success('已退出登录')
    },
    
    // 检查登录状态
    checkLoginStatus() {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const userData = JSON.parse(userStr)
          this.userInfo = userData
          this.isLoggedIn = true
          return true
        }
        return false
      } catch (error) {
        console.error('检查登录状态失败:', error)
        return false
      }
    },
    
    // 更新用户信息
    async updateUserInfo(newInfo) {
      try {
        // 在实际应用中，这里应该调用API更新用户信息
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 更新本地状态
        this.userInfo = { ...this.userInfo, ...newInfo }
        
        // 更新本地存储
        localStorage.setItem('user', JSON.stringify(this.userInfo))
        
        ElMessage.success('个人信息更新成功')
        return true
      } catch (error) {
        console.error('更新用户信息失败:', error)
        ElMessage.error('更新失败，请重试')
        return false
      }
    },
    
    // 清除用户状态
    clearUserState() {
      localStorage.removeItem('user')
      this.userInfo = null
      this.isLoggedIn = false
    }
  }
})