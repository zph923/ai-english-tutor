Page({
  data: {
    inputValue: '',
    chatHistory: [],
    loading: false,
    welcomeMessage: '👋 你好！我是你的 AI 英语陪练助手～\n\n你可以和我练习：\n• 日常对话\n• 面试英语\n• 旅游英语\n• 商务英语\n\n在下方输入你想练习的话题吧！',
    isRecording: false,
    isPlaying: false,
    currentPlayingId: null,
    // 开发环境用 localhost，生产环境需要换成 HTTPS 域名
    apiBaseUrl: 'http://127.0.0.1:3000'
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
    } catch (error) {
      console.error('AI 调用失败:', error)
      wx.showToast({
        title: '网络开小差了',
        icon: 'none'
      })
    }
  },

  async callAI(message) {
    const { apiBaseUrl } = this.data
    
    try {
      const res = await wx.request({
        url: `${apiBaseUrl}/api/chat`,
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
      console.log('后端未连接，使用模拟回复')
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

    recorderManager.start({
      duration: 60000,
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

  async recognizeSpeech(filePath) {
    wx.showLoading({ title: '识别中...' })
    
    const { apiBaseUrl } = this.data
    
    try {
      const fs = wx.getFileSystemManager()
      const arrayBuffer = fs.readFileSync(filePath)
      const base64 = wx.arrayBufferToBase64(arrayBuffer)
      
      const res = await wx.request({
        url: `${apiBaseUrl}/api/speech/recognize`,
        method: 'POST',
        data: {
          audioBase64: base64
        },
        timeout: 30000
      })
      
      wx.hideLoading()
      
      if (res.data.success) {
        const recognizedText = res.data.data.text
        this.setData({ inputValue: recognizedText })
        wx.showToast({
          title: `识别成功：${recognizedText}`,
          icon: 'success',
          duration: 2000
        })
      } else {
        throw new Error(res.data.message || '识别失败')
      }
    } catch (error) {
      wx.hideLoading()
      console.error('语音识别错误:', error)
      wx.showToast({
        title: '语音识别失败',
        icon: 'none'
      })
    }
  },

  async speak(e) {
    const { text, id } = e.currentTarget.dataset
    
    if (this.data.isPlaying && this.data.currentPlayingId === id) {
      wx.stopVoice()
      this.setData({ isPlaying: false, currentPlayingId: null })
      return
    }

    wx.stopVoice()

    const { apiBaseUrl } = this.data
    
    try {
      this.setData({ 
        isPlaying: true, 
        currentPlayingId: id 
      })
      
      wx.showLoading({ title: '生成语音...' })
      
      const res = await wx.request({
        url: `${apiBaseUrl}/api/speech/synthesize`,
        method: 'POST',
        data: {
          text: text,
          voice: 'xiaoyan'
        },
        timeout: 30000
      })
      
      wx.hideLoading()
      
      if (res.data.success) {
        const audioBase64 = res.data.data.audioBase64
        
        if (!audioBase64) {
          throw new Error('未收到音频数据')
        }
        
        const fs = wx.getFileSystemManager()
        const tempPath = `${wx.env.USER_DATA_PATH}/tts_${id}.mp3`
        
        try {
          fs.writeFileSync(tempPath, wx.base64ToArrayBuffer(audioBase64))
        } catch (writeError) {
          console.error('写入音频文件失败:', writeError)
          throw new Error('音频文件写入失败')
        }
        
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = tempPath
        innerAudioContext.autoplay = false
        
        innerAudioContext.onPlay(() => {
          console.log('开始播放音频')
        })
        
        innerAudioContext.onEnded(() => {
          console.log('音频播放结束')
          this.setData({ 
            isPlaying: false, 
            currentPlayingId: null 
          })
        })
        
        innerAudioContext.onError((err) => {
          console.error('音频播放错误:', err)
          this.setData({ 
            isPlaying: false, 
            currentPlayingId: null 
          })
          wx.showToast({
            title: '播放失败',
            icon: 'none'
          })
        })
        
        innerAudioContext.play()
        
        wx.showToast({
          title: '正在播放',
          icon: 'none',
          duration: 1000
        })
      } else {
        throw new Error(res.data.message || '语音合成失败')
      }
    } catch (error) {
      wx.hideLoading()
      console.error('语音播放错误:', error)
      
      this.setData({ 
        isPlaying: false, 
        currentPlayingId: null 
      })
      
      wx.showToast({
        title: error.message || '语音播放失败',
        icon: 'none',
        duration: 2000
      })
    }
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

  onUnload() {
    wx.stopVoice()
  }
})
