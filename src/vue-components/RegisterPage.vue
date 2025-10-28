<template>
  <div class="register-page">
    <div class="container">
      <div class="register-container">
        <div class="register-header">
          <h1>注册百度贴吧账号</h1>
          <p>加入我们，发现更精彩的世界</p>
        </div>
        
        <div class="register-form">
          <div class="form-group">
            <label for="username">用户名</label>
            <input 
              id="username"
              v-model="username"
              type="text"
              placeholder="请设置用户名（3-20个字符）"
              class="form-input"
              :class="{ error: errors.username }"
              @keyup.enter="handleRegister"
            >
            <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input 
              id="password"
              v-model="password"
              type="password"
              placeholder="请设置密码（至少6位）"
              class="form-input"
              :class="{ error: errors.password }"
              @keyup.enter="handleRegister"
            >
            <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input 
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              class="form-input"
              :class="{ error: errors.confirmPassword }"
              @keyup.enter="handleRegister"
            >
            <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
          </div>
          
          <div class="form-group">
            <label for="email">邮箱（选填）</label>
            <input 
              id="email"
              v-model="email"
              type="email"
              placeholder="用于找回密码"
              class="form-input"
              :class="{ error: errors.email }"
              @keyup.enter="handleRegister"
            >
            <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
          </div>
          
          <div class="form-agreement">
            <label class="agreement-checkbox">
              <input type="checkbox" v-model="agreed">
              <span>我已阅读并同意 <a href="#">用户协议</a> 和 <a href="#">隐私政策</a></span>
            </label>
          </div>
          <div v-if="errors.agreed" class="error-message agreement-error">{{ errors.agreed }}</div>
          
          <button 
            class="register-button"
            :disabled="isLoading"
            @click="handleRegister"
          >
            {{ isLoading ? '注册中...' : '注册' }}
          </button>
          
          <div class="form-footer">
            <p>已有账号？ <a href="/login" class="login-link">立即登录</a></p>
          </div>
        </div>
      </div>
      
      <div class="register-bg">
        <div class="bg-content">
          <h2>百度贴吧</h2>
          <p>发现有趣的内容，结识志同道合的朋友</p>
          <div class="features">
            <div class="feature-item">
              <i class="feature-icon">🌟</i>
              <span>百万个兴趣吧</span>
            </div>
            <div class="feature-item">
              <i class="feature-icon">💬</i>
              <span>实时互动交流</span>
            </div>
            <div class="feature-item">
              <i class="feature-icon">📸</i>
              <span>分享精彩瞬间</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';

const router = useRouter();
const userStore = useUserStore();

// 表单数据
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const email = ref('');
const agreed = ref(false);
const isLoading = ref(false);
const errors = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  agreed: '',
  general: ''
});

// 处理注册
async function handleRegister() {
  // 表单验证
  resetErrors();
  let isValid = true;
  
  // 用户名验证
  if (!username.value.trim()) {
    errors.username = '请设置用户名';
    isValid = false;
  } else if (username.value.length < 3 || username.value.length > 20) {
    errors.username = '用户名长度应为3-20个字符';
    isValid = false;
  }
  
  // 密码验证
  if (!password.value) {
    errors.password = '请设置密码';
    isValid = false;
  } else if (password.value.length < 6) {
    errors.password = '密码长度至少为6位';
    isValid = false;
  }
  
  // 确认密码验证
  if (password.value !== confirmPassword.value) {
    errors.confirmPassword = '两次输入的密码不一致';
    isValid = false;
  }
  
  // 邮箱验证
  if (email.value && !isValidEmail(email.value)) {
    errors.email = '请输入有效的邮箱地址';
    isValid = false;
  }
  
  // 协议同意验证
  if (!agreed.value) {
    errors.agreed = '请阅读并同意用户协议和隐私政策';
    isValid = false;
  }
  
  if (!isValid) {
    return;
  }
  
  try {
    isLoading.value = true;
    
    // 调用用户store中的注册方法
    await userStore.register({
      username: username.value,
      password: password.value,
      email: email.value
    });
    
    // 注册成功后自动登录并跳转到首页
    await userStore.login({
      username: username.value,
      password: password.value
    });
    
    router.push('/');
  } catch (error) {
    // 处理注册失败
    errors.general = error.message || '注册失败，请稍后重试';
  } finally {
    isLoading.value = false;
  }
}

// 邮箱格式验证
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 重置错误信息
function resetErrors() {
  errors.username = '';
  errors.password = '';
  errors.confirmPassword = '';
  errors.email = '';
  errors.agreed = '';
  errors.general = '';
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  max-width: 1200px;
  width: 100%;
  display: flex;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.register-container {
  flex: 1;
  padding: 40px;
  max-width: 500px;
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.register-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.register-header p {
  color: #666;
  font-size: 16px;
}

.register-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: #f093fb;
  outline: none;
  box-shadow: 0 0 0 2px rgba(240, 147, 251, 0.2);
}

.form-input.error {
  border-color: #ff3b30;
}

.error-message {
  color: #ff3b30;
  font-size: 14px;
  margin-top: 5px;
}

.agreement-error {
  margin-top: -10px;
  margin-bottom: 15px;
}

.form-agreement {
  margin: 20px 0;
  font-size: 14px;
}

.agreement-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
}

.agreement-checkbox input {
  margin-top: 3px;
}

.agreement-checkbox a {
  color: #f093fb;
  text-decoration: none;
}

.agreement-checkbox a:hover {
  text-decoration: underline;
}

.register-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.register-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #e878f0 0%, #e6465c 100%);
}

.register-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
}

.login-link {
  color: #f093fb;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

.register-bg {
  flex: 1;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-content h2 {
  font-size: 36px;
  margin-bottom: 15px;
}

.bg-content p {
  font-size: 18px;
  margin-bottom: 40px;
  opacity: 0.9;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 18px;
}

.feature-icon {
  font-size: 24px;
}

/* 响应式设计 */
@media (max-width: 900px) {
  .register-bg {
    display: none;
  }
  
  .register-container {
    max-width: 100%;
    margin: 0 auto;
  }
}

@media (max-width: 500px) {
  .register-container {
    padding: 30px 20px;
  }
  
  .register-header h1 {
    font-size: 28px;
  }
  
  .form-input {
    padding: 10px;
    font-size: 14px;
  }
}
</style>