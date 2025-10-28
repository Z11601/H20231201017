import { defineStore } from 'pinia'

export const useTiebaStore = defineStore('tieba', {
  state: () => ({
    tiebas: [],
    currentTieba: null,
    loading: false,
    error: null
  }),
  actions: {
    // 获取热门贴吧
    async fetchHotTiebas() {
      this.loading = true
      this.error = null
      try {
        // 模拟API调用
        // const response = await axios.get('/api/tiebas/hot/')
        // this.tiebas = response.data
        
        // 模拟数据
        this.tiebas = [
          {
            id: 1,
            name: '生活吧',
            description: '分享生活中的点点滴滴',
            member_count: 123456,
            post_count: 789012,
            avatar: ''
          },
          {
            id: 2,
            name: '影视吧',
            description: '讨论最新最热的电影电视剧',
            member_count: 234567,
            post_count: 890123,
            avatar: ''
          },
          {
            id: 3,
            name: '电脑技术吧',
            description: '电脑相关技术讨论',
            member_count: 98765,
            post_count: 567890,
            avatar: ''
          },
          {
            id: 4,
            name: '美食吧',
            description: '分享美食制作和推荐',
            member_count: 345678,
            post_count: 1234567,
            avatar: ''
          },
          {
            id: 5,
            name: '旅行吧',
            description: '旅行见闻和攻略分享',
            member_count: 198765,
            post_count: 678901,
            avatar: ''
          },
          {
            id: 6,
            name: '游戏吧',
            description: '游戏讨论和攻略',
            member_count: 456789,
            post_count: 2345678,
            avatar: ''
          }
        ]
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 获取贴吧详情
    async fetchTiebaDetail(id) {
      this.loading = true
      this.error = null
      try {
        // 模拟API调用
        // const response = await axios.get(`/api/tiebas/${id}/`)
        // this.currentTieba = response.data
        
        // 模拟数据
        this.currentTieba = {
          id: id,
          name: '生活吧',
          description: '分享生活中的点点滴滴，记录美好生活瞬间',
          member_count: 123456,
          post_count: 789012,
          created_at: '2020-01-01T00:00:00Z',
          posts: [
            {
              id: 1,
              title: '今天天气真好，适合出去走走',
              author_name: '小明',
              reply_count: 56,
              view_count: 1234,
              last_reply_time: '2024-01-15T11:30:00Z'
            },
            {
              id: 2,
              title: '周末计划',
              author_name: '小红',
              reply_count: 23,
              view_count: 567,
              last_reply_time: '2024-01-15T10:00:00Z'
            }
          ]
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    // 加入贴吧
    async joinTieba(id) {
      try {
        // 模拟API调用
        // await axios.post(`/api/tiebas/${id}/join/`)
        
        // 更新本地状态
        const tieba = this.tiebas.find(t => t.id === id)
        if (tieba) {
          tieba.member_count++
        }
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    }
  }
})