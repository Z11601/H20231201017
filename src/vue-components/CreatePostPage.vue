<template>
  <div class="create-post">
    <div class="container">
      <div class="content-wrapper">
        <!-- 左侧内容 -->
        <div class="main-content">
          <div class="page-header">
            <h1 class="page-title">发表新帖</h1>
            <div class="page-subtitle">{{ tiebaName }} - 分享你的想法</div>
          </div>
          
          <div class="post-form">
            <!-- 标题输入 -->
            <div class="form-group">
              <label class="form-label" for="post-title">标题</label>
              <el-input
                id="post-title"
                v-model="title"
                placeholder="请输入标题（最多50个字符）"
                maxlength="50"
                show-word-limit
                :validate-event="false"
              />
            </div>
            
            <!-- 内容编辑器 -->
            <div class="form-group">
              <label class="form-label">内容</label>
              <!-- 使用简单的富文本编辑器界面 -->
              <div class="editor-toolbar">
                <el-button-group>
                  <el-button type="text" @click="insertBold" :class="{ active: currentFormat.bold }">
                    <el-icon><Bold /></el-icon>
                  </el-button>
                  <el-button type="text" @click="insertItalic" :class="{ active: currentFormat.italic }">
                    <el-icon><Italic /></el-icon>
                  </el-button>
                  <el-button type="text" @click="insertUnderline" :class="{ active: currentFormat.underline }">
                    <el-icon><Underline /></el-icon>
                  </el-button>
                  <el-button type="text" @click="insertStrikethrough" :class="{ active: currentFormat.strikethrough }">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </el-button-group>
                
                <el-button-group>
                  <el-button type="text" @click="insertLink">
                    <el-icon><Link /></el-icon>
                  </el-button>
                  <el-button type="text" @click="insertImage">
                    <el-icon><Picture /></el-icon>
                  </el-button>
                  <el-button type="text" @click="insertQuote">
                    <el-icon><ChatDotSquare /></el-icon>
                  </el-button>
                </el-button-group>
                
                <el-button-group>
                  <el-button type="text" @click="insertList('unordered')">
                    <el-icon><List /></el-icon>
                  </el-button>
                  <el-button type="text" @click="insertList('ordered')">
                    <el-icon><Menu /></el-icon>
                  </el-button>
                </el-button-group>
                
                <el-button-group>
                  <el-button type="text" @click="insertCode">
                    <el-icon><Document /></el-icon>
                  </el-button>
                  <el-button type="text" @click="clearFormat">
                    <el-icon><Refresh /></el-icon>
                  </el-button>
                </el-button-group>
              </div>
              
              <el-input
                v-model="content"
                type="textarea"
                :rows="15"
                placeholder="请输入内容..."
                maxlength="10000"
                show-word-limit
                :validate-event="false"
              />
            </div>
            
            <!-- 图片上传 -->
            <div class="form-group">
              <label class="form-label">添加图片</label>
              <el-upload
                class="image-uploader"
                :action="uploadAction"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :before-upload="beforeUpload"
                :on-exceed="handleExceed"
                :limit="9"
                list-type="picture-card"
                accept="image/*"
              >
                <el-icon><Plus /></el-icon>
                <template #tip>
                  <div class="el-upload__tip">
                    最多上传9张图片，单张不超过5MB
                  </div>
                </template>
              </el-upload>
              <div class="uploaded-images" v-if="uploadedImages.length > 0">
                <div 
                  v-for="(image, index) in uploadedImages" 
                  :key="index" 
                  class="uploaded-image-item"
                >
                  <img :src="image.url" alt="上传的图片" />
                  <el-button 
                    type="danger" 
                    icon="Delete" 
                    circle 
                    size="small" 
                    class="delete-image-btn"
                    @click="removeImage(index)"
                  />
                </div>
              </div>
            </div>
            
            <!-- 标签选择 -->
            <div class="form-group">
              <label class="form-label">添加标签</label>
              <el-select
                v-model="selectedTags"
                multiple
                placeholder="请选择标签"
                collapse-tags
                filterable
                allow-create
                default-first-option
                style="width: 100%"
                :validate-event="false"
              >
                <el-option
                  v-for="tag in availableTags"
                  :key="tag"
                  :label="tag"
                  :value="tag"
                />
              </el-select>
            </div>
            
            <!-- 发帖选项 -->
            <div class="form-group options">
              <el-checkbox v-model="isAnonymous">匿名发帖</el-checkbox>
              <el-checkbox v-model="isOnlyFans">仅粉丝可见</el-checkbox>
            </div>
            
            <!-- 操作按钮 -->
            <div class="form-actions">
              <el-button @click="saveDraft">保存草稿</el-button>
              <el-button type="primary" @click="submitPost">发布帖子</el-button>
            </div>
          </div>
        </div>
        
        <!-- 右侧帮助信息 -->
        <div class="sidebar">
          <div class="help-section">
            <h3 class="section-title">
              <el-icon><Warning /></el-icon> 发帖须知
            </h3>
            <div class="help-content">
              <ul>
                <li>请遵守国家法律法规和贴吧协议</li>
                <li>禁止发布广告、色情、暴力等违法违规内容</li>
                <li>禁止发布不实信息和恶意攻击他人的言论</li>
                <li>尊重他人知识产权，转载内容请注明出处</li>
                <li>保持理性讨论，共建和谐社区环境</li>
              </ul>
            </div>
          </div>
          
          <div class="sidebar-section">
            <h3 class="section-title">
              <el-icon><ChatDotSquare /></el-icon> 发帖技巧
            </h3>
            <div class="help-content">
              <ul>
                <li>使用醒目的标题能吸引更多人的关注</li>
                <li>图文并茂的帖子更容易获得回复</li>
                <li>添加合适的标签可以让更多同好找到你的帖子</li>
                <li>善用排版，让内容更加清晰易读</li>
                <li>回复他人的评论是维持互动的关键</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 确认对话框 -->
    <el-dialog
      v-model="confirmDialogVisible"
      title="确认操作"
      width="30%"
    >
      <span>{{ confirmMessage }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAction">{{ confirmActionText }}</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 链接输入对话框 -->
    <el-dialog
      v-model="linkDialogVisible"
      title="插入链接"
      width="30%"
    >
      <el-form :model="linkForm">
        <el-form-item label="链接文本">
          <el-input v-model="linkForm.text" placeholder="请输入链接显示的文本" />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="linkForm.url" placeholder="请输入链接地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="linkDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmInsertLink">确认</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 图片输入对话框（模拟上传） -->
    <el-dialog
      v-model="imageDialogVisible"
      title="插入图片"
      width="30%"
    >
      <el-form :model="imageForm">
        <el-form-item label="图片地址">
          <el-input v-model="imageForm.url" placeholder="请输入图片地址" />
        </el-form-item>
        <el-form-item label="图片描述">
          <el-input v-model="imageForm.alt" placeholder="请输入图片描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="imageDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmInsertImage">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Bold,
  Italic,
  Underline,
  Delete,
  Link,
  Picture,
  ChatDotSquare,
  List,
  Menu,
  Document,
  Refresh,
  Plus,
  Warning,
  Delete as DeleteIcon
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const tiebaId = ref(route.params.id || 1)
const tiebaName = ref('百度贴吧')

// 表单数据
const title = ref('')
const content = ref('')
const selectedTags = ref([])
const isAnonymous = ref(false)
const isOnlyFans = ref(false)
const uploadedImages = ref([])

// 编辑器状态
const currentFormat = ref({
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false
})

// 对话框状态
const confirmDialogVisible = ref(false)
const confirmMessage = ref('')
const confirmActionText = ref('确认')
const confirmCallback = ref(null)
const linkDialogVisible = ref(false)
const imageDialogVisible = ref(false)

// 表单模型
const linkForm = ref({
  text: '',
  url: ''
})
const imageForm = ref({
  url: '',
  alt: ''
})

// 标签选项
const availableTags = ref([
  '讨论', '分享', '求助', '经验', '图片', '视频',
  '新闻', '攻略', '教程', '评测', '活动', '投票'
])

// 上传配置（实际环境中需要替换为真实的上传接口）
const uploadAction = '/api/upload/image'

// 检查表单有效性
const isFormValid = computed(() => {
  return title.value.trim() && content.value.trim()
})

// 编辑器方法
const insertBold = () => {
  wrapText('**', '**')
  currentFormat.value.bold = !currentFormat.value.bold
}

const insertItalic = () => {
  wrapText('*', '*')
  currentFormat.value.italic = !currentFormat.value.italic
}

const insertUnderline = () => {
  wrapText('__', '__')
  currentFormat.value.underline = !currentFormat.value.underline
}

const insertStrikethrough = () => {
  wrapText('~~', '~~')
  currentFormat.value.strikethrough = !currentFormat.value.strikethrough
}

const insertLink = () => {
  linkDialogVisible.value = true
}

const insertImage = () => {
  imageDialogVisible.value = true
}

const insertQuote = () => {
  wrapText('> ', '')
}

const insertList = (type) => {
  if (type === 'unordered') {
    wrapText('- ', '')
  } else {
    // 获取内容行数，确定序号
    const lines = content.value.split('\n')
    const currentLine = getCurrentLine(lines)
    const number = currentLine ? currentLine.lineNumber + 1 : 1
    wrapText(`${number}. `, '')
  }
}

const insertCode = () => {
  wrapText('```\n', '\n```')
}

const clearFormat = () => {
  // 简单清除格式化，实际应用中可能需要更复杂的处理
  content.value = content.value
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
  
  // 重置当前格式状态
  currentFormat.value = {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false
  }
}

// 获取当前行信息（简化版）
const getCurrentLine = (lines) => {
  // 注意：这是一个简化的实现，在实际应用中需要获取光标位置
  // 这里只是为了演示功能
  return {
    lineNumber: lines.length,
    text: ''
  }
}

// 在文本前后插入标记
const wrapText = (prefix, suffix) => {
  // 注意：这是一个简化的实现，在实际应用中需要处理光标位置
  content.value = prefix + content.value + suffix
}

// 确认插入链接
const confirmInsertLink = () => {
  if (linkForm.value.text && linkForm.value.url) {
    content.value += `[${linkForm.value.text}](${linkForm.value.url})`
    linkDialogVisible.value = false
    // 重置表单
    linkForm.value = { text: '', url: '' }
  } else {
    ElMessage.warning('请填写完整的链接信息')
  }
}

// 确认插入图片
const confirmInsertImage = () => {
  if (imageForm.value.url) {
    const altText = imageForm.value.alt || '图片'
    content.value += `![${altText}](${imageForm.value.url})`
    imageDialogVisible.value = false
    // 模拟上传
    handleUploadSuccess({ url: imageForm.value.url }, null, 0)
    // 重置表单
    imageForm.value = { url: '', alt: '' }
  } else {
    ElMessage.warning('请填写图片地址')
  }
}

// 上传前检查
const beforeUpload = (file) => {
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('上传图片大小不能超过 5MB!')
    return false
  }
  return true
}

// 上传成功处理
const handleUploadSuccess = (response, file, fileList) => {
  // 在实际应用中，应该使用服务器返回的URL
  // 这里使用模拟数据
  const imageUrl = response.url || `https://via.placeholder.com/300x200?text=${uploadedImages.value.length + 1}`
  uploadedImages.value.push({
    url: imageUrl
  })
}

// 上传失败处理
const handleUploadError = (error, file, fileList) => {
  ElMessage.error('上传失败，请重试')
  console.error('Upload error:', error)
}

// 处理超出数量限制
const handleExceed = (files, fileList) => {
  ElMessage.warning('最多只能上传9张图片')
}

// 移除图片
const removeImage = (index) => {
  uploadedImages.value.splice(index, 1)
}

// 保存草稿
const saveDraft = () => {
  // 检查是否有内容可以保存
  if (!title.value && !content.value && uploadedImages.value.length === 0) {
    ElMessage.warning('没有可保存的内容')
    return
  }
  
  confirmMessage.value = '确定要保存为草稿吗？'
  confirmActionText.value = '保存'
  confirmCallback.value = () => {
    // 这里应该调用API保存草稿
    ElMessage.success('草稿保存成功')
    router.push(`/tieba/${tiebaId.value}`)
  }
  confirmDialogVisible.value = true
}

// 提交帖子
const submitPost = () => {
  // 验证表单
  if (!title.value.trim()) {
    ElMessage.warning('请输入标题')
    return
  }
  
  if (!content.value.trim()) {
    ElMessage.warning('请输入内容')
    return
  }
  
  confirmMessage.value = '确定要发布帖子吗？'
  confirmActionText.value = '发布'
  confirmCallback.value = () => {
    // 这里应该调用API提交帖子
    const postData = {
      tiebaId: tiebaId.value,
      title: title.value,
      content: content.value,
      tags: selectedTags.value,
      isAnonymous: isAnonymous.value,
      isOnlyFans: isOnlyFans.value,
      images: uploadedImages.value.map(img => img.url)
    }
    
    console.log('Post data:', postData)
    
    ElMessage.success('帖子发布成功')
    router.push(`/tieba/${tiebaId.value}`)
  }
  confirmDialogVisible.value = true
}

// 确认操作
const confirmAction = () => {
  if (confirmCallback.value) {
    confirmCallback.value()
  }
  confirmDialogVisible.value = false
}

onMounted(() => {
  // 这里应该根据tiebaId调用API获取贴吧信息
})
</script>

<style scoped>
.create-post {
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

.main-content {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.page-header {
  padding: 25px;
  border-bottom: 1px solid #f0f0f0;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.post-form {
  padding: 25px;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 10px;
  display: block;
}

.editor-toolbar {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.editor-toolbar .el-button {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
}

.editor-toolbar .el-button.active {
  background-color: var(--primary-color);
  color: white;
}

.editor-toolbar .el-button-group {
  margin-right: 5px;
}

.editor-toolbar + .el-input {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.editor-toolbar + .el-input .el-textarea__inner {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  font-family: inherit;
  line-height: 1.6;
  font-size: 15px;
}

.image-uploader {
  margin-bottom: 15px;
}

.uploaded-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.uploaded-image-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
}

.uploaded-image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}

.options {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.help-section,
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

.help-content {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.help-content ul {
  padding-left: 20px;
}

.help-content li {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    padding: 20px;
  }
  
  .post-form {
    padding: 20px;
  }
  
  .editor-toolbar {
    overflow-x: auto;
  }
}
</style>