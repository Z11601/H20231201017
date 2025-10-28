# 百度贴吧前端项目

基于 Veaury 混合框架（Vue 3 + React）开发的百度贴吧前端项目。

## 技术栈

- **前端框架**: Vue 3 + React (通过 Veaury 混合开发)
- **构建工具**: Vite
- **状态管理**: Pinia
- **UI组件库**: Element Plus + Ant Design
- **路由管理**: Vue Router
- **HTTP请求**: Axios

## 项目结构

```
├── public/            # 静态资源
├── src/
│   ├── assets/        # 项目资源文件
│   ├── components/    # 通用组件
│   ├── vue-components/ # Vue组件
│   ├── react-components/ # React组件
│   ├── pages/         # 页面组件
│   ├── router/        # 路由配置
│   ├── store/         # 状态管理
│   ├── utils/         # 工具函数
│   ├── App.vue        # 根组件
│   └── main.js        # 入口文件
├── index.html         # HTML模板
├── package.json       # 项目依赖
└── vite.config.js     # Vite配置
```

## 核心功能模块

- **用户管理**：登录、注册、个人中心
- **帖子管理**：浏览、发布、评论、点赞、收藏
- **贴吧管理**：浏览、关注、搜索
- **消息通知**：评论、点赞、系统通知

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境启动

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 环境变量配置

在项目根目录创建 `.env` 文件：

```
# API基础URL
VITE_API_BASE_URL=http://localhost:8000/api

# 开发环境端口
VITE_DEV_PORT=3000
```

## 项目特点

1. **混合开发**: 使用 Veaury 框架实现 Vue 和 React 组件的无缝集成
2. **响应式设计**: 适配各种屏幕尺寸的设备
3. **组件化架构**: 采用高度组件化的开发方式
4. **状态管理**: 使用 Pinia 进行高效的状态管理
5. **性能优化**: 实现了代码分割、懒加载等性能优化方案

## 注意事项

1. 开发环境下，API 请求会自动通过 Vite 的代理转发到后端服务
2. 生产环境部署时，需确保后端 API 地址配置正确
3. 本项目使用了模拟数据，实际部署时需要连接真实后端服务

## License

MIT