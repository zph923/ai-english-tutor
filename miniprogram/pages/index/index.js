Page({
  data: {
    inputValue: '',
    chatHistory: [],
    loading: false,
    welcomeMessage: '👋 你好！我是你的 AI 英语陪练助手～\n\n你可以和我练习：\n• 日常对话\n• 面试英语\n• 旅游英语\n• 商务英语\n\n在下方输入你想练习的话题吧！',
    isRecording: false,
    isPlaying: false,
    currentPlayingId: null
  },

  onLoad() {
    console.log('Index page loaded')
    this.loadChatHistory()
    
    // 检查录音权限
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.record']) {
          console.log('录音权限未授权')
        }
      }
    })
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  async onSubmit() {
    const { inputValue, loading } = this.data
    if (!inputValue.trim() || loading) return

    this.setData({ loading: true })

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue
    }
    
    const newHistory = [...this.data.chatHistory, userMessage]
    this.setData({
      chatHistory: newHistory,
      inputValue: '',
      loading: false
    })

    try {
      const response = await this.callAI(inputValue)
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response
      }
      
      this.setData({
        chatHistory: [...newHistory, aiMessage]
      })

      this.saveChatHistory()
      
      // 自动播放 AI 回复（可选）
      // this.speak(response, aiMessage.id)
    } catch (error) {
      console.error('AI 调用失败:', error)
      wx.showToast({
        title: '网络开小差了',
        icon: 'none'
      })
    }
  },

  async callAI(message) {
    const apiUrl = 'http://localhost:3000/api/chat'
    
    try {
      const res = await wx.request({
        url: apiUrl,
        method: 'POST',
        data: {
          message: message,
          scenario: 'daily'
        },
        timeout: 10000
      })
      
      if (res.data.success) {
        return res.data.data.reply
      } else {
        return '抱歉，我暂时无法回答这个问题。'
      }
    } catch (error) {
      return this.getMockReply(message)
    }
  },

  getMockReply(message) {
    const replies = [
      `Great question! Let's practice: "${message}"\n\nTry saying it in English first, I'll help you!`,
      `Interesting topic! "${message}" is perfect for practice.\n\nHow would you express this in English?`,
      `Nice! Let's work on "${message}" together.\n\nStart by telling me what you want to say in English.`,
      `Perfect choice! "${message}" is a common conversation topic.\n\nGive it a try in English!`
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  },

  // 🎤 开始录音
  onStartRecord() {
    if (this.data.isRecording) {
      this.stopRecord()
      return
    }

    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success: () => this.startRecording(),
            fail: () => {
              wx.showModal({
                title: '提示',
                content: '需要录音权限才能使用语音输入，请在设置中开启',
                confirmText: '去设置',
                success: (res) => {
                  if (res.confirm) {
                    wx.openSetting()
                  }
                }
              })
            }
          })
        } else {
          this.startRecording()
        }
      }
    })
  },

  startRecording() {
    this.setData({ isRecording: true })
    
    const recorderManager = wx.getRecorderManager()
    
    recorderManager.onStart(() => {
      console.log('录音开始')
      wx.showToast({
        title: '正在录音...',
        icon: 'none',
        duration: 1000
      })
    })

    recorderManager.onStop((res) => {
      console.log('录音结束', res)
      this.setData({ isRecording: false })
      
      // 识别语音
      this.recognizeSpeech(res.tempFilePath)
    })

    recorderManager.onError((err) => {
      console.error('录音错误', err)
      this.setData({ isRecording: false })
      wx.showToast({
        title: '录音失败',
        icon: 'none'
      })
    })

    // 配置录音参数
    recorderManager.start({
      duration: 60000, // 最长 60 秒
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 48000,
      format: 'mp3'
    })
  },

  stopRecord() {
    const recorderManager = wx.getRecorderManager()
    recorderManager.stop()
  },

  // 🎙️ 语音识别（调用讯飞/百度 API）
  async recognizeSpeech(filePath) {
    wx.showLoading({ title: '识别中...' })
    
    // TODO: 调用语音识别 API
    // 这里先用模拟数据
    setTimeout(() => {
      wx.hideLoading()
      const recognizedText = '我想练习日常对话' // 模拟识别结果
      
      this.setData({ inputValue: recognizedText })
      
      wx.showToast({
        title: '识别成功',
        icon: 'success'
      })
    }, 1000)
  },

  // 🔊 语音播放
  speak(text, messageId) {
    if (this.data.isPlaying && this.data.currentPlayingId === messageId) {
      // 正在播放这条，停止
      wx.stopVoice()
      this.setData({ isPlaying: false, currentPlayingId: null })
      return
    }

    // 停止之前的播放
    wx.stopVoice()

    this.setData({ 
      isPlaying: true, 
      currentPlayingId: messageId 
    })

    // 提取英文内容播放（简化版）
    const englishText = this.extractEnglish(text)
    
    if (englishText) {
      wx.getSystemInfo({
        success: (res) => {
          console.log('系统信息', res)
        }
      })

      // 使用微信内置 TTS
      const plugin = requirePlugin('WechatSI')
      
      // 简单方式：用系统 TTS
      this.playWithSystemTTS(englishText, messageId)
    }
  },

  playWithSystemTTS(text, messageId) {
    // 微信小程序没有内置 TTS，需要调用第三方 API
    // 这里用模拟方式
    
    wx.showToast({
      title: '播放语音',
      icon: 'none',
      duration: 2000
    })

    // TODO: 调用讯飞/百度 TTS API 获取音频 URL
    // 然后播放
    
    setTimeout(() => {
      this.setData({ 
        isPlaying: false, 
        currentPlayingId: null 
      })
    }, 2000)
  },

  extractEnglish(text) {
    // 提取文本中的英文部分
    const englishMatch = text.match(/[a-zA-Z\s\.,!?]+/)
    return englishMatch ? englishMatch[0].trim() : text
  },

  saveChatHistory() {
    wx.setStorageSync('chatHistory', this.data.chatHistory)
  },

  loadChatHistory() {
    try {
      const history = wx.getStorageSync('chatHistory')
      if (history) {
        this.setData({ chatHistory: history })
      }
    } catch (e) {
      console.error('加载聊天记录失败:', e)
    }
  },

  onClear() {
    wx.showModal({
      title: '清空聊天记录',
      content: '确定要清空所有聊天记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ chatHistory: [] })
          wx.removeStorageSync('chatHistory')
          wx.showToast({
            title: '已清空',
            icon: 'success'
          })
        }
      }
    })
  },

  // 停止播放（页面卸载时）
  onUnload() {
    wx.stopVoice()
  }
})
