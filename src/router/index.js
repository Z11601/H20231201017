import { createRouter, createWebHistory } from 'vue-router'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../vue-components/HomePage.vue'),
    meta: { title: '百度贴吧 - 全球最大的中文社区' }
  },
  {
    path: '/tieba/:id',
    name: 'TiebaDetail',
    component: () => import('../vue-components/TiebaDetail.vue'),
    meta: { title: '贴吧详情' }
  },
  {
    path: '/post/create',
    name: 'CreatePost',
    component: () => import('../pages/CreatePost.vue'),
    meta: { title: '发布帖子' }
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: () => import('../pages/PostDetail.vue'),
    meta: { title: '帖子详情' }
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    component: () => import('../vue-components/UserProfile.vue'),
    meta: { title: '个人中心' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../vue-components/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../vue-components/Register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../vue-components/SearchPage.vue'),
    meta: { title: '搜索结果' }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由前置守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '百度贴吧'
  next()
})

export default router