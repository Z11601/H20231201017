<template>
  <div class="homepage">
    <!-- 轮播图区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1>发现有趣的世界</h1>
        <p>百度贴吧，全球最大的中文社区</p>
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
    </div>
    
    <!-- 主要内容区域 -->
    <div class="container">
      <div class="main-content">
        <!-- 热门贴吧列表 -->
        <div class="hot-tiebas">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><HotFilled /></el-icon> 热门贴吧
            </h2>
            <router-link to="/hot" class="more-link">更多</router-link>
          </div>
          <div class="tieba-grid">
            <div 
              v-for="tieba in hotTiebas" 
              :key="tieba.id" 
              class="tieba-item"
              @click="goToTieba(tieba.id)"
            >
              <div class="tieba-avatar">{{ tieba.name.charAt(0) }}</div>
              <div class="tieba-name">{{ tieba.name }}</div>
              <div class="tieba-members">{{ tieba.memberCount }}人关注</div>
            </div>
          </div>
        </div>
        
        <!-- 热门帖子列表 -->
        <div class="hot-posts">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><StarFilled /></el-icon> 热门帖子
            </h2>
            <router-link to="/hot/posts" class="more-link">更多</router-link>
          </div>
          <div class="post-list">
            <div 
              v-for="post in hotPosts" 
              :key="post.id" 
              class="post-item"
              @click="goToPost(post.id)"
            >
              <div class="post-header">
                <div class="post-avatar">{{ post.author.charAt(0) }}</div>
                <div class="post-meta">
                  <div class="post-author">{{ post.author }}</div>
                  <div class="post-time">{{ formatTime(post.createdAt) }}</div>
                </div>
              </div>
              <div class="post-title">{{ post.title }}</div>
              <div class="post-content">{{ post.content }}</div>
              <div class="post-stats">
                <div class="post-stat">
                  <el-icon><View /></el-icon> {{ post.viewCount }}
                </div>
                <div class="post-stat">
                  <el-icon><ChatDotRound /></el-icon> {{ post.replyCount }}
                </div>
                <div class="post-stat">
                  <el-icon><Star /></el-icon> {{ post.likeCount }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 推荐关注 -->
      <div class="recommended-section">
        <div class="section-header">
          <h2 class="section-title">
            <el-icon><RefreshRight /></el-icon> 推荐关注
          </h2>
        </div>
        <div class="tieba-grid">
          <div 
            v-for="tieba in recommendedTiebas" 
            :key="tieba.id" 
            class="tieba-item"
            @click="goToTieba(tieba.id)"
          >
            <div class="tieba-avatar">{{ tieba.name.charAt(0) }}</div>
            <div class="tieba-name">{{ tieba.name }}</div>
            <div class="tieba-members">{{ tieba.memberCount }}人关注</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  HotFilled,
  StarFilled,
  View,
  ChatDotRound,
  Star,
  RefreshRight
} from '@element-plus/icons-vue'

const router = useRouter()
const searchQuery = ref('')

// 模拟热门贴吧数据
const hotTiebas = ref([
  { id: 1, name: '百度贴吧', memberCount: 2356789 },
  { id: 2, name: '电影吧', memberCount: 1890456 },
  { id: 3, name: '游戏吧', memberCount: 1567890 },
  { id: 4, name: '美食吧', memberCount: 1234567 },
  { id: 5, name: '旅游吧', memberCount: 987654 },
  { id: 6, name: '音乐吧', memberCount: 876543 },
  { id: 7, name: '科技吧', memberCount: 765432 },
  { id: 8, name: '生活吧', memberCount: 654321 },
])

// 模拟热门帖子数据
const hotPosts = ref([
  {
    id: 1,
    title: '【讨论】你最喜欢的电影是哪一部？为什么？',
    content: '每个人心中都有一部特别喜欢的电影，可能是因为它的剧情、演员的表演，或者是它带给你的特殊感受...',
    author: '电影爱好者',
    viewCount: 12345,
    replyCount: 567,
    likeCount: 890,
    createdAt: '2023-11-10T10:30:00'
  },
  {
    id: 2,
    title: '【分享】最近发现的一款超好玩的独立游戏',
    content: '今天要给大家推荐一款独立游戏，画面精美，玩法新颖，最重要的是开发者非常用心...',
    author: '游戏达人',
    viewCount: 9876,
    replyCount: 345,
    likeCount: 678,
    createdAt: '2023-11-09T15:20:00'
  },
  {
    id: 3,
    title: '【求助】关于电脑配置的问题，求大佬指导',
    content: '最近想组装一台新电脑，但对硬件不是很了解，预算在8000左右，主要用来玩游戏和做设计...',
    author: '电脑小白',
    viewCount: 7654,
    replyCount: 234,
    likeCount: 456,
    createdAt: '2023-11-08T09:15:00'
  },
  {
    id: 4,
    title: '【攻略】新手如何快速上手摄影？',
    content: '很多朋友想要学习摄影，但不知道从何开始。今天我来分享一些新手入门的经验和技巧...',
    author: '摄影师小王',
    viewCount: 5432,
    replyCount: 123,
    likeCount: 345,
    createdAt: '2023-11-07T14:45:00'
  },
])

// 模拟推荐关注数据
const recommendedTiebas = ref([
  { id: 9, name: '摄影吧', memberCount: 543210 },
  { id: 10, name: '宠物吧', memberCount: 432109 },
  { id: 11, name: '健身吧', memberCount: 321098 },
  { id: 12, name: '读书吧', memberCount: 210987 },
  { id: 13, name: '编程吧', memberCount: 109876 },
  { id: 14, name: '手工吧', memberCount: 98765 },
  { id: 15, name: '动漫吧', memberCount: 87654 },
  { id: 16, name: '美妆吧', memberCount: 76543 },
])

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
  }
}

// 跳转到贴吧详情
const goToTieba = (id) => {
  router.push(`/tieba/${id}`)
}

// 跳转到帖子详情
const goToPost = (id) => {
  router.push(`/post/${id}`)
}

// 格式化时间
const formatTime = (timeString) => {
  const date = new Date(timeString)
  const now = new Date()
  const diff = now - date
  
  // 小于1分钟
  if (diff < 60000) {
    return '刚刚'
  }
  
  // 小于1小时
  if (diff < 3600000) {
    return Math.floor(diff / 60000) + '分钟前'
  }
  
  // 小于24小时
  if (diff < 86400000) {
    return Math.floor(diff / 3600000) + '小时前'
  }
  
  // 小于7天
  if (diff < 604800000) {
    return Math.floor(diff / 86400000) + '天前'
  }
  
  // 超过7天显示具体日期
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

onMounted(() => {
  // 这里可以添加初始化数据的逻辑，例如从API获取数据
})
</script>

<style scoped>
.homepage {
  min-height: 100vh;
}

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
  box-shadow: var(--shadow-heavy);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.search-input {
  flex: 1;
  padding: clamp(0.75rem, 3vw, 1rem) clamp(1rem, 4vw, 1.25rem);
  border: none;
  font-size: clamp(0.875rem, 3vw, 1rem);
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
  padding: clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 4vw, 2rem);
  font-size: clamp(0.875rem, 3vw, 1rem);
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
  box-shadow: var(--shadow-medium);
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 clamp(1rem, 4vw, 2rem);
}

.main-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr));
  gap: clamp(1rem, 4vw, 2rem);
  margin-bottom: clamp(2rem, 6vw, 3rem);
}

.hot-tiebas,
.hot-posts,
.recommended-section {
  background: white;
  border-radius: var(--border-radius-medium);
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  margin-bottom: clamp(1rem, 4vw, 2rem);
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
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.more-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
}

.more-link:hover {
  text-decoration: underline;
}

.tieba-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(120px, 100%), 1fr));
  gap: clamp(0.75rem, 2vw, 1rem);
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
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
  color: var(--text-primary);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tieba-members {
  font-size: 12px;
  color: var(--text-secondary);
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 2vw, 1rem);
}

.post-item {
  padding: clamp(0.75rem, 3vw, 1rem);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  transition: all 0.3s ease;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.9);
}

.post-item:hover {
  background: rgba(255, 255, 255, 1);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
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
  color: var(--text-primary);
  font-size: 14px;
}

.post-time {
  color: var(--text-secondary);
  font-size: 12px;
}

.post-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.post-content {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-stats {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: var(--text-secondary);
}

.post-stat {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .tieba-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.75rem;
  }
}
</style>