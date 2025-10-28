<template>
  <div class="tieba-detail-page">
    <!-- 贴吧头部信息 -->
    <div v-if="tiebaStore.currentTieba" class="tieba-header">
      <div class="tieba-banner">
        <div class="tieba-info">
          <div class="tieba-avatar-large">
            {{ tiebaStore.currentTieba.name.charAt(0) }}
          </div>
          <div class="tieba-meta">
            <h1 class="tieba-name-large">{{ tiebaStore.currentTieba.name }}</h1>
            <div class="tieba-stats">
              <span>{{ formatNumber(tiebaStore.currentTieba.member_count) }} 成员</span>
              <span>{{ formatNumber(tiebaStore.currentTieba.post_count) }} 帖子</span>
            </div>
            <div class="tieba-desc">{{ tiebaStore.currentTieba.description }}</div>
            <button 
              v-if="userStore.isLoggedIn" 
              class="join-btn" 
              @click="joinTieba"
              :disabled="isJoining || isJoined"
            >
              {{ isJoined ? '已加入' : '加入' }}
            </button>
            <router-link 
              v-if="userStore.isLoggedIn && isJoined" 
              to="/post/create" 
              class="create-post-btn"
            >
              发新帖
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- 帖子分类筛选 -->
      <div class="post-filter">
        <div class="container">
          <div class="filter-tabs">
            <div 
              v-for="filter in filters" 
              :key="filter.value" 
              class="filter-tab"
              :class="{ active: currentFilter === filter.value }"
              @click="changeFilter(filter.value)"
            >
              {{ filter.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 帖子列表区域 -->
    <div class="container">
      <div class="post-list-content">
        <!-- 帖子排序 -->
        <div class="sort-bar">
          <div class="sort-options">
            <span class="sort-label">排序：</span>
            <select v-model="sortBy" @change="handleSort">
              <option value="latest">最新发布</option>
              <option value="hot">热门</option>
              <option value="reply">回复最多</option>
            </select>
          </div>
          <router-link 
            v-if="userStore.isLoggedIn && isJoined" 
            to="/post/create" 
            class="mobile-create-btn"
          >
            + 发帖
          </router-link>
        </div>
        
        <!-- 帖子列表 -->
        <div v-if="posts.length > 0" class="tieba-posts">
          <div 
            v-for="post in posts" 
            :key="post.id" 
            class="post-item"
            @click="goToPost(post.id)"
          >
            <div class="post-main">
              <div class="post-title">{{ post.title }}</div>
              <div class="post-content">{{ truncateContent(post.content, 120) }}</div>
              
              <!-- 图片预览 -->
              <div v-if="post.image_count > 0" class="post-images">
                <div class="image-preview">
                  <span class="image-icon">🖼️</span>
                  <span>{{ post.image_count }}张图</span>
                </div>
              </div>
              
              <div class="post-meta">
                <div class="post-user">
                  <div class="user-avatar">{{ post.author_name.charAt(0) }}</div>
                  <span class="user-name">{{ post.author_name }}</span>
                </div>
                <div class="post-time">{{ formatTime(post.created_at) }}</div>
              </div>
            </div>
            
            <div class="post-stats">
              <div class="stat-item">
                <span class="stat-number">{{ post.view_count }}</span>
                <span class="stat-label">浏览</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ post.reply_count }}</span>
                <span class="stat-label">回复</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ post.like_count }}</span>
                <span class="stat-label">点赞</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 加载中状态 -->
        <div v-else-if="loading" class="loading-state">
          <div class="spinner"></div>
          <span>加载中...</span>
        </div>
        
        <!-- 无内容状态 -->
        <div v-else class="empty-state">
          <div class="empty-icon">📝</div>
          <p>暂无帖子</p>
          <router-link 
            v-if="userStore.isLoggedIn && isJoined" 
            to="/post/create" 
            class="create-first-btn"
          >
            发布第一篇帖子
          </router-link>
        </div>
        
        <!-- 分页 -->
        <div v-if="posts.length > 0" class="pagination">
          <button 
            @click="changePage(page - 1)" 
            :disabled="page <= 1"
            class="page-btn"
          >
            上一页
          </button>
          <div class="page-info">{{ page }} / {{ totalPages }}</div>
          <button 
            @click="changePage(page + 1)" 
            :disabled="page >= totalPages"
            class="page-btn"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTiebaStore } from '../store/tieba'
import { useUserStore } from '../store/user'
import { usePostStore } from '../store/post'

const router = useRouter()
const route = useRoute()
const tiebaStore = useTiebaStore()
const userStore = useUserStore()
const postStore = usePostStore()

// 状态管理
const tiebaId = computed(() => route.params.id)
const isJoining = ref(false)
const isJoined = ref(false)
const posts = ref([])
const loading = ref(false)
const currentFilter = ref('all')
const sortBy = ref('latest')
const page = ref(1)
const pageSize = 10
const totalPages = ref(1)

// 筛选选项
const filters = [
  { label: '全部', value: 'all' },
  { label: '最新', value: 'latest' },
  { label: '精华', value: 'featured' },
  { label: '视频', value: 'video' }
]

// 监听路由参数变化
watch(tiebaId, async (newId) => {
  if (newId) {
    await loadTiebaDetail()
    await loadTiebaPosts()
  }
})

// 组件挂载时加载数据
onMounted(async () => {
  if (tiebaId.value) {
    await loadTiebaDetail()
    await loadTiebaPosts()
  }
})

// 加载贴吧详情
async function loadTiebaDetail() {
  try {
    await tiebaStore.fetchTiebaDetail(tiebaId.value)
    // 模拟检查用户是否已加入
    isJoined.value = Math.random() > 0.5 // 这里只是模拟，实际应该从API获取
  } catch (error) {
    console.error('加载贴吧详情失败:', error)
  }
}

// 加载贴吧帖子
async function loadTiebaPosts() {
  loading.value = true
  try {
    // 模拟数据，实际应该调用API
    const mockPosts = Array.from({ length: Math.min(pageSize, 20) }, (_, i) => ({
      id: (page.value - 1) * pageSize + i + 1,
      title: `${tiebaStore.currentTieba?.name || '贴吧'}精彩内容 ${(page.value - 1) * pageSize + i + 1}`,
      content: '这是一个精彩的帖子内容，包含了丰富的信息和有价值的讨论。欢迎大家积极参与讨论，分享自己的想法和见解。',
      author_name: `用户${Math.floor(Math.random() * 1000)}`,
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      view_count: Math.floor(Math.random() * 1000),
      reply_count: Math.floor(Math.random() * 100),
      like_count: Math.floor(Math.random() * 50),
      image_count: Math.floor(Math.random() * 5)
    }))
    posts.value = mockPosts
    totalPages.value = 5 // 模拟总页数
  } catch (error) {
    console.error('加载帖子列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 加入贴吧
async function joinTieba() {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  isJoining.value = true
  try {
    await tiebaStore.joinTieba(tiebaId.value)
    isJoined.value = true
  } catch (error) {
    console.error('加入贴吧失败:', error)
  } finally {
    isJoining.value = false
  }
}

// 跳转到帖子详情
function goToPost(postId) {
  router.push(`/post/${postId}`)
}

// 切换筛选
function changeFilter(filter) {
  currentFilter.value = filter
  page.value = 1
  loadTiebaPosts()
}

// 切换排序
function handleSort() {
  loadTiebaPosts()
}

// 切换分页
function changePage(newPage) {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage
    loadTiebaPosts()
  }
}

// 工具函数
function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

function formatTime(timeString) {
  const date = new Date(timeString)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60 * 1000) return '刚刚'
  if (diff < 60 * 60 * 1000) return Math.floor(diff / (60 * 1000)) + '分钟前'
  if (diff < 24 * 60 * 60 * 1000) return Math.floor(diff / (60 * 60 * 1000)) + '小时前'
  if (diff < 7 * 24 * 60 * 60 * 1000) return Math.floor(diff / (24 * 60 * 60 * 1000)) + '天前'
  
  return date.toLocaleDateString('zh-CN')
}

function truncateContent(content, maxLength) {
  return content.length <= maxLength ? content : content.substring(0, maxLength) + '...'
}
</script>

<style scoped>
.tieba-detail-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* 贴吧头部 */
.tieba-header {
  background-color: white;
  border-bottom: 1px solid var(--border-color);
}

.tieba-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 0;
  color: white;
}

.tieba-info {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.tieba-avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.tieba-meta {
  flex: 1;
}

.tieba-name-large {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
}

.tieba-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  opacity: 0.9;
}

.tieba-desc {
  margin-bottom: 20px;
  max-width: 600px;
  opacity: 0.9;
  line-height: 1.5;
}

.join-btn {
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 10px 24px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  margin-right: 15px;
}

.join-btn:hover:not(:disabled) {
  background-color: white;
  color: var(--primary-color);
  transform: translateY(-1px);
}

.join-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.create-post-btn {
  background-color: var(--secondary-color);
  color: white;
  padding: 10px 24px;
  border-radius: 25px;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.create-post-btn:hover {
  background-color: #e68900;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

/* 帖子分类筛选 */
.post-filter {
  border-bottom: 1px solid var(--border-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.filter-tabs {
  display: flex;
  gap: 40px;
}

.filter-tab {
  padding: 15px 0;
  font-size: 16px;
  color: var(--text-secondary);
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;
}

.filter-tab:hover {
  color: var(--primary-color);
}

.filter-tab.active {
  color: var(--primary-color);
  font-weight: bold;
}

.filter-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 3px;
}

/* 帖子列表内容 */
.post-list-content {
  padding: 20px 0;
}

.sort-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-label {
  color: var(--text-secondary);
}

.sort-options select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  outline: none;
}

.mobile-create-btn {
  display: none;
}

/* 帖子列表 */
.tieba-posts {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.post-item {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid var(--border-color);
}

.post-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: var(--primary-color);
}

.post-main {
  flex: 1;
}

.post-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.4;
}

.post-content {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
}

.post-images {
  margin-bottom: 12px;
}

.image-preview {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}

.image-icon {
  font-size: 14px;
}

.post-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.post-user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.user-name {
  font-size: 14px;
  color: var(--text-secondary);
}

.post-time {
  font-size: 14px;
  color: var(--text-secondary);
}

.post-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 80px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-number {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 加载和空状态 */
.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  border: 4px solid rgba(0, 122, 255, 0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
  opacity: 0.5;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.create-first-btn {
  background-color: var(--primary-color);
  color: white;
  padding: 10px 24px;
  border-radius: 25px;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.create-first-btn:hover {
  background-color: #0066cc;
  transform: translateY(-1px);
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  background-color: white;
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tieba-info {
    flex-direction: column;
    text-align: center;
    padding: 0 15px;
  }
  
  .tieba-stats {
    justify-content: center;
  }
  
  .filter-tabs {
    gap: 20px;
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 5px;
  }
  
  .post-item {
    flex-direction: column;
    padding: 15px;
  }
  
  .post-stats {
    flex-direction: row;
    justify-content: space-around;
    border-top: 1px solid var(--border-color);
    padding-top: 15px;
  }
  
  .mobile-create-btn {
    display: inline-block;
    background-color: var(--secondary-color);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    text-decoration: none;
  }
  
  .create-post-btn {
    display: none;
  }
}
</style>