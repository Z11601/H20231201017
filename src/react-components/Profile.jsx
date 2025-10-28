import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = ({ userId }) => {
  // 状态管理
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userTiebas, setUserTiebas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  // 组件挂载时加载用户数据
  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // 模拟获取用户数据
  const fetchUserData = async () => {
    setLoading(true);
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟用户信息
      const mockUserInfo = {
        id: userId || 1,
        username: '用户' + Math.floor(Math.random() * 1000),
        avatar: null, // 实际项目中这里应该是头像URL
        bio: '这是一段个人简介，喜欢分享生活中的点点滴滴。',
        joinDate: '2023-01-15',
        postCount: 45,
        tiebaCount: 12,
        followerCount: 156,
        followingCount: 89
      };

      // 模拟用户帖子
      const mockUserPosts = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `我的帖子标题 ${i + 1}`,
        tiebaName: ['英雄联盟', '绝地求生', '动漫吧', '美食吧', '旅游吧'][Math.floor(Math.random() * 5)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        viewCount: Math.floor(Math.random() * 1000),
        replyCount: Math.floor(Math.random() * 100)
      }));

      // 模拟用户关注的贴吧
      const mockUserTiebas = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: ['英雄联盟', '绝地求生', '动漫吧', '美食吧', '旅游吧', '电影吧', '音乐吧', '科技吧', '体育吧', '宠物吧', '读书吧', '摄影吧'][i],
        memberCount: Math.floor(Math.random() * 100000)
      }));

      setUserInfo(mockUserInfo);
      setUserPosts(mockUserPosts);
      setUserTiebas(mockUserTiebas);
    } catch (error) {
      console.error('获取用户数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 格式化数字
  const formatNumber = (num) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // 格式化时间
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60 * 1000) return '刚刚';
    if (diff < 60 * 60 * 1000) return Math.floor(diff / (60 * 1000)) + '分钟前';
    if (diff < 24 * 60 * 60 * 1000) return Math.floor(diff / (60 * 60 * 1000)) + '小时前';
    if (diff < 7 * 24 * 60 * 60 * 1000) return Math.floor(diff / (24 * 60 * 60 * 1000)) + '天前';
    
    return date.toLocaleDateString('zh-CN');
  };

  // 渲染用户头像
  const renderAvatar = () => {
    if (userInfo?.avatar) {
      return <img src={userInfo.avatar} alt="用户头像" className="user-avatar" />;
    }
    return (
      <div className="default-avatar">
        {userInfo?.username.charAt(0)}
      </div>
    );
  };

  // 渲染加载状态
  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  // 渲染用户信息
  return (
    <div className="profile-container">
      {/* 用户信息头部 */}
      <div className="profile-header">
        <div className="profile-banner"></div>
        <div className="profile-info">
          <div className="profile-avatar-container">
            {renderAvatar()}
          </div>
          <div className="profile-details">
            <h1 className="profile-username">{userInfo.username}</h1>
            <div className="profile-bio">{userInfo.bio}</div>
            <div className="profile-join-date">
              加入时间: {new Date(userInfo.joinDate).toLocaleDateString('zh-CN')}
            </div>
          </div>
          <div className="profile-actions">
            <button className="action-btn edit-btn">编辑资料</button>
            <button className="action-btn settings-btn">设置</button>
          </div>
        </div>
      </div>

      {/* 统计数据 */}
      <div className="profile-stats">
        <div className="stat-item">
          <div className="stat-value">{formatNumber(userInfo.postCount)}</div>
          <div className="stat-label">帖子</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{formatNumber(userInfo.tiebaCount)}</div>
          <div className="stat-label">关注的贴吧</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{formatNumber(userInfo.followerCount)}</div>
          <div className="stat-label">粉丝</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{formatNumber(userInfo.followingCount)}</div>
          <div className="stat-label">关注</div>
        </div>
      </div>

      {/* 内容标签页 */}
      <div className="content-tabs">
        <div 
          className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          我的帖子
        </div>
        <div 
          className={`tab ${activeTab === 'tiebas' ? 'active' : ''}`}
          onClick={() => setActiveTab('tiebas')}
        >
          我的贴吧
        </div>
        <div 
          className={`tab ${activeTab === 'collections' ? 'active' : ''}`}
          onClick={() => setActiveTab('collections')}
        >
          我的收藏
        </div>
      </div>

      {/* 标签页内容 */}
      <div className="tab-content">
        {/* 帖子列表 */}
        {activeTab === 'posts' && (
          <div className="posts-list">
            {userPosts.length > 0 ? (
              userPosts.map(post => (
                <div key={post.id} className="post-item">
                  <div className="post-main">
                    <div className="post-title">{post.title}</div>
                    <div className="post-meta">
                      <span className="post-tieba">{post.tiebaName}</span>
                      <span className="post-time">{formatTime(post.createdAt)}</span>
                    </div>
                  </div>
                  <div className="post-stats">
                    <span className="stat-item">
                      {formatNumber(post.viewCount)} 浏览
                    </span>
                    <span className="stat-item">
                      {formatNumber(post.replyCount)} 回复
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>暂无帖子</p>
              </div>
            )}
          </div>
        )}

        {/* 贴吧列表 */}
        {activeTab === 'tiebas' && (
          <div className="tiebas-list">
            <div className="tieba-grid">
              {userTiebas.map(tieba => (
                <div key={tieba.id} className="tieba-item">
                  <div className="tieba-avatar">
                    {tieba.name.charAt(0)}
                  </div>
                  <div className="tieba-name">{tieba.name}</div>
                  <div className="tieba-members">
                    {formatNumber(tieba.memberCount)} 成员
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 收藏列表 */}
        {activeTab === 'collections' && (
          <div className="collections-list">
            <div className="empty-state">
              <p>暂无收藏内容</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;