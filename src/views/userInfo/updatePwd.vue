<template>
  <div v-if="key" :style="{paddingTop:source==='iOS'?62:20+'px'}" class="perfectInfo active" ref="test1">
      <wxc-loading :show="isShow" :need-mask="true"></wxc-loading>
      <div class="install-title" >
            <text @click="back()" class="iconfont back">&#xe625;</text>
            <text class="title-text iconfont">更新密码</text>
            <text @click="makeSure()" class="title-text sure">确定</text>
      </div>
      <div class="demo">
        <wxc-cell label="旧密码"
          :has-arrow="false"
          :has-margin="true">  
          <input type="password" slot="title" class="input" v-model="password" />
        </wxc-cell>
        <wxc-cell label="新密码"
          :has-arrow="false"
          :has-margin="true">  
          <input type="password" slot="title" class="input" v-model="newPassword" />
        </wxc-cell>
        <wxc-cell label="确认密码"
          :has-arrow="false"
          :has-margin="true">  
          <input type="password" slot="title" class="input" v-model="confirmPwd" />
        </wxc-cell>
        </div>

      </div>
</template>
<script>
import { WxcCell, WxcIcon, WxcLoading } from "weex-ui";
import mixins from "../../mixins";
import { putUserPwd } from "../../api/userInfo";
const modal = weex.requireModule("modal");
const animation = weex.requireModule('animation')
export default {
  mixins: [mixins],
  components: { WxcCell, WxcIcon, WxcLoading },
  data() {
    return {
      key: false,
      isShow: false,
      password: "",
      newPassword: "",
      confirmPwd: ""
    };
  },
  methods: {
    show() {
      this.key = true;
      setTimeout(() => {
        const testEl = this.$refs.test1;
        this.move(testEl);
        this.putPageUrlLog(1104);
      }, 200);
    },
    // 初始化
    zero() {
      this.password = "";
      this.newPassword = "";
      this.confirmPwd = "";
    },
    // 提交
    makeSure() {
      if (this.password === "") {
        modal.toast({
          message: "请填写旧密码"
        });
      } else if (this.newPassword === "") {
        modal.toast({
          message: "请填写新密码"
        });
      } else if (this.confirmPwd === "") {
        modal.toast({
          message: "请确认密码"
        });
      } else if (this.newPassword !== this.confirmPwd) {
        modal.toast({
          message: "两次密码不一致"
        });
      } else {
        putUserPwd(
          {
            mobile: this.mobile,
            password: this.password,
            newPassword: this.newPassword,
            confirmPwd: this.confirmPwd
          },
          { token: this.mobile }
        )
          .then(res => {
            if (res.status == 0) {
              modal.toast({
                message: "修改成功"
              });
            } else {
              modal.toast({
                message: res.desc
              });
              this.zero();
            }
          })
          .catch();
      }
    },
    // 返回
    back() {
      const testEl = this.$refs.test1;
      this.leave(testEl);
      setTimeout(() => {
        this.key = false;
      }, 200);
    },
    move(testEl) {
      animation.transition(testEl, {
        styles: {
          transform: 'translate(-750px, 0)',
          transformOrigin: 'center center'
        },
        duration: 500, //ms
        timingFunction: 'ease',
        delay: 0 //ms
      }, function () {})
    },
    leave(testEl) {
      animation.transition(testEl, {
        styles: {
          transform: 'translate(750px, 0)',
          transformOrigin: 'center center'
        },
        duration: 500, //ms
        timingFunction: 'ease',
        delay: 0 //ms
      }, function () {})
    }
  }
};
</script>
<style scoped>
.iconfont {
  font-family: iconfont;
}
.active{
  top: 0;
}
.perfectInfo {
  position: fixed;
  width: 750px;
  left: 750px;
  bottom: 0;
  background-color: #fff;
}
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
.sure {
  padding-right: 20px;
}
.demo {
  padding-left: 40px;
  padding-right: 40px;
  margin-top: 40px;
}
.msg {
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  color: #666;
}
.input{
  height:50px;
}
</style>
