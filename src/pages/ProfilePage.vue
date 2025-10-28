<template>
  <div class="page-wrapper">
    <ReactProfile :userId="userId" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { createVueComponentFromReact } from 'veaury';
import ReactProfileComponent from '../react-components/Profile.jsx';

// 使用Veaury将React组件转换为Vue组件
const ReactProfile = createVueComponentFromReact(ReactProfileComponent);

const route = useRoute();
// 从路由参数中获取用户ID，如果没有则为当前用户
const userId = computed(() => route.params.id || 1);
</script>

<style scoped>
.page-wrapper {
  width: 100%;
  min-height: 100vh;
}
</style>