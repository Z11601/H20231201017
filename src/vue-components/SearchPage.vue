<template>
  <div class="search-page">
    <div class="container">
      <!-- 搜索框 -->
      <div class="search-header">
        <div class="search-box">
          <input 
            type="text" 
            class="search-input" 
            v-model="searchQuery"
            placeholder="搜索感兴趣的内容..."
            @keyup.enter="handleSearch"
          >
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>
        
        <!-- 搜索筛选标签 -->
        <div class="search-filters">
          <div 
            v-for="filter in searchFilters" 
            :key="filter.value"
            class="filter-chip"
            :class="{ active: activeFilter === filter.value }"
            @click="setActiveFilter(filter.value)"
          >
            {{ filter.label }}
          </div>
        </div>
      </div>
      
      <!-- 搜索结果 -->
      <div v-if="searchQuery && searchQuery.length >= 2" class="search-results">
        <!-- 结果统计 -->
        <div class="results-stats">
          找到与 "{{ searchQuery }}" 相关的结果约 {{ resultsCount }} 个
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <span>搜索中...</span>
        </div>
        
        <!-- 帖子结果 -->
        <div v-else-if="activeFilter === 'posts' || activeFilter === 'all'" class="results-section">
          <div v-if="postResults.length > 0" class="results-list">
            <div 
              v-for="post in postResults" 
              :key="post.id"
              class="result-item"
              @click="goToPost(post.id)"
            >
              <div class="result-title">{{ highlightMatch(post.title) }}</div>
              <div class="result-content">{{ highlightMatch(truncateContent(post.content, 150)) }}</div>
              <div class="result-meta">
                <span class="result-tieba">{{ post.tieba_name }}</span>
                <span class="result-author">{{ post.author_name }}</span>
                <span class="result-time">{{ formatTime(post.created_at) }}</span>
                <span class="result-stats">{{ post.view_count }} 浏览 · {{ post.reply_count }} 回复</span>
              </div>
            </div>
          </div>
          <div v-else class="no-results">
            <p>没有找到相关帖子</p>
          </div>
        </div>
        
        <!-- 贴吧结果 -->
        <div v-if="activeFilter === 'tiebas' || activeFilter === 'all'" class="results-section">
          <h2 class="section-title">相关贴吧</h2>
          <div v-if="tiebaResults.length > 0" class="tieba-grid">
            <div 
              v-for="tieba in tiebaResults" 
              :key="tieba.id"
              class="tieba-item"
              @click="goToTieba(tieba.id)"
            >
              <div class="tieba-avatar">{{ tieba.name.charAt(0) }}</div>
              <div class="tieba-name">{{ highlightMatch(tieba.name) }}</div>
              <div class="tieba-desc">{{ truncateContent(tieba.description, 80) }}</div>
              <div class="tieba-members">{{ formatNumber(tieba.member_count) }} 成员</div>
            </div>
          </div>
          <div v-else-if="activeFilter === 'tiebas'" class="no-results">
            <p>没有找到相关贴吧</p>
          </div>
        </div>
        
        <!-- 用户结果 -->
        <div v-if="activeFilter === 'users' || activeFilter === 'all'" class="results-section">
          <h2 class="section-title">相关用户</h2>
          <div v-if="userResults.length > 0" class="users-list">
            <div 
              v-for="user in userResults" 
              :key="user.id"
              class="user-item"
              @click="goToUser(user.id)"
            >
              <div class="user-avatar">{{ user.username.charAt(0) }}</div>
              <div class="user-info">
                <div class="user-name">{{ highlightMatch(user.username) }}</div>
                <div class="user-meta">{{ user.post_count }} 帖子 · {{ formatNumber(user.follower_count) }} 粉丝</div>
              </div>
            </div>
          </div>
          <div v-else-if="activeFilter === 'users'" class="no-results">
            <p>没有找到相关用户</p>
          </div>
        </div>
        
        <!-- 分页 -->
        <div v-if="!loading && (postResults.length > 0 || tiebaResults.length > 0 || userResults.length > 0)" class="pagination">
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
      
      <!-- 欢迎提示 -->
      <div v-else class="welcome-section">
        <div class="welcome-icon">🔍</div>
        <h2>搜索百度贴吧</h2>
        <p>输入关键词，查找感兴趣的内容、贴吧和用户</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 状态管理
const searchQuery = ref('');
const activeFilter = ref('all');
const loading = ref(false);
const page = ref(1);
const totalPages = ref(1);
const resultsCount = ref(0);

// 搜索结果
const postResults = ref([]);
const tiebaResults = ref([]);
const userResults = ref([]);

// 搜索筛选标签
const searchFilters = [
  { label: '全部', value: 'all' },
  { label: '帖子', value: 'posts' },
  { label: '贴吧', value: 'tiebas' },
  { label: '用户', value: 'users' }
];

// 监听路由参数中的搜索查询
watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery) {
      searchQuery.value = newQuery;
      performSearch();
    }
  }
);

// 组件挂载时检查路由参数
onMounted(() => {
  const query = route.query.q;
  if (query) {
    searchQuery.value = query;
  }
});

// 处理搜索
function handleSearch() {
  if (searchQuery.value.trim() && searchQuery.value.trim().length >= 2) {
    // 更新路由参数，但不刷新页面
    router.push({
      path: '/search',
      query: { q: searchQuery.value.trim() }
    });
  }
}

// 执行搜索
function performSearch() {
  if (searchQuery.value.length < 2) return;
  
  loading.value = true;
  page.value = 1;
  
  // 模拟搜索请求延迟
  setTimeout(() => {
    // 模拟搜索结果
    generateMockResults();
    loading.value = false;
  }, 800);
}

// 生成模拟搜索结果
function generateMockResults() {
  const query = searchQuery.value.toLowerCase();
  
  // 模拟帖子结果
  postResults.value = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    title: `${query}相关的帖子标题 ${i + 1} - 精彩内容分享`,
    content: `这是关于${query}的帖子内容，包含了丰富的信息和有价值的讨论。欢迎大家积极参与讨论，分享自己的想法和见解。`,
    tieba_name: ['英雄联盟', '绝地求生', '动漫吧', '美食吧', '旅游吧'][i],
    author_name: `用户${Math.floor(Math.random() * 1000)}`,
    created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    view_count: Math.floor(Math.random() * 1000),
    reply_count: Math.floor(Math.random() * 100)
  }));
  
  // 模拟贴吧结果
  tiebaResults.value = Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    name: `${query}爱好者吧${i + 1}`,
    description: `这是一个关于${query}的讨论贴吧，欢迎所有喜欢${query}的朋友加入我们！`,
    member_count: Math.floor(Math.random() * 100000) + 1000
  }));
  
  // 模拟用户结果
  userResults.value = Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    username: `${query}达人${i + 1}`,
    post_count: Math.floor(Math.random() * 100) + 10,
    follower_count: Math.floor(Math.random() * 1000)
  }));
  
  // 计算总结果数
  resultsCount.value = postResults.value.length + tiebaResults.value.length + userResults.value.length;
  // 设置总页数
  totalPages.value = 3;
}

// 设置活动筛选器
function setActiveFilter(filter) {
  activeFilter.value = filter;
}

// 切换分页
function changePage(newPage) {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage;
    // 在实际项目中，这里应该加载对应页的数据
  }
}

// 高亮匹配的文本
function highlightMatch(text) {
  if (!text || !searchQuery.value) return text;
  
  const regex = new RegExp(`(${escapeRegExp(searchQuery.value)})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    if (part.toLowerCase() === searchQuery.value.toLowerCase()) {
      return `<span class="highlight">${part}</span>`;
    }
    return part;
  }).join('');
}

// 转义正则表达式特殊字符
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 截断内容
function truncateContent(content, maxLength) {
  return content.length <= maxLength ? content : content.substring(0, maxLength) + '...';
}

// 格式化数字
function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

// 格式化时间
function formatTime(timeString) {
  const date = new Date(timeString);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60 * 1000) return '刚刚';
  if (diff < 60 * 60 * 1000) return Math.floor(diff / (60 * 1000)) + '分钟前';
  if (diff < 24 * 60 * 60 * 1000) return Math.floor(diff / (60 * 60 * 1000)) + '小时前';
  if (diff < 7 * 24 * 60 * 60 * 1000) return Math.floor(diff / (24 * 60 * 60 * 1000)) + '天前';
  
  return date.toLocaleDateString('zh-CN');
}

// 跳转到帖子详情
function goToPost(postId) {
  router.push(`/post/${postId}`);
}

// 跳转到贴吧详情
function goToTieba(tiebaId) {
  router.push(`/tieba/${tiebaId}`);
}

// 跳转到用户主页
function goToUser(userId) {
  router.push(`/profile/${userId}`);
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 30px 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 搜索头部 */
.search-header {
  margin-bottom: 30px;
}

.search-box {
  display: flex;
  max-width: min(600px, 100%);
  width: 100%;
  margin: 0 auto 20px;
  background-color: white;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.search-input {
  flex: 1;
  padding: 15px 20px;
  border: none;
  font-size: 16px;
  outline: none;
}

.search-btn {
  background-color: #007aff;
  color: white;
  border: none;
  padding: 0 25px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-btn:hover {
  background-color: #0056cc;
}

/* 搜索筛选标签 */
.search-filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-chip {
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-chip:hover {
  border-color: #007aff;
  color: #007aff;
}

.filter-chip.active {
  background-color: #007aff;
  color: white;
  border-color: #007aff;
}

/* 搜索结果 */
.search-results {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.results-stats {
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.spinner {
  border: 4px solid rgba(0, 122, 255, 0.1);
  border-left-color: #007aff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 结果区域 */
.results-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

/* 帖子结果列表 */
.results-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-item {
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.result-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #007aff;
}

.result-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.4;
}

.result-content {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.result-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 13px;
  color: #999;
}

.result-tieba {
  color: #007aff;
}

/* 高亮匹配文本 */
:deep(.highlight) {
  background-color: #ffeb3b;
  padding: 0 2px;
  border-radius: 2px;
}

/* 贴吧结果网格 */
.tieba-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.tieba-item {
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tieba-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #007aff;
}

.tieba-avatar {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
}

.tieba-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.tieba-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  line-height: 1.4;
}

.tieba-members {
  font-size: 13px;
  color: #999;
}

/* 用户结果列表 */
.users-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.user-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #007aff;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 3px;
}

.user-meta {
  font-size: 13px;
  color: #999;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background-color: white;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #007aff;
  color: #007aff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}

/* 无结果状态 */
.no-results {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

/* 欢迎区域 */
.welcome-section {
  text-align: center;
  padding: 80px 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.welcome-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.welcome-section h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
}

.welcome-section p {
  font-size: 16px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-page {
    padding: 20px 0;
  }
  
  .search-results {
    padding: 20px;
  }
  
  .tieba-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .result-title {
    font-size: 16px;
  }
  
  .result-meta {
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .search-box {
    border-radius: 20px;
  }
  
  .search-input {
    padding: 12px 15px;
    font-size: 14px;
  }
  
  .search-btn {
    padding: 0 20px;
    font-size: 14px;
  }
  
  .welcome-section {
    padding: 60px 15px;
  }
  
  .welcome-section h2 {
    font-size: 24px;
  }
}
</style>