// 工具函数模块 - 提供常用的辅助方法

/**
 * 格式化时间显示
 * @param {string|Date} time - 时间字符串或Date对象
 * @param {boolean} full - 是否显示完整时间
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (time, full = false) => {
  if (!time) return ''
  
  const date = typeof time === 'string' ? new Date(time) : time
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  const months = Math.floor(diff / 2592000000)
  const years = Math.floor(diff / 31536000000)
  
  // 如果是今天
  if (date.toDateString() === now.toDateString()) {
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  // 如果是昨天
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return `昨天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  }
  
  // 如果是今年
  if (date.getFullYear() === now.getFullYear()) {
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
  }
  
  // 超过一年
  if (years > 0) {
    return `${years}年前`
  }
  
  // 其他情况
  if (full) {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

/**
 * 截断文本
 * @param {string} text - 要截断的文本
 * @param {number} maxLength - 最大长度
 * @param {string} suffix - 后缀，默认为...
 * @returns {string} 截断后的文本
 */
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + suffix
}

/**
 * 从HTML字符串中提取纯文本
 * @param {string} html - HTML字符串
 * @returns {string} 纯文本
 */
export const htmlToText = (html) => {
  if (!html) return ''
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  return tempDiv.textContent || tempDiv.innerText || ''
}

/**
 * 格式化数字（如：1000 -> 1k）
 * @param {number} num - 数字
 * @returns {string} 格式化后的数字
 */
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0'
  
  const n = Number(num)
  if (isNaN(n)) return '0'
  
  if (n >= 100000000) {
    return (n / 100000000).toFixed(1).replace(/\.0$/, '') + '亿'
  }
  
  if (n >= 10000) {
    return (n / 10000).toFixed(1).replace(/\.0$/, '') + '万'
  }
  
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  
  return n.toString()
}

/**
 * 验证手机号
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
export const isValidPhone = (phone) => {
  if (!phone) return false
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证邮箱
 * @param {string} email - 邮箱
 * @returns {boolean} 是否有效
 */
export const isValidEmail = (email) => {
  if (!email) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * 生成随机ID
 * @param {number} length - ID长度
 * @returns {string} 随机ID
 */
export const generateId = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 获取URL参数
 * @param {string} name - 参数名
 * @returns {string|null} 参数值
 */
export const getUrlParam = (name) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r !== null) return decodeURIComponent(r[2])
  return null
}

/**
 * 滚动到页面顶部
 * @param {number} duration - 动画持续时间（毫秒）
 */
export const scrollToTop = (duration = 300) => {
  const start = window.scrollY
  const startTime = performance.now()
  
  const animate = (currentTime) => {
    const elapsedTime = currentTime - startTime
    const progress = Math.min(elapsedTime / duration, 1)
    
    // 使用缓动函数
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    
    window.scrollTo(0, start * (1 - easeProgress))
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖处理后的函数
 */
export const debounce = (func, delay) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} limit - 时间限制（毫秒）
 * @returns {Function} 节流处理后的函数
 */
export const throttle = (func, limit) => {
  let inThrottle = false
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否成功
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 备用方法
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const successful = document.execCommand('copy')
      textArea.remove()
      return successful
    }
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}

/**
 * 检查设备类型
 * @returns {Object} 设备类型对象
 */
export const getDeviceType = () => {
  const ua = navigator.userAgent
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua)
  const isIOS = /iPhone|iPad|iPod/i.test(ua)
  const isAndroid = /Android/i.test(ua)
  
  return {
    isMobile,
    isTablet,
    isIOS,
    isAndroid,
    isDesktop: !isMobile
  }
}

/**
 * 处理图片URL，添加默认图片
 * @param {string} url - 图片URL
 * @param {string} defaultUrl - 默认图片URL
 * @returns {string} 处理后的图片URL
 */
export const processImageUrl = (url, defaultUrl = 'https://picsum.photos/200/200') => {
  return url && url.trim() ? url : defaultUrl
}

/**
 * 生成随机头像URL
 * @param {string} seed - 随机种子
 * @returns {string} 头像URL
 */
export const getRandomAvatar = (seed) => {
  // 使用picsum.photos提供的随机图片服务
  return `https://picsum.photos/seed/${seed || Math.random()}/200/200`
}

/**
 * 获取用户等级对应的颜色
 * @param {number} level - 用户等级
 * @returns {string} 等级颜色
 */
export const getLevelColor = (level) => {
  if (level >= 10) return '#FF6600' // 高级用户 - 橙色
  if (level >= 7) return '#FF9900'  // 资深用户 - 深黄色
  if (level >= 4) return '#33CC33'  // 活跃用户 - 绿色
  return '#999999'                  // 新用户 - 灰色
}

/**
 * 判断是否为管理员
 * @param {Object} userInfo - 用户信息
 * @returns {boolean} 是否为管理员
 */
export const isAdmin = (userInfo) => {
  return userInfo && (userInfo.role === 'admin' || userInfo.isAdmin === true)
}

/**
 * 判断是否为吧主
 * @param {string} userId - 用户ID
 * @param {Object} tiebaInfo - 贴吧信息
 * @returns {boolean} 是否为吧主
 */
export const isTiebaOwner = (userId, tiebaInfo) => {
  return userId && tiebaInfo && tiebaInfo.ownerId === userId
}

/**
 * 判断是否为小吧主
 * @param {string} userId - 用户ID
 * @param {Object} tiebaInfo - 贴吧信息
 * @returns {boolean} 是否为小吧主
 */
export const isTiebaModerator = (userId, tiebaInfo) => {
  return userId && tiebaInfo && tiebaInfo.moderators && tiebaInfo.moderators.includes(userId)
}