<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <div class="logo">
          <div class="logo-text">百度贴吧</div>
          <div class="logo-slogan">全球最大的中文社区</div>
        </div>
      </div>
      
      <div class="register-content">
        <div class="register-form-wrapper">
          <div class="register-title">创建新账号</div>
          
          <el-form 
            :model="registerForm" 
            :rules="registerRules"
            ref="registerFormRef"
            @keyup.enter="handleRegister"
          >
            <div class="form-group">
              <el-form-item prop="username">
                <el-input 
                  v-model="registerForm.username" 
                  placeholder="请设置用户名（4-20位字符）"
                  prefix-icon="User"
                  :validate-event="false"
                />
              </el-form-item>
            </div>
            
            <div class="form-group">
              <el-form-item prop="phone">
                <el-input 
                  v-model="registerForm.phone" 
                  placeholder="请输入手机号"
                  prefix-icon="Cellphone"
                  :validate-event="false"
                />
              </el-form-item>
            </div>
            
            <div class="form-group">
              <el-form-item prop="code">
                <el-input 
                  v-model="registerForm.code" 
                  placeholder="请输入短信验证码"
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
            
            <div class="form-group">
              <el-form-item prop="password">
                <el-input 
                  v-model="registerForm.password" 
                  type="password" 
                  placeholder="请设置密码（8-20位，包含字母和数字）"
                  prefix-icon="Lock"
                  show-password
                  :validate-event="false"
                />
              </el-form-item>
            </div>
            
            <div class="form-group">
              <el-form-item prop="confirmPassword">
                <el-input 
                  v-model="registerForm.confirmPassword" 
                  type="password" 
                  placeholder="请确认密码"
                  prefix-icon="Lock"
                  show-password
                  :validate-event="false"
                />
              </el-form-item>
            </div>
            
            <div class="form-options">
              <el-checkbox v-model="agreeTerms" class="terms-checkbox">
                我已阅读并同意
                <a href="/terms" class="terms-link">《用户协议》</a>
                和
                <a href="/privacy" class="terms-link">《隐私政策》</a>
              </el-checkbox>
            </div>
            
            <div class="form-actions">
              <el-button 
                type="primary" 
                class="register-button" 
                @click="handleRegister"
                :loading="isLoading"
              >
                立即注册
              </el-button>
            </div>
          </el-form>
          
          <div class="login-link">
            已有账号？<router-link to="/login">立即登录</router-link>
          </div>
        </div>
        
        <div class="register-banner">
          <div class="banner-content">
            <h2>加入百度贴吧</h2>
            <p>发现精彩内容，分享独特观点，结识志同道合的朋友</p>
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
                <span>发布你的原创内容</span>
              </div>
              <div class="feature-item">
                <el-icon><Top /></el-icon>
                <span>登上热门，被更多人关注</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="register-footer">
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
  Cellphone,
  ChatLineRound,
  Lock,
  ChatDotSquare,
  StarFilled,
  Message,
  Top
} from '@element-plus/icons-vue'

const router = useRouter()
const registerFormRef = ref()
const agreeTerms = ref(false)
const isLoading = ref(false)
const countdown = ref(0)
let countdownTimer = null

// 注册表单
const registerForm = reactive({
  username: '',
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
})

// 注册规则
const registerRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 20, message: '用户名长度应为4-20个字符', trigger: 'blur' }
  ],
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
  ],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度应为8-20个字符', trigger: 'blur' },
    { 
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,20}$/, 
      message: '密码必须包含字母和数字', 
      trigger: 'blur' 
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ]
})

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  // 验证是否同意协议
  if (!agreeTerms.value) {
    ElMessage.warning('请阅读并同意用户协议和隐私政策')
    return
  }
  
  try {
    await registerFormRef.value.validate()
    isLoading.value = true
    
    // 模拟注册请求
    setTimeout(() => {
      isLoading.value = false
      
      ElMessage.success('注册成功！正在跳转到登录页面...')
      
      // 跳转到登录页面
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    }, 1500)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!registerFormRef.value) return
  
  try {
    // 只验证手机号
    await registerFormRef.value.validateField('phone')
    
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
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 1200px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
}

.register-header {
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

.register-content {
  display: flex;
  flex: 1;
}

.register-form-wrapper {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.register-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 30px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-options {
  margin-bottom: 30px;
}

.terms-checkbox {
  font-size: 14px;
  color: var(--text-secondary);
}

.terms-link {
  color: var(--primary-color);
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.form-actions {
  margin-bottom: 20px;
}

.register-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 22px;
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
}

.login-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

.register-banner {
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
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 16px;
}

.register-footer {
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
  .register-content {
    flex-direction: column;
  }
  
  .register-banner {
    width: 100%;
    padding: 30px 20px;
    text-align: center;
  }
  
  .feature-item {
    justify-content: center;
  }
  
  .register-form-wrapper {
    padding: 20px;
  }
  
  .register-header {
    padding: 20px;
    text-align: center;
  }
}
</style>