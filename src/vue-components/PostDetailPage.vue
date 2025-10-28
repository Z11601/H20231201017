<template>
  <div class="post-detail">
    <div class="container">
      <div class="content-wrapper">
        <!-- 帖子内容 -->
        <div class="post-section">
          <!-- 帖子基本信息 -->
          <div class="post-header">
            <div class="post-author">
              <div class="author-avatar">{{ post.author.charAt(0) }}</div>
              <div class="author-info">
                <div class="author-name">{{ post.author }}</div>
                <div class="post-meta">
                  <span class="post-time">{{ formatTime(post.createdAt) }}</span>
                  <span class="post-source">{{ post.source }}</span>
                </div>
              </div>
              <el-button type="primary" size="small">
                <el-icon><ChatDotRound /></el-icon> 私信
              </el-button>
            </div>
            <h1 class="post-title">{{ post.title }}</h1>
            <div class="post-tags">
              <el-tag v-if="post.isTop" size="small" type="danger" effect="light">置顶</el-tag>
              <el-tag v-if="post.isEssence" size="small" type="warning" effect="light">精华</el-tag>
              <el-tag v-for="tag in post.tags" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
            </div>
          </div>
          
          <!-- 帖子正文 -->
          <div class="post-content">
            <div class="content-text" v-html="post.content"></div>
            
            <!-- 帖子图片 -->
            <div v-if="post.images && post.images.length > 0" class="content-images">
              <div class="image-grid">
                <div 
                  v-for="(image, index) in post.images" 
                  :key="index" 
                  class="image-wrapper"
                  @click="showImageViewer(index)"
                >
                  <img :src="image.url" :alt="`图片 ${index + 1}`" class="post-image">
                </div>
              </div>
            </div>
            
            <!-- 帖子统计 -->
            <div class="post-stats">
              <div class="stat-item">
                <el-icon><View /></el-icon> {{ formatNumber(post.viewCount) }} 浏览
              </div>
              <div class="stat-item">
                <el-icon><Star /></el-icon> {{ formatNumber(post.likeCount) }} 喜欢
              </div>
              <div class="stat-item">
                <el-icon><ChatDotRound /></el-icon> {{ formatNumber(post.replyCount) }} 回复
              </div>
              <div class="stat-item">
                <el-icon><Share /></el-icon> 分享
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="post-actions">
              <el-button 
                type="primary" 
                :icon="isLiked ? Check : Star" 
                :class="{ 'liked': isLiked }"
                @click="toggleLike"
              >
                {{ isLiked ? '已喜欢' : '喜欢' }}
              </el-button>
              <el-button type="default" :icon="ChatDotRound">
                回复
              </el-button>
              <el-button type="default" :icon="Share">
                分享
              </el-button>
              <el-button type="default" :icon="More">
                更多
              </el-button>
            </div>
          </div>
          
          <!-- 作者信息 -->
          <div class="author-card">
            <div class="author-avatar-large">{{ post.author.charAt(0) }}</div>
            <div class="author-details">
              <div class="author-name">{{ post.author }}</div>
              <div class="author-description">{{ post.authorDescription }}</div>
            </div>
            <el-button type="primary">
              <el-icon><Plus /></el-icon> 关注
            </el-button>
          </div>
          
          <!-- 评论区 -->
          <div class="comments-section">
            <div class="section-header">
              <h2 class="section-title">
                <el-icon><ChatLineSquare /></el-icon> 全部评论 ({{ comments.length }})
              </h2>
              <div class="sort-options">
                <el-radio-group v-model="commentSort" size="small">
                  <el-radio-button label="time">最新</el-radio-button>
                  <el-radio-button label="hot">最热</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            
            <!-- 发表评论 -->
            <div class="comment-input-section">
              <div class="user-avatar">
                <el-icon><User /></el-icon>
              </div>
              <el-input
                v-model="newComment"
                type="textarea"
                :rows="3"
                placeholder="写下你的评论..."
                maxlength="500"
                show-word-limit
              />
              <div class="comment-actions">
                <el-button type="primary" @click="submitComment">
                  发表评论
                </el-button>
              </div>
            </div>
            
            <!-- 评论列表 -->
            <div class="comments-list">
              <div 
                v-for="comment in comments" 
                :key="comment.id" 
                class="comment-item"
              >
                <div class="comment-avatar">{{ comment.author.charAt(0) }}</div>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">{{ comment.author }}</span>
                    <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
                  </div>
                  <div class="comment-text">{{ comment.text }}</div>
                  <div class="comment-stats">
                    <span 
                      class="comment-like" 
                      :class="{ 'liked': comment.isLiked }"
                      @click="toggleCommentLike(comment.id)"
                    >
                      <el-icon><Star /></el-icon> {{ formatNumber(comment.likeCount) }}
                    </span>
                    <span class="comment-reply" @click="replyToComment(comment.id)">
                      <el-icon><ChatDotRound /></el-icon> 回复
                    </span>
                  </div>
                  
                  <!-- 回复列表 -->
                  <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
                    <div 
                      v-for="reply in comment.replies" 
                      :key="reply.id" 
                      class="reply-item"
                    >
                      <div class="reply-avatar">{{ reply.author.charAt(0) }}</div>
                      <div class="reply-content">
                        <div class="reply-header">
                          <span class="reply-author">{{ reply.author }}</span>
                          <span class="reply-time">{{ formatTime(reply.createdAt) }}</span>
                        </div>
                        <div class="reply-text">{{ reply.text }}</div>
                        <div class="reply-stats">
                          <span 
                            class="reply-like" 
                            :class="{ 'liked': reply.isLiked }"
                            @click="toggleReplyLike(comment.id, reply.id)"
                          >
                            <el-icon><Star /></el-icon> {{ formatNumber(reply.likeCount) }}
                          </span>
                          <span class="reply-reply" @click="replyToComment(comment.id)">
                            <el-icon><ChatDotRound /></el-icon> 回复
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="show-more-replies" v-if="comment.totalReplies > comment.replies.length">
                      <a href="#" @click.prevent="showMoreReplies(comment.id)">
                        查看更多 {{ comment.totalReplies - comment.replies.length }} 条回复
                      </a>
                    </div>
                  </div>
                  
                  <!-- 回复输入框 -->
                  <div v-if="replyingTo === comment.id" class="reply-input-section">
                    <el-input
                      v-model="replyContent"
                      type="textarea"
                      :rows="2"
                      placeholder="写下你的回复..."
                      maxlength="200"
                      show-word-limit
                    />
                    <div class="reply-input-actions">
                      <el-button @click="cancelReply">取消</el-button>
                      <el-button type="primary" @click="submitReply(comment.id)">
                        回复
                      </el-button>
                    </div>
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
                :total="totalComments"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
        
        <!-- 侧边栏 -->
        <div class="sidebar">
          <!-- 相关推荐 -->
          <div class="sidebar-section">
            <h3 class="section-title">
              <el-icon><RefreshRight /></el-icon> 相关推荐
            </h3>
            <div class="related-posts">
              <div 
                v-for="related in relatedPosts" 
                :key="related.id" 
                class="related-post-item"
                @click="goToPost(related.id)"
              >
                <div class="related-post-title">{{ related.title }}</div>
                <div class="related-post-meta">
                  <span>{{ formatNumber(related.viewCount) }} 浏览</span>
                  <span>{{ formatNumber(related.replyCount) }} 回复</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 本吧热门 -->
          <div class="sidebar-section">
            <h3 class="section-title">
              <el-icon><HotFilled /></el-icon> 本吧热门
            </h3>
            <div class="hot-posts">
              <div 
                v-for="hot in hotPosts" 
                :key="hot.id" 
                class="hot-post-item"
                @click="goToPost(hot.id)"
              >
                <div class="hot-rank">{{ hot.rank }}</div>
                <div class="hot-post-title">{{ hot.title }}</div>
              </div>
            </div>
          </div>
          
          <!-- 推广 -->
          <div class="sidebar-section">
            <h3 class="section-title">
              <el-icon><Bell /></el-icon> 推广
            </h3>
            <div class="promotion-banner">
              <div class="promo-content">
                <h4>开通贴吧会员</h4>
                <p>享受更多特权服务</p>
                <el-button type="primary" size="small">立即开通</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 图片查看器 -->
    <el-dialog
      v-model="dialogVisible"
      :show-close="true"
      width="90%"
      :before-close="closeDialog"
      class="image-viewer"
      center
    >
      <div class="viewer-container">
        <img :src="currentImageUrl" class="viewer-image" :alt="'图片 ' + (currentImageIndex + 1)">
        <div class="viewer-nav">
          <el-button icon="ArrowLeft" @click="prevImage" :disabled="currentImageIndex === 0"></el-button>
          <span class="viewer-counter">{{ currentImageIndex + 1 }} / {{ post.images.length }}</span>
          <el-button icon="ArrowRight" @click="nextImage" :disabled="currentImageIndex === post.images.length - 1"></el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  User,
  View,
  Star,
  ChatDotRound,
  Share,
  More,
  Check,
  ChatLineSquare,
  RefreshRight,
  HotFilled,
  Bell,
  ArrowLeft,
  ArrowRight,
  Picture
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const postId = ref(route.params.id || 1)

// 帖子数据
const post = ref({
  id: 1,
  title: '【讨论】你最喜欢的电影是哪一部？为什么？',
  content: `<p>每个人心中都有一部特别喜欢的电影，可能是因为它的剧情、演员的表演，或者是它带给你的特殊感受。</p>
  <p>我先来分享一下，我最喜欢的电影是《肖申克的救赎》，这部电影讲述了希望与自由的故事，主角安迪在监狱中经历了种种磨难，但始终没有放弃希望，最终获得了自由。这部电影让我明白了，无论在多么艰难的环境中，只要心中有希望，就一定能够找到出路。</p>
  <p>你们呢？最喜欢的电影是什么？为什么喜欢它？欢迎在评论区分享！</p>`,
  author: '电影爱好者',
  authorDescription: '热爱电影，喜欢分享观影心得',
  createdAt: '2023-11-10T10:30:00',
  source: '来自 iPhone客户端',
  viewCount: 12345,
  likeCount: 890,
  replyCount: 567,
  isTop: false,
  isEssence: true,
  tags: ['电影', '讨论'],
  images: [
    { url: 'https://via.placeholder.com/400x300?text=Movie1' },
    { url: 'https://via.placeholder.com/400x300?text=Movie2' },
    { url: 'https://via.placeholder.com/400x300?text=Movie3' }
  ]
})

// 状态
const isLiked = ref(false)
const newComment = ref('')
const replyContent = ref('')
const replyingTo = ref(null)
const commentSort = ref('time')
const currentPage = ref(1)
const pageSize = ref(10)
const totalComments = ref(100)
const dialogVisible = ref(false)
const currentImageIndex = ref(0)
const currentImageUrl = ref('')

// 模拟评论数据
const comments = ref([
  {
    id: 1,
    author: '影评人张三',
    text: '我也很喜欢《肖申克的救赎》，这部电影确实是经典中的经典。特别是其中那句"希望是美好的，也许是人间至善，而美好的事物永不消逝"，每次看都会被深深打动。',
    createdAt: '2023-11-10T11:30:00',
    likeCount: 45,
    isLiked: false,
    totalReplies: 5,
    replies: [
      {
        id: 11,
        author: '电影爱好者',
        text: '谢谢支持！这句话确实很经典，每次想起都让我很有感触。',
        createdAt: '2023-11-10T12:00:00',
        likeCount: 12,
        isLiked: false
      },
      {
        id: 12,
        author: '新人小白',
        text: '请问这部电影在哪里可以看？',
        createdAt: '2023-11-10T13:00:00',
        likeCount: 5,
        isLiked: false
      }
    ]
  },
  {
    id: 2,
    author: '影迷李四',
    text: '我最喜欢的电影是《星际穿越》，科幻题材，但更多的是关于爱、亲情和人类的探索精神。诺兰导演的作品总是能够在视觉和思想上给人震撼。',
    createdAt: '2023-11-10T12:15:00',
    likeCount: 38,
    isLiked: false,
    totalReplies: 3,
    replies: [
      {
        id: 21,
        author: '科幻迷王五',
        text: '《星际穿越》确实很棒！特别是其中关于黑洞和五维空间的表现，太震撼了！',
        createdAt: '2023-11-10T12:30:00',
        likeCount: 8,
        isLiked: false
      }
    ]
  },
  {
    id: 3,
    author: '电影发烧友',
    text: '我比较喜欢《阿甘正传》，这部电影让我明白了，无论智商如何，只要坚持做自己，总有一天会成功的。生活就像一盒巧克力，你永远不知道下一颗是什么味道。',
    createdAt: '2023-11-10T13:45:00',
    likeCount: 32,
    isLiked: false,
    totalReplies: 2,
    replies: []
  }
])

// 模拟相关推荐数据
const relatedPosts = ref([
  {
    id: 10,
    title: '【分享】2023年必看的十部电影推荐',
    viewCount: 8765,
    replyCount: 234
  },
  {
    id: 11,
    title: '【讨论】你认为哪部电影最能代表中国电影的水平？',
    viewCount: 7654,
    replyCount: 198
  },
  {
    id: 12,
    title: '【影评】深度解析《奥本海默》中的人物塑造',
    viewCount: 6543,
    replyCount: 156
  }
])

// 模拟热门帖子数据
const hotPosts = ref([
  {
    id: 20,
    title: '【公告】百度贴吧观影团招募成员',
    rank: 1
  },
  {
    id: 21,
    title: '【活动】晒出你的观影票根，赢取电影周边',
    rank: 2
  },
  {
    id: 22,
    title: '【讨论】你觉得电影票价是不是越来越贵了？',
    rank: 3
  },
  {
    id: 23,
    title: '【求助】求推荐一些治愈系电影',
    rank: 4
  },
  {
    id: 24,
    title: '【分享】我收藏的经典电影海报',
    rank: 5
  }
])

// 切换喜欢状态
const toggleLike = () => {
  isLiked.value = !isLiked.value
  post.value.likeCount += isLiked.value ? 1 : -1
}

// 发表评论
const submitComment = () => {
  if (newComment.value.trim()) {
    // 这里应该调用API发表评论
    const newCommentObj = {
      id: Date.now(),
      author: '当前用户',
      text: newComment.value.trim(),
      createdAt: new Date().toISOString(),
      likeCount: 0,
      isLiked: false,
      totalReplies: 0,
      replies: []
    }
    comments.value.unshift(newCommentObj)
    post.value.replyCount += 1
    newComment.value = ''
  }
}

// 回复评论
const replyToComment = (commentId) => {
  replyingTo.value = commentId === replyingTo.value ? null : commentId
  if (commentId !== replyingTo.value) {
    replyContent.value = ''
  }
}

// 取消回复
const cancelReply = () => {
  replyingTo.value = null
  replyContent.value = ''
}

// 提交回复
const submitReply = (commentId) => {
  if (replyContent.value.trim()) {
    // 这里应该调用API提交回复
    const comment = comments.value.find(c => c.id === commentId)
    if (comment) {
      const newReply = {
        id: Date.now(),
        author: '当前用户',
        text: replyContent.value.trim(),
        createdAt: new Date().toISOString(),
        likeCount: 0,
        isLiked: false
      }
      comment.replies.push(newReply)
      comment.totalReplies += 1
      replyingTo.value = null
      replyContent.value = ''
    }
  }
}

// 切换评论喜欢状态
const toggleCommentLike = (commentId) => {
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    comment.isLiked = !comment.isLiked
    comment.likeCount += comment.isLiked ? 1 : -1
  }
}

// 切换回复喜欢状态
const toggleReplyLike = (commentId, replyId) => {
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    const reply = comment.replies.find(r => r.id === replyId)
    if (reply) {
      reply.isLiked = !reply.isLiked
      reply.likeCount += reply.isLiked ? 1 : -1
    }
  }
}

// 查看更多回复
const showMoreReplies = (commentId) => {
  // 这里应该调用API获取更多回复
  console.log('加载更多回复:', commentId)
}

// 查看图片
const showImageViewer = (index) => {
  currentImageIndex.value = index
  currentImageUrl.value = post.value.images[index].url
  dialogVisible.value = true
}

// 上一张图片
const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
    currentImageUrl.value = post.value.images[currentImageIndex.value].url
  }
}

// 下一张图片
const nextImage = () => {
  if (currentImageIndex.value < post.value.images.length - 1) {
    currentImageIndex.value++
    currentImageUrl.value = post.value.images[currentImageIndex.value].url
  }
}

// 关闭图片查看器
const closeDialog = () => {
  dialogVisible.value = false
}

// 跳转到其他帖子
const goToPost = (id) => {
  if (parseInt(id) !== parseInt(postId.value)) {
    router.push(`/post/${id}`)
  }
}

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  // 这里应该重新获取评论数据
}

const handleCurrentChange = (newCurrent) => {
  currentPage.value = newCurrent
  // 这里应该重新获取评论数据
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
  // 这里应该根据postId调用API获取帖子详情和评论列表
})
</script>

<style scoped>
.post-detail {
  min-height: 100vh;
  padding: 20px 0;
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

.post-section {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.post-header {
  padding: 25px;
  border-bottom: 1px solid #f0f0f0;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 20px;
}

.author-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: bold;
  color: var(--text-primary);
  font-size: 16px;
  margin-bottom: 5px;
}

.post-meta {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: var(--text-secondary);
}

.post-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 15px;
  line-height: 1.4;
}

.post-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.post-content {
  padding: 25px;
}

.content-text {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-primary);
  margin-bottom: 30px;
}

.content-text :deep(p) {
  margin-bottom: 15px;
}

.content-images {
  margin-bottom: 30px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}

.image-wrapper {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
}

.post-image {
  width: 100%;
  height: auto;
  transition: transform 0.3s;
}

.image-wrapper:hover .post-image {
  transform: scale(1.05);
}

.post-stats {
  display: flex;
  gap: 30px;
  padding: 15px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--text-secondary);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.post-actions {
  display: flex;
  gap: 10px;
}

.post-actions .liked {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.author-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 25px;
  border-top: 1px solid #f0f0f0;
  background-color: #f8f9fa;
}

.author-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 32px;
}

.author-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.author-description {
  font-size: 14px;
  color: var(--text-secondary);
}

.comments-section {
  padding: 25px;
  border-top: 1px solid #f0f0f0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-input-section {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.comment-input-section .el-input {
  flex: 1;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.comment-item {
  display: flex;
  gap: 15px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

.comment-author {
  font-weight: bold;
  color: var(--text-primary);
  font-size: 14px;
}

.comment-time {
  color: var(--text-secondary);
  font-size: 12px;
}

.comment-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.comment-stats {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: var(--text-secondary);
}

.comment-like,
.comment-reply {
  cursor: pointer;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.comment-like:hover,
.comment-reply:hover {
  color: var(--primary-color);
}

.comment-like.liked {
  color: var(--primary-color);
}

.replies-list {
  margin-top: 15px;
  padding-left: 30px;
  border-left: 2px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.reply-item {
  display: flex;
  gap: 10px;
}

.reply-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
  flex-shrink: 0;
}

.reply-content {
  flex: 1;
}

.reply-header {
  display: flex;
  gap: 15px;
  margin-bottom: 5px;
}

.reply-author {
  font-weight: bold;
  color: var(--text-primary);
  font-size: 13px;
}

.reply-time {
  color: var(--text-secondary);
  font-size: 11px;
}

.reply-text {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.reply-stats {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: var(--text-secondary);
}

.reply-like,
.reply-reply {
  cursor: pointer;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.reply-like:hover,
.reply-reply:hover {
  color: var(--primary-color);
}

.reply-like.liked {
  color: var(--primary-color);
}

.show-more-replies {
  margin-top: 10px;
}

.show-more-replies a {
  color: var(--primary-color);
  font-size: 13px;
  text-decoration: none;
}

.show-more-replies a:hover {
  text-decoration: underline;
}

.reply-input-section {
  margin-top: 15px;
  padding-left: 40px;
}

.reply-input-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.pagination {
  margin-top: 30px;
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

.sidebar-section .section-title {
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

.related-posts {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.related-post-item {
  cursor: pointer;
  transition: all 0.3s;
}

.related-post-item:hover {
  transform: translateX(5px);
}

.related-post-title {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-post-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: var(--text-secondary);
}

.hot-posts {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hot-post-item {
  display: flex;
  gap: 10px;
  cursor: pointer;
  transition: color 0.3s;
}

.hot-post-item:hover {
  color: var(--primary-color);
}

.hot-rank {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.hot-post-item:nth-child(1) .hot-rank {
  background-color: #ff6b6b;
  color: white;
}

.hot-post-item:nth-child(2) .hot-rank {
  background-color: #ffa500;
  color: white;
}

.hot-post-item:nth-child(3) .hot-rank {
  background-color: #feca57;
  color: white;
}

.hot-post-title {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.promotion-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 20px;
  color: white;
  text-align: center;
}

.promo-content h4 {
  margin-bottom: 10px;
  font-size: 16px;
}

.promo-content p {
  margin-bottom: 15px;
  font-size: 14px;
  opacity: 0.9;
}

.image-viewer {
  padding: 0;
}

.viewer-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.viewer-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.viewer-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.viewer-counter {
  font-size: 14px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
  
  .post-header {
    padding: 20px;
  }
  
  .post-title {
    font-size: 20px;
  }
  
  .post-content {
    padding: 20px;
  }
  
  .author-card {
    padding: 20px;
  }
  
  .comments-section {
    padding: 20px;
  }
  
  .comment-input-section {
    flex-direction: column;
  }
  
  .image-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>