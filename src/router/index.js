import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../vue-components/HomePage.vue')
  },
  {
    path: '/tieba/:id',
    name: 'TiebaDetail',
    component: () => import('../pages/TiebaDetail.vue')
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: () => import('../pages/PostDetail.vue')
  },
  {
    path: '/create-post',
    name: 'CreatePost',
    component: () => import('../pages/CreatePost.vue')
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    component: () => import('../vue-components/UserProfile.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../vue-components/SearchPage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router