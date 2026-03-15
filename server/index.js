const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const WebSocket = require('ws')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json({ limit: '10mb' }))

const IFLYTEK = {
  appId: process.env.IFLYTEK_APPID,
  apiKey: process.env.IFLYTEK_API_KEY,
  apiSecret: process.env.IFLYTEK_API_SECRET,
  asrUrl: 'wss://iat-api.xfyun.cn/v2/iat',
  ttsUrl: 'wss://tts-api.xfyun.cn/v2/tts'
}

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AI English Tutor API is running',
    timestamp: new Date().toISOString()
  })
})

function getAuthUrl(url, apiKey, apiSecret) {
  const date = new Date().toUTCString()
  const signatureOrigin = `host: ${new URL(url).host}\ndate: ${date}\nGET ${new URL(url).pathname} HTTP/1.1`
  const signatureSha = crypto.createHmac('sha256', apiSecret).update(signatureOrigin).digest('base64')
  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureSha}"`
  const authorization = Buffer.from(authorizationOrigin).toString('base64')
  return `${url}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${new URL(url).host}`
}

app.post('/api/chat', (req, res) => {
  const { message, scenario } = req.body
  console.log('收到对话请求:', message)
  
  res.json({
    success: true,
    data: {
      reply: generateMockReply(message, scenario),
      scenario: scenario || 'daily'
    }
  })
})

app.post('/api/speech/recognize', async (req, res) => {
  const { audioBase64 } = req.body
  console.log('收到语音识别请求，音频长度:', audioBase64?.length || 0)
  
  if (!IFLYTEK.appId || !IFLYTEK.apiKey || !IFLYTEK.apiSecret) {
    return res.status(500).json({
      success: false,
      message: '讯飞 API 配置缺失'
    })
  }
  
  try {
    const authUrl = getAuthUrl(IFLYTEK.asrUrl, IFLYTEK.apiKey, IFLYTEK.apiSecret)
    console.log('讯飞 ASR 鉴权 URL:', authUrl.substring(0, 100) + '...')
    
    const ws = new WebSocket(authUrl)
    let recognizedText = ''
    
    ws.on('open', () => {
      console.log('讯飞 ASR WebSocket 已连接')
      const frame = {
        common: { app_id: IFLYTEK.appId },
        business: {
          language: 'zh_cn',
          domain: 'iat',
          accent: 'mandarin',
          vad_eos: 3000
        },
        data: {
          status: 0,
          format: 'audio/L16;rate=16000',
          encoding: 'raw',
          audio: audioBase64
        }
      }
      ws.send(JSON.stringify(frame))
      
      setTimeout(() => {
        ws.send(JSON.stringify({
          data: { status: 2, format: 'audio/L16;rate=16000', encoding: 'raw', audio: '' }
        }))
        ws.close()
      }, 1000)
    })
    
    ws.on('message', (data) => {
      try {
        const result = JSON.parse(data.toString())
        console.log('讯飞 ASR 响应:', JSON.stringify(result).substring(0, 200))
        
        if (result.code === 0 && result.data && result.data.result) {
          const text = result.data.result.ws?.map(w => w.cw?.map(c => c.w).join('')).join('') || ''
          recognizedText += text
        } else if (result.code !== 0) {
          console.error('讯飞 ASR 错误码:', result.code, result.message)
        }
      } catch (e) {
        console.error('解析识别结果失败:', e)
      }
    })
    
    ws.on('close', () => {
      console.log('讯飞 ASR 连接关闭，识别结果:', recognizedText)
      res.json({
        success: true,
        data: { text: recognizedText || '未识别到内容' }
      })
    })
    
    ws.on('error', (error) => {
      console.error('讯飞 ASR 错误:', error.message)
      res.status(500).json({
        success: false,
        message: '语音识别失败：' + error.message
      })
    })
  } catch (error) {
    console.error('讯飞 ASR 错误:', error)
    res.status(500).json({
      success: false,
      message: '语音识别服务异常'
    })
  }
})

app.post('/api/speech/synthesize', async (req, res) => {
  const { text, voice = 'xiaoyan' } = req.body
  console.log('收到 TTS 请求，文本:', text?.substring(0, 50))
  
  if (!IFLYTEK.appId || !IFLYTEK.apiKey || !IFLYTEK.apiSecret) {
    return res.status(500).json({
      success: false,
      message: '讯飞 API 配置缺失'
    })
  }
  
  try {
    const authUrl = getAuthUrl(IFLYTEK.ttsUrl, IFLYTEK.apiKey, IFLYTEK.apiSecret)
    console.log('讯飞 TTS 鉴权 URL:', authUrl.substring(0, 100) + '...')
    
    const ws = new WebSocket(authUrl)
    const audioChunks = []
    
    ws.on('open', () => {
      console.log('讯飞 TTS WebSocket 已连接')
      const frame = {
        common: { app_id: IFLYTEK.appId },
        business: {
          aue: 'lame',
          auf: 'audio/L16;rate=16000',
          voice_name: voice,
          speed: 50,
          pitch: 50
        },
        data: {
          status: 0,
          text: Buffer.from(text || '').toString('base64'),
          encoding: 'utf8'
        }
      }
      console.log('发送 TTS 请求帧')
      ws.send(JSON.stringify(frame))
      
      setTimeout(() => {
        ws.send(JSON.stringify({
          data: { status: 2, text: '', encoding: 'utf8' }
        }))
        console.log('发送 TTS 结束帧')
      }, 500)
    })
    
    ws.on('message', (data) => {
      try {
        const result = JSON.parse(data.toString())
        console.log('讯飞 TTS 响应码:', result.code)
        
        if (result.code === 0 && result.data && result.data.audio) {
          audioChunks.push(result.data.audio)
          console.log('收到音频片段，长度:', result.data.audio.length)
        } else if (result.code !== 0) {
          console.error('讯飞 TTS 错误码:', result.code, result.message)
        }
      } catch (e) {
        console.error('解析 TTS 结果失败:', e)
      }
    })
    
    ws.on('close', (code) => {
      console.log('讯飞 TTS 连接关闭，关闭码:', code, '音频片段数:', audioChunks.length)
      const audioData = audioChunks.join('')
      console.log('最终音频长度:', audioData.length)
      
      res.json({
        success: true,
        data: {
          audioBase64: audioData || '',
          format: 'mp3',
          debug: {
            chunks: audioChunks.length,
            length: audioData.length
          }
        }
      })
    })
    
    ws.on('error', (error) => {
      console.error('讯飞 TTS 错误:', error.message)
      res.status(500).json({
        success: false,
        message: '语音合成失败：' + error.message
      })
    })
  } catch (error) {
    console.error('讯飞 TTS 错误:', error)
    res.status(500).json({
      success: false,
      message: '语音合成服务异常'
    })
  }
})

function generateMockReply(message, scenario) {
  const replies = {
    daily: [
      `Great! Let's talk about "${message}".\n\nHow would you express this in English?`,
      `Interesting topic! "${message}" is perfect for daily conversation.`,
      `Nice choice! Let's practice "${message}" together.`
    ],
    interview: [`Excellent! Interview practice for "${message}".`],
    travel: [`Perfect for travel! "${message}" is common when traveling.`],
    business: [`Business English: "${message}".`]
  }
  const category = replies[scenario] || replies.daily
  return category[Math.floor(Math.random() * category.length)]
}

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`)
  console.log(`📝 Health: http://localhost:${PORT}/health`)
  console.log(`🎤 ASR: POST /api/speech/recognize`)
  console.log(`🔊 TTS: POST /api/speech/synthesize`)
  console.log(`💬 Chat: POST /api/chat\n`)
})
