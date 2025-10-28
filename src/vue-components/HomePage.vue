<template>
  <div class="homepage">
    <!-- 轮播图区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>发现有趣的世界</h1>
        <p>加入百度贴吧，找到志同道合的朋友</p>
        
        <!-- 搜索框 -->
        <div class="search-box">
          <input 
            type="text" 
            class="search-input" 
            placeholder="搜索感兴趣的内容..."
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          >
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>
      </div>
    </section>
    
    <!-- 主要内容区域 -->
    <div class="container">
      <div class="main-content">
        <!-- 热门贴吧列表 -->
        <div class="hot-tiebas">
          <div class="section-header">
            <h2 class="section-title">
              <i class="icon">🏠</i> 热门贴吧
            </h2>
            <router-link to="/search" class="more-link">更多 ></router-link>
          </div>
          
          <div class="tieba-grid">
            <div 
              v-for="tieba in tiebaStore.tiebas" 
              :key="tieba.id" 
              class="tieba-item"
              @click="goToTieba(tieba.id)"
            >
              <div class="tieba-avatar">
                {{ tieba.name.charAt(0) }}
              </div>
              <div class="tieba-name">{{ tieba.name }}</div>
              <div class="tieba-members">{{ formatNumber(tieba.member_count) }} 成员</div>
            </div>
          </div>
        </div>
        
        <!-- 热门帖子列表 -->
        <div class="hot-posts">
          <div class="section-header">
            <h2 class="section-title">
              <i class="icon">📝</i> 热门帖子
            </h2>
            <router-link to="/search" class="more-link">更多 ></router-link>
          </div>
          
          <div class="post-list">
            <div 
              v-for="post in postStore.posts" 
              :key="post.id" 
              class="post-item"
              @click="goToPost(post.id)"
            >
              <div class="post-header">
                <div class="post-avatar">
                  {{ post.author_name.charAt(0) }}
                </div>
                <div class="post-meta">
                  <div class="post-author">{{ post.author_name }}</div>
                  <div class="post-time">{{ formatTime(post.created_at) }}</div>
                </div>
              </div>
              <div class="post-title">{{ post.title }}</div>
              <div class="post-content">{{ truncateContent(post.content, 100) }}</div>
              <div class="post-stats">
                <span>{{ post.view_count }} 浏览</span>
                <span>{{ post.reply_count }} 回复</span>
                <span>{{ post.like_count }} 点赞</span>
                <span class="tieba-tag">{{ post.tieba_name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTiebaStore } from '../store/tieba'
import { usePostStore } from '../store/post'

const router = useRouter()
const tiebaStore = useTiebaStore()
const postStore = usePostStore()
const searchQuery = ref('')

// 页面加载时获取数据
onMounted(async () => {
  await Promise.all([
    tiebaStore.fetchHotTiebas(),
    postStore.fetchPosts()
  ])
})

// 跳转到贴吧详情
const goToTieba = (id) => {
  router.push(`/tieba/${id}`)
}

// 跳转到帖子详情
const goToPost = (id) => {
  router.push(`/post/${id}`)
}

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
  }
}

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 格式化时间
const formatTime = (timeString) => {
  const date = new Date(timeString)
  const now = new Date()
  const diff = now - date
  
  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚'
  }
  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    return Math.floor(diff / (60 * 1000)) + '分钟前'
  }
  // 小于24小时
  if (diff < 24 * 60 * 60 * 1000) {
    return Math.floor(diff / (60 * 60 * 1000)) + '小时前'
  }
  // 小于7天
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return Math.floor(diff / (24 * 60 * 60 * 1000)) + '天前'
  }
  
  // 其他情况显示日期
  return date.toLocaleDateString('zh-CN')
}

// 截断内容
const truncateContent = (content, maxLength) => {
  if (content.length <= maxLength) {
    return content
  }
  return content.substring(0, maxLength) + '...'
}
</script>

<style scoped>
.homepage {
  min-height: 100vh;
}

/* 轮播图区域 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
  margin-bottom: 40px;
}

.hero-content h1 {
  font-size: 48px;
  margin-bottom: 20px;
  font-weight: 300;
}

.hero-content p {
  font-size: 20px;
  margin-bottom: 30px;
  opacity: 0.9;
}

.search-box {
  display: flex;
  max-width: min(600px, 90vw);
  width: 100%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.search-input {
  flex: 1;
  padding: 1rem 1.25rem;
  border: none;
  font-size: 1rem;
  outline: none;
  background: transparent;
  color: var(--text-primary);
  min-height: 44px;
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.search-btn {
  background: linear-gradient(135deg, var(--secondary-color), #ff9800);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background: linear-gradient(135deg, #ff9800, var(--secondary-color));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 主要内容区域 */
.main-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

/* 热门贴吧列表 */
.hot-tiebas {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  font-size: 18px;
}

.more-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.more-link:hover {
  color: var(--secondary-color);
}

.tieba-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(120px, 100%), 1fr));
  gap: 1rem;
}

.tieba-item {
  text-align: center;
  padding: 15px 10px;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
  border: 1px solid #f0f0f0;
}

.tieba-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tieba-avatar {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  margin: 0 auto 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.tieba-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tieba-members {
  font-size: 12px;
  color: #999;
}

/* 热门帖子列表 */
.hot-posts {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.post-item:hover {
  background: rgba(255, 255, 255, 1);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.post-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.post-meta {
  flex: 1;
}

.post-author {
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.post-time {
  color: #999;
  font-size: 12px;
}

.post-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
}

.post-content {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.post-stats {
  display: flex;
  gap: 1rem;
  font-size: 12px;
  color: #999;
}

.tieba-tag {
  margin-left: auto;
  color: var(--primary-color);
  background: rgba(0, 122, 255, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    padding: 40px 20px;
  }
  
  .hero-content h1 {
    font-size: 36px;
  }
  
  .hero-content p {
    font-size: 16px;
  }
  
  .main-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .tieba-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .search-box {
    border-radius: 20px;
  }
  
  .search-btn {
    padding: 0.75rem 1.25rem;
  }
  
  .post-stats {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .tieba-tag {
    margin-left: 0;
    order: -1;
  }
}
</style>