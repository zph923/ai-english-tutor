Page({
  data: {
    message: 'Hello AI English Tutor',
    inputValue: '',
    chatHistory: []
  },

  onLoad() {
    console.log('Index page loaded')
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  async onSubmit() {
    const { inputValue } = this.data
    if (!inputValue.trim()) return

    // TODO: 调用后端 API
    wx.showToast({
      title: '发送中...',
      icon: 'loading'
    })
  }
})
