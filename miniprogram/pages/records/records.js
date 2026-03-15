// pages/records/records.js
Page({
  data: {
    records: []
  },

  onLoad() {
    this.loadRecords()
  },

  onShow() {
    this.loadRecords()
  },

  loadRecords() {
    const records = wx.getStorageSync('gameRecords') || []
    this.setData({ records })
  },

  clearRecords() {
    wx.showModal({
      title: '提示',
      content: '确定要清空所有游戏记录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('gameRecords')
          this.setData({ records: [] })
          wx.showToast({
            title: '已清空',
            icon: 'success'
          })
        }
      }
    })
  },

  goBack() {
    wx.navigateBack()
  }
})
