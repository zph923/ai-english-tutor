// 奥特曼和怪兽角色数据 - 符合原著设定

module.exports = {
  // 奥特曼角色（免费 3 个 + 付费 5 个）
  ultramen: [
    // === 免费角色 ===
    { 
      id: 1, 
      name: '迪迦奥特曼', 
      color: '#ff6600',
      secondaryColor: '#cc3300',
      image: '🦸‍️',
      desc: '光之巨人，来自超古代',
      skill: '哉佩利敖光线',
      isFree: true,
      origin: '迪迦奥特曼 TV 版'
    },
    { 
      id: 2, 
      name: '赛罗奥特曼', 
      color: '#0066ff',
      secondaryColor: '#cc0000',
      image: '🦸',
      desc: '最强战士，赛文之子',
      skill: '赛罗集束光线',
      isFree: true,
      origin: '超银河传说'
    },
    { 
      id: 3, 
      name: '泰迦奥特曼', 
      color: '#ff3366',
      secondaryColor: '#ffcc00',
      image: '⚡',
      desc: '泰罗之子，新生代英雄',
      skill: '斯特利姆爆裂',
      isFree: true,
      origin: '泰迦奥特曼 TV 版'
    },
    
    // === 付费解锁角色 ===
    { 
      id: 4, 
      name: '泽塔奥特曼', 
      color: '#9933ff',
      secondaryColor: '#ff6600',
      image: '🌟',
      desc: '赛罗徒弟，宇宙拳法',
      skill: '泽斯蒂姆光线',
      isFree: false,
      origin: '泽塔奥特曼 TV 版'
    },
    { 
      id: 5, 
      name: '初代奥特曼', 
      color: '#ff3333',
      secondaryColor: '#cccccc',
      image: '👨‍🚀',
      desc: '宇宙英雄，第一位奥特曼',
      skill: '斯派修姆光线',
      isFree: false,
      origin: '奥特曼 TV 版 (1966)'
    },
    { 
      id: 6, 
      name: '杰克奥特曼', 
      color: '#ff6666',
      secondaryColor: '#999999',
      image: '🦸',
      desc: '归来的奥特曼',
      skill: '奥特火花',
      isFree: false,
      origin: '归来的奥特曼'
    },
    { 
      id: 7, 
      name: '艾斯奥特曼', 
      color: '#ff3333',
      secondaryColor: '#6699ff',
      image: '⭐',
      desc: '光线之王',
      skill: '梅塔利姆光线',
      isFree: false,
      origin: '艾斯奥特曼 TV 版'
    },
    { 
      id: 8, 
      name: '梦比优斯奥特曼', 
      color: '#ff9933',
      secondaryColor: '#333333',
      image: '🔥',
      desc: '爱迪之子，GUYS 队员',
      skill: '梦比姆射线',
      isFree: false,
      origin: '梦比优斯奥特曼'
    }
  ],

  // 怪兽角色（免费 2 个 + 付费 4 个）
  monsters: [
    // === 免费角色 ===
    { 
      id: 1, 
      name: '哥莫拉', 
      color: '#886644',
      secondaryColor: '#ff6600',
      image: '🦖',
      desc: '古代怪兽，超振动波',
      skill: '超振动波',
      isFree: true,
      origin: '奥特曼 TV 版'
    },
    { 
      id: 2, 
      name: '巴尔坦星人', 
      color: '#66cc66',
      secondaryColor: '#993300',
      image: '👽',
      desc: '宇宙忍者，分身术',
      skill: '巴尔坦光束',
      isFree: true,
      origin: '奥特曼 TV 版'
    },
    
    // === 付费解锁角色 ===
    { 
      id: 3, 
      name: '杰顿', 
      color: '#ffaa00',
      secondaryColor: '#333333',
      image: '👾',
      desc: '最强怪兽，一兆度火球',
      skill: '一兆度火球',
      isFree: false,
      origin: '奥特曼 TV 版 (最终 BOSS)'
    },
    { 
      id: 4, 
      name: '贝利亚', 
      color: '#990000',
      secondaryColor: '#333333',
      image: '😈',
      desc: '黑暗奥特曼，终极战斗仪',
      skill: '帝斯修姆光线',
      isFree: false,
      origin: '宇宙英雄之超银河传说'
    },
    { 
      id: 5, 
      name: '艾雷王', 
      color: '#ffff66',
      secondaryColor: '#666666',
      image: '🐉',
      desc: '放电龙，电流攻击',
      skill: '放电攻击',
      isFree: false,
      origin: '赛文奥特曼 TV 版'
    },
    { 
      id: 6, 
      name: '庞顿', 
      color: '#cc3300',
      secondaryColor: '#663300',
      image: '👹',
      desc: '火焰怪兽，火焰攻击',
      skill: '火焰放射',
      isFree: false,
      origin: '赛文奥特曼 TV 版'
    }
  ],

  // 角色解锁价格
  unlockPrices: {
    allUltramen: 600,      // 解锁全部奥特曼 6 元
    allMonsters: 300,      // 解锁全部怪兽 3 元
    bundle: 1200,          // 完整版 12 元（省 25%）
    singleCharacter: 200   // 单个角色 2 元
  }
}
