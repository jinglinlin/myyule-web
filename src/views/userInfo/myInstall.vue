<template>
   <div class="install" :style="{paddingTop:source==='iOS'?62:20+'px'}" @viewappear="getUser">
      <div class="install-title" >
            <text @click="pop()" class="iconfont back">&#xe625;</text>
            <text class="title-text iconfont">设置</text>
            <text style="width:44px"></text>
      </div>
      <div class="container">
        <div class="demo">
          <text class="demo-title">个人信息</text>
          <div @click="toMyInfo()" class="cell-info">
            <div class="userInfo">
              <image resize="cover" class="m-img" :src="'http://media2.myyule.cn/'+userData.icon" placeholder="http://www.myyule.com/images/head-02.jpg"></image>
              <div class="msg">
                <text class="user-name">{{userData.nickname}}</text>
                <text class="user-school">{{userData.schoolName}}</text>
                <text v-if="!userData.nickname" class="user-name">未登录</text>
              </div>
            </div>
            <wxc-icon name="more"></wxc-icon>
          </div>

        </div>

        <div class="demo">
        <text class="demo-title">通知</text>
          <wxc-cell title="通知"
                    :has-arrow="false"
                    :has-top-border="true">
            <switch v-if="source==='iOS'" slot="value" :checked="noticeStatus" @change="changeSatus()"></switch>
            <div v-if="source!=='iOS'" slot="value" @click="changeSatus()">
              <mySwitch :switchKey="noticeStatus"></mySwitch>
            </div>
          </wxc-cell>
        </div>

        <div class="demo">
        <text class="demo-title">系统</text>
          <wxc-cell title="清除缓存"
                    @wxcCellClicked="clean()"
                    :has-arrow="false"
                    :has-top-border="true">
            <text slot="value">{{sert}}KB</text>
          </wxc-cell>
          <wxc-cell title="意见反馈"
                    :has-arrow="false"
                    @wxcCellClicked="adivce()"
                    :has-top-border="true"></wxc-cell>
          <wxc-cell title="关于随身行"
                    :has-arrow="false"
                    @wxcCellClicked="push('/about','')"
                    :has-top-border="true"></wxc-cell>
        </div>
      </div>
   </div>
</template>
<script>
import { WxcCell, WxcIcon, WxcLoading } from "weex-ui";
import { getUserInfo } from "../../api/userInfo";
import { pop } from "../../utils";
import mixins from "../../mixins";
import mySwitch from './mySwitch.vue'
import { cleanAppCacheCallBack, setNotice, openChat } from "../../api/weex";
var modal = weex.requireModule("modal");
var storage = weex.requireModule("storage");
const yxLocationModal = weex.requireModule("MyyuleSet")
  ? weex.requireModule("MyyuleSet")
  : "";
export default {
  mixins: [mixins],
  components: { WxcCell, WxcIcon, WxcLoading,mySwitch },
  data() {
    return {
      userData: [],
      isShow: false,
      noticeStatus: false,
      sert: 0
    };
  },
  beforeCreate(){
    this.fontIcon();
  },
  created() {
    this.request();
    this.getUser();
    this.notice();
    // 获取缓存
    this.getCache();
  },
  mounted(){
    this.putPageUrlLog(1101)
  },
  methods: {
    // 获取用户信息
    getUser(){
        if(this.webParam()){
            this.userData = this.webParam().data;
        }else{
            storage.getItem("userData", event => {
                this.userData = JSON.parse(event.data);
                // modal.alert({message:JSON.parse(event.data).icon})
            });
        }

    },
    wxcCellClicked(e) {
      console.log(e);
    },
    // 获取缓存
    getCache() {
      const _this = this;
      yxLocationModal.getAppCacheCallBack(function(ret) {
        _this.sert = parseInt(ret.cache / 1000);
      });
    },
    // 意见反馈
    adivce() {
      openChat({ chatacct: "gz_8fa4423a74ac489f", chattype: "3" });
    },
    // 清除缓存
    clean() {
      cleanAppCacheCallBack();
      this.getCache();
    },
    // 通知
    notice() {
      // modal.toast({message:setNotice()})
      if (setNotice() === "on") {
        this.noticeStatus = true;
      } else {
        this.noticeStatus = false;
      }
    },
    changeSatus() {
      console.log(1)
      if (this.noticeStatus) {
        this.noticeStatus = false;
        setNotice("off");
      } else {
        this.noticeStatus = true;
        setNotice("on");
      }
    },
    toMyInfo() {
      this.push2('/views/userInfo/myInfo','')
    }
  }
};
</script>
<style scoped>
.iconfont {
  font-family: iconfont;
}
/* .install.move-enter-active,
.install.move-leave-active {
  transition: all 0.2s linear;
}
.install.move-enter,
.install.move-leave-active {
  transform: translate3d(100%, 0, 0);
} */
/* 导航 */
.install-title {
  width: 750px;
  height: 100px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: auto;
  margin-right: auto;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
}
.back {
  padding-left: 30px;
  color: #ee1c41;
  font-size: 45px;
}
.title-text {
  line-height: 100px;
  text-align: center;
  font-size: 36px;
}
.m-img {
  width: 150px;
  height: 150px;
  border-radius: 100px;
  margin-right: 15px;
}
.msg{
  width:350px;
}
.userInfo {
  flex-direction: row;
  align-items: center;
}
.cell-info {
  flex-direction: row;
  justify-content: space-between;
  padding-top: 30px;
  padding-bottom: 30px;
  padding-right: 20px;
  padding-left: 20px;
  background-color: #fff;
  align-items: center;
}
.user-name {
  width:350px;
  color: #333333;
  font-size: 28px;
  lines:1;
  text-overflow:ellipse;
  white-space: nowrap;
}
.user-school {
  color: #666666;
  font-size: 24px;
}
.demo-title {
  font-size: 30px;
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color:#ececec;
}
</style>
