import {
  WxcLoading
} from 'weex-ui';
import {
  getAccount,
  startNewWebView,
  startNewWEeexView,
  toLogin,
  getUser,
  setMiniPlayerHidden
} from '../api/weex'
import {
  putUrlLog
} from '../api/userInfo';
import config from '../utils/config'
const storage = weex.requireModule("storage");
const dom = weex.requireModule("dom");
const navigator = weex.requireModule("navigator");
const modal = weex.requireModule("modal");


export default {
  data() {
    return {
      wUrl: weex.config.bundleUrl,
      downUrl: "http://www.myyule.com/app/down",
      imgSrc: 'http://media2.myyule.cn/',
      imgUrl: '',
      commonUrl: '',
      weexUrl: '',
      isShow: false,
      mobile: getUser().mobile,
      source: weex.config.env.platform,
      versionControl: 'beta', // 正式环境:official;测试环境:beta;本地环境:local
      version: '',
      webVersion: (weex.config.env.platform == 'Web')?true:false // 分享web页面
    }
  },
  components: {
    WxcLoading
  },
  created() {
    if (config.versionControl === 'official') {
      // 正式环境
      this.commonUrl = 'https://myyule.teamshub.com/'
      this.weexUrl = this.commonUrl + 'weexMyl/index'
      this.version = getAccount().appDevVersion + '(1.4.13)'
      this.imgUrl = 'https://myyule.teamshub.com/web-icon/'
    } else if (config.versionControl === 'beta') {
      //测试环境
      this.commonUrl = 'https://testmyyule.teamshub.com/'
      this.weexUrl = this.commonUrl + 'weexMyl/index'
      this.version = getAccount().appDevVersion + '(1.3.13)'
      this.imgUrl = 'https://testmyyule.teamshub.com/web-icon/'
    } else {
      // 本地
      this.commonUrl = 'http://172.26.101.12:8081/'
      this.weexUrl = this.commonUrl + 'dist'
      this.mobile = '9EFC7F96C52DEA4FB234765796F96B4A' //本地测试
      this.imgUrl = 'https://testmyyule.teamshub.com/web-icon/'
    }
  },
  methods: {
    // 图标字体
    fontIcon() {
      var domModule = weex.requireModule("dom");
      if (config.versionControl === 'official') {
        domModule.addRule("fontFace", {
          fontFamily: "iconfont",
          src: "url('https://myyule.teamshub.com/web-icon/font/font_580422_62vodh0mkakyb9.ttf')"
        });
      } else {
        domModule.addRule("fontFace", {
          fontFamily: "iconfont",
          src: "url('https://testmyyule.teamshub.com/web-icon/font/font_580422_62vodh0mkakyb9.ttf')"
        });
      }
    },
    // 请求地址记录
    putPageUrlLog(code) {
      putUrlLog({
        addressCode: code,
        pageVersion: this.version,
        urlType: 1,
        mobile: this.mobile
      }, {
        token: this.mobile
      }).then(res => {
        if (res.status == 0) {
          console.log('成功')
        } else {
          // modal.alert({message:res.desc})
          console.log(res.desc)
        }
      }).catch()
    },
    //weexjs地址跳转接参
    wjump() {
      var url = weex.config.bundleUrl; //获取url中"?"符后的字串    
      if (url.indexOf("?") != -1) {
        var str = url.substr(url.indexOf("?") + 1);
        var param = str.split("=")[1];
        //2.解密  
        return base64Decode(param);
        //storage.setItem("data", wParam);
      }
    },
    // 发布时间
    noticeTime(date) {
      let itime = new Date().getTime();
      let etime = new Date(date.replace(new RegExp(/-/gm), "/")).getTime();
      var total = parseInt((itime - etime) / 1000); //取得秒数
      var mouth = parseInt(total / (24 * 60 * 60 * 12)); //计算整数月数
      var day = parseInt(total / (24 * 60 * 60)); //计算整数天数
      var hour = parseInt(total / (60 * 60)); //计算整数小时数
      var minute = parseInt(total / 60); //计算整数分钟数
      if (Math.abs(total) < 60) {
        return Math.abs(total) + "秒前"
      } else if (Math.abs(minute) < 60) {
        return Math.abs(minute) + "分钟前"
      } else if (Math.abs(hour) < 24) {
        return Math.abs(hour) + "小时前"
      } else if (Math.abs(day) < 30) {
        return Math.abs(day) + "天前"
      } else if (Math.abs(mouth) < 12) {
        return Math.abs(mouth) + "月前";
      } else if (Math.abs(day) >= 365) {
        return Math.abs(day) / 365 + "年前";
      }
    },
    // 动态高度适配(动态，活动，话题)
    adapterHeight(array, type) {
      console.log('adapterHeight')
      let activityNum = 0
      let topicShortNum = 0
      let topicLongNum = 0
      let height = 0
      array.forEach(value => {
        if (value.resType == 'activity' || type == 'activity') {
          activityNum++
        } else if (value.resType == 'topic' || type == 'topic') {
          if ((value.resData ? value.resData : value).images.length == 0) {
            topicShortNum++
          } else {
            topicLongNum++
          }
        }
      })
      console.log(761 * activityNum + 652 * topicLongNum + 427 * topicShortNum)
      return height = 761 * activityNum + 652 * topicLongNum + 427 * topicShortNum;
    },
    // 显示min播放器
    miniShow() {
      // modal.toast({message:'NO'})
      setMiniPlayerHidden("NO");

    },
    //隐藏min播放器
    miniHidder() {
      // modal.toast({message:'YES'})
      setMiniPlayerHidden('YES')
    },
    // 跳转新weex页面  一级跳二级
    push(path, paramValue) {
      const toUrl = weex.config.bundleUrl.split('/').slice(0, -1).join('/') + path + '.js' // 将a.js的绝对地址转为b.js的绝对地址
      console.log(toUrl)
      // modal.alert({message:toUrl})
      storage.setItem("data", JSON.stringify(paramValue));
      if (!this.webVersion) {
        startNewWEeexView(toUrl)
      } else {
        weex.requireModule('navigator').push({
          url: toUrl,
          animated: 'true'
        })
      }
    },
    // 跳转新weex页面  二级跳到兄弟页面;或上级的兄弟
    push2(path, paramValue) {
      let toUrl = this.weexUrl + path + '.js'
      // console.log(toUrl)
      storage.setItem("data", JSON.stringify(paramValue));
      if (!this.webVersion) {
        startNewWEeexView(toUrl)
      } else {
        console.log('这是站外分享')
        // 站外分享
        window.location.href = this.downUrl
      }

    },
    pushTest() {
      const toUrl = 'https://myyule.teamshub.com/xxtest/index-pop1.js'
      // modal.alert({message:toUrl})
      startNewWEeexView(toUrl)
    },
    pop() {
      // 发送返回通知
      // const channel = new BroadcastChannel('backFlesh')
      // channel.postMessage(JSON.stringify({static:'backFlesh'}));
      navigator.pop({
        animated: 'true'
      })
    },
    pop2() {
      storage.setItem('reflesh', 1)
      navigator.pop({
        animated: 'true'
      })
    },
    // 站外分享点击事件处理
    shareEvent() {
      if (this.webVersion) {
        console.log('这是站外分享')
        // 站外分享
        window.location.href = this.downUrl
        return;
      }
    },
    webParam() {
      let wUrl = weex.config.bundleUrl //获取url中"?"符后的字串
      let paramName = {};
      let paramJson = '';
      if (wUrl.indexOf("?") != -1) {
        //weexjs地址接参方式
        paramJson = {};
        let str = wUrl.substr(wUrl.indexOf("?") + 1);
        let param = str.split("&");
        for (let i = 0; i < param.length; i++) { //遍历参数数组
          paramName = param[i].split("=");
          paramJson[paramName[0]] = paramName[1];
        }
        return paramJson;
      } else {
        return paramJson;
      }
    },
    millionNum(number){
      if (number>9999){
        return Math.round((number/10000) * 10)/10
      }else{
        return number
      }
    }
  }
}