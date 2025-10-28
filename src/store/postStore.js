import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const usePostStore = defineStore('post', {
  state: () => ({
    // 当前帖子列表
    posts: [],
    // 当前帖子详情
    currentPost: null,
    // 评论列表
    comments: [],
    // 加载状态
    loading: false,
    // 分页信息
    pagination: {
      currentPage: 1,
      pageSize: 10,
      total: 0
    },
    // 筛选条件
    filters: {
      order: 'latest', // latest, hot, essence
      keyword: ''
    }
  }),
  
  getters: {
    // 获取过滤后的帖子列表
    filteredPosts: (state) => {
      let result = [...state.posts]
      
      // 根据关键词筛选
      if (state.filters.keyword) {
        const keyword = state.filters.keyword.toLowerCase()
        result = result.filter(post => 
          post.title.toLowerCase().includes(keyword) || 
          post.content.toLowerCase().includes(keyword)
        )
      }
      
      // 根据排序方式排序
      switch (state.filters.order) {
        case 'latest':
          result.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
          break
        case 'hot':
          result.sort((a, b) => (b.viewCount + b.commentCount * 5 + b.likeCount * 3) - (a.viewCount + a.commentCount * 5 + a.likeCount * 3))
          break
        case 'essence':
          result = result.filter(post => post.isEssence).sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
          break
      }
      
      return result
    },
    
    // 获取热门帖子
    hotPosts: (state) => {
      return [...state.posts]
        .sort((a, b) => (b.viewCount + b.commentCount * 5 + b.likeCount * 3) - (a.viewCount + a.commentCount * 5 + a.likeCount * 3))
        .slice(0, 10)
    },
    
    // 获取最新帖子
    latestPosts: (state) => {
      return [...state.posts]
        .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
        .slice(0, 10)
    }
  },
  
  actions: {
    // 获取帖子列表
    async fetchPosts(params = {}) {
      this.loading = true
      try {
        // 在实际应用中，这里应该调用API获取帖子列表
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 模拟数据
        const mockPosts = [
          {
            id: '1001',
            tiebaId: '5001',
            tiebaName: '摄影吧',
            userId: '1001',
            username: '摄影师小王',
            avatar: 'https://picsum.photos/50/50?random=1',
            title: '分享一组人像摄影作品，请大家多多指点',
            content: '最近拍摄了一组人像照片，想请大家多提提意见。这组照片主要使用了自然光，后期做了一些调整，希望能得到一些专业的评价...',
            images: ['https://picsum.photos/400/300?random=101', 'https://picsum.photos/400/300?random=102'],
            viewCount: 1234,
            commentCount: 48,
            likeCount: 127,
            isTop: false,
            isEssence: false,
            createTime: '2023-06-15T14:30:00'
          },
          {
            id: '1002',
            tiebaId: '5002',
            tiebaName: '旅行吧',
            userId: '1002',
            username: '旅行达人',
            avatar: 'https://picsum.photos/50/50?random=2',
            title: '端午节去了趟杭州西湖，风景真的太美了',
            content: '西湖的美景果然名不虚传，断桥残雪、平湖秋月等景点各具特色。特别推荐大家傍晚时分乘坐游船，那时的夕阳映照在湖面上，美得让人窒息...',
            images: ['https://picsum.photos/400/300?random=201', 'https://picsum.photos/400/300?random=202', 'https://picsum.photos/400/300?random=203'],
            viewCount: 2567,
            commentCount: 89,
            likeCount: 342,
            isTop: true,
            isEssence: true,
            createTime: '2023-06-22T09:15:00'
          },
          {
            id: '1003',
            tiebaId: '5003',
            tiebaName: '美食吧',
            userId: '1003',
            username: '美食家老李',
            avatar: 'https://picsum.photos/50/50?random=3',
            title: '在家自制芒果班戟，零失败教程分享',
            content: '今天给大家分享一个超简单的芒果班戟制作方法。需要准备的材料有：低筋面粉、牛奶、鸡蛋、黄油、糖和新鲜芒果。第一步...',
            images: ['https://picsum.photos/400/300?random=301'],
            viewCount: 3456,
            commentCount: 156,
            likeCount: 789,
            isTop: false,
            isEssence: true,
            createTime: '2023-06-10T18:45:00'
          },
          {
            id: '1004',
            tiebaId: '5001',
            tiebaName: '摄影吧',
            userId: '1004',
            username: '摄影新手',
            avatar: 'https://picsum.photos/50/50?random=4',
            title: '新手求助：关于夜景拍摄的参数设置',
            content: '最近刚开始尝试夜景摄影，但拍出来的照片总是很暗或者糊掉，请问有经验的大佬们有什么建议吗？相机是佳能EOS 200D，有三脚架...',
            images: [],
            viewCount: 892,
            commentCount: 67,
            likeCount: 45,
            isTop: false,
            isEssence: false,
            createTime: '2023-06-05T20:10:00'
          },
          {
            id: '1005',
            tiebaId: '5004',
            tiebaName: '科技吧',
            userId: '1005',
            username: '科技迷小张',
            avatar: 'https://picsum.photos/50/50?random=5',
            title: '新买的笔记本电脑开箱体验',
            content: '终于入手了心仪已久的MacBook Pro，16寸的屏幕用起来确实爽。处理视频和图片的速度比之前的电脑快了很多，电池续航也很给力...',
            images: ['https://picsum.photos/400/300?random=501', 'https://picsum.photos/400/300?random=502'],
            viewCount: 1876,
            commentCount: 78,
            likeCount: 231,
            isTop: false,
            isEssence: false,
            createTime: '2023-05-28T11:20:00'
          }
        ]
        
        // 如果有tiebaId参数，只返回对应贴吧的帖子
        if (params.tiebaId) {
          mockPosts.forEach(post => {
            post.tiebaId = params.tiebaId
          })
        }
        
        // 更新状态
        this.posts = mockPosts
        this.pagination.total = mockPosts.length
        
        return mockPosts
      } catch (error) {
        console.error('获取帖子列表失败:', error)
        ElMessage.error('获取帖子失败，请重试')
        return []
      } finally {
        this.loading = false
      }
    },
    
    // 获取帖子详情
    async fetchPostDetail(postId) {
      this.loading = true
      try {
        // 在实际应用中，这里应该调用API获取帖子详情
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // 模拟帖子详情数据
        const mockPostDetail = {
          id: postId,
          tiebaId: '5001',
          tiebaName: '摄影吧',
          userId: '1001',
          username: '摄影师小王',
          avatar: 'https://picsum.photos/50/50?random=1',
          title: '分享一组人像摄影作品，请大家多多指点',
          content: `<p>最近拍摄了一组人像照片，想请大家多提提意见。这组照片主要使用了自然光，后期做了一些调整，希望能得到一些专业的评价。</p>
                    <p>拍摄地点是在城市公园，时间选择在下午4点左右，这个时候的光线比较柔和，非常适合人像拍摄。</p>
                    <p>设备：佳能EOS 5D Mark IV + 85mm f/1.4镜头</p>
                    <p>参数：光圈f/1.8，快门1/200s，ISO 100</p>
                    <p>希望大家喜欢！</p>`,
          images: [
            'https://picsum.photos/800/600?random=101', 
            'https://picsum.photos/800/600?random=102',
            'https://picsum.photos/800/600?random=103',
            'https://picsum.photos/800/600?random=104'
          ],
          viewCount: 1234,
          commentCount: 48,
          likeCount: 127,
          isTop: false,
          isEssence: false,
          createTime: '2023-06-15T14:30:00',
          updateTime: '2023-06-15T16:20:00'
        }
        
        // 更新状态
        this.currentPost = mockPostDetail
        
        // 增加浏览量
        this.currentPost.viewCount++
        
        // 顺便获取评论列表
        await this.fetchComments(postId)
        
        return mockPostDetail
      } catch (error) {
        console.error('获取帖子详情失败:', error)
        ElMessage.error('获取帖子详情失败，请重试')
        return null
      } finally {
        this.loading = false
      }
    },
    
    // 获取评论列表
    async fetchComments(postId) {
      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // 模拟评论数据
        const mockComments = [
          {
            id: '2001',
            postId: postId,
            userId: '2001',
            username: '摄影爱好者A',
            avatar: 'https://picsum.photos/50/50?random=11',
            content: '照片拍得很棒，构图和光线处理得很好！请问后期用的什么软件？',
            likeCount: 15,
            replyCount: 2,
            createTime: '2023-06-15T15:30:00',
            replies: [
              {
                id: '3001',
                commentId: '2001',
                userId: '1001',
                username: '摄影师小王',
                avatar: 'https://picsum.photos/50/50?random=1',
                replyTo: '2001',
                replyToName: '摄影爱好者A',
                content: '谢谢支持！我用的是Lightroom和Photoshop，主要调整了一下曝光和颜色。',
                likeCount: 8,
                createTime: '2023-06-15T16:05:00'
              },
              {
                id: '3002',
                commentId: '2001',
                userId: '2001',
                username: '摄影爱好者A',
                avatar: 'https://picsum.photos/50/50?random=11',
                replyTo: '1001',
                replyToName: '摄影师小王',
                content: '学到了，谢谢分享！',
                likeCount: 3,
                createTime: '2023-06-15T16:30:00'
              }
            ]
          },
          {
            id: '2002',
            postId: postId,
            userId: '2002',
            username: '路人甲',
            avatar: 'https://picsum.photos/50/50?random=12',
            content: '模特表现力很好，照片很有感觉！',
            likeCount: 12,
            replyCount: 0,
            createTime: '2023-06-15T17:20:00',
            replies: []
          },
          {
            id: '2003',
            postId: postId,
            userId: '2003',
            username: '专业摄影师',
            avatar: 'https://picsum.photos/50/50?random=13',
            content: '整体不错，但第二张照片背景有点杂乱，可以考虑用更大的光圈虚化背景。另外，后期可以稍微增加一点对比度，让照片更有层次感。',
            likeCount: 20,
            replyCount: 1,
            createTime: '2023-06-16T09:15:00',
            replies: [
              {
                id: '3003',
                commentId: '2003',
                userId: '1001',
                username: '摄影师小王',
                avatar: 'https://picsum.photos/50/50?random=1',
                replyTo: '2003',
                replyToName: '专业摄影师',
                content: '感谢专业的点评！下次拍摄会注意这些问题。',
                likeCount: 5,
                createTime: '2023-06-16T10:30:00'
              }
            ]
          }
        ]
        
        // 更新状态
        this.comments = mockComments
        
        return mockComments
      } catch (error) {
        console.error('获取评论列表失败:', error)
        return []
      }
    },
    
    // 创建帖子
    async createPost(postData) {
      this.loading = true
      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 创建新帖子
        const newPost = {
          id: '100' + Date.now(),
          tiebaId: postData.tiebaId,
          tiebaName: postData.tiebaName || '未知贴吧',
          userId: '10086', // 假设当前用户ID
          username: '百度用户10086', // 假设当前用户名
          avatar: 'https://picsum.photos/50/50?random=0',
          title: postData.title,
          content: postData.content,
          images: postData.images || [],
          viewCount: 0,
          commentCount: 0,
          likeCount: 0,
          isTop: false,
          isEssence: false,
          createTime: new Date().toISOString()
        }
        
        // 添加到帖子列表
        this.posts.unshift(newPost)
        this.pagination.total++
        
        ElMessage.success('帖子发布成功')
        return newPost
      } catch (error) {
        console.error('创建帖子失败:', error)
        ElMessage.error('发布失败，请重试')
        return null
      } finally {
        this.loading = false
      }
    },
    
    // 创建评论
    async createComment(commentData) {
      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 创建新评论
        const newComment = {
          id: '200' + Date.now(),
          postId: commentData.postId,
          userId: '10086', // 假设当前用户ID
          username: '百度用户10086', // 假设当前用户名
          avatar: 'https://picsum.photos/50/50?random=0',
          content: commentData.content,
          likeCount: 0,
          replyCount: 0,
          createTime: new Date().toISOString(),
          replies: []
        }
        
        // 添加到评论列表
        this.comments.unshift(newComment)
        
        // 更新当前帖子的评论数
        if (this.currentPost && this.currentPost.id === commentData.postId) {
          this.currentPost.commentCount++
        }
        
        // 更新帖子列表中的评论数
        const postIndex = this.posts.findIndex(p => p.id === commentData.postId)
        if (postIndex !== -1) {
          this.posts[postIndex].commentCount++
        }
        
        ElMessage.success('评论成功')
        return newComment
      } catch (error) {
        console.error('创建评论失败:', error)
        ElMessage.error('评论失败，请重试')
        return null
      }
    },
    
    // 点赞帖子
    async likePost(postId) {
      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // 更新当前帖子的点赞数
        if (this.currentPost && this.currentPost.id === postId) {
          this.currentPost.likeCount++
        }
        
        // 更新帖子列表中的点赞数
        const postIndex = this.posts.findIndex(p => p.id === postId)
        if (postIndex !== -1) {
          this.posts[postIndex].likeCount++
        }
        
        ElMessage.success('点赞成功')
        return true
      } catch (error) {
        console.error('点赞失败:', error)
        ElMessage.error('点赞失败，请重试')
        return false
      }
    },
    
    // 设置筛选条件
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },
    
    // 设置分页信息
    setPagination(pagination) {
      this.pagination = { ...this.pagination, ...pagination }
    },
    
    // 清除当前帖子和评论
    clearCurrentPost() {
      this.currentPost = null
      this.comments = []
    }
  }
})