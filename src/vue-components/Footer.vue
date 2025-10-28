<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于百度贴吧</h3>
          <p>百度贴吧是全球最大的中文社区，用户可以基于兴趣关键词创建和参与讨论。</p>
        </div>
        <div class="footer-section">
          <h3>快速链接</h3>
          <ul>
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/search">发现</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>联系我们</h3>
          <p>邮箱：support@tieba.com</p>
          <p>客服电话：400-123-4567</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} 百度贴吧 - 版权所有</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #f8f9fa;
  border-top: 1px solid var(--border-color);
  padding: 2rem 0;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.footer-section p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: var(--primary-color);
}

.footer-bottom {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>