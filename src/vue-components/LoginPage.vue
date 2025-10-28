<template>
  <div class="login-page">
    <div class="container">
      <div class="login-container">
        <div class="login-header">
          <h1>登录百度贴吧</h1>
          <p>登录后享受更多功能</p>
        </div>
        
        <div class="login-form">
          <div class="form-group">
            <label for="username">用户名</label>
            <input 
              id="username"
              v-model="username"
              type="text"
              placeholder="请输入用户名"
              class="form-input"
              :class="{ error: errors.username }"
              @keyup.enter="handleLogin"
            >
            <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input 
              id="password"
              v-model="password"
              type="password"
              placeholder="请输入密码"
              class="form-input"
              :class="{ error: errors.password }"
              @keyup.enter="handleLogin"
            >
            <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
          </div>
          
          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe">
              <span>记住我</span>
            </label>
            <a href="#" class="forgot-password">忘记密码？</a>
          </div>
          
          <button 
            class="login-button"
            :disabled="isLoading"
            @click="handleLogin"
          >
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
          
          <div class="form-footer">
            <p>还没有账号？ <a href="/register" class="register-link">立即注册</a></p>
          </div>
        </div>
        
        <div class="other-login-options">
          <div class="divider">
            <span>其他登录方式</span>
          </div>
          
          <div class="social-login">
            <button class="social-btn wechat">
              <i class="social-icon">💚</i>
              微信登录
            </button>
            <button class="social-btn qq">
              <i class="social-icon">💙</i>
              QQ登录
            </button>
          </div>
        </div>
      </div>
      
      <div class="login-bg">
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
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../store/user';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 表单数据
const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);
const errors = reactive({
  username: '',
  password: '',
  general: ''
});

// 处理登录
async function handleLogin() {
  // 表单验证
  resetErrors();
  let isValid = true;
  
  if (!username.value.trim()) {
    errors.username = '请输入用户名';
    isValid = false;
  }
  
  if (!password.value) {
    errors.password = '请输入密码';
    isValid = false;
  } else if (password.value.length < 6) {
    errors.password = '密码长度至少为6位';
    isValid = false;
  }
  
  if (!isValid) {
    return;
  }
  
  try {
    isLoading.value = true;
    
    // 调用用户store中的登录方法
    await userStore.login({
      username: username.value,
      password: password.value
    });
    
    // 登录成功后跳转
    // 获取跳转前的页面，如果有的话，否则跳转到首页
    const redirect = route.query.redirect || '/';
    router.push(redirect);
  } catch (error) {
    // 处理登录失败
    errors.general = error.message || '登录失败，请检查您的用户名和密码';
  } finally {
    isLoading.value = false;
  }
}

// 重置错误信息
function resetErrors() {
  errors.username = '';
  errors.password = '';
  errors.general = '';
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
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

.login-container {
  flex: 1;
  padding: 40px;
  max-width: 500px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
  font-size: 16px;
}

.login-form {
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
  border-color: #007aff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
}

.form-input.error {
  border-color: #ff3b30;
}

.error-message {
  color: #ff3b30;
  font-size: 14px;
  margin-top: 5px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.forgot-password {
  color: #007aff;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover:not(:disabled) {
  background-color: #0056cc;
}

.login-button:disabled {
  background-color: #b3d4fc;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
}

.register-link {
  color: #007aff;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

.other-login-options {
  margin-top: 30px;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider span {
  padding: 0 10px;
  color: #999;
  font-size: 14px;
}

.social-login {
  display: flex;
  gap: 15px;
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  background-color: #f5f5f5;
}

.social-icon {
  font-size: 20px;
}

.login-bg {
  flex: 1;
  background: linear-gradient(135deg, #007aff, #0056cc);
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
  .login-bg {
    display: none;
  }
  
  .login-container {
    max-width: 100%;
    margin: 0 auto;
  }
}

@media (max-width: 500px) {
  .login-container {
    padding: 30px 20px;
  }
  
  .login-header h1 {
    font-size: 28px;
  }
  
  .form-input {
    padding: 10px;
    font-size: 14px;
  }
  
  .social-login {
    flex-direction: column;
  }
}
</style>