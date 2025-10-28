<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于百度贴吧</h3>
          <p>百度贴吧是全球最大的中文社区，提供一个交流、分享、讨论的平台。</p>
        </div>
        
        <div class="footer-section">
          <h3>联系我们</h3>
          <ul>
            <li>客服邮箱: kf@tieba.baidu.com</li>
            <li>投诉建议: feedback@tieba.baidu.com</li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>相关链接</h3>
          <ul>
            <li><a href="https://www.baidu.com" target="_blank">百度首页</a></li>
            <li><a href="https://baike.baidu.com" target="_blank">百度百科</a></li>
            <li><a href="https://image.baidu.com" target="_blank">百度图片</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>© 2023 百度贴吧 版权所有</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer组件逻辑
</script>

<style scoped>
.footer {
  background-color: var(--background-secondary);
  padding: 2rem 0;
  margin-top: auto;
  border-top: 1px solid var(--border-color);
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 clamp(1rem, 4vw, 2rem);
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section {
  flex: 1;
  min-width: 200px;
}

.footer-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.footer-section p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: var(--primary-color);
}

.footer-bottom {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .footer-section {
    width: 100%;
  }
}
</style>