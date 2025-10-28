<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 用户信息头部 -->
      <div class="profile-header">
        <div class="profile-cover">
          <div class="cover-image" style="background-image: url('https://picsum.photos/1200/400')">
            <div class="cover-actions">
              <el-button size="small" type="text" class="change-cover-btn">
                <el-icon><Camera /></el-icon>
                <span>更换封面</span>
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="profile-info">
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <div class="avatar" style="background-image: url('https://picsum.photos/200/200')">
                <div class="avatar-actions">
                  <el-button size="small" type="text" class="change-avatar-btn">
                    <el-icon><Camera /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
            
            <div class="user-details">
              <div class="user-name">{{ currentUser.username }}</div>
              <div class="user-id">ID: {{ currentUser.userId }}</div>
              <div class="user-level">LV.{{ currentUser.level }}</div>
              <div class="user-sign">{{ currentUser.signature || '这个人很懒，还没有设置签名' }}</div>
            </div>
            
            <div class="user-stats">
              <div class="stat-item">
                <div class="stat-number">{{ currentUser.postCount }}</div>
                <div class="stat-label">发帖</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ currentUser.followingCount }}</div>
                <div class="stat-label">关注</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ currentUser.followerCount }}</div>
                <div class="stat-label">粉丝</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ currentUser.likedCount }}</div>
                <div class="stat-label">获赞</div>
              </div>
            </div>
            
            <div class="profile-actions">
              <el-button type="primary" class="edit-profile-btn">编辑资料</el-button>
              <el-button class="settings-btn">设置</el-button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 内容标签页 -->
      <div class="profile-content">
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="我的帖子" name="posts">
            <template #label>
              <el-icon><ChatLineRound /></el-icon>
              <span>我的帖子</span>
            </template>
            
            <div class="posts-container">
              <div class="posts-filter">
                <el-radio-group v-model="postFilter" size="small">
                  <el-radio-button label="all">全部</el-radio-button>
                  <el-radio-button label="normal">普通</el-radio-button>
                  <el-radio-button label="hot">热门</el-radio-button>
                  <el-radio-button label="deleted">已删除</el-radio-button>
                </el-radio-group>
                
                <el-input
                  v-model="postSearch"
                  placeholder="搜索我的帖子"
                  prefix-icon="Search"
                  clearable
                  size="small"
                  class="post-search-input"
                />
              </div>
              
              <div class="posts-list">
                <div 
                  v-for="post in userPosts" 
                  :key="post.id"
                  class="post-item"
                >
                  <div class="post-header">
                    <div class="post-title">
                      <router-link :to="`/tieba/${post.tiebaId}/post/${post.id}`">
                        {{ post.title }}
                      </router-link>
                    </div>
                    <div class="post-tieba">
                      <router-link :to="`/tieba/${post.tiebaId}`" class="tieba-link">
                        {{ post.tiebaName }}
                      </router-link>
                    </div>
                  </div>
                  
                  <div class="post-content">
                    {{ truncateText(post.content, 100) }}
                  </div>
                  
                  <div class="post-footer">
                    <div class="post-stats">
                      <div class="stat">
                        <el-icon><View /></el-icon>
                        <span>{{ post.viewCount }}</span>
                      </div>
                      <div class="stat">
                        <el-icon><ChatDotSquare /></el-icon>
                        <span>{{ post.commentCount }}</span>
                      </div>
                      <div class="stat">
                        <el-icon><Top /></el-icon>
                        <span>{{ post.likeCount }}</span>
                      </div>
                    </div>
                    
                    <div class="post-time">
                      {{ formatTime(post.createTime) }}
                    </div>
                    
                    <div class="post-actions">
                      <el-dropdown>
                        <el-button size="small" text>
                          操作
                          <el-icon class="el-icon--right">
                            <arrow-down />
                          </el-icon>
                        </el-button>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item>编辑</el-dropdown-item>
                            <el-dropdown-item>置顶</el-dropdown-item>
                            <el-dropdown-item>删除</el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="pagination-container">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalPosts"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="我的收藏" name="collections">
            <template #label>
              <el-icon><StarFilled /></el-icon>
              <span>我的收藏</span>
            </template>
            
            <div class="collections-container">
              <div class="collections-list">
                <div 
                  v-for="collection in userCollections" 
                  :key="collection.id"
                  class="collection-item"
                >
                  <div class="collection-type">
                    <el-tag size="small" :type="collection.type === 'tieba' ? 'primary' : 'success'">
                      {{ collection.type === 'tieba' ? '贴吧' : '帖子' }}
                    </el-tag>
                  </div>
                  
                  <div class="collection-title">
                    <router-link :to="collection.type === 'tieba' 
                      ? `/tieba/${collection.id}` 
                      : `/tieba/${collection.tiebaId}/post/${collection.id}`"
                    >
                      {{ collection.title }}
                    </router-link>
                  </div>
                  
                  <div class="collection-tieba" v-if="collection.tiebaName">
                    <router-link :to="`/tieba/${collection.tiebaId}`" class="tieba-link">
                      {{ collection.tiebaName }}
                    </router-link>
                  </div>
                  
                  <div class="collection-time">
                    {{ formatTime(collection.collectTime) }}
                  </div>
                  
                  <div class="collection-actions">
                    <el-button size="small" type="danger" text>
                      <el-icon><Delete /></el-icon>
                      取消收藏
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="我的关注" name="followings">
            <template #label>
              <el-icon><ChatDotSquare /></el-icon>
              <span>我的关注</span>
            </template>
            
            <div class="followings-container">
              <div class="followings-list">
                <div 
                  v-for="tieba in followedTiebas" 
                  :key="tieba.id"
                  class="following-item"
                >
                  <div class="tieba-avatar">
                    <router-link :to="`/tieba/${tieba.id}`">
                      <div class="tieba-avatar-img" :style="{ backgroundImage: `url(${tieba.avatar})` }"></div>
                    </router-link>
                  </div>
                  
                  <div class="tieba-info">
                    <div class="tieba-name">
                      <router-link :to="`/tieba/${tieba.id}`">
                        {{ tieba.name }}
                      </router-link>
                    </div>
                    <div class="tieba-desc">{{ tieba.desc }}</div>
                    <div class="tieba-stats">
                      <span>{{ tieba.memberCount }} 关注</span>
                      <span>{{ tieba.postCount }} 帖子</span>
                    </div>
                  </div>
                  
                  <div class="tieba-actions">
                    <el-button size="small" type="success" plain>
                      已关注
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="我的消息" name="messages">
            <template #label>
              <el-icon><Bell /></el-icon>
              <span>我的消息</span>
            </template>
            
            <div class="messages-container">
              <el-radio-group v-model="messageTab" size="small" class="message-tabs">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="notice">通知</el-radio-button>
                <el-radio-button label="comment">评论</el-radio-button>
                <el-radio-button label="like">点赞</el-radio-button>
                <el-radio-button label="system">系统</el-radio-button>
              </el-radio-group>
              
              <div class="messages-list">
                <div 
                  v-for="message in userMessages" 
                  :key="message.id"
                  class="message-item"
                  :class="{ 'unread': message.unread }"
                >
                  <div class="message-type">
                    <el-icon v-if="message.type === 'comment'">
                      <ChatDotSquare />
                    </el-icon>
                    <el-icon v-else-if="message.type === 'like'">
                      <StarFilled />
                    </el-icon>
                    <el-icon v-else-if="message.type === 'system'">
                      <WarningFilled />
                    </el-icon>
                    <el-icon v-else>
                      <Bell />
                    </el-icon>
                  </div>
                  
                  <div class="message-content">
                    <div class="message-text">
                      {{ message.content }}
                    </div>
                    <div class="message-source" v-if="message.source">
                      <router-link :to="message.sourceUrl">
                        {{ message.source }}
                      </router-link>
                    </div>
                    <div class="message-time">
                      {{ formatTime(message.time) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Camera,
  ChatLineRound,
  StarFilled,
  Search,
  View,
  ChatDotSquare,
  Top,
  ArrowDown as arrowDown,
  Delete,
  Bell,
  WarningFilled
} from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('posts')
const postFilter = ref('all')
const postSearch = ref('')
const messageTab = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)
const totalPosts = ref(0)

// 当前用户信息（模拟数据）
const currentUser = reactive({
  userId: '10086',
  username: '百度用户10086',
  level: 8,
  signature: '热爱生活，分享美好',
  postCount: 128,
  followingCount: 45,
  followerCount: 132,
  likedCount: 528
})

// 用户帖子列表（模拟数据）
const userPosts = ref([
  {
    id: '1001',
    tiebaId: '5001',
    tiebaName: '摄影吧',
    title: '分享一组人像摄影作品，请大家多多指点',
    content: '最近拍摄了一组人像照片，想请大家多提提意见。这组照片主要使用了自然光，后期做了一些调整，希望能得到一些专业的评价...',
    viewCount: 1234,
    commentCount: 48,
    likeCount: 127,
    createTime: '2023-06-15T14:30:00'
  },
  {
    id: '1002',
    tiebaId: '5002',
    tiebaName: '旅行吧',
    title: '端午节去了趟杭州西湖，风景真的太美了',
    content: '西湖的美景果然名不虚传，断桥残雪、平湖秋月等景点各具特色。特别推荐大家傍晚时分乘坐游船，那时的夕阳映照在湖面上，美得让人窒息...',
    viewCount: 2567,
    commentCount: 89,
    likeCount: 342,
    createTime: '2023-06-22T09:15:00'
  },
  {
    id: '1003',
    tiebaId: '5003',
    tiebaName: '美食吧',
    title: '在家自制芒果班戟，零失败教程分享',
    content: '今天给大家分享一个超简单的芒果班戟制作方法。需要准备的材料有：低筋面粉、牛奶、鸡蛋、黄油、糖和新鲜芒果。第一步...',
    viewCount: 3456,
    commentCount: 156,
    likeCount: 789,
    createTime: '2023-06-10T18:45:00'
  },
  {
    id: '1004',
    tiebaId: '5001',
    tiebaName: '摄影吧',
    title: '新手求助：关于夜景拍摄的参数设置',
    content: '最近刚开始尝试夜景摄影，但拍出来的照片总是很暗或者糊掉，请问有经验的大佬们有什么建议吗？相机是佳能EOS 200D，有三脚架...',
    viewCount: 892,
    commentCount: 67,
    likeCount: 45,
    createTime: '2023-06-05T20:10:00'
  },
  {
    id: '1005',
    tiebaId: '5004',
    tiebaName: '科技吧',
    title: '新买的笔记本电脑开箱体验',
    content: '终于入手了心仪已久的MacBook Pro，16寸的屏幕用起来确实爽。处理视频和图片的速度比之前的电脑快了很多，电池续航也很给力...',
    viewCount: 1876,
    commentCount: 78,
    likeCount: 231,
    createTime: '2023-05-28T11:20:00'
  }
])

// 用户收藏列表（模拟数据）
const userCollections = ref([
  {
    id: '2001',
    type: 'tieba',
    title: '摄影吧',
    collectTime: '2023-06-20T15:30:00'
  },
  {
    id: '2002',
    type: 'tieba',
    title: '旅行吧',
    collectTime: '2023-06-18T10:15:00'
  },
  {
    id: '3001',
    type: 'post',
    tiebaId: '5001',
    tiebaName: '摄影吧',
    title: '摄影入门必学的十个技巧',
    collectTime: '2023-06-15T09:45:00'
  },
  {
    id: '3002',
    type: 'post',
    tiebaId: '5002',
    tiebaName: '旅行吧',
    title: '国内十大最美古镇推荐',
    collectTime: '2023-06-12T14:20:00'
  }
])

// 关注的贴吧列表（模拟数据）
const followedTiebas = ref([
  {
    id: '5001',
    name: '摄影吧',
    desc: '分享摄影技巧、器材心得和精美作品',
    avatar: 'https://picsum.photos/100/100?random=1',
    memberCount: '12.5万',
    postCount: '342.8万'
  },
  {
    id: '5002',
    name: '旅行吧',
    desc: '记录旅行见闻，分享旅行攻略',
    avatar: 'https://picsum.photos/100/100?random=2',
    memberCount: '28.3万',
    postCount: '867.1万'
  },
  {
    id: '5003',
    name: '美食吧',
    desc: '发现美食，分享食谱',
    avatar: 'https://picsum.photos/100/100?random=3',
    memberCount: '45.6万',
    postCount: '1234.5万'
  },
  {
    id: '5004',
    name: '科技吧',
    desc: '讨论最新科技产品和科技资讯',
    avatar: 'https://picsum.photos/100/100?random=4',
    memberCount: '34.2万',
    postCount: '765.3万'
  }
])

// 用户消息列表（模拟数据）
const userMessages = ref([
  {
    id: '4001',
    type: 'comment',
    content: '你拍的照片真好看，请问用的什么相机？',
    source: '分享一组人像摄影作品，请大家多多指点',
    sourceUrl: '/tieba/5001/post/1001',
    time: '2023-06-25T10:23:00',
    unread: true
  },
  {
    id: '4002',
    type: 'like',
    content: '有人赞了你的帖子',
    source: '端午节去了趟杭州西湖，风景真的太美了',
    sourceUrl: '/tieba/5002/post/1002',
    time: '2023-06-24T18:45:00',
    unread: true
  },
  {
    id: '4003',
    type: 'system',
    content: '恭喜您的账号升级到8级！',
    time: '2023-06-20T00:00:00',
    unread: false
  },
  {
    id: '4004',
    type: 'notice',
    content: '您关注的摄影吧发布了新活动',
    source: '夏季摄影大赛',
    sourceUrl: '/tieba/5001/activity/6001',
    time: '2023-06-18T14:30:00',
    unread: false
  }
])

// 格式化时间
const formatTime = (timeString) => {
  const date = new Date(timeString)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 截断文本
const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// 处理分页大小变化
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  // 这里可以添加加载数据的逻辑
}

// 处理页码变化
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  // 这里可以添加加载数据的逻辑
}

// 检查登录状态
const checkLoginStatus = () => {
  const user = localStorage.getItem('user')
  if (!user) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return false
  }
  return true
}

onMounted(() => {
  // 检查是否已登录
  checkLoginStatus()
  
  // 设置帖子总数
  totalPosts.value = userPosts.value.length
})
</script>

<style scoped>
.profile-page {
  background-color: var(--bg-color);
  min-height: 100vh;
  padding-top: 20px;
}

.profile-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 个人信息头部 */
.profile-header {
  margin-bottom: 20px;
}

.profile-cover {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: -80px;
  z-index: 1;
}

.cover-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.cover-actions {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.change-cover-btn {
  color: white;
  background: rgba(0,0,0,0.5);
  padding: 5px 10px;
  border-radius: 4px;
}

.profile-info {
  background: white;
  border-radius: 8px;
  padding: 90px 20px 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  z-index: 2;
  position: relative;
}

.avatar-section {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 20px;
}

.avatar-wrapper {
  position: relative;
  margin-top: -70px;
  margin-left: 10px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 4px solid white;
  position: relative;
}

.avatar-actions {
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.user-details {
  flex: 1;
  min-width: 200px;
}

.user-name {
  font-size: 20px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.user-id {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 3px;
}

.user-level {
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  margin-bottom: 8px;
}

.user-sign {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.user-stats {
  display: flex;
  gap: 30px;
  min-width: 300px;
  margin-top: 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-primary);
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.profile-actions {
  display: flex;
  gap: 10px;
  margin-left: auto;
  min-width: 200px;
  justify-content: flex-end;
}

/* 内容标签页 */
.profile-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

/* 帖子列表样式 */
.posts-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.post-search-input {
  width: 300px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.post-item {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
}

.post-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;
}

.post-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-title a {
  color: var(--text-primary);
  text-decoration: none;
}

.post-title a:hover {
  color: var(--primary-color);
}

.post-tieba {
  margin-left: 10px;
  white-space: nowrap;
}

.tieba-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
}

.tieba-link:hover {
  text-decoration: underline;
}

.post-content {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 10px;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.post-stats {
  display: flex;
  gap: 20px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--text-secondary);
}

.post-time {
  font-size: 12px;
  color: var(--text-secondary);
}

.pagination-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

/* 收藏列表样式 */
.collections-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.collection-item {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.collection-title {
  flex: 1;
  font-size: 16px;
  color: var(--text-primary);
}

.collection-title a {
  color: var(--text-primary);
  text-decoration: none;
}

.collection-title a:hover {
  color: var(--primary-color);
}

.collection-time {
  font-size: 12px;
  color: var(--text-secondary);
  margin-right: 10px;
}

/* 关注的贴吧列表样式 */
.followings-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.following-item {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.tieba-avatar-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
}

.tieba-info {
  flex: 1;
  min-width: 200px;
}

.tieba-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.tieba-name a {
  color: var(--text-primary);
  text-decoration: none;
}

.tieba-name a:hover {
  color: var(--primary-color);
}

.tieba-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 5px;
}

.tieba-stats {
  font-size: 12px;
  color: var(--text-secondary);
}

.tieba-stats span {
  margin-right: 15px;
}

.tieba-actions {
  margin-left: auto;
}

/* 消息列表样式 */
.message-tabs {
  margin-bottom: 20px;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-item {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  gap: 15px;
  transition: all 0.3s ease;
}

.message-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.message-item.unread {
  background-color: #f0f7ff;
  border-color: #d6e4ff;
}

.message-type {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: var(--primary-color);
}

.message-content {
  flex: 1;
}

.message-text {
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.message-source {
  font-size: 13px;
  margin-bottom: 5px;
}

.message-source a {
  color: var(--primary-color);
  text-decoration: none;
}

.message-source a:hover {
  text-decoration: underline;
}

.message-time {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 响应式样式 */
@media (max-width: 768px) {
  .profile-container {
    padding: 0 10px;
  }
  
  .avatar-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .user-stats {
    gap: 20px;
    min-width: auto;
  }
  
  .profile-actions {
    width: 100%;
    justify-content: flex-start;
    margin-left: 0;
    margin-top: 10px;
  }
  
  .posts-filter {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .post-search-input {
    width: 100%;
  }
  
  .post-header, .post-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .post-tieba {
    margin-left: 0;
  }
  
  .following-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .tieba-actions {
    margin-left: 0;
    width: 100%;
  }
  
  .tieba-actions .el-button {
    width: 100%;
  }
}
</style>