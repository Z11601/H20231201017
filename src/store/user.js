import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    isLoggedIn: false,
    token: localStorage.getItem('token') || null
  }),
  actions: {
    // 登录
    async login(credentials) {
      try {
        // 模拟API调用
        // const response = await axios.post('/api/auth/login/', credentials)
        // this.token = response.data.token
        // this.currentUser = response.data.user
        
        // 模拟数据
        this.token = 'mock-token-123456'
        this.currentUser = {
          id: 1,
          username: credentials.username,
          avatar: '',
          nickname: credentials.username
        }
        this.isLoggedIn = true
        localStorage.setItem('token', this.token)
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },
    
    // 注册
    async register(userData) {
      try {
        // 模拟API调用
        // const response = await axios.post('/api/auth/register/', userData)
        
        // 模拟成功响应
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },
    
    // 登出
    logout() {
      this.token = null
      this.currentUser = null
      this.isLoggedIn = false
      localStorage.removeItem('token')
    },
    
    // 获取用户信息
    async fetchProfile() {
      try {
        if (!this.token) return
        
        // 模拟API调用
        // const response = await axios.get('/api/auth/profile/')
        // this.currentUser = response.data
        
        // 保持当前模拟数据
      } catch (error) {
        console.error('获取用户信息失败:', error)
        this.logout()
      }
    }
  }
})