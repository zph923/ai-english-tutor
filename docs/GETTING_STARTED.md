# 快速开始指南

## 前置要求

- Node.js 18+
- 微信开发者工具
- Git

## 小程序端

1. 打开微信开发者工具
2. 导入 `miniprogram` 目录
3. 在 `project.config.json` 中配置你的 AppID
4. 点击编译即可预览

## 后端服务

```bash
cd server

# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env

# 编辑 .env 填入你的 API Key

# 启动服务
npm start
```

## 获取 API Key

### 通义千问
https://dashscope.console.aliyun.com/

### 文心一言
https://cloud.baidu.com/product/wenxinworkshop

### 讯飞开放平台
https://www.xfyun.cn/

## 下一步

- [ ] 配置小程序 AppID
- [ ] 申请大模型 API Key
- [ ] 实现对话功能
- [ ] 实现发音评分
- [ ] 添加用户系统
- [ ] 接入微信支付
