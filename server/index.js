const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const WebSocket = require('ws')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// 讯飞配置
const IFLYTEK = {
  appId: process.env.IFLYTEK_APPID,
  apiKey: process.env.IFLYTEK_API_KEY,
  apiSecret: process.env.IFLYTEK_API_SECRET,
  asrUrl: 'wss://iat-api.xfyun.cn/v2/iat',
  ttsUrl: 'wss://tts-api.xfyun.cn/v2/tts'
}

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AI English Tutor API is running',
    timestamp: new Date().toISOString()
  })
})

// 生成讯飞鉴权 URL
function getAuthUrl(url, apiKey, apiSecret) {
  const date = new Date().toUTCString()
  const signatureOrigin = `host: ${new URL(url).host}\ndate: ${date}\nGET ${new URL(url).pathname} HTTP/1.1`
  const signatureSha = crypto.createHmac('sha256', apiSecret).update(signatureOrigin).digest('base64')
  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureSha}"`
  const authorization = Buffer.from(authorizationOrigin).toString('base64')
  return `${url}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${new URL(url).host}`
}

// AI 对话接口
app.post('/api/chat', async (req, res) => {
  const { message, scenario } = req.body
  
  try {
    // TODO: 调用大模型 API（通义/文心/GPT）
    const response = {
      success: true,
      data: {
        reply: generateMockReply(message, scenario),
        scenario: scenario || 'daily'
      }
    }
    
    res.json(response)
  } catch (error) {
    console.error('AI 对话错误:', error)
    res.status(500).json({
      success: false,
      message: 'AI 服务暂时不可用'
    })
  }
})

// 语音识别接口（讯飞）
app.post('/api/speech/recognize', async (req, res) => {
  const { audioBase64 } = req.body
  
  if (!IFLYTEK.appId || !IFLYTEK.apiKey || !IFLYTEK.apiSecret) {
    return res.status(500).json({
      success: false,
      message: '讯飞 API 配置缺失，请检查 .env 文件'
    })
  }
  
  try {
    const authUrl = getAuthUrl(IFLYTEK.asrUrl, IFLYTEK.apiKey, IFLYTEK.apiSecret)
    
    const ws = new WebSocket(authUrl)
    let recognizedText = ''
    
    ws.on('open', () => {
      // 发送配置帧
      const frame = {
        common: {
          app_id: IFLYTEK.appId
        },
        business: {
          language: 'zh_cn',
          domain: 'iat',
          accent: 'mandarin',
          vad_eos: 3000,
          dwa: 'wpgs'
        },
        data: {
          status: 0,
          format: 'audio/L16;rate=16000',
          encoding: 'raw',
          audio: audioBase64
        }
      }
      
      ws.send(JSON.stringify(frame))
      
      // 发送结束帧
      setTimeout(() => {
        const endFrame = {
          data: {
            status: 2,
            format: 'audio/L16;rate=16000',
            encoding: 'raw',
            audio: ''
          }
        }
        ws.send(JSON.stringify(endFrame))
        ws.close()
      }, 1000)
    })
    
    ws.on('message', (data) => {
      const result = JSON.parse(data.toString())
      if (result.code === 0 && result.data && result.data.result) {
        const text = result.data.result.ws.map(w => w.cw.map(c => c.w).join('')).join('')
        recognizedText += text
      }
    })
    
    ws.on('close', () => {
      res.json({
        success: true,
        data: {
          text: recognizedText || '未识别到内容'
        }
      })
    })
    
    ws.on('error', (error) => {
      console.error('语音识别错误:', error)
      res.status(500).json({
        success: false,
        message: '语音识别失败'
      })
    })
  } catch (error) {
    console.error('语音识别错误:', error)
    res.status(500).json({
      success: false,
      message: '语音识别服务异常'
    })
  }
})

// 语音合成接口（讯飞 TTS）
app.post('/api/speech/synthesize', async (req, res) => {
  const { text, voice = 'xiaoyan' } = req.body
  
  if (!IFLYTEK.appId || !IFLYTEK.apiKey || !IFLYTEK.apiSecret) {
    return res.status(500).json({
      success: false,
      message: '讯飞 API 配置缺失，请检查 .env 文件'
    })
  }
  
  try {
    const authUrl = getAuthUrl(IFLYTEK.ttsUrl, IFLYTEK.apiKey, IFLYTEK.apiSecret)
    
    const ws = new WebSocket(authUrl)
    const audioChunks = []
    
    ws.on('open', () => {
      const frame = {
        common: {
          app_id: IFLYTEK.appId
        },
        business: {
          aue: 'lame',
          auf: 'audio/L16;rate=16000',
          voice_name: voice,
          speed: 50,
          pitch: 50
        },
        data: {
          status: 0,
          text: Buffer.from(text).toString('base64'),
          encoding: 'utf8'
        }
      }
      
      ws.send(JSON.stringify(frame))
      
      // 发送结束帧
      setTimeout(() => {
        const endFrame = {
          data: {
            status: 2,
            text: '',
            encoding: 'utf8'
          }
        }
        ws.send(JSON.stringify(endFrame))
      }, 500)
    })
    
    ws.on('message', (data) => {
      const result = JSON.parse(data.toString())
      if (result.code === 0 && result.data && result.data.audio) {
        audioChunks.push(result.data.audio)
      }
    })
    
    ws.on('close', () => {
      const audioData = audioChunks.join('')
      res.json({
        success: true,
        data: {
          audioBase64: audioData,
          format: 'mp3'
        }
      })
    })
    
    ws.on('error', (error) => {
      console.error('语音合成错误:', error)
      res.status(500).json({
        success: false,
        message: '语音合成失败'
      })
    })
  } catch (error) {
    console.error('语音合成错误:', error)
    res.status(500).json({
      success: false,
      message: '语音合成服务异常'
    })
  }
})

// 模拟 AI 回复
function generateMockReply(message, scenario) {
  const replies = {
    daily: [
      `Great! Let's talk about "${message}".\n\nHow would you express this in English? Give it a try!`,
      `Interesting topic! "${message}" is perfect for daily conversation.\n\nWhat do you want to say about it?`,
      `Nice choice! Let's practice "${message}" together.\n\nStart by telling me your thoughts in English.`
    ],
    interview: [
      `Excellent! Interview practice for "${message}".\n\nA common question would be: "Can you tell me about your experience with ${message}?"\n\nHow would you answer?`,
      `Great interview topic! For "${message}", employers often ask about your skills.\n\nTry answering in English:`
    ],
    travel: [
      `Perfect for travel! "${message}" is a common situation when traveling.\n\nHow would you ask for help in English?`,
      `Travel scenario: "${message}".\n\nImagine you're in a foreign country. What would you say?`
    ],
    business: [
      `Business English: "${message}".\n\nIn a professional setting, you might say:\n"I'd like to discuss..." or "Could we talk about..."`,
      `For business communication about "${message}", clarity is key.\n\nTry expressing your point professionally:`
    ]
  }
  
  const category = replies[scenario] || replies.daily
  return category[Math.floor(Math.random() * category.length)]
}

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📝 Health check: http://localhost:${PORT}/health`)
  console.log(`🎤 Speech recognition: POST /api/speech/recognize`)
  console.log(`🔊 Speech synthesis: POST /api/speech/synthesize`)
  console.log(`💬 AI Chat: POST /api/chat`)
})
