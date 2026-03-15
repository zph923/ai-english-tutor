// pages/game/game.js
const questionBank = require('../../data/questions.js')
const characters = require('../../data/characters.js')

Page({
  data: {
    // 游戏状态：select, topic, difficulty, battle, result
    gameState: 'select',
    
    // 角色选择
    selectedUltraman: null,
    selectedMonster: null,
    
    // 题型选择
    selectedTopics: [], // 已选题型
    availableTopics: [
      { id: 'math', name: '📐 数学', icon: '📐', color: '#4CAF50', count: 50 },
      { id: 'knowledge', name: '🧠 认知', icon: '🧠', color: '#2196F3', count: 40 },
      { id: 'english', name: '🔤 英语', icon: '🔤', color: '#FF9800', count: 40 },
      { id: 'color', name: '🎨 颜色', icon: '🎨', color: '#E91E63', count: 30 },
      { id: 'logic', name: '💡 逻辑', icon: '💡', color: '#9C27B0', count: 25 },
      { id: 'common', name: '📚 常识', icon: '📚', color: '#00BCD4', count: 15 }
    ],
    
    // 难度选择
    selectedDifficulty: 'age4',
    difficulties: [
      { id: 'age3', name: '3 岁', icon: '👶', desc: '启蒙阶段', stars: '⭐' },
      { id: 'age4', name: '4 岁', icon: '🧒', desc: '基础阶段', stars: '⭐⭐' },
      { id: 'age5', name: '5 岁', icon: '👦', desc: '进阶阶段', stars: '⭐⭐⭐' },
      { id: 'age6', name: '6 岁', icon: '👧', desc: '提高阶段', stars: '⭐⭐⭐⭐' },
      { id: 'age7_8', name: '7-8 岁', icon: '🎓', desc: '挑战阶段', stars: '⭐⭐⭐⭐⭐' }
    ],
    
    // 游戏设置
    questionCount: 10, // 题目数量
    
    // 战斗状态
    ultramanHealth: 10,
    monsterHealth: 10,
    currentQuestionIndex: 0,
    questions: [],
    wrongQuestions: [],
    correctCount: 0,
    
    // 角色数据
    ultramen: characters.ultramen,
    monsters: characters.monsters,
    
    // 当前题目
    currentQuestion: null,
    canAnswer: true,
    
    // 动画
    showAttack: false,
    attackEmoji: '',
    
    // 结果
    isWin: false,
    accuracy: 0,
    wrongCount: 0,
    
    // 已解锁角色
    unlockedCharacters: []
  },

  onLoad() {
    console.log('游戏页面加载')
    this.loadUnlockedCharacters()
    this.initQuestions()
    // 初始化难度名称
    this.setData({
      currentDifficultyName: this.getDifficultyName(this.data.selectedDifficulty)
    })
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

  // 初始化题目
  initQuestions() {
    console.log('初始化题目')
  },

  // 选择奥特曼
  selectUltraman(e) {
    const index = e.currentTarget.dataset.index
    const ultraman = this.data.ultramen[index]
    
    // 检查是否解锁
    if (!ultraman.isFree && !this.isUnlocked(ultraman.id)) {
      wx.showToast({
        title: '请先解锁角色',
        icon: 'none'
      })
      // 跳转到商店
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/shop/shop'
        })
      }, 1000)
      return
    }
    
    this.setData({
      selectedUltraman: ultraman
    })
    this.vibrate()
  },

  // 选择怪兽
  selectMonster(e) {
    const index = e.currentTarget.dataset.index
    const monster = this.data.monsters[index]
    
    // 检查是否解锁
    if (!monster.isFree && !this.isUnlocked(monster.id)) {
      wx.showToast({
        title: '请先解锁角色',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/shop/shop'
        })
      }, 1000)
      return
    }
    
    this.setData({
      selectedMonster: monster
    })
    this.vibrate()
  },

  // 进入题型选择
  goToTopicSelect() {
    if (!this.data.selectedUltraman || !this.data.selectedMonster) {
      wx.showToast({
        title: '请先选择角色',
        icon: 'none'
      })
      return
    }
    this.setData({ gameState: 'topic' })
    this.vibrate()
  },

  // 切换题型选择
  toggleTopic(e) {
    const topicId = e.currentTarget.dataset.id
    let { selectedTopics } = this.data
    
    console.log('========== 切换题型 ==========')
    console.log('点击的题型 ID:', topicId)
    console.log('当前已选:', selectedTopics)
    
    const index = selectedTopics.indexOf(topicId)
    console.log('当前索引:', index)
    
    if (index > -1) {
      // 取消选择
      selectedTopics.splice(index, 1)
      console.log('取消选择', topicId)
    } else {
      // 添加选择
      selectedTopics = [...selectedTopics, topicId]
      console.log('添加选择', topicId)
    }
    
    // 至少选择一个题型
    if (selectedTopics.length === 0) {
      wx.showToast({
        title: '至少选择一个题型',
        icon: 'none'
      })
      selectedTopics = [topicId]
    }
    
    console.log('更新后已选:', selectedTopics)
    console.log('================================')
    
    // 强制触发视图更新
    this.setData({ 
      selectedTopics: selectedTopics,
      selectedTopicsStr: selectedTopics.join(',') // 用于调试
    }, () => {
      console.log('setData 完成，当前 selectedTopics:', this.data.selectedTopics)
    })
    
    this.vibrate()
  },

  // 选择难度
  selectDifficulty(e) {
    const difficulty = e.currentTarget.dataset.id
    this.setData({ 
      selectedDifficulty: difficulty,
      currentDifficultyName: this.getDifficultyName(difficulty)
    })
    this.vibrate()
  },

  // 获取难度名称
  getDifficultyName(difficultyId) {
    const diff = this.data.difficulties.find(d => d.id === difficultyId)
    return diff ? diff.name : '4 岁'
  },

  // 设置题目数量
  setQuestionCount(e) {
    const count = parseInt(e.currentTarget.dataset.count)
    this.setData({ questionCount: count })
    this.vibrate()
  },

  // 开始游戏
  startGame() {
    console.log('========== 开始游戏 ==========')
    
    if (!this.data.selectedUltraman || !this.data.selectedMonster) {
      wx.showToast({
        title: '请先选择角色',
        icon: 'none'
      })
      return
    }
    
    console.log('选择的奥特曼:', this.data.selectedUltraman.name)
    console.log('选择的怪兽:', this.data.selectedMonster.name)
    console.log('选题型:', this.data.selectedTopics)
    console.log('难度:', this.data.selectedDifficulty)
    console.log('题量:', this.data.questionCount)

    // 生成题目
    console.log('开始生成题目...')
    this.generateQuestions()
    
    // 等待题目生成后再设置状态
    setTimeout(() => {
      console.log('题目生成完成，设置游戏状态...')
      
      this.setData({
        gameState: 'battle',
        ultramanHealth: 10,
        monsterHealth: 10,
        currentQuestionIndex: 0,
        wrongQuestions: [],
        correctCount: 0
      }, () => {
        console.log('游戏状态设置完成')
        this.vibrate()
        console.log('准备显示第一题...')
        this.showQuestion()
      })
    }, 100)
  },

  // 生成题目
  generateQuestions() {
    const { selectedTopics, selectedDifficulty, questionCount } = this.data
    const allQuestions = []
    const usedQuestions = new Set() // 去重
    
    console.log('========== 生成题目 ==========')
    console.log('选题型', selectedTopics)
    console.log('难度', selectedDifficulty)
    console.log('题量', questionCount)
    
    // 从题库中选题
    const fullBank = require('../../data/questions-full.js')
    const ageBank = fullBank[selectedDifficulty] || fullBank.age4
    
    console.log('年龄题库', selectedDifficulty)
    if (!ageBank) {
      console.error('错误：找不到题库数据！')
      wx.showToast({
        title: '题库数据错误',
        icon: 'none'
      })
      return
    }
    
    // 如果没有选择题型，默认全选
    const topics = selectedTopics.length > 0 ? selectedTopics : ['math', 'knowledge', 'english', 'color', 'logic', 'common']
    console.log('最终题型列表', topics)
    
    // 检查每个题型是否有数据
    topics.forEach(topic => {
      const topicQuestions = ageBank[topic] || []
      console.log('题型', topic, '题目数量:', topicQuestions.length)
    })
    
    // 从每个题型中随机选题（不重复）
    topics.forEach(topic => {
      const topicQuestions = ageBank[topic] || []
      
      if (topicQuestions.length === 0) {
        console.log('题型', topic, '没有数据，跳过')
        return
      }
      
      // 每个题型至少选 1 题
      const count = Math.max(1, Math.floor(questionCount / topics.length))
      console.log('题型', topic, '应选', count, '题')
      
      // 打乱题目顺序
      const shuffled = this.shuffleArray([...topicQuestions])
      
      for (let i = 0; i < count && i < shuffled.length; i++) {
        const q = shuffled[i]
        const key = q.q // 用题目作为唯一标识
        
        if (!usedQuestions.has(key)) {
          usedQuestions.add(key)
          allQuestions.push({
            q: q.q,
            a: q.a,
            ans: q.ans,
            type: topic,
            difficulty: q.difficulty || 1
          })
          console.log('  添加题目:', q.q.substring(0, 20))
        }
      }
    })
    
    console.log('当前题目总数:', allQuestions.length)
    
    // 如果题目不够，随机补充（不重复）
    while (allQuestions.length < questionCount) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)]
      const topicQuestions = ageBank[randomTopic] || []
      
      if (topicQuestions.length > 0) {
        const shuffled = this.shuffleArray([...topicQuestions])
        let added = false
        
        for (let i = 0; i < shuffled.length && !added; i++) {
          const q = shuffled[i]
          const key = q.q
          
          if (!usedQuestions.has(key)) {
            usedQuestions.add(key)
            allQuestions.push({
              q: q.q,
              a: q.a,
              ans: q.ans,
              type: randomTopic
            })
            console.log('补充题目:', q.q.substring(0, 20))
            added = true
          }
        }
      }
      
      // 如果所有题型都用完了，退出循环
      const totalAvailable = topics.reduce((sum, topic) => {
        return sum + (ageBank[topic] || []).length
      }, 0)
      
      if (allQuestions.length >= totalAvailable || allQuestions.length >= questionCount) {
        break
      }
    }
    
    // 截取指定数量
    const questions = allQuestions.slice(0, questionCount)
    
    console.log('最终题目数量:', questions.length)
    
    if (questions.length === 0) {
      console.error('错误：没有生成任何题目！')
      wx.showToast({
        title: '题目生成失败',
        icon: 'none'
      })
    }
    
    console.log('================================')
    
    this.setData({ questions })
  },

  // 洗牌算法（打乱数组）
  shuffleArray(array) {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  },

  // 显示题目
  showQuestion() {
    const { currentQuestionIndex, questions } = this.data
    
    console.log('========== 显示题目 ==========')
    console.log('当前索引:', currentQuestionIndex)
    console.log('题目总数:', questions.length)
    console.log('奥特曼血量:', this.data.ultramanHealth)
    console.log('怪兽血量:', this.data.monsterHealth)
    
    if (questions.length === 0) {
      console.error('错误：题目数组为空！')
      wx.showToast({
        title: '题目生成失败',
        icon: 'none'
      })
      return
    }
    
    if (currentQuestionIndex >= questions.length) {
      console.log('题目已答完，结束游戏')
      this.endGame()
      return
    }
    
    if (this.data.ultramanHealth <= 0 || this.data.monsterHealth <= 0) {
      console.log('血量归零，结束游戏')
      this.endGame()
      return
    }

    const question = questions[currentQuestionIndex]
    console.log('当前题目:', question.q)
    console.log('题目类型:', question.type)
    
    // 获取题型信息
    const topic = this.data.availableTopics.find(t => t.id === question.type)
    
    this.setData({
      currentQuestion: question,
      canAnswer: true,
      currentTopicColor: topic ? topic.color : '#00d4ff',
      currentTopicIcon: topic ? topic.icon : '📚',
      currentTopicName: topic ? topic.name : '未知'
    })
    
    console.log('题目显示完成')
    console.log('================================')
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
      const newMonsterHealth = this.data.monsterHealth - 1
      const newCorrectCount = this.data.correctCount + 1
      
      this.setData({
        monsterHealth: newMonsterHealth,
        correctCount: newCorrectCount,
        showAttack: true,
        attackEmoji: '💥'
      })
    } else {
      // 答错了
      const newUltramanHealth = this.data.ultramanHealth - 1
      
      this.setData({
        ultramanHealth: newUltramanHealth,
        showAttack: true,
        attackEmoji: '⚡'
      })
      
      // 记录错题
      this.data.wrongQuestions.push({
        question: currentQuestion.q,
        yourAnswer: currentQuestion.a[selectedIndex],
        correctAnswer: currentQuestion.a[currentQuestion.ans],
        type: currentQuestion.type
      })
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
        accuracy: this.data.accuracy,
        topics: this.data.selectedTopics,
        difficulty: this.data.selectedDifficulty
      }
      records.unshift(newRecord)
      
      if (records.length > 20) {
        records.splice(20)
      }
      
      wx.setStorageSync('gameRecords', records)
    } catch (e) {
      console.error('保存记录失败', e)
    }
  },

  // 再玩一次
  restartGame() {
    this.setData({
      gameState: 'select',
      selectedUltraman: null,
      selectedMonster: null,
      selectedTopics: []
    })
    this.vibrate()
  },

  // 再来一局（保持设置）
  playAgain() {
    this.setData({
      gameState: 'battle',
      ultramanHealth: 10,
      monsterHealth: 10,
      currentQuestionIndex: 0,
      wrongQuestions: [],
      correctCount: 0
    })
    this.initQuestions()
    this.vibrate()
    this.showQuestion()
  },

  // 查看历史记录
  viewRecords() {
    wx.navigateTo({
      url: '/pages/records/records'
    })
  },

  // 去商店
  goToShop() {
    wx.navigateTo({
      url: '/pages/shop/shop'
    })
  },

  // 震动反馈
  vibrate() {
    try {
      wx.vibrateShort({
        type: 'light'
      })
    } catch (e) {}
  },
  
  // 返回上一步
  goBack() {
    const { gameState } = this.data
    
    if (gameState === 'topic') {
      this.setData({ gameState: 'select' })
    } else if (gameState === 'difficulty') {
      this.setData({ gameState: 'topic' })
    }
    
    this.vibrate()
  }
})
