export interface Option {
  race: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
}

// 种族内部标识（与算法保持一致）
// elf=阿莎娜(精灵), beast=玛瑞维(兽人), mer=蒙佩洛(人鱼), ghost=迪蒙特(鬼族), dwarf=多瑞斯(矮人), human=伊亚迪克(人类)
export const RACES = ['elf', 'beast', 'mer', 'ghost', 'dwarf', 'human'] as const;

export const RACE_NAMES: Record<string, { name: string; display: string }> = {
  elf: { name: '阿莎娜', display: '精灵' },
  beast: { name: '玛瑞维', display: '兽人' },
  mer: { name: '蒙佩洛', display: '人鱼' },
  ghost: { name: '迪蒙特', display: '鬼族' },
  dwarf: { name: '多瑞斯', display: '矮人' },
  human: { name: '伊亚迪克', display: '人类' },
};

export const RACE_COLORS: Record<string, string> = {
  elf: '#6B9BD1',
  beast: '#D98C3F',
  mer: '#5BA8A0',
  ghost: '#8B6DB1',
  dwarf: '#A0785A',
  human: '#888888',
};

export const questions: Question[] = [
  {
    id: 1,
    text: '整理旧相册，发现自己最常拍的一类照片是',
    options: [
      { race: 'elf', text: '天空、晚霞、高处俯瞰的街景，以及"这张构图很有自由的感觉"的废片' },
      { race: 'beast', text: '和朋友的合照，尤其是损友的丑照重点收藏' },
      { race: 'mer', text: '家族聚餐大合照、老照片翻拍、或者"这个场景好像我奶奶说的那个故事"' },
      { race: 'ghost', text: '精心布置的书桌一角、阳台植物、或者只有自己觉得好看的光影，基本不拍人' },
    ],
  },
  {
    id: 2,
    text: '逛超市时，你最容易被什么打动而买单',
    options: [
      { race: 'elf', text: '包装好看的新口味气泡水，或者"限定款"三个字，哪怕家里还有三瓶' },
      { race: 'beast', text: '在零食区和生鲜区之间来回走了三趟，最后买了计划外的所有东西，因为"看起来都好吃"' },
      { race: 'mer', text: '奶奶/妈妈常用的那个老牌子，虽然旁边新品在促销，但"这个我知根知底"' },
      { race: 'dwarf', text: '为了某个特定菜谱精确采购，清单上的东西必须买齐，少一样就浑身难受' },
    ],
  },
  {
    id: 3,
    text: '你最喜欢哪种周末打开方式',
    options: [
      { race: 'elf', text: '早起去城市最高点看日出，然后随机探索一条没走过的小巷' },
      { race: 'beast', text: '约好了朋友一起出去玩，顺利汇合但随便找了个舒服的地方一起刷手机结束了一天' },
      { race: 'mer', text: '按惯例周六大扫除、周日家庭聚餐，规律让人安心' },
      { race: 'human', text: '睡到自然醒，看心情决定今天干嘛，可能躺一天也可能突然出门' },
    ],
  },
  {
    id: 4,
    text: '你要布置自己的房间，最看重什么',
    options: [
      { race: 'elf', text: '开阔的视野和良好的采光，最好有能看天空的窗户，植物要放在高处' },
      { race: 'beast', text: '看到别人的好物/风格推荐就想要同款，最后变成了超级混搭风' },
      { race: 'ghost', text: '隐私感第一，遮光窗帘、隔音棉、香薰，打造一个外人进不来的结界' },
      { race: 'dwarf', text: '功能性优先，每个区域有明确用途，书桌就是书桌，床就是床，不混搭' },
    ],
  },
  {
    id: 5,
    text: '你最喜欢什么类型的电影/剧集',
    options: [
      { race: 'elf', text: '公路片、冒险片，主角一直在路上，风景绝美，结局开放' },
      { race: 'beast', text: '看正剧不看，但各种电影、电视剧解说一个不落' },
      { race: 'ghost', text: '一个人看的文艺片或悬疑片，不需要和人讨论，看完自己消化' },
      { race: 'human', text: '什么类型都看，最近流行什么看什么，不挑' },
    ],
  },
  {
    id: 6,
    text: '朋友约你吃一家很火但排队两小时的网红餐厅',
    options: [
      { race: 'elf', text: '查好非高峰时段，规划好周边可以逛的店，把排队变成城市探索' },
      { race: 'beast', text: '能点他家外卖的话就不出去受罪了' },
      { race: 'dwarf', text: '提前拿号，排队期间背单词/看书，绝不浪费时间，吃完写详细评价' },
      { race: 'human', text: '走到哪吃到哪，看到什么吃什么，网红店？随缘吧' },
    ],
  },
  {
    id: 7,
    text: '如果要养宠物，你最可能选择',
    options: [
      { race: 'elf', text: '养鸟，或者能高处活动的宠物，每天看着它飞觉得心情开阔' },
      { race: 'mer', text: '养金鱼/乌龟，安静好打理' },
      { race: 'ghost', text: '养猫，独立不粘人，不需要遛，各自有空间，偶尔互相陪伴' },
      { race: 'dwarf', text: '养狗，每天固定时间遛，训练指令，五年如一日，这就是我们之间的羁绊啊布鲁斯！' },
    ],
  },
  {
    id: 8,
    text: '你发朋友圈/社交动态的频率是',
    options: [
      { race: 'elf', text: '不定期，但每条都是精心构图的风景或感悟，像个人杂志' },
      { race: 'mer', text: '节假日和家族纪念日必发，内容固定，长辈看了都点赞' },
      { race: 'ghost', text: '几乎不发，偶尔发也是仅自己可见，或者三天可见' },
      { race: 'human', text: '想到什么发什么，上周的梗这周还在发，但自己很开心' },
    ],
  },
  {
    id: 9,
    text: '排队时前面有人吵架，你会',
    options: [
      { race: 'elf', text: '竖起耳朵吃瓜，但保持安全距离，随时准备撤离' },
      { race: 'mer', text: '想起"闲事少管"，低头玩手机，怕波及自己' },
      { race: 'dwarf', text: '如果影响队伍前进就出面调解，快速解决问题，恢复秩序' },
      { race: 'human', text: '看热闹，或者走开，取决于当时有没有急事' },
    ],
  },
  {
    id: 10,
    text: '你喝咖啡/茶的习惯是',
    options: [
      { race: 'elf', text: '喜欢尝试各种特调、手冲、产地豆，像品酒一样研究风味' },
      { race: 'ghost', text: '固定喝一种，每天同一时段，同一杯子，不接受新品推荐' },
      { race: 'dwarf', text: '为了提神而喝，不追求口感' },
      { race: 'human', text: '奶茶也行咖啡也行白开水也行，渴了喝啥都行' },
    ],
  },
  {
    id: 11,
    text: '团队作业/项目里，你通常扮演什么角色',
    options: [
      { race: 'beast', text: '粘合剂，能照顾到每个人的情绪，但自己不愿意去当担责的负责人' },
      { race: 'mer', text: '顾问，提供经验参考，提醒团队别踩坑，但不主动出头' },
      { race: 'ghost', text: '独立执行者，领到自己的任务就闷头做，少开会少讨论' },
      { race: 'dwarf', text: '推进者，制定时间节点，催进度，确保项目按时交付' },
    ],
  },
  {
    id: 12,
    text: '朋友深夜打电话倾诉感情问题',
    options: [
      { race: 'beast', text: '陪他聊到凌晨五点，既安慰他又帮他分析，最后自己失眠了' },
      { race: 'mer', text: '先听，然后分享"我当年也遇到过类似的事，后来……"' },
      { race: 'ghost', text: '设定一个时间界限，比如"我陪你聊半小时"，到点就挂' },
      { race: 'human', text: '听着，偶尔附和，最后说"别想太多，睡吧"，然后自己睡觉' },
    ],
  },
  {
    id: 13,
    text: '买礼物给朋友，你会',
    options: [
      { race: 'beast', text: '挑了十样都觉得不错，最后买了三样，让朋友自己选' },
      { race: 'mer', text: '送实用的、有纪念意义的' },
      { race: 'dwarf', text: '根据对方的需求精确购买，确保礼物被用到，不浪费' },
      { race: 'human', text: '看到什么买什么，或者干脆发红包，省事' },
    ],
  },
  {
    id: 14,
    text: '遇到街头问卷调查',
    options: [
      { race: 'beast', text: '不好意思拒绝，填了十分钟，最后买了对方推销的产品' },
      { race: 'ghost', text: '摆手说"没时间"，径直走过，不留余地' },
      { race: 'dwarf', text: '如果感兴趣就认真填，不感兴趣就直接说"不填"，不浪费彼此时间' },
      { race: 'human', text: '看心情，有时候填有时候不填，看对方态度' },
    ],
  },
  {
    id: 15,
    text: '睡前最后一件事通常是',
    options: [
      { race: 'mer', text: '检查门窗、设定闹钟、把明天要穿的衣服摆好，按部就班' },
      { race: 'ghost', text: '调暗灯光，点香薰，做十分钟冥想，然后关机睡觉' },
      { race: 'dwarf', text: '回顾今天完成的事项，在清单上打勾，规划明天任务' },
      { race: 'human', text: '刷手机刷到睡着，或者突然想起来某件事然后爬起来做' },
    ],
  },
  {
    id: 16,
    text: '选择餐厅座位，你偏好',
    options: [
      { race: 'elf', text: '靠窗、视野开阔、能看到外面风景的位置' },
      { race: 'beast', text: '方便移动的中间区域，来来回回走动方便' },
      { race: 'mer', text: '靠墙、有安全感、熟悉的位置，如果常去就固定坐同一个' },
      { race: 'ghost', text: '角落、安静、不被打扰，最好背靠墙面对入口' },
    ],
  },
  {
    id: 17,
    text: '面对即将到来的 deadline',
    options: [
      { race: 'elf', text: '提前完成但不断修改完善，最后一刻还在调整细节' },
      { race: 'beast', text: '时间还早……还早……还早……最后三天通宵，边做边骂自己' },
      { race: 'dwarf', text: '倒排工期，每天完成固定进度，提前三天交付，留缓冲时间' },
      { race: 'human', text: 'deadline？什么玩意……我去！最后只能交出半成品，并且做好了挨骂的充分准备' },
    ],
  },
  {
    id: 18,
    text: '老朋友突然联系你，你会',
    options: [
      { race: 'mer', text: '热情回应，聊起往事，但心里感觉"TA 是不是有事找我"' },
      { race: 'ghost', text: '礼貌回复，但保持边界，不立刻深聊，看对方意图' },
      { race: 'dwarf', text: '直接问"有什么事吗？"，高效沟通，不绕弯子' },
      { race: 'human', text: '开心聊天，约饭约酒，像以前一样' },
    ],
  },
];
