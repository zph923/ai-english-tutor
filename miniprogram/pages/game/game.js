// pages/game/game.js
const questionBank = require('../../data/questions.js')

Page({
  data: {
    // 游戏状态
    gameState: 'select', // select, battle, result
    selectedUltraman: null,
    selectedMonster: null,
    
    // 战斗状态
    ultramanHealth: 10,
    monsterHealth: 10,
    currentQuestionIndex: 0,
    questions: [],
    wrongQuestions: [],
    correctCount: 0,
    
    // 角色数据
    ultramen: [
      { id: 1, name: '迪迦奥特曼', color: '#ff6600', image: '🦸‍️', desc: '光之巨人' },
      { id: 2, name: '赛罗奥特曼', color: '#00aaff', image: '🦸', desc: '最强战士' },
      { id: 3, name: '泰迦奥特曼', color: '#ff3366', image: '⚡', desc: '泰罗之子' },
      { id: 4, name: '泽塔奥特曼', color: '#cc00ff', image: '🌟', desc: '宇宙拳法' }
    ],
    
    monsters: [
      { id: 1, name: '哥莫拉', color: '#886644', image: '🦖', desc: '古代怪兽' },
      { id: 2, name: '巴尔坦星人', color: '#88cc88', image: '👽', desc: '宇宙忍者' },
      { id: 3, name: '杰顿', color: '#ffaa00', image: '👾', desc: '最强怪兽' },
      { id: 4, name: '贝利亚', color: '#aa0000', image: '😈', desc: '黑暗奥特曼' }
    ],
    
    // 当前题目
    currentQuestion: null,
    canAnswer: true,
    
    // 动画
    showAttack: false,
    attackEmoji: '',
    attackPosition: 'left'
  },

  onLoad() {
    this.initQuestions()
  },

  // 初始化题目
  initQuestions() {
    // 合并所有类型的题目
    const allQuestions = [
      ...questionBank.math.map(q => ({ ...q, type: 'math' })),
      ...questionBank.knowledge.map(q => ({ ...q, type: 'knowledge' })),
      ...questionBank.english.map(q => ({ ...q, type: 'english' })),
      ...questionBank.color.map(q => ({ ...q, type: 'color' })),
      ...questionBank.logic.map(q => ({ ...q, type: 'logic' })),
      ...questionBank.common.map(q => ({ ...q, type: 'common' }))
    ]
    
    // 打乱并选择 10 道题
    const shuffled = this.shuffleArray(allQuestions)
    this.data.questions = shuffled.slice(0, 10)
  },

  // 洗牌算法
  shuffleArray(array) {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  },

  // 选择奥特曼
  selectUltraman(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      selectedUltraman: this.data.ultramen[index]
    })
    this.vibrate()
  },

  // 选择怪兽
  selectMonster(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      selectedMonster: this.data.monsters[index]
    })
    this.vibrate()
  },

  // 开始游戏
  startGame() {
    if (!this.data.selectedUltraman || !this.data.selectedMonster) {
      wx.showToast({
        title: '请选择角色',
        icon: 'none'
      })
      return
    }

    this.setData({
      gameState: 'battle',
      ultramanHealth: 10,
      monsterHealth: 10,
      currentQuestionIndex: 0,
      wrongQuestions: [],
      correctCount: 0
    })

    this.vibrate()
    this.showQuestion()
  },

  // 显示题目
  showQuestion() {
    const { currentQuestionIndex, questions } = this.data
    
    if (currentQuestionIndex >= questions.length || 
        this.data.ultramanHealth <= 0 || 
        this.data.monsterHealth <= 0) {
      this.endGame()
      return
    }

    const question = questions[currentQuestionIndex]
    this.setData({
      currentQuestion: question,
      canAnswer: true
    })
  },

  // 选择答案
  selectAnswer(e) {
    if (!this.data.canAnswer) return

    const selectedIndex = e.currentTarget.dataset.index
    const { currentQuestion } = this.data

    this.setData({ canAnswer: false })
    this.vibrate()

    const isCorrect = selectedIndex === currentQuestion.ans

    if (isCorrect) {
      // 答对了
      this.setData({
        monsterHealth: this.data.monsterHealth - 1,
        correctCount: this.data.correctCount + 1,
        showAttack: true,
        attackEmoji: '💥',
        attackPosition: 'right'
      })
      this.playSound('correct')
    } else {
      // 答错了
      this.setData({
        ultramanHealth: this.data.ultramanHealth - 1,
        showAttack: true,
        attackEmoji: '⚡',
        attackPosition: 'left'
      })
      
      // 记录错题
      this.data.wrongQuestions.push({
        question: currentQuestion.q,
        yourAnswer: currentQuestion.a[selectedIndex],
        correctAnswer: currentQuestion.a[currentQuestion.ans],
        type: currentQuestion.type
      })
      
      this.playSound('wrong')
    }

    // 隐藏动画
    setTimeout(() => {
      this.setData({ showAttack: false })
      
      // 下一题
      this.setData({
        currentQuestionIndex: this.data.currentQuestionIndex + 1
      })
      this.showQuestion()
    }, 1500)
  },

  // 游戏结束
  endGame() {
    const won = this.data.monsterHealth <= 0 && this.data.ultramanHealth > 0
    const totalQuestions = this.data.currentQuestionIndex
    const accuracy = totalQuestions > 0 
      ? Math.round((this.data.correctCount / totalQuestions) * 100) 
      : 0

    this.setData({
      gameState: 'result',
      isWin: won,
      accuracy: accuracy,
      wrongCount: totalQuestions - this.data.correctCount
    })

    this.vibrate()
    
    // 保存游戏记录
    this.saveGameRecord()
  },

  // 保存游戏记录
  saveGameRecord() {
    const records = wx.getStorageSync('gameRecords') || []
    const newRecord = {
      date: new Date().toLocaleString(),
      win: this.data.isWin,
      correctCount: this.data.correctCount,
      wrongCount: this.data.wrongCount,
      accuracy: this.data.accuracy
    }
    records.unshift(newRecord)
    
    // 只保留最近 20 条记录
    if (records.length > 20) {
      records.splice(20)
    }
    
    wx.setStorageSync('gameRecords', records)
  },

  // 再玩一次
  restartGame() {
    this.setData({
      gameState: 'select',
      selectedUltraman: null,
      selectedMonster: null
    })
    this.initQuestions()
    this.vibrate()
  },

  // 查看历史记录
  viewRecords() {
    const records = wx.getStorageSync('gameRecords') || []
    wx.navigateTo({
      url: '/pages/records/records'
    })
  },

  // 震动反馈
  vibrate() {
    wx.vibrateShort({
      type: 'light'
    })
  },

  // 播放音效
  playSound(type) {
    // 微信小程序需要用户交互后才能播放音频
    // 这里可以后续添加音效功能
  }
})
