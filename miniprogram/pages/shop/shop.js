// pages/shop/shop.js
const characters = require('../../data/characters.js')

Page({
  data: {
    ultramen: characters.ultramen,
    monsters: characters.monsters,
    prices: characters.unlockPrices,
    
    // 已解锁内容（从本地存储读取）
    unlockedCharacters: [],
    
    // 当前选中的购买项
    selectedPackage: null
  },

  onLoad() {
    this.loadUnlockedCharacters()
  },

  onShow() {
    this.loadUnlockedCharacters()
  },

  // 加载已解锁角色
  loadUnlockedCharacters() {
    const unlocked = wx.getStorageSync('unlockedCharacters') || []
    this.setData({ unlockedCharacters: unlocked })
  },

  // 判断角色是否已解锁
  isUnlocked(id) {
    return this.data.unlockedCharacters.includes(id)
  },

  // 购买全部奥特曼
  buyAllUltramen() {
    this.showPurchaseConfirm('全部奥特曼', this.data.prices.allUltramen, () => {
      // 解锁所有奥特曼
      const ultramenIds = this.data.ultramen.map(u => u.id)
      this.unlockCharacters(ultramenIds)
    })
  },

  // 购买全部怪兽
  buyAllMonsters() {
    this.showPurchaseConfirm('全部怪兽', this.data.prices.allMonsters, () => {
      // 解锁所有怪兽
      const monstersIds = this.data.monsters.map(m => m.id)
      this.unlockCharacters(monstersIds)
    })
  },

  // 购买完整版
  buyBundle() {
    this.showPurchaseConfirm('完整版（全部角色）', this.data.prices.bundle, () => {
      // 解锁所有角色
      const allIds = [
        ...this.data.ultramen.map(u => u.id),
        ...this.data.monsters.map(m => m.id)
      ]
      this.unlockCharacters(allIds)
    })
  },

  // 购买单个角色
  buyCharacter(e) {
    const { id, name, type } = e.currentTarget.dataset
    const character = (type === 'ultraman' ? this.data.ultramen : this.data.monsters).find(c => c.id === id)
    
    this.showPurchaseConfirm(name, this.data.prices.singleCharacter, () => {
      this.unlockCharacters([id])
    })
  },

  // 显示购买确认
  showPurchaseConfirm(itemName, price, onConfirm) {
    wx.showModal({
      title: '确认购买',
      content: `购买"${itemName}"需要 ${price / 100}元，确认支付吗？`,
      confirmText: '确认支付',
      cancelText: '再想想',
      success: (res) => {
        if (res.confirm) {
          // 调用微信支付
          this.makePayment(itemName, price, onConfirm)
        }
      }
    })
  },

  // 模拟支付（实际开发需要接入微信支付）
  makePayment(itemName, price, onConfirm) {
    // TODO: 接入微信支付
    // wx.requestPayment({...})
    
    // 模拟支付成功
    wx.showLoading({ title: '支付中...' })
    
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '支付成功！',
        icon: 'success'
      })
      
      // 执行解锁
      if (onConfirm) {
        onConfirm()
      }
    }, 1000)
  },

  // 解锁角色
  unlockCharacters(ids) {
    const current = this.data.unlockedCharacters
    const newUnlocked = [...new Set([...current, ...ids])]
    
    wx.setStorageSync('unlockedCharacters', newUnlocked)
    this.setData({ unlockedCharacters: newUnlocked })
    
    wx.showToast({
      title: '解锁成功！',
      icon: 'success'
    })
  },

  // 恢复购买
  restorePurchases() {
    wx.showLoading({ title: '恢复中...' })
    
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '已恢复购买',
        icon: 'success'
      })
    }, 1000)
  },

  // 返回首页
  goBack() {
    wx.navigateBack()
  }
})
