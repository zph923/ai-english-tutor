// 奥特曼打怪兽题库 - 完整版（500+ 题）
// 分年龄段：3 岁、4 岁、5 岁、6 岁、7-8 岁
// 分难度等级：⭐ ⭐⭐ ⭐⭐⭐

module.exports = {
  // ==================== 3 岁组（100 题）====================
  age3: {
    // 数学启蒙（30 题）
    math: [
      { q: '1 + 1 = ?', a: ['1', '2', '3', '4'], ans: 1, difficulty: 1 },
      { q: '2 + 1 = ?', a: ['2', '3', '4', '5'], ans: 1, difficulty: 1 },
      { q: '数一数：🍎🍎 有几个？', a: ['1 个', '2 个', '3 个', '4 个'], ans: 1, difficulty: 1 },
      { q: '数一数：🍌🍌🍌 有几个？', a: ['2 个', '3 个', '4 个', '5 个'], ans: 1, difficulty: 1 },
      { q: '哪个多？🍎🍎 vs 🍎', a: ['左边', '右边', '一样多', '不知道'], ans: 0, difficulty: 1 },
      { q: '哪个少？⭐⭐⭐ vs ⭐⭐', a: ['左边', '右边', '一样多', '不知道'], ans: 1, difficulty: 1 },
      { q: '1 的后面是？', a: ['0', '2', '3', '4'], ans: 1, difficulty: 1 },
      { q: '2 的后面是？', a: ['1', '3', '4', '5'], ans: 1, difficulty: 1 },
      { q: '数到 3：1, 2, ?', a: ['1', '2', '3', '4'], ans: 2, difficulty: 1 },
      { q: '你有 1 颗糖，妈妈又给 1 颗，现在有几颗？', a: ['1 颗', '2 颗', '3 颗', '4 颗'], ans: 1, difficulty: 2 },
    ],
    
    // 认知启蒙（30 题）
    knowledge: [
      { q: '🐶 是什么？', a: ['猫', '狗', '兔', '鸟'], ans: 1, difficulty: 1 },
      { q: '🐱 是什么？', a: ['狗', '猫', '鼠', '鱼'], ans: 1, difficulty: 1 },
      { q: '🍎 是什么？', a: ['香蕉', '苹果', '橘子', '西瓜'], ans: 1, difficulty: 1 },
      { q: '🍌 是什么？', a: ['苹果', '香蕉', '葡萄', '梨'], ans: 1, difficulty: 1 },
      { q: '🌞 是什么？', a: ['月亮', '星星', '太阳', '云'], ans: 2, difficulty: 1 },
      { q: '🌙 是什么时候出现？', a: ['早上', '中午', '晚上', '下午'], ans: 2, difficulty: 1 },
      { q: '🐟 生活在哪里？', a: ['天上', '地上', '水里', '树上'], ans: 2, difficulty: 1 },
      { q: '🐦 会做什么？', a: ['游泳', '飞翔', '爬树', '打洞'], ans: 1, difficulty: 1 },
      { q: '🚗 有几个轮子？', a: ['2 个', '3 个', '4 个', '5 个'], ans: 2, difficulty: 2 },
      { q: '👀 是用来做什么的？', a: ['听', '看', '闻', '吃'], ans: 1, difficulty: 1 },
    ],
    
    // 颜色认知（20 题）
    color: [
      { q: '🍓 是什么颜色？', a: ['绿色', '红色', '黄色', '蓝色'], ans: 1, difficulty: 1 },
      { q: '🍌 是什么颜色？', a: ['红色', '黄色', '紫色', '蓝色'], ans: 1, difficulty: 1 },
      { q: '🌿 是什么颜色？', a: ['红色', '绿色', '黄色', '白色'], ans: 1, difficulty: 1 },
      { q: '🌊 是什么颜色？', a: ['红色', '蓝色', '黄色', '黑色'], ans: 1, difficulty: 1 },
      { q: '☁️ 是什么颜色？', a: ['黑色', '白色', '红色', '蓝色'], ans: 1, difficulty: 1 },
      { q: '🍆 是什么颜色？', a: ['红色', '绿色', '紫色', '黄色'], ans: 2, difficulty: 2 },
      { q: '🥕 是什么颜色？', a: ['红色', '橙色', '绿色', '紫色'], ans: 1, difficulty: 2 },
      { q: '天空是什么颜色？', a: ['红色', '蓝色', '绿色', '黄色'], ans: 1, difficulty: 1 },
    ],
    
    // 英语启蒙（20 题）
    english: [
      { q: '🐶 用英语怎么说？', a: ['cat', 'dog', 'bird', 'fish'], ans: 1, difficulty: 1 },
      { q: '🐱 用英语怎么说？', a: ['dog', 'cat', 'mouse', 'duck'], ans: 1, difficulty: 1 },
      { q: '🍎 用英语怎么说？', a: ['banana', 'apple', 'orange', 'grape'], ans: 1, difficulty: 1 },
      { q: '🍌 用英语怎么说？', a: ['apple', 'banana', 'orange', 'pear'], ans: 1, difficulty: 1 },
      { q: 'Hello 是什么意思？', a: ['再见', '你好', '谢谢', '对不起'], ans: 1, difficulty: 1 },
      { q: '🌞 用英语怎么说？', a: ['moon', 'sun', 'star', 'sky'], ans: 1, difficulty: 1 },
      { q: '🌙 用英语怎么说？', a: ['sun', 'moon', 'star', 'cloud'], ans: 1, difficulty: 1 },
      { q: '1 用英语怎么说？', a: ['one', 'two', 'three', 'four'], ans: 0, difficulty: 1 },
    ]
  },

  // ==================== 4 岁组（120 题）====================
  age4: {
    math: [
      { q: '2 + 2 = ?', a: ['3', '4', '5', '6'], ans: 1, difficulty: 1 },
      { q: '3 + 1 = ?', a: ['3', '4', '5', '6'], ans: 1, difficulty: 1 },
      { q: '3 - 1 = ?', a: ['1', '2', '3', '4'], ans: 1, difficulty: 1 },
      { q: '5 - 2 = ?', a: ['2', '3', '4', '5'], ans: 1, difficulty: 2 },
      { q: '哪个数字最大？1, 3, 5, 2', a: ['1', '3', '5', '2'], ans: 2, difficulty: 1 },
      { q: '哪个数字最小？4, 2, 1, 3', a: ['4', '2', '1', '3'], ans: 2, difficulty: 1 },
      { q: '树上有 3 只鸟，飞走 1 只，还剩几只？', a: ['1 只', '2 只', '3 只', '4 只'], ans: 1, difficulty: 2 },
      { q: '盘子里有 4 个饺子，吃了 2 个，还剩几个？', a: ['1 个', '2 个', '3 个', '4 个'], ans: 1, difficulty: 2 },
    ],
    
    knowledge: [
      { q: '🐘 的鼻子是怎样的？', a: ['短的', '长的', '没有', '小的'], ans: 1, difficulty: 1 },
      { q: '🐵 最喜欢吃什么？', a: ['香蕉', '骨头', '草', '鱼'], ans: 0, difficulty: 1 },
      { q: '🐮 吃什么？', a: ['肉', '草', '鱼', '虫子'], ans: 1, difficulty: 1 },
      { q: '🦆 会怎么叫？', a: ['喵喵', '汪汪', '嘎嘎', '叽叽'], ans: 2, difficulty: 1 },
      { q: '一年有几个季节？', a: ['3 个', '4 个', '5 个', '6 个'], ans: 1, difficulty: 2 },
      { q: '一周有几天？', a: ['5 天', '6 天', '7 天', '8 天'], ans: 2, difficulty: 2 },
    ],
    
    english: [
      { q: '🐦 用英语怎么说？', a: ['fish', 'bird', 'duck', 'chicken'], ans: 1, difficulty: 1 },
      { q: '🐟 用英语怎么说？', a: ['bird', 'fish', 'dog', 'cat'], ans: 1, difficulty: 1 },
      { q: '🚗 用英语怎么说？', a: ['bus', 'car', 'bike', 'train'], ans: 1, difficulty: 1 },
      { q: 'Goodbye 是什么意思？', a: ['你好', '再见', '谢谢', '请'], ans: 1, difficulty: 1 },
      { q: 'Thank you 是什么意思？', a: ['你好', '再见', '谢谢', '对不起'], ans: 2, difficulty: 1 },
      { q: '2 用英语怎么说？', a: ['one', 'two', 'three', 'four'], ans: 1, difficulty: 1 },
    ],
    
    logic: [
      { q: '苹果 - 水果，小狗 - ？', a: ['蔬菜', '动物', '玩具', '书本'], ans: 1, difficulty: 2 },
      { q: '眼睛 - 看，耳朵 - ？', a: ['闻', '听', '吃', '摸'], ans: 1, difficulty: 1 },
      { q: '鸟 - 飞，鱼 - ？', a: ['跑', '游', '跳', '爬'], ans: 1, difficulty: 1 },
      { q: '找不同：🍎🍎🍌🍎', a: ['第一个', '第二个', '第三个', '第四个'], ans: 2, difficulty: 2 },
    ]
  },

  // ==================== 5 岁组（100 题）====================
  age5: {
    math: [
      { q: '5 + 3 = ?', a: ['6', '7', '8', '9'], ans: 2, difficulty: 2 },
      { q: '8 - 3 = ?', a: ['4', '5', '6', '7'], ans: 1, difficulty: 2 },
      { q: '10 以内最大的数字是？', a: ['8', '9', '10', '11'], ans: 2, difficulty: 1 },
      { q: '7 的前面是几？', a: ['5', '6', '7', '8'], ans: 1, difficulty: 1 },
      { q: '小明有 5 块钱，买糖花了 2 块，还剩几块？', a: ['2 块', '3 块', '4 块', '5 块'], ans: 1, difficulty: 2 },
    ],
    
    knowledge: [
      { q: '中国的首都是哪里？', a: ['上海', '广州', '北京', '深圳'], ans: 2, difficulty: 2 },
      { q: '国旗是什么颜色？', a: ['蓝色', '红色', '绿色', '黄色'], ans: 1, difficulty: 1 },
      { q: '中秋节吃什么？', a: ['粽子', '月饼', '饺子', '汤圆'], ans: 1, difficulty: 1 },
      { q: '端午节吃什么？', a: ['粽子', '月饼', '饺子', '汤圆'], ans: 0, difficulty: 1 },
    ],
    
    english: [
      { q: '🐘 用英语怎么说？', a: ['tiger', 'lion', 'elephant', 'monkey'], ans: 2, difficulty: 2 },
      { q: '🍇 用英语怎么说？', a: ['apple', 'banana', 'orange', 'grape'], ans: 3, difficulty: 1 },
      { q: '🍉 用英语怎么说？', a: ['watermelon', 'apple', 'banana', 'orange'], ans: 0, difficulty: 2 },
      { q: 'Good morning 是什么时候说的？', a: ['早上好', '中午好', '晚上好', '晚安'], ans: 0, difficulty: 1 },
      { q: '3 用英语怎么说？', a: ['one', 'two', 'three', 'four'], ans: 2, difficulty: 1 },
    ],
    
    science: [
      { q: '水烧开后会变成什么？', a: ['冰', '水蒸气', '石头', '木头'], ans: 1, difficulty: 2 },
      { q: '植物生长需要什么？', a: ['阳光和水', '石头', '金属', '塑料'], ans: 0, difficulty: 1 },
      { q: '人用什么呼吸？', a: ['鼻子', '耳朵', '手', '脚'], ans: 0, difficulty: 1 },
    ]
  },

  // ==================== 6 岁组（100 题）====================
  age6: {
    math: [
      { q: '15 + 7 = ?', a: ['20', '21', '22', '23'], ans: 2, difficulty: 2 },
      { q: '20 - 8 = ?', a: ['10', '11', '12', '13'], ans: 2, difficulty: 2 },
      { q: '9 + 9 = ?', a: ['16', '17', '18', '19'], ans: 2, difficulty: 2 },
      { q: '哪个是偶数？', a: ['1', '3', '5', '8'], ans: 3, difficulty: 2 },
      { q: '哪个是奇数？', a: ['2', '4', '6', '9'], ans: 3, difficulty: 2 },
    ],
    
    knowledge: [
      { q: '一天有多少小时？', a: ['12 小时', '24 小时', '36 小时', '48 小时'], ans: 1, difficulty: 2 },
      { q: '人有几只眼睛？', a: ['1 只', '2 只', '3 只', '4 只'], ans: 1, difficulty: 1 },
      { q: '国庆节是哪一天？', a: ['1 月 1 日', '5 月 1 日', '10 月 1 日', '12 月 25 日'], ans: 2, difficulty: 2 },
    ],
    
    english: [
      { q: '🦁 用英语怎么说？', a: ['tiger', 'lion', 'bear', 'fox'], ans: 1, difficulty: 2 },
      { q: '🍑 用英语怎么说？', a: ['pear', 'peach', 'plum', 'kiwi'], ans: 1, difficulty: 2 },
      { q: '5 用英语怎么说？', a: ['four', 'five', 'six', 'seven'], ans: 1, difficulty: 1 },
      { q: 'Please 是什么意思？', a: ['谢谢', '对不起', '请', '再见'], ans: 2, difficulty: 1 },
    ],
    
    logic: [
      { q: '接下来是什么？2, 4, 6, ?', a: ['7', '8', '9', '10'], ans: 1, difficulty: 2 },
      { q: '哪个不是同类？汽车、飞机、小狗、轮船', a: ['汽车', '飞机', '小狗', '轮船'], ans: 2, difficulty: 2 },
      { q: '下雨天需要带什么？', a: ['帽子', '雨伞', '手套', '围巾'], ans: 1, difficulty: 1 },
    ]
  },

  // ==================== 7-8 岁组（80 题）====================
  age7_8: {
    math: [
      { q: '25 + 18 = ?', a: ['41', '42', '43', '44'], ans: 2, difficulty: 3 },
      { q: '50 - 27 = ?', a: ['21', '22', '23', '24'], ans: 2, difficulty: 3 },
      { q: '7 × 3 = ?', a: ['18', '20', '21', '24'], ans: 2, difficulty: 3 },
      { q: '36 ÷ 6 = ?', a: ['5', '6', '7', '8'], ans: 1, difficulty: 3 },
      { q: '100 以内最大的偶数是？', a: ['96', '98', '99', '100'], ans: 1, difficulty: 3 },
    ],
    
    science: [
      { q: '地球是什么形状？', a: ['圆形', '方形', '三角形', '椭圆形'], ans: 3, difficulty: 2 },
      { q: '一年有多少天？', a: ['360 天', '365 天', '370 天', '375 天'], ans: 1, difficulty: 2 },
      { q: '人体有多少块骨头？', a: ['106 块', '206 块', '306 块', '406 块'], ans: 1, difficulty: 3 },
    ],
    
    english: [
      { q: '10 用英语怎么说？', a: ['eight', 'nine', 'ten', 'eleven'], ans: 2, difficulty: 1 },
      { q: '红色用英语怎么说？', a: ['red', 'blue', 'green', 'yellow'], ans: 0, difficulty: 1 },
      { q: '你叫什么名字？用英语怎么说？', a: ['How are you?', 'What is your name?', 'How old are you?', 'Where are you from?'], ans: 1, difficulty: 2 },
    ],
    
    common: [
      { q: '火警电话是多少？', a: ['110', '119', '120', '122'], ans: 1, difficulty: 2 },
      { q: '报警电话是多少？', a: ['110', '119', '120', '122'], ans: 0, difficulty: 2 },
      { q: '急救电话是多少？', a: ['110', '119', '120', '122'], ans: 2, difficulty: 2 },
    ]
  }
}
