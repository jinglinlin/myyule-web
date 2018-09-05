<template>
   <div class="install" :style="{paddingTop:source==='iOS'?62:20+'px'}" ref="test">
      <div class="install-title" >
            <text @click="pop()" class="iconfont back">&#xe625;</text>
            <text class="title-text iconfont">个人信息</text>
            <text style="width:44px"></text>
      </div>
      <div class="container">

        <div class="demo">
          <wxc-cell label="完善资料"
            :has-arrow="true"
            @wxcCellClicked="push('/perfectInfo','')"
            :has-margin="true"></wxc-cell>
          <wxc-cell label="更改密码"
            :has-arrow="true"
            @wxcCellClicked="toUpdatePwd()"
            :has-margin="true"></wxc-cell>
          <wxc-cell label="我的二维码"
            :has-arrow="true"
            @wxcCellClicked="wxcCellClicked"
            :has-margin="true"></wxc-cell>
                
        </div>
      </div>
     <!-- 更改密码 -->
     <updatePwd ref="updatePwd"></updatePwd>
   </div>
</template>
<script>
import { WxcCell, WxcIcon } from "weex-ui";
import updatePwd from "./updatePwd.vue";
import mixins from "../../mixins";
var storage = weex.requireModule("storage");
var modal = weex.requireModule("modal");
export default {
  components: { WxcCell, WxcIcon,updatePwd },
  mixins: [mixins],
  data() {
    return {
      userData: {}
    };
  },
  created() {
    this.getUser()
  },
  mounted(){
    this.putPageUrlLog(1103)
  },
  methods: {
    // 获取用户信息
    getUser(){
        if(this.webParam()){
            this.userData = this.webParam().userData;
        }else{
            storage.getItem("data", event => {
                this.userData = JSON.parse(event.data).userData;
                // modal.alert({message:JSON.parse(event.data).icon})
            });
        }

    },
    wxcCellClicked(e) {
      modal.toast({message:'正在开发中'})
      console.log(e);
    },
    toUpdatePwd(){
      this.$refs.updatePwd.show();
    }
  }
};
</script>
<style scoped>
.iconfont {
  font-family: iconfont;
}

.install {
  position: fixed;
  width: 750px;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #fff;
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
.userInfo {
  flex-direction: row;
  align-items: center;
}
.demo-title {
  font-size: 28px;
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
