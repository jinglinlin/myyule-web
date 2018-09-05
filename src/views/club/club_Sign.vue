<template>
  <div class="clubSign">
    <div @click="toUser(item)" v-for="(item,index) in resData" :key="index" class="clubSign-item">
      <div class="inner">
        <div class="left">
          <div class="user-img">
            <image resize="cover" class="user-icon" :src="item.icon?('http://media2.myyule.cn/'+item.icon):(imgUrl+'userIcon.png')" alt="" :placeholder="imgUrl+'userIcon.png'"></image>
            <text class="range">{{index+1}}</text>
          </div>
          <div class="user-info">
            <text class="font-26 title info-text">{{item.nickname}}</text>
            <text class="font-22 info-text">{{item.schoolName}}</text>
            <!--<text class="font-22 info-text">已签到{{item.signDay}}天</text>-->
          </div>
        </div>
        <div v-if="item.userRelation == 0 && item.mobile !== mobile" @click="follow(item)" class="follow"><text class="follow-text font-26">+ 关注</text></div>
        <div v-if="item.userRelation == 1||item.userRelation == 2" @click="deleteFollow(item)" class="follow active"><text class="active-text font-26">已关注</text></div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getClubMember,
  putUserFollow,
  deleteUserFollow
} from "../../api/club.js";
import mixins from "../../mixins";
import { toLogin } from "../../api/weex";
const modal = weex.requireModule("modal");
export default {
  mixins: [mixins],
  props: {
    resData: {},
    clubId: {}
  },
  data() {
    return {
      thisMember: {}
    };
  },
  methods: {
    toUser(item) {
      this.push2("/views/myPlace/myPlace", { mobile: item.mobile });
    },
    // 关注
    follow(item) {
      if (!this.mobile || this.mobile === "") {
         toLogin({ loginOut: "0" });
         return
      }
      if (!this.isShow) {
        this.isShow = true;
        putUserFollow(
          {
            mobile: this.mobile,
            toMobile: item.mobile
          },
          { token: this.mobile }
        )
          .then(res => {
            this.isShow = false;
            if (res.status == 0) {
              item.userRelation = 1;
              console.log("success");
            } else {
              modal.toast({
                message: res.desc,
                duration: 0.3
              });
              console.log(res.desc);
            }
          })
          .catch(err => {});
      }
    },
    // 取消关注
    deleteFollow(item) {
      const _this = this;
      console.log(item);
      modal.confirm(
        {
          message: "确定取消关注么 ?",
          okTitle: "确定",
          cancelTitle: "取消",
          duration: 0.3
        },
        function(value) {
          if (value === "确定") {
            _this.isShow = true;
            deleteUserFollow(
              {
                mobile: _this.mobile,
                toMobile: item.mobile
              },
              { token: _this.mobile }
            )
              .then(res => {
                if (res.status == 0) {
                  _this.isShow = false;
                  item.userRelation = 0;
                  modal.toast({
                    message: "取消成功!!",
                    duration: 1
                  });
                } else {
                  console.log(res.desc);
                }
              })
              .catch(err => {});
          }
        }
      );
    }
  }
};
</script>
<style src="../../assets/style/index.scss">
</style>
<style scoped>
.clubSign {
  position: relative;
}
.clubSign-item {
  width: 670px;
  margin-top: 20px;
  height:200px;
  margin-left: 40px;
  margin-right: 40px;
  background-color: #fff;
  box-shadow: 0 0 10px 10px #f6f6f6;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.inner{
  width: 670px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height:200px;
  padding-left: 23px;
  padding-right: 23px;
}
.user-info{
  max-width:300px;
}
.user-icon {
  width: 120px;
  height: 120px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  background-color:#ececec;
}
.left {
  flex-direction: row;
  justify-content: space-around;
  align-items:center;
}

.user-img {
  width: 168px;
  height: 168px;
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;

}
.range {
  position: absolute;
  right:24px;
  top: 10px;
  font-size: 24px;
  color: #fff;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  width: 48px;
  height: 48px;
  text-align: center;
  padding-top: 10px;
  background-color: #ee1c41;
}
.title {
  lines:1;
  text-overflow:ellipse;
  color: #000;
}
.info-text {
  padding-bottom: 18px;
  color: #828282;
}
.follow {
  justify-content: center;
  align-items: center;
  width: 110px;
  height: 60px;
  border-width: 2px;
  border-style: solid;
  border-color: #ee1c41;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.follow-text {
  text-align: center;
  line-height: 60px;
  color: #ee1c41;
}
.active {
  background-color: #ee1c41;
}
.active-text {
  color: #fff;
}
</style>
