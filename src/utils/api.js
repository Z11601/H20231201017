// API服务模块 - 封装HTTP请求
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 后端API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 从本地存储获取token
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : ''
    
    // 如果有token，添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 直接返回响应数据
    return response.data
  },
  error => {
    // 处理错误响应
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 401:
          // 未授权，清除本地存储并重定向到登录页
          localStorage.removeItem('user')
          ElMessage.error('登录已过期，请重新登录')
          window.location.href = '/login'
          break
        case 403:
          ElMessage.error('没有权限访问该资源')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(`请求失败: ${error.response.data.message || '未知错误'}`)
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      ElMessage.error('网络错误，请检查您的网络连接')
    } else {
      // 请求配置出错
      ElMessage.error(`请求配置错误: ${error.message}`)
    }
    
    return Promise.reject(error)
  }
)

// 封装GET请求
export const get = (url, params = {}) => {
  return api.get(url, { params })
}

// 封装POST请求
export const post = (url, data = {}) => {
  return api.post(url, data)
}

// 封装PUT请求
export const put = (url, data = {}) => {
  return api.put(url, data)
}

// 封装DELETE请求
export const del = (url, params = {}) => {
  return api.delete(url, { params })
}

// 用户相关API
export const userApi = {
  // 用户登录
  login: (data) => post('/user/login', data),
  
  // 用户注册
  register: (data) => post('/user/register', data),
  
  // 获取用户信息
  getUserInfo: () => get('/user/info'),
  
  // 更新用户信息
  updateUserInfo: (data) => put('/user/info', data),
  
  // 修改密码
  changePassword: (data) => put('/user/password', data),
  
  // 发送验证码
  sendCode: (phone) => get('/user/sendCode', { phone })
}

// 帖子相关API
export const postApi = {
  // 获取帖子列表
  getPosts: (params) => get('/posts', params),
  
  // 获取帖子详情
  getPostDetail: (postId) => get(`/posts/${postId}`),
  
  // 创建帖子
  createPost: (data) => post('/posts', data),
  
  // 更新帖子
  updatePost: (postId, data) => put(`/posts/${postId}`, data),
  
  // 删除帖子
  deletePost: (postId) => del(`/posts/${postId}`),
  
  // 点赞帖子
  likePost: (postId) => post(`/posts/${postId}/like`),
  
  // 取消点赞
  unlikePost: (postId) => del(`/posts/${postId}/like`),
  
  // 收藏帖子
  collectPost: (postId) => post(`/posts/${postId}/collect`),
  
  // 取消收藏
  uncollectPost: (postId) => del(`/posts/${postId}/collect`)
}

// 评论相关API
export const commentApi = {
  // 获取评论列表
  getComments: (postId, params) => get(`/posts/${postId}/comments`, params),
  
  // 创建评论
  createComment: (postId, data) => post(`/posts/${postId}/comments`, data),
  
  // 创建回复
  createReply: (postId, commentId, data) => post(`/posts/${postId}/comments/${commentId}/replies`, data),
  
  // 删除评论
  deleteComment: (postId, commentId) => del(`/posts/${postId}/comments/${commentId}`),
  
  // 点赞评论
  likeComment: (commentId) => post(`/comments/${commentId}/like`),
  
  // 取消点赞
  unlikeComment: (commentId) => del(`/comments/${commentId}/like`)
}

// 贴吧相关API
export const tiebaApi = {
  // 获取贴吧列表
  getTiebas: (params) => get('/tiebas', params),
  
  // 获取贴吧详情
  getTiebaDetail: (tiebaId) => get(`/tiebas/${tiebaId}`),
  
  // 搜索贴吧
  searchTiebas: (keyword) => get('/tiebas/search', { keyword }),
  
  // 关注贴吧
  followTieba: (tiebaId) => post(`/tiebas/${tiebaId}/follow`),
  
  // 取消关注
  unfollowTieba: (tiebaId) => del(`/tiebas/${tiebaId}/follow`),
  
  // 获取关注的贴吧
  getFollowingTiebas: () => get('/user/following-tiebas')
}

// 导出默认的api实例
export default api