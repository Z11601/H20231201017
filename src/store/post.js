import { defineStore } from 'pinia'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [],
    currentPost: null,
    loading: false,
    error: null
  }),
  actions: {
    // 获取帖子列表
    async fetchPosts(params = {}) {
      this.loading = true
      this.error = null
      try {
        // 模拟API调用
        // const response = await axios.get('/api/posts/', { params })
        // this.posts = response.data
        
        // 模拟数据
        this.posts = [
          {
            id: 1,
            title: '今天天气真好，适合出去走走',
            content: '阳光明媚，微风轻拂，这样的天气最适合户外活动了！',
            author_id: 1,
            author_name: '小明',
            tieba_id: 1,
            tieba_name: '生活吧',
            view_count: 1234,
            reply_count: 56,
            like_count: 78,
            created_at: '2024-01-15T10:30:00Z'
          },
          {
            id: 2,
            title: '推荐一部好看的电影',
            content: '最近看了一部非常精彩的电影，强烈推荐给大家...',
            author_id: 2,
            author_name: '电影爱好者',
            tieba_id: 2,
            tieba_name: '影视吧',
            view_count: 2345,
            reply_count: 123,
            like_count: 456,
            created_at: '2024-01-15T09:15:00Z'
          },
          {
            id: 3,
            title: '求助：电脑突然黑屏怎么办？',
            content: '正在使用电脑时突然黑屏，重启也没用，有人遇到过类似问题吗？',
            author_id: 3,
            author_name: '电脑小白',
            tieba_id: 3,
            tieba_name: '电脑技术吧',
            view_count: 567,
            reply_count: 34,
            like_count: 12,
            created_at: '2024-01-15T08:45:00Z'
          }
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 获取帖子详情
    async fetchPost(id) {
      this.loading = true
      this.error = null
      try {
        // 模拟API调用
        // const response = await axios.get(`/api/posts/${id}/`)
        // this.currentPost = response.data
        
        // 模拟数据
        this.currentPost = {
          id: id,
          title: '今天天气真好，适合出去走走',
          content: '阳光明媚，微风轻拂，这样的天气最适合户外活动了！我打算下午去公园散步，呼吸新鲜空气，看看美丽的风景。',
          author_id: 1,
          author_name: '小明',
          author_avatar: '',
          tieba_id: 1,
          tieba_name: '生活吧',
          view_count: 1234,
          reply_count: 56,
          like_count: 78,
          comments: [
            {
              id: 1,
              content: '是啊，今天天气确实不错！',
              author_name: '路人甲',
              created_at: '2024-01-15T11:00:00Z'
            },
            {
              id: 2,
              content: '我也想去公园，可是还要上班...',
              author_name: '打工人',
              created_at: '2024-01-15T11:30:00Z'
            }
          ],
          created_at: '2024-01-15T10:30:00Z'
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 创建帖子
    async createPost(postData) {
      try {
        // 模拟API调用
        // const response = await axios.post('/api/posts/', postData)
        // return { success: true, data: response.data }
        
        // 模拟成功响应
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    },
    
    // 点赞帖子
    async likePost(id) {
      try {
        // 模拟API调用
        // await axios.post(`/api/posts/${id}/like/`)
        
        // 更新本地状态
        const post = this.posts.find(p => p.id === id)
        if (post) {
          post.like_count++
        }
      } catch (error) {
        console.error('点赞失败:', error)
      }
    }
  }
})