<template>
  <div class="tieba-detail">
    <!-- 贴吧头部信息 -->
    <div class="tieba-header">
      <div class="tieba-banner">
        <div class="tieba-info">
          <div class="tieba-logo">
            {{ tiebaInfo.name.charAt(0) }}
          </div>
          <div class="tieba-meta">
            <h1 class="tieba-name">{{ tiebaInfo.name }}</h1>
            <div class="tieba-stats">
              <div class="stat-item">
                <el-icon><User /></el-icon> {{ formatNumber(tiebaInfo.memberCount) }} 关注
              </div>
              <div class="stat-item">
                <el-icon><ChatDotRound /></el-icon> {{ formatNumber(tiebaInfo.postCount) }} 帖子
              </div>
            </div>
          </div>
          <div class="tieba-actions">
            <el-button 
              type="primary" 
              @click="followTieba" 
              :icon="isFollowing ? Check : Plus"
              :disabled="isFollowing"
            >
              {{ isFollowing ? '已关注' : '关注' }}
            </el-button>
            <el-button type="default" @click="createPost">
              <el-icon><EditPen /></el-icon> 发帖
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="container">
      <div class="content-wrapper">
        <!-- 左侧帖子列表 -->
        <div class="posts-section">
          <!-- 帖子筛选 -->
          <div class="filter-bar">
            <div class="filter-tabs">
              <el-tabs v-model="activeTab" @tab-change="handleTabChange" type="card">
                <el-tab-pane label="最新" name="latest">
                  <template #label>
                    <div class="tab-label">
                      <el-icon><Time /></el-icon> 最新
                    </div>
                  </template>
                </el-tab-pane>
                <el-tab-pane label="热门" name="hot">
                  <template #label>
                    <div class="tab-label">
                      <el-icon><HotFilled /></el-icon> 热门
                    </div>
                  </template>
                </el-tab-pane>
                <el-tab-pane label="精华" name="essence">
                  <template #label>
                    <div class="tab-label">
                      <el-icon><StarFilled /></el-icon> 精华
                    </div>
                  </template>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="search-box">
              <el-input
                v-model="searchQuery"
                placeholder="搜索吧内内容"
                @keyup.enter="handleSearch"
                clearable
                class="search-input"
                prefix-icon="Search"
              />
            </div>
          </div>

          <!-- 帖子列表 -->
          <div class="posts-list">
            <div 
              v-for="post in posts" 
              :key="post.id" 
              class="post-item"
              @click="goToPost(post.id)"
            >
              <div class="post-main">
                <!-- 作者信息 -->
                <div class="post-author">
                  <div class="author-avatar">{{ post.author.charAt(0) }}</div>
                  <div class="author-info">
                    <div class="author-name">{{ post.author }}</div>
                    <div class="post-time">{{ formatTime(post.createdAt) }}</div>
                  </div>
                </div>
                
                <!-- 帖子内容 -->
                <div class="post-content">
                  <h3 class="post-title">
                    <el-tag v-if="post.isTop" size="small" type="danger" effect="light">置顶</el-tag>
                    <el-tag v-if="post.isEssence" size="small" type="warning" effect="light">精华</el-tag>
                    {{ post.title }}
                  </h3>
                  <p class="post-summary">{{ post.summary }}</p>
                </div>
                
                <!-- 帖子图片预览 -->
                <div v-if="post.imageCount > 0" class="post-images">
                  <div class="image-preview">
                    <el-icon><Picture /></el-icon>
                    <span class="image-count">{{ post.imageCount }}张</span>
                  </div>
                </div>
              </div>
              
              <!-- 帖子统计 -->
              <div class="post-stats">
                <div class="stat-item">
                  <el-icon><View /></el-icon> {{ formatNumber(post.viewCount) }}
                </div>
                <div class="stat-item">
                  <el-icon><ChatDotRound /></el-icon> {{ formatNumber(post.replyCount) }}
                </div>
                <div class="stat-item">
                  <el-icon><Star /></el-icon> {{ formatNumber(post.likeCount) }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalPosts"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
        
        <!-- 右侧信息栏 -->
        <div class="sidebar">
          <!-- 吧主信息 -->
          <div class="sidebar-section">
            <h3 class="section-title">
              <el-icon><User /></el-icon> 吧务团队
            </h3>
            <div class="moderator-list">
              <div 
                v-for="mod in moderators" 
                :key="mod.id" 
                class="moderator-item"
              >
                <div class="mod-avatar">{{ mod.name.charAt(0) }}</div>
                <div class="mod-info">
                  <div class="mod-name">{{ mod.name }}</div>
                  <div class="mod-role">{{ mod.role }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 热门话题 -->
          <div class="sidebar-section">
            <h3 class="section-title">
              <el-icon><ChatLineRound /></el-icon> 热门话题
            </h3>
            <div class="hot-topics">
              <div 
                v-for="topic in hotTopics" 
                :key="topic.id" 
                class="topic-item"
                @click="searchByTopic(topic.name)"
              >
                <div class="topic-rank">{{ topic.rank }}</div>
                <div class="topic-name">{{ topic.name }}</div>
              </div>
            </div>
          </div>
          
          <!-- 推荐关注 -->
          <div class="sidebar-section">
            <h3 class="section-title">
              <el-icon><RefreshRight /></el-icon> 推荐关注
            </h3>
            <div class="recommended-tiebas">
              <div 
                v-for="tieba in recommendedTiebas" 
                :key="tieba.id" 
                class="tieba-item"
                @click="goToTieba(tieba.id)"
              >
                <div class="tieba-avatar">{{ tieba.name.charAt(0) }}</div>
                <div class="tieba-name">{{ tieba.name }}</div>
                <el-button size="small" type="primary" circle>
                  <el-icon><Plus /></el-icon>
                </el-button>
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
import { useRouter, useRoute } from 'vue-router'
import {
  User,
  ChatDotRound,
  Plus,
  Check,
  EditPen,
  Time,
  HotFilled,
  StarFilled,
  Search,
  View,
  Star,
  Picture,
  ChatLineRound,
  RefreshRight
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const tiebaId = ref(route.params.id || 1)

// 贴吧信息
const tiebaInfo = ref({
  id: 1,
  name: '百度贴吧',
  memberCount: 2356789,
  postCount: 15678901
})

// 状态
const isFollowing = ref(false)
const activeTab = ref('latest')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalPosts = ref(100)

// 模拟帖子数据
const posts = ref([
  {
    id: 1,
    title: '【公告】百度贴吧使用规范更新说明',
    summary: '为了维护良好的社区环境，百度贴吧对使用规范进行了更新，请各位吧友遵守新规定...',
    author: '百度贴吧官方',
    viewCount: 23456,
    replyCount: 456,
    likeCount: 789,
    imageCount: 3,
    createdAt: '2023-11-10T10:30:00',
    isTop: true,
    isEssence: true
  },
  {
    id: 2,
    title: '【讨论】你对百度贴吧未来发展有什么建议？',
    summary: '作为一个有着悠久历史的社区，百度贴吧正在寻求新的发展方向，欢迎大家提出宝贵意见...',
    author: '热心吧友小王',
    viewCount: 12345,
    replyCount: 234,
    likeCount: 567,
    imageCount: 0,
    createdAt: '2023-11-09T15:20:00',
    isTop: false,
    isEssence: true
  },
  {
    id: 3,
    title: '【分享】我的贴吧十年使用心得',
    summary: '从2013年注册到现在，已经在贴吧度过了十个年头，见证了贴吧的各种变化...',
    author: '老贴吧用户',
    viewCount: 9876,
    replyCount: 156,
    likeCount: 432,
    imageCount: 5,
    createdAt: '2023-11-08T09:15:00',
    isTop: false,
    isEssence: false
  },
  {
    id: 4,
    title: '【求助】为什么我的账号被禁言了？',
    summary: '昨天还能正常发言，今天突然发现账号被禁言了，但我没有违反任何规定...',
    author: '求助者',
    viewCount: 6789,
    replyCount: 78,
    likeCount: 123,
    imageCount: 0,
    createdAt: '2023-11-07T14:45:00',
    isTop: false,
    isEssence: false
  },
  {
    id: 5,
    title: '【活动】贴吧十周年庆祝活动',
    summary: '为了庆祝百度贴吧成立十周年，我们将举办一系列线上线下活动，欢迎大家参加...',
    author: '活动策划组',
    viewCount: 15678,
    replyCount: 345,
    likeCount: 678,
    imageCount: 8,
    createdAt: '2023-11-06T11:20:00',
    isTop: false,
    isEssence: false
  }
])

// 模拟版主数据
const moderators = ref([
  { id: 1, name: '百度管理员', role: '吧主' },
  { id: 2, name: '贴吧助手', role: '小吧主' },
  { id: 3, name: '内容审核员', role: '小吧主' }
])

// 模拟热门话题数据
const hotTopics = ref([
  { id: 1, name: '贴吧十年', rank: 1 },
  { id: 2, name: '社区建设', rank: 2 },
  { id: 3, name: '用户体验', rank: 3 },
  { id: 4, name: '内容创作', rank: 4 },
  { id: 5, name: '新功能建议', rank: 5 }
])

// 模拟推荐关注数据
const recommendedTiebas = ref([
  { id: 2, name: '电影吧' },
  { id: 3, name: '游戏吧' },
  { id: 4, name: '美食吧' }
])

// 关注贴吧
const followTieba = () => {
  isFollowing.value = true
  tiebaInfo.value.memberCount += 1
  // 这里应该调用API进行关注操作
}

// 创建帖子
const createPost = () => {
  router.push(`/tieba/${tiebaId.value}/create-post`)
}

// 跳转到帖子详情
const goToPost = (id) => {
  router.push(`/post/${id}`)
}

// 跳转到其他贴吧
const goToTieba = (id) => {
  router.push(`/tieba/${id}`)
}

// 搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 这里应该调用API进行搜索
    console.log('搜索内容:', searchQuery.value)
  }
}

// 按话题搜索
const searchByTopic = (topic) => {
  searchQuery.value = topic
  handleSearch()
}

// 切换标签
const handleTabChange = (tab) => {
  activeTab.value = tab
  // 这里应该根据不同的标签调用不同的API获取数据
}

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  // 这里应该重新获取数据
}

const handleCurrentChange = (newCurrent) => {
  currentPage.value = newCurrent
  // 这里应该重新获取数据
}

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
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
  // 这里应该根据tiebaId调用API获取贴吧详情和帖子列表
})
</script>

<style scoped>
.tieba-detail {
  min-height: 100vh;
}

.tieba-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px 0;
  margin-bottom: 30px;
}

.tieba-banner {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
}

.tieba-info {
  display: flex;
  align-items: center;
  color: white;
}

.tieba-logo {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  margin-right: 20px;
}

.tieba-meta {
  flex: 1;
}

.tieba-name {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}

.tieba-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  opacity: 0.9;
}

.tieba-actions {
  display: flex;
  gap: 10px;
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
}

.posts-section {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.filter-bar {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.search-box {
  margin-top: 15px;
}

.search-input {
  width: 100%;
}

.posts-list {
  display: flex;
  flex-direction: column;
}

.post-item {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s;
}

.post-item:hover {
  background-color: #f8f9fa;
}

.post-item:last-child {
  border-bottom: none;
}

.post-main {
  flex: 1;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.author-avatar {
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

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: bold;
  color: var(--text-primary);
  font-size: 14px;
}

.post-time {
  color: var(--text-secondary);
  font-size: 12px;
}

.post-content {
  margin-bottom: 10px;
}

.post-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.post-summary {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-images {
  margin-bottom: 10px;
}

.image-preview {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}

.post-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 80px;
  align-items: center;
  justify-content: center;
}

.pagination {
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: center;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.moderator-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.moderator-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mod-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.mod-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mod-name {
  font-weight: bold;
  color: var(--text-primary);
  font-size: 14px;
}

.mod-role {
  color: var(--text-secondary);
  font-size: 12px;
}

.hot-topics {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.topic-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 0;
  transition: color 0.3s;
}

.topic-item:hover {
  color: var(--primary-color);
}

.topic-rank {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.topic-item:nth-child(1) .topic-rank {
  background-color: #ff6b6b;
  color: white;
}

.topic-item:nth-child(2) .topic-rank {
  background-color: #ffa500;
  color: white;
}

.topic-item:nth-child(3) .topic-rank {
  background-color: #feca57;
  color: white;
}

.topic-name {
  font-size: 14px;
  color: var(--text-primary);
}

.recommended-tiebas {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tieba-item {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s;
}

.tieba-item:hover {
  background-color: #f8f9fa;
}

.tieba-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
}

.tieba-name {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 5px;
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
  
  .tieba-info {
    flex-direction: column;
    text-align: center;
  }
  
  .tieba-logo {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .tieba-stats {
    justify-content: center;
  }
  
  .tieba-actions {
    margin-top: 15px;
  }
  
  .post-item {
    flex-direction: column;
    gap: 15px;
  }
  
  .post-stats {
    flex-direction: row;
    justify-content: flex-start;
  }
}
</style>