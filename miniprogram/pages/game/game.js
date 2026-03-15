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
    attackPosition: 'left',
    
    // 结果
    isWin: false,
    accuracy: 0,
    wrongCount: 0
  },

  onLoad() {
    console.log('游戏页面加载')
    this.initQuestions()
  },

  // 初始化题目
  initQuestions() {
    console.log('初始化题目')
    // 合并所有类型的题目
    const allQuestions = []
    
    // 从题库中随机选择题
    const types = ['math', 'knowledge', 'english', 'color', 'logic', 'common']
    
    for (let i = 0; i < 10; i++) {
      const type = types[i % types.length]
      const typeQuestions = questionBank[type] || []
      if (typeQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * typeQuestions.length)
        const q = typeQuestions[randomIndex]
        allQuestions.push({
          q: q.q,
          a: q.a,
          ans: q.ans,
          type: type
        })
      }
    }
    
    // 如果题目不够，用数学题补充
    while (allQuestions.length < 10) {
      const mathQuestions = questionBank.math
      const randomIndex = Math.floor(Math.random() * mathQuestions.length)
      const q = mathQuestions[randomIndex]
      allQuestions.push({
        q: q.q,
        a: q.a,
        ans: q.ans,
        type: 'math'
      })
    }
    
    this.setData({
      questions: allQuestions
    })
    console.log('题目初始化完成，共', allQuestions.length, '题')
  },

  // 选择奥特曼
  selectUltraman(e) {
    console.log('选择奥特曼', e)
    const index = e.currentTarget.dataset.index
    const ultraman = this.data.ultramen[index]
    console.log('选中的奥特曼', ultraman)
    this.setData({
      selectedUltraman: ultraman
    })
    this.vibrate()
  },

  // 选择怪兽
  selectMonster(e) {
    console.log('选择怪兽', e)
    const index = e.currentTarget.dataset.index
    const monster = this.data.monsters[index]
    console.log('选中的怪兽', monster)
    this.setData({
      selectedMonster: monster
    })
    this.vibrate()
  },

  // 开始游戏
  startGame() {
    console.log('开始游戏')
    console.log('奥特曼', this.data.selectedUltraman)
    console.log('怪兽', this.data.selectedMonster)
    
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
    console.log('显示题目')
    const { currentQuestionIndex, questions } = this.data
    
    console.log('当前索引', currentQuestionIndex)
    console.log('题目数量', questions.length)
    console.log '奥特曼血量', this.data.ultramanHealth)
    console.log('怪兽血量', this.data.monsterHealth)
    
    if (currentQuestionIndex >= questions.length || 
        this.data.ultramanHealth <= 0 || 
        this.data.monsterHealth <= 0) {
      console.log('游戏结束条件满足')
      this.endGame()
      return
    }

    const question = questions[currentQuestionIndex]
    console.log('当前题目', question)
    
    this.setData({
      currentQuestion: question,
      canAnswer: true
    })
  },

  // 选择答案
  selectAnswer(e) {
    console.log('选择答案', e)
    if (!this.data.canAnswer) return

    const selectedIndex = e.currentTarget.dataset.index
    const { currentQuestion } = this.data

    console.log('选择的答案索引', selectedIndex)
    console.log('正确答案索引', currentQuestion.ans)

    this.setData({ canAnswer: false })
    this.vibrate()

    const isCorrect = selectedIndex === currentQuestion.ans
    console.log('答案是否正确', isCorrect)

    if (isCorrect) {
      // 答对了
      const newMonsterHealth = this.data.monsterHealth - 1
      const newCorrectCount = this.data.correctCount + 1
      
      this.setData({
        monsterHealth: newMonsterHealth,
        correctCount: newCorrectCount,
        showAttack: true,
        attackEmoji: '💥',
        attackPosition: 'right'
      })
      console.log('答对了！怪兽血量', newMonsterHealth)
    } else {
      // 答错了
      const newUltramanHealth = this.data.ultramanHealth - 1
      
      this.setData({
        ultramanHealth: newUltramanHealth,
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
      
      console.log('答错了！奥特曼血量', newUltramanHealth)
    }

    // 隐藏动画
    setTimeout(() => {
      this.setData({ showAttack: false })
      
      // 下一题
      this.setData({
        currentQuestionIndex: this.data.currentQuestionIndex + 1
      })
      
      // 显示下一题
      setTimeout(() => {
        this.showQuestion()
      }, 100)
    }, 1500)
  },

  // 游戏结束
  endGame() {
    console.log('游戏结束')
    const won = this.data.monsterHealth <= 0 && this.data.ultramanHealth > 0
    const totalQuestions = this.data.currentQuestionIndex
    const accuracy = totalQuestions > 0 
      ? Math.round((this.data.correctCount / totalQuestions) * 100) 
      : 0

    console.log('是否胜利', won)
    console.log('正确率', accuracy)

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
    try {
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
      console.log('游戏记录已保存')
    } catch (e) {
      console.error('保存记录失败', e)
    }
  },

  // 再玩一次
  restartGame() {
    console.log('重新开始游戏')
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
    wx.navigateTo({
      url: '/pages/records/records'
    })
  },

  // 震动反馈
  vibrate() {
    try {
      wx.vibrateShort({
        type: 'light'
      })
    } catch (e) {
      console.log('震动失败', e)
    }
  }
})
