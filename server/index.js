const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI English Tutor API is running' })
})

// AI 对话接口
app.post('/api/chat', async (req, res) => {
  const { message, scenario } = req.body
  
  // TODO: 调用大模型 API（通义/文心/GPT）
  const response = {
    success: true,
    data: {
      reply: `收到你的消息：${message}`,
      scenario: scenario || 'daily'
    }
  }
  
  res.json(response)
})

// 发音评分接口
app.post('/api/speech', async (req, res) => {
  const { audio, text } = req.body
  
  // TODO: 调用语音识别 API
  const response = {
    success: true,
    data: {
      score: 85,
      feedback: '发音不错，继续加油！'
    }
  }
  
  res.json(response)
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
