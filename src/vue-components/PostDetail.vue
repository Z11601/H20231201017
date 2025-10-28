<template>
  <div class="post-detail-page">
    <div class="container">
      <!-- 帖子正文 -->
      <div v-if="currentPost" class="post-content-section">
        <!-- 帖子头部信息 -->
        <div class="post-header">
          <div class="post-user-info">
            <div class="user-avatar-large">
              {{ currentPost.author_name.charAt(0) }}
            </div>
            <div class="user-details">
              <div class="author-name">{{ currentPost.author_name }}</div>
              <div class="post-meta">
                <span class="post-time">{{ formatTime(currentPost.created_at) }}</span>
                <span class="post-view">浏览 {{ formatNumber(currentPost.view_count) }}</span>
                <span class="post-tieba">{{ currentPost.tieba_name }}</span>
              </div>
            </div>
          </div>
          <div class="post-actions">
            <button 
              class="report-btn" 
              @click="handleReport"
            >
              举报
            </button>
          </div>
        </div>
        
        <!-- 帖子标题 -->
        <h1 class="post-title-large">{{ currentPost.title }}</h1>
        
        <!-- 帖子内容 -->
        <div class="post-content">
          <p v-for="(paragraph, index) in currentPost.content.split('\n')" :key="index" class="content-paragraph">
            {{ paragraph }}
          </p>
        </div>
        
        <!-- 帖子图片 -->
        <div v-if="currentPost.images && currentPost.images.length > 0" class="post-image-gallery">
          <img 
            v-for="(image, index) in currentPost.images" 
            :key="index"
            :src="image.url" 
            :alt="`帖子图片 ${index + 1}`"
            class="post-image"
            @click="previewImage(image.url)"
          >
        </div>
        
        <!-- 帖子互动按钮 -->
        <div class="post-interactions">
          <button 
            class="interaction-btn"
            :class="{ active: isLiked }"
            @click="handleLike"
          >
            <span class="icon">{{ isLiked ? '👍' : '👍' }}</span>
            <span>{{ formatNumber(currentPost.like_count + (isLiked ? 1 : 0)) }}</span>
          </button>
          <button 
            class="interaction-btn"
            @click="focusComment"
          >
            <span class="icon">💬</span>
            <span>{{ formatNumber(currentPost.reply_count) }}</span>
          </button>
          <button 
            class="interaction-btn"
            @click="handleShare"
          >
            <span class="icon">🔗</span>
            <span>分享</span>
          </button>
        </div>
      </div>
      
      <!-- 加载中状态 -->
      <div v-else-if="loading" class="loading-state">
        <div class="spinner"></div>
        <span>加载中...</span>
      </div>
      
      <!-- 评论区 -->
      <div class="comments-section">
        <h2 class="comments-title">
          全部回复 ({{ formatNumber(currentPost?.reply_count || 0) }})
        </h2>
        
        <!-- 评论排序 -->
        <div class="comment-sort">
          <span class="sort-label">排序：</span>
          <select v-model="commentSort" @change="loadComments">
            <option value="latest">最新</option>
            <option value="hot">热门</option>
          </select>
        </div>
        
        <!-- 评论输入框 -->
        <div class="comment-input-section">
          <div v-if="userStore.isLoggedIn">
            <div class="user-input-avatar">
              {{ userStore.currentUser?.username?.charAt(0) || '游' }}
            </div>
            <div class="comment-input-wrapper">
              <textarea
                ref="commentTextarea"
                v-model="commentText"
                class="comment-textarea"
                placeholder="写下你的回复..."
                rows="3"
              ></textarea>
              <div class="comment-input-actions">
                <div class="input-actions-left">
                  <button class="input-action-btn">
                    <span class="icon">🖼️</span>
                  </button>
                  <button class="input-action-btn">
                    <span class="icon">😊</span>
                  </button>
                </div>
                <button 
                  class="submit-comment-btn"
                  :disabled="!commentText.trim() || isSubmittingComment"
                  @click="submitComment"
                >
                  {{ isSubmittingComment ? '发送中...' : '发送回复' }}
                </button>
              </div>
            </div>
          </div>
          <div v-else class="login-to-comment">
            <p>请 <router-link to="/login">登录</router-link> 后发表评论</p>
          </div>
        </div>
        
        <!-- 评论列表 -->
        <div v-if="comments.length > 0" class="comment-list">
          <div 
            v-for="comment in comments" 
            :key="comment.id" 
            class="comment-item"
          >
            <div class="comment-avatar">
              {{ comment.author_name.charAt(0) }}
            </div>
            <div class="comment-content-wrapper">
              <div class="comment-header">
                <div class="comment-author">{{ comment.author_name }}</div>
                <div class="comment-time">{{ formatTime(comment.created_at) }}</div>
              </div>
              <div class="comment-content">
                {{ comment.content }}
              </div>
              <div class="comment-actions">
                <button 
                  class="comment-action-btn"
                  :class="{ active: isCommentLiked(comment.id) }"
                  @click="handleCommentLike(comment.id)"
                >
                  <span class="icon">👍</span>
                  <span>{{ comment.like_count + (isCommentLiked(comment.id) ? 1 : 0) }}</span>
                </button>
                <button 
                  class="comment-action-btn"
                  @click="replyToComment(comment.id, comment.author_name)"
                >
                  <span class="icon">↩️</span>
                  <span>回复</span>
                </button>
              </div>
              
              <!-- 回复输入框 -->
              <div 
                v-if="replyingToCommentId === comment.id" 
                class="reply-input-section"
              >
                <textarea
                  v-model="replyText"
                  class="reply-textarea"
                  :placeholder="`回复 @${comment.author_name}`"
                  rows="2"
                ></textarea>
                <div class="reply-actions">
                  <button 
                    class="cancel-reply-btn"
                    @click="cancelReply"
                  >
                    取消
                  </button>
                  <button 
                    class="submit-reply-btn"
                    :disabled="!replyText.trim()"
                    @click="submitReply"
                  >
                    回复
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 评论加载状态 -->
        <div v-else-if="loadingComments" class="loading-state">
          <div class="spinner small"></div>
          <span>加载评论中...</span>
        </div>
        
        <!-- 无评论状态 -->
        <div v-else class="no-comments">
          <div class="empty-icon">💬</div>
          <p>暂无评论，来发表第一条评论吧！</p>
        </div>
        
        <!-- 评论分页 -->
        <div v-if="comments.length > 0" class="comment-pagination">
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
    
    <!-- 图片预览对话框 -->
    <div v-if="previewImageUrl" class="image-preview-overlay" @click="closePreview">
      <div class="image-preview-content" @click.stop>
        <button class="close-preview-btn" @click="closePreview">×</button>
        <img :src="previewImageUrl" alt="图片预览" class="preview-image" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePostStore } from '../store/post'
import { useUserStore } from '../store/user'

const router = useRouter()
const route = useRoute()
const postStore = usePostStore()
const userStore = useUserStore()

// 状态管理
const postId = computed(() => route.params.id)
const loading = ref(false)
const loadingComments = ref(false)
const isLiked = ref(false)
const comments = ref([])
const commentSort = ref('latest')
const commentText = ref('')
const replyText = ref('')
const replyingToCommentId = ref(null)
const replyingToAuthor = ref('')
const isSubmittingComment = ref(false)
const likedComments = ref(new Set())
const previewImageUrl = ref('')
const page = ref(1)
const pageSize = 20
const totalPages = ref(1)
const commentTextarea = ref(null)

// 计算属性
const currentPost = computed(() => postStore.currentPost)

// 监听路由参数变化
watch(postId, async (newId) => {
  if (newId) {
    await loadPostDetail()
    await loadComments()
  }
})

// 组件挂载时加载数据
onMounted(async () => {
  if (postId.value) {
    await loadPostDetail()
    await loadComments()
  }
})

// 加载帖子详情
async function loadPostDetail() {
  loading.value = true
  try {
    await postStore.fetchPost(postId.value)
    // 模拟随机点赞状态
    isLiked.value = Math.random() > 0.5
  } catch (error) {
    console.error('加载帖子详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载评论
async function loadComments() {
  loadingComments.value = true
  try {
    // 模拟评论数据
    const mockComments = Array.from({ length: Math.min(pageSize, 15) }, (_, i) => ({
      id: (page.value - 1) * pageSize + i + 1,
      author_name: `用户${Math.floor(Math.random() * 1000)}`,
      content: '这是一条很有见地的评论，我觉得你的观点非常正确。我也有类似的经历和感受，希望能够看到更多这样的内容。',
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      like_count: Math.floor(Math.random() * 50)
    }))
    comments.value = mockComments
    totalPages.value = 3 // 模拟总页数
  } catch (error) {
    console.error('加载评论失败:', error)
  } finally {
    loadingComments.value = false
  }
}

// 点赞帖子
function handleLike() {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  isLiked.value = !isLiked.value
  // 实际应该调用API
}

// 检查评论是否被点赞
function isCommentLiked(commentId) {
  return likedComments.value.has(commentId)
}

// 点赞评论
function handleCommentLike(commentId) {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  if (likedComments.value.has(commentId)) {
    likedComments.value.delete(commentId)
  } else {
    likedComments.value.add(commentId)
  }
  // 实际应该调用API
}

// 举报帖子
function handleReport() {
  alert('举报功能正在开发中')
}

// 分享帖子
function handleShare() {
  alert('分享功能正在开发中')
}

// 提交评论
async function submitComment() {
  if (!commentText.value.trim() || !userStore.isLoggedIn) return
  
  isSubmittingComment.value = true
  try {
    // 模拟提交评论
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 添加新评论到列表顶部
    const newComment = {
      id: Date.now(),
      author_name: userStore.currentUser?.username || '匿名用户',
      content: commentText.value,
      created_at: new Date().toISOString(),
      like_count: 0
    }
    comments.value.unshift(newComment)
    commentText.value = ''
    
    // 更新帖子回复数
    if (currentPost.value) {
      currentPost.value.reply_count += 1
    }
  } catch (error) {
    console.error('提交评论失败:', error)
  } finally {
    isSubmittingComment.value = false
  }
}

// 回复评论
function replyToComment(commentId, authorName) {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  replyingToCommentId.value = commentId
  replyingToAuthor.value = authorName
  replyText.value = ''
}

// 取消回复
function cancelReply() {
  replyingToCommentId.value = null
  replyingToAuthor.value = ''
  replyText.value = ''
}

// 提交回复
async function submitReply() {
  if (!replyText.value.trim()) return
  
  // 模拟提交回复
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 创建回复内容
  const replyContent = `@${replyingToAuthor.value} ${replyText.value}`
  
  // 添加回复到评论列表
  const newReply = {
    id: Date.now(),
    author_name: userStore.currentUser?.username || '匿名用户',
    content: replyContent,
    created_at: new Date().toISOString(),
    like_count: 0
  }
  comments.value.unshift(newReply)
  
  // 重置回复状态
  cancelReply()
  
  // 更新帖子回复数
  if (currentPost.value) {
    currentPost.value.reply_count += 1
  }
}

// 预览图片
function previewImage(url) {
  previewImageUrl.value = url
}

// 关闭图片预览
function closePreview() {
  previewImageUrl.value = ''
}

// 聚焦到评论框
function focusComment() {
  if (commentTextarea.value && userStore.isLoggedIn) {
    commentTextarea.value.focus()
  } else if (!userStore.isLoggedIn) {
    router.push('/login')
  }
}

// 切换分页
function changePage(newPage) {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage
    loadComments()
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
</script>

<style scoped>
.post-detail-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 30px 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 帖子内容区域 */
.post-content-section {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* 帖子头部信息 */
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.post-user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-avatar-large {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.author-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 14px;
  color: var(--text-secondary);
}

.post-tieba {
  color: var(--primary-color);
  background-color: rgba(0, 122, 255, 0.1);
  padding: 2px 10px;
  border-radius: 12px;
  cursor: pointer;
}

.post-actions {
  display: flex;
  gap: 10px;
}

.report-btn {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.report-btn:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

/* 帖子标题 */
.post-title-large {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 25px;
  line-height: 1.4;
}

/* 帖子内容 */
.post-content {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-primary);
  margin-bottom: 30px;
}

.content-paragraph {
  margin-bottom: 15px;
}

.content-paragraph:last-child {
  margin-bottom: 0;
}

/* 帖子图片 */
.post-image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.post-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.post-image:hover {
  transform: scale(1.05);
}

/* 帖子互动按钮 */
.post-interactions {
  display: flex;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.interaction-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
}

.interaction-btn:hover {
  background-color: rgba(0, 122, 255, 0.08);
  color: var(--primary-color);
}

.interaction-btn.active {
  color: var(--primary-color);
  background-color: rgba(0, 122, 255, 0.08);
}

.icon {
  font-size: 18px;
}

/* 评论区 */
.comments-section {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.comments-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.comment-sort {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
}

.sort-label {
  color: var(--text-secondary);
}

.comment-sort select {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  outline: none;
}

/* 评论输入框 */
.comment-input-section {
  margin-bottom: 30px;
  padding-bottom: 25px;
  border-bottom: 1px solid var(--border-color);
}

.user-input-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-bottom: 15px;
}

.comment-input-wrapper {
  position: relative;
}

.comment-textarea {
  width: 100%;
  min-height: 80px;
  padding: 12px 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  resize: vertical;
  font-size: 15px;
  line-height: 1.5;
  outline: none;
  font-family: inherit;
}

.comment-textarea:focus {
  border-color: var(--primary-color);
}

.comment-input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.input-actions-left {
  display: flex;
  gap: 10px;
}

.input-action-btn {
  background-color: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.input-action-btn:hover {
  background-color: #f0f0f0;
  color: var(--text-primary);
}

.submit-comment-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-comment-btn:hover:not(:disabled) {
  background-color: #0066cc;
  transform: translateY(-1px);
}

.submit-comment-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-to-comment {
  text-align: center;
  padding: 30px 0;
  color: var(--text-secondary);
}

.login-to-comment a {
  color: var(--primary-color);
  text-decoration: none;
}

.login-to-comment a:hover {
  text-decoration: underline;
}

/* 评论列表 */
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 30px;
}

.comment-item {
  display: flex;
  gap: 15px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
}

.comment-content-wrapper {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: bold;
  color: #333;
  font-size: 15px;
}

.comment-time {
  font-size: 13px;
  color: var(--text-secondary);
}

.comment-content {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.comment-actions {
  display: flex;
  gap: 20px;
}

.comment-action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s ease;
}

.comment-action-btn:hover {
  background-color: #f0f0f0;
  color: var(--text-primary);
}

.comment-action-btn.active {
  color: var(--primary-color);
}

/* 回复输入框 */
.reply-input-section {
  margin-top: 15px;
  margin-left: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.reply-textarea {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  resize: vertical;
  font-size: 14px;
  line-height: 1.5;
  outline: none;
  font-family: inherit;
}

.reply-textarea:focus {
  border-color: var(--primary-color);
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.cancel-reply-btn {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-reply-btn:hover {
  border-color: var(--text-secondary);
  color: var(--text-primary);
}

.submit-reply-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-reply-btn:hover:not(:disabled) {
  background-color: #0066cc;
}

.submit-reply-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 加载和空状态 */
.loading-state,
.no-comments {
  text-align: center;
  padding: 40px 0;
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

.spinner.small {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
  opacity: 0.5;
}

.no-comments p {
  color: var(--text-secondary);
}

/* 评论分页 */
.comment-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  background-color: white;
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
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
  font-size: 14px;
}

/* 图片预览对话框 */
.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.image-preview-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
}

.close-preview-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background-color: transparent;
  border: none;
  color: white;
  font-size: 32px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-preview-btn:hover {
  transform: scale(1.1);
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .post-content-section,
  .comments-section {
    padding: 20px;
  }
  
  .post-title-large {
    font-size: 24px;
  }
  
  .post-actions {
    display: none;
  }
  
  .post-image-gallery {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .post-image {
    height: 120px;
  }
  
  .post-interactions {
    gap: 10px;
    flex-wrap: wrap;
  }
  
  .interaction-btn {
    flex: 1;
    justify-content: center;
  }
  
  .comment-input-wrapper {
    margin-left: 45px;
  }
  
  .user-input-avatar {
    float: left;
    margin-right: 15px;
    margin-bottom: 0;
  }
  
  .image-preview-content {
    max-width: 100%;
  }
  
  .close-preview-btn {
    top: 10px;
    right: 10px;
  }
}

@media (max-width: 480px) {
  .post-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .post-title-large {
    font-size: 22px;
  }
  
  .post-meta {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .comment-header {
    flex-wrap: wrap;
  }
}
</style>