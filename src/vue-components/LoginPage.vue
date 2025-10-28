<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="logo">
          <div class="logo-text">百度贴吧</div>
          <div class="logo-slogan">全球最大的中文社区</div>
        </div>
      </div>
      
      <div class="login-content">
        <div class="login-form-wrapper">
          <div class="login-tabs">
            <el-tabs v-model="activeTab" type="card">
              <el-tab-pane label="账号密码登录" name="account">
                <template #label>
                  <span class="tab-label">账号密码登录</span>
                </template>
              </el-tab-pane>
              <el-tab-pane label="短信登录" name="sms">
                <template #label>
                  <span class="tab-label">短信登录</span>
                </template>
              </el-tab-pane>
            </el-tabs>
          </div>
          
          <!-- 账号密码登录表单 -->
          <el-form 
            v-if="activeTab === 'account'"
            :model="accountForm" 
            :rules="accountRules"
            ref="accountFormRef"
            @keyup.enter="handleAccountLogin"
          >
            <div class="form-group">
              <el-form-item prop="username">
                <el-input 
                  v-model="accountForm.username" 
                  placeholder="用户名/手机号/邮箱"
                  prefix-icon="User"
                  :validate-event="false"
                />
              </el-form-item>
            </div>
            
            <div class="form-group">
              <el-form-item prop="password">
                <el-input 
                  v-model="accountForm.password" 
                  type="password" 
                  placeholder="密码"
                  prefix-icon="Lock"
                  show-password
                  :validate-event="false"
                />
              </el-form-item>
            </div>
            
            <div class="form-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <router-link to="/forget-password" class="forgot-password">忘记密码？</router-link>
            </div>
            
            <div class="form-actions">
              <el-button 
                type="primary" 
                class="login-button" 
                @click="handleAccountLogin"
                :loading="isLoading"
              >
                登录
              </el-button>
            </div>
          </el-form>
          
          <!-- 短信登录表单 -->
          <el-form 
            v-if="activeTab === 'sms'"
            :model="smsForm" 
            :rules="smsRules"
            ref="smsFormRef"
            @keyup.enter="handleSmsLogin"
          >
            <div class="form-group">
              <el-form-item prop="phone">
                <el-input 
                  v-model="smsForm.phone" 
                  placeholder="手机号"
                  prefix-icon="Cellphone"
                  :validate-event="false"
                />
              </el-form-item>
            </div>
            
            <div class="form-group">
              <el-form-item prop="code">
                <el-input 
                  v-model="smsForm.code" 
                  placeholder="短信验证码"
                  prefix-icon="ChatLineRound"
                  :validate-event="false"
                >
                  <template #append>
                    <el-button 
                      @click="sendVerificationCode"
                      :disabled="countdown > 0"
                    >
                      {{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            
            <div class="form-actions">
              <el-button 
                type="primary" 
                class="login-button" 
                @click="handleSmsLogin"
                :loading="isLoading"
              >
                登录
              </el-button>
            </div>
          </el-form>
          
          <div class="register-link">
            还没有账号？<router-link to="/register">立即注册</router-link>
          </div>
        </div>
        
        <div class="login-banner">
          <div class="banner-content">
            <h2>欢迎来到百度贴吧</h2>
            <p>发现有趣的世界，结交志同道合的朋友</p>
            <div class="feature-list">
              <div class="feature-item">
                <el-icon><ChatDotSquare /></el-icon>
                <span>参与热门话题讨论</span>
              </div>
              <div class="feature-item">
                <el-icon><StarFilled /></el-icon>
                <span>关注感兴趣的贴吧</span>
              </div>
              <div class="feature-item">
                <el-icon><Message /></el-icon>
                <span>分享你的精彩生活</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="login-footer">
        <div class="footer-links">
          <router-link to="/about">关于我们</router-link>
          <span>|</span>
          <router-link to="/privacy">隐私政策</router-link>
          <span>|</span>
          <router-link to="/terms">服务条款</router-link>
          <span>|</span>
          <router-link to="/help">帮助中心</router-link>
        </div>
        <div class="copyright">© 2023 百度贴吧 版权所有</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  User,
  Lock,
  Cellphone,
  ChatLineRound,
  ChatDotSquare,
  StarFilled,
  Message
} from '@element-plus/icons-vue'

const router = useRouter()
const accountFormRef = ref()
const smsFormRef = ref()
const activeTab = ref('account')
const rememberMe = ref(false)
const isLoading = ref(false)
const countdown = ref(0)
let countdownTimer = null

// 账号密码登录表单
const accountForm = reactive({
  username: '',
  password: ''
})

// 短信登录表单
const smsForm = reactive({
  phone: '',
  code: ''
})

// 账号密码登录规则
const accountRules = reactive({
  username: [
    { required: true, message: '请输入用户名/手机号/邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

// 短信登录规则
const smsRules = reactive({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { 
      pattern: /^1[3-9]\d{9}$/, 
      message: '请输入正确的手机号', 
      trigger: 'blur' 
    }
  ],
  code: [
    { required: true, message: '请输入短信验证码', trigger: 'blur' },
    { 
      pattern: /^\d{6}$/, 
      message: '请输入6位数字验证码', 
      trigger: 'blur' 
    }
  ]
})

// 账号密码登录
const handleAccountLogin = async () => {
  if (!accountFormRef.value) return
  
  try {
    await accountFormRef.value.validate()
    isLoading.value = true
    
    // 模拟登录请求
    setTimeout(() => {
      isLoading.value = false
      
      // 保存用户信息到本地存储
      localStorage.setItem('user', JSON.stringify({
        username: accountForm.username,
        token: 'mock_token_' + Date.now()
      }))
      
      ElMessage.success('登录成功')
      
      // 跳转到首页或之前的页面
      router.push('/')
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 短信登录
const handleSmsLogin = async () => {
  if (!smsFormRef.value) return
  
  try {
    await smsFormRef.value.validate()
    isLoading.value = true
    
    // 模拟登录请求
    setTimeout(() => {
      isLoading.value = false
      
      // 保存用户信息到本地存储
      localStorage.setItem('user', JSON.stringify({
        phone: smsForm.phone,
        token: 'mock_token_' + Date.now()
      }))
      
      ElMessage.success('登录成功')
      
      // 跳转到首页或之前的页面
      router.push('/')
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!smsFormRef.value) return
  
  try {
    // 只验证手机号
    await smsFormRef.value.validateField('phone')
    
    // 模拟发送验证码请求
    ElMessage.success('验证码已发送，请注意查收')
    
    // 开始倒计时
    startCountdown()
  } catch (error) {
    console.error('手机号验证失败:', error)
  }
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  
  countdownTimer = setInterval(() => {
    countdown.value--
    
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

// 检查是否已登录
const checkLoginStatus = () => {
  const user = localStorage.getItem('user')
  if (user) {
    // 如果已登录，跳转到首页
    router.push('/')
    return true
  }
  return false
}

onMounted(() => {
  // 检查是否已登录
  checkLoginStatus()
})

onUnmounted(() => {
  // 清除倒计时计时器
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 1200px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
}

.login-header {
  padding: 20px 40px;
  border-bottom: 1px solid #f0f0f0;
}

.logo {
  display: flex;
  flex-direction: column;
}

.logo-text {
  font-size: 28px;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 5px;
}

.logo-slogan {
  font-size: 14px;
  color: var(--text-secondary);
}

.login-content {
  display: flex;
  flex: 1;
}

.login-form-wrapper {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.login-tabs {
  margin-bottom: 30px;
}

.tab-label {
  font-size: 16px;
  font-weight: 500;
}

.form-group {
  margin-bottom: 20px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.forgot-password {
  color: var(--primary-color);
  font-size: 14px;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.form-actions {
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 22px;
}

.register-link {
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
}

.register-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

.login-banner {
  width: 500px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.banner-content h2 {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 15px;
}

.banner-content p {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 40px;
  line-height: 1.6;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 16px;
}

.login-footer {
  padding: 20px 40px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
  font-size: 13px;
  color: var(--text-secondary);
}

.footer-links {
  margin-bottom: 10px;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  margin: 0 10px;
}

.footer-links a:hover {
  color: var(--primary-color);
}

.footer-links span {
  margin: 0 10px;
  color: #ddd;
}

@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
  }
  
  .login-banner {
    width: 100%;
    padding: 30px 20px;
    text-align: center;
  }
  
  .feature-item {
    justify-content: center;
  }
  
  .login-form-wrapper {
    padding: 20px;
  }
  
  .login-header {
    padding: 20px;
    text-align: center;
  }
}
</style>