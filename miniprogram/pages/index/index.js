Page({
  data: {
    inputValue: '',
    chatHistory: [],
    loading: false,
    welcomeMessage: '👋 你好！我是你的 AI 英语陪练助手～\n\n你可以和我练习：\n• 日常对话\n• 面试英语\n• 旅游英语\n• 商务英语\n\n在下方输入你想练习的话题吧！'
  },

  onLoad() {
    console.log('Index page loaded')
    // 加载保存的聊天记录
    this.loadChatHistory()
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  async onSubmit() {
    const { inputValue, loading } = this.data
    if (!inputValue.trim() || loading) return

    // 设置加载中
    this.setData({ loading: true })

    // 添加用户消息
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

    // 调用后端 API
    try {
      const response = await this.callAI(inputValue)
      
      // 添加 AI 回复
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response
      }
      
      this.setData({
        chatHistory: [...newHistory, aiMessage]
      })

      // 保存聊天记录
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
    // TODO: 替换为你的后端 API 地址
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
      // 如果后端未启动，返回模拟回复（用于测试）
      return this.getMockReply(message)
    }
  },

  getMockReply(message) {
    // 模拟 AI 回复（开发测试用）
    const replies = [
      `Great question! Let's practice: "${message}"\n\nTry saying it in English first, I'll help you!`,
      `Interesting topic! "${message}" is perfect for practice.\n\nHow would you express this in English?`,
      `Nice! Let's work on "${message}" together.\n\nStart by telling me what you want to say in English.`,
      `Perfect choice! "${message}" is a common conversation topic.\n\nGive it a try in English!`
    ]
    return replies[Math.floor(Math.random() * replies.length)]
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
  }
})
