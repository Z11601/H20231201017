<template>
  <div class="create-post-page">
    <div class="container">
      <div class="create-post-content">
        <!-- 页面标题 -->
        <div class="page-header">
          <h1>发布新帖子</h1>
          <button class="cancel-btn" @click="handleCancel">取消</button>
        </div>
        
        <!-- 发布表单 -->
        <form @submit.prevent="handleSubmit" class="create-post-form">
          <!-- 选择贴吧 -->
          <div class="form-group">
            <label for="tieba-select">选择贴吧</label>
            <select 
              id="tieba-select" 
              v-model="selectedTieba"
              class="tieba-select"
              :class="{ 'error': errors.tieba }"
            >
              <option value="" disabled>请选择要发布的贴吧</option>
              <option 
                v-for="tieba in userJoinedTiebas" 
                :key="tieba.id" 
                :value="tieba.id"
              >
                {{ tieba.name }}
              </option>
            </select>
            <div v-if="errors.tieba" class="error-message">{{ errors.tieba }}</div>
            <div v-if="userJoinedTiebas.length === 0" class="info-message">
              您还没有加入任何贴吧，<router-link to="/">去加入贴吧</router-link>
            </div>
          </div>
          
          <!-- 帖子标题 -->
          <div class="form-group">
            <label for="post-title">标题</label>
            <input 
              type="text" 
              id="post-title"
              v-model="title"
              class="post-title-input"
              placeholder="请输入标题"
              maxlength="100"
              :class="{ 'error': errors.title }"
            >
            <div class="input-info">
              <span class="char-count">{{ title.length }}/100</span>
            </div>
            <div v-if="errors.title" class="error-message">{{ errors.title }}</div>
          </div>
          
          <!-- 帖子内容 -->
          <div class="form-group">
            <label for="post-content">内容</label>
            <textarea
              id="post-content"
              v-model="content"
              class="post-content-editor"
              placeholder="分享你的想法..."
              rows="10"
              maxlength="2000"
              :class="{ 'error': errors.content }"
            ></textarea>
            <div class="input-info">
              <span class="char-count">{{ content.length }}/2000</span>
            </div>
            <div v-if="errors.content" class="error-message">{{ errors.content }}</div>
          </div>
          
          <!-- 工具栏 -->
          <div class="editor-toolbar">
            <div class="toolbar-actions">
              <button 
                type="button" 
                class="toolbar-btn"
                @click="triggerImageUpload"
                :disabled="isUploading"
              >
                <span class="icon">🖼️</span>
                <span>图片</span>
              </button>
              <button 
                type="button" 
                class="toolbar-btn"
                @click="insertEmoji"
              >
                <span class="icon">😊</span>
                <span>表情</span>
              </button>
              <input 
                ref="imageInput"
                type="file" 
                accept="image/*" 
                multiple 
                style="display: none"
                @change="handleImageUpload"
              >
            </div>
          </div>
          
          <!-- 上传图片预览 -->
          <div v-if="images.length > 0" class="image-preview-container">
            <div class="preview-title">已选择的图片 (最多9张)</div>
            <div class="image-grid">
              <div 
                v-for="(image, index) in images" 
                :key="index" 
                class="image-preview-item"
              >
                <img :src="image.url" alt="预览" class="preview-img" />
                <button 
                  type="button" 
                  class="remove-image-btn"
                  @click="removeImage(index)"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
          
          <!-- 标签 -->
          <div class="form-group">
            <label for="post-tags">添加标签 (可选)</label>
            <div class="tags-input-wrapper">
              <div v-for="(tag, index) in tags" :key="index" class="tag">
                {{ tag }}
                <button 
                  type="button" 
                  class="remove-tag-btn"
                  @click="removeTag(index)"
                >
                  ×
                </button>
              </div>
              <input 
                v-if="tags.length < 5"
                type="text" 
                id="post-tags"
                v-model="tagInput"
                class="tags-input"
                placeholder="输入标签后按回车添加"
                maxlength="10"
                @keyup.enter.prevent="addTag"
              >
              <div v-else class="tags-limit-message">最多添加5个标签</div>
            </div>
          </div>
          
          <!-- 发布按钮 -->
          <div class="form-actions">
            <button 
              type="submit" 
              class="submit-btn"
              :disabled="isSubmitting || userJoinedTiebas.length === 0"
            >
              {{ isSubmitting ? '发布中...' : '发布帖子' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { useTiebaStore } from '../store/tieba'
import { usePostStore } from '../store/post'

const router = useRouter()
const userStore = useUserStore()
const tiebaStore = useTiebaStore()
const postStore = usePostStore()

// 表单数据
const selectedTieba = ref('')
const title = ref('')
const content = ref('')
const images = ref([])
const tags = ref([])
const tagInput = ref('')

// 状态
const isSubmitting = ref(false)
const isUploading = ref(false)
const errors = reactive({})
const userJoinedTiebas = ref([])
const imageInput = ref(null)

// 组件挂载时检查登录状态并加载数据
onMounted(() => {
  // 检查用户是否已登录
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  // 加载用户已加入的贴吧（模拟数据）
  loadUserJoinedTiebas()
})

// 加载用户已加入的贴吧
function loadUserJoinedTiebas() {
  // 模拟用户已加入的贴吧数据
  userJoinedTiebas.value = [
    { id: 1, name: '英雄联盟' },
    { id: 2, name: '绝地求生' },
    { id: 3, name: '动漫吧' },
    { id: 4, name: '美食吧' },
    { id: 5, name: '旅游吧' }
  ]
  
  // 如果有数据，默认选择第一个
  if (userJoinedTiebas.value.length > 0) {
    selectedTieba.value = userJoinedTiebas.value[0].id
  }
}

// 表单验证
function validateForm() {
  // 清空之前的错误
  Object.keys(errors).forEach(key => delete errors[key])
  
  let isValid = true
  
  if (!selectedTieba.value) {
    errors.tieba = '请选择要发布的贴吧'
    isValid = false
  }
  
  if (!title.value.trim()) {
    errors.title = '请输入标题'
    isValid = false
  } else if (title.value.trim().length < 5) {
    errors.title = '标题长度至少5个字符'
    isValid = false
  }
  
  if (!content.value.trim()) {
    errors.content = '请输入内容'
    isValid = false
  } else if (content.value.trim().length < 10) {
    errors.content = '内容长度至少10个字符'
    isValid = false
  }
  
  return isValid
}

// 提交表单
async function handleSubmit() {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 创建帖子数据
    const newPost = {
      tieba_id: selectedTieba.value,
      title: title.value.trim(),
      content: content.value.trim(),
      images: images.value.map(img => img.url),
      tags: tags.value
    }
    
    // 调用store创建帖子
    await postStore.createPost(newPost)
    
    // 显示成功提示
    alert('帖子发布成功！')
    
    // 跳转到帖子详情页
    router.push(`/tieba/${selectedTieba.value}`)
  } catch (error) {
    console.error('发布帖子失败:', error)
    alert('发布失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

// 取消发布
function handleCancel() {
  if (title.value || content.value || images.value.length > 0 || tags.value.length > 0) {
    if (confirm('确定要放弃当前编辑的内容吗？')) {
      router.back()
    }
  } else {
    router.back()
  }
}

// 触发图片上传
function triggerImageUpload() {
  if (images.value.length >= 9) {
    alert('最多只能上传9张图片')
    return
  }
  
  if (imageInput.value) {
    imageInput.value.click()
  }
}

// 处理图片上传
async function handleImageUpload(event) {
  const files = event.target.files
  if (!files || files.length === 0) return
  
  // 检查剩余可上传数量
  const remainingSlots = 9 - images.value.length
  if (files.length > remainingSlots) {
    alert(`最多只能上传9张图片，还可以上传${remainingSlots}张`)
    return
  }
  
  isUploading.value = true
  
  try {
    // 模拟上传过程
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // 使用FileReader预览本地图片
      const previewUrl = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.readAsDataURL(file)
      })
      
      // 添加到预览列表（实际项目中这里应该上传到服务器）
      images.value.push({
        url: previewUrl,
        name: file.name
      })
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    alert('图片上传失败，请重试')
  } finally {
    isUploading.value = false
    // 清空input以允许重新选择相同的文件
    if (imageInput.value) {
      imageInput.value.value = ''
    }
  }
}

// 移除图片
function removeImage(index) {
  images.value.splice(index, 1)
}

// 插入表情
function insertEmoji() {
  // 简单的表情列表
  const emojis = ['😊', '😂', '😍', '😎', '😢', '😡', '👍', '👎', '❤️', '🔥']
  
  // 随机选择一个表情插入到内容末尾
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
  content.value += randomEmoji
  
  // 实际项目中这里应该弹出表情选择面板
}

// 添加标签
function addTag() {
  if (!tagInput.value.trim() || tags.value.length >= 5) return
  
  // 检查是否已存在相同标签
  const trimmedTag = tagInput.value.trim()
  if (!tags.value.includes(trimmedTag)) {
    tags.value.push(trimmedTag)
  }
  
  // 清空输入框
  tagInput.value = ''
}

// 移除标签
function removeTag(index) {
  tags.value.splice(index, 1)
}
</script>

<style scoped>
.create-post-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 30px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.create-post-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid var(--border-color);
}

.page-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.cancel-btn {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.cancel-btn:hover {
  border-color: var(--text-secondary);
  color: var(--text-primary);
}

/* 表单 */
.create-post-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 15px;
}

/* 选择贴吧 */
.tieba-select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 15px;
  background-color: white;
  outline: none;
  transition: border-color 0.3s ease;
}

.tieba-select:focus {
  border-color: var(--primary-color);
}

.tieba-select.error,
.post-title-input.error,
.post-content-editor.error {
  border-color: #ff6b6b;
}

.error-message {
  color: #ff6b6b;
  font-size: 13px;
  margin-top: 5px;
}

.info-message {
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 5px;
}

.info-message a {
  color: var(--primary-color);
  text-decoration: none;
}

.info-message a:hover {
  text-decoration: underline;
}

/* 标题输入 */
.post-title-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.post-title-input:focus {
  border-color: var(--primary-color);
}

/* 内容编辑器 */
.post-content-editor {
  width: 100%;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.6;
  resize: vertical;
  min-height: 200px;
  outline: none;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.post-content-editor:focus {
  border-color: var(--primary-color);
}

/* 输入信息 */
.input-info {
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
  font-size: 13px;
  color: var(--text-secondary);
}

/* 工具栏 */
.editor-toolbar {
  margin-bottom: 20px;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 10px 0;
}

.toolbar-actions {
  display: flex;
  gap: 15px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.toolbar-btn:hover:not(:disabled) {
  background-color: rgba(0, 122, 255, 0.08);
  color: var(--primary-color);
}

.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  font-size: 16px;
}

/* 图片预览 */
.image-preview-container {
  margin-bottom: 25px;
}

.preview-title {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.image-preview-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-image-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

/* 标签输入 */
.tags-input-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  min-height: 44px;
}

.tag {
  display: inline-flex;
  align-items: center;
  background-color: rgba(0, 122, 255, 0.1);
  color: var(--primary-color);
  padding: 5px 10px;
  border-radius: 16px;
  font-size: 14px;
  gap: 5px;
}

.remove-tag-btn {
  background-color: transparent;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.remove-tag-btn:hover {
  background-color: rgba(0, 122, 255, 0.2);
  color: white;
}

.tags-input {
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 5px 0;
}

.tags-limit-message {
  font-size: 13px;
  color: var(--text-secondary);
}

/* 表单操作按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.submit-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0066cc;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header,
  .create-post-form {
    padding: 20px;
  }
  
  .page-header h1 {
    font-size: 20px;
  }
  
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .toolbar-actions {
    gap: 10px;
  }
  
  .toolbar-btn {
    padding: 6px 12px;
  }
}

@media (max-width: 480px) {
  .create-post-page {
    padding: 0;
  }
  
  .create-post-content {
    border-radius: 0;
  }
  
  .form-actions {
    margin-top: 30px;
  }
  
  .submit-btn {
    width: 100%;
    padding: 12px 0;
  }
}
</style>