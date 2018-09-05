

export default {
  // 环境切换
  // 正式环境:official;测试环境:beta;本地环境:local
  versionControl: 'official', 
  tabTitles: [
    {
      title: '音乐'
    },
    {
      title: '专辑'
    },
    {
      title: '部落'
    },
    {
      title: '用户'
    },
    {
      title: '活动'
    },
    {
      title: '话题'
    }
  ],
  clubTag:[
    {
      title: '话题'
    },
    {
      title: '活动'
    },
    {
      title: '签到榜'
    },
    {
      title: '音乐'
    },
    {
      title: '视频'
    },
    {
      title: '相册'
    }
  ],
  tabBusiness:[
      {
        title: '单曲'
      },
      {
        title: '专辑'
      }
  ],
  tabNavBottom:[
    {
      title: '首页',
      icon: 'http://172.21.10.23:30111/home.png',
      activeIcon: 'http://172.21.10.23:30111/home-active.png'
    },
    {
      title: '发行',
      icon: 'http://172.21.10.23:30111/music.png',
      activeIcon: 'http://172.21.10.23:30111/music-active.png'
    },
    {
      title: '',
      icon: 'http://172.21.10.23:30111/icon-mid.png'
    },
    {
      title: '消息',
      icon: 'http://172.21.10.23:30111/message.png',
      activeIcon: 'http://172.21.10.23:30111/message-active.png',
      badge: 5
    },
    {
      title: '我的地盘',
      icon: 'http://172.21.10.23:30111/my.png',
      activeIcon: 'http://172.21.10.23:30111/my-active.png',
      dot: true
    }
  ],
  tabStyles: {
    bgColor: '#FFFFFF',
    titleColor: '#666666',
    activeTitleColor: '#EE1C41',
    activeBgColor: '#FFFFFF',
    isActiveTitleBold: true,
    iconWidth: 70,
    iconHeight: 70,
    width: 140,
    height: 72,
    fontSize: 30,
    hasActiveBottom: true,
    activeBottomColor: '#EE1C41',
    activeBottomHeight: 6,
    activeBottomWidth: 36,
    textPaddingLeft: 20,
    textPaddingRight: 20
  },
  tabStyles5: {
    bgColor: '#FFFFFF',
    titleColor: '#666666',
    activeTitleColor: '#EE1C41',
    activeBgColor: '#FFFFFF',
    isActiveTitleBold: true,
    iconWidth: 70,
    iconHeight: 70,
    width: 125,
    height: 72,
    fontSize: 30,
    hasActiveBottom: true,
    activeBottomColor: '#EE1C41',
    activeBottomHeight: 6,
    activeBottomWidth: 36,
    textPaddingLeft: 20,
    textPaddingRight: 20
  },
  tabStyles2: {
    bgColor: '#FFFFFF',
    titleColor: '#666666',
    activeTitleColor: '#EE1C41',
    activeBgColor: '#FFFFFF',
    isActiveTitleBold: true,
    leftOffset:240,
    iconWidth: 70,
    iconHeight: 70,
    width: 140,
    height: 72,
    fontSize: 30,
    hasActiveBottom: true,
    activeBottomColor: '#EE1C41',
    activeBottomHeight: 6,
    activeBottomWidth: 36,
    textPaddingLeft: 20,
    textPaddingRight: 20
  },
  tabStyles3: {
      bgColor: '#FFFFFF',
      titleColor: '#666666',
      activeTitleColor: '#EE1C41',
      activeBgColor: '#FFFFFF',
      isActiveTitleBold: true,
      iconWidth: 70,
      iconHeight: 70,
      width: 375,
      height: 72,
      fontSize: 28,
      hasActiveBottom: true,
      activeBottomColor: '#EE1C41',
      activeBottomHeight: 6,
      activeBottomWidth: 36,
      textPaddingLeft: 20,
      textPaddingRight: 20
    },
    tabStyles4: {
    bgColor: '#FFFFFF',
    titleColor: '#666666',
    activeTitleColor: '#EE1C41',
    activeBgColor: '#FFFFFF',
    isActiveTitleBold: true,
    iconWidth: 70,
    iconHeight: 70,
    width: 375,
    height: 72,
    fontSize: 30,
    hasActiveBottom: true,
    activeBottomColor: '#EE1C41',
    activeBottomHeight: 6,
    activeBottomWidth: 70,
    textPaddingLeft: 20,
    textPaddingRight: 20
  },
  // 使用 iconfont 模式的tab title配置
  tabIconFontTitles: [
    {
      title: '首页',
      codePoint: '\ue623'
    },
    {
      title: '特别推荐',
      codePoint: '\ue608'
    },
    {
      title: '消息中心',
      codePoint: '\ue752',
      badge: 5
    },
    {
      title: '我的主页',
      codePoint: '\ue601',
      dot: true
    }
  ],
  tabIconFontStyles: {
    bgColor: '#FFFFFF',
    titleColor: '#666666',
    activeTitleColor: '#3D3D3D',
    activeBgColor: '#FFFFFF',
    isActiveTitleBold: true,
    width: 160,
    height: 120,
    fontSize: 24,
    textPaddingLeft: 10,
    textPaddingRight: 10,
    iconFontSize: 50,
    iconFontColor: '#333333',
    activeIconFontColor: 'red',
    iconFontUrl: '//at.alicdn.com/t/font_501019_mauqv15evc1pp66r.ttf'
  }
}