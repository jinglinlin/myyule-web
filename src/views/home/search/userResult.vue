<template>
  <div @click="push2('/views/myPlace/myPlace',{mobile:item.mobile})" class="user-item">
    <div class="left">
      <div class="img-icon">
        <image class="img" :src="'http://media2.myyule.cn/'+item.icon" placeholder="http://www.myyule.com/images/head-02.jpg"></image>
        <image v-if="item.userLevel>0" class="vip" :src="imgUrl+'vip'+item.userLevel+'.png'" ></image>
      </div>
      <div class="user-info">
        <div class="user-all">
            <div class="user-name">
              <text class="font-28" :class="[otherName(item)[0]==keyWord?'color-pink':'color-black']">{{otherName(item)[0]}}</text>
              <text class="font-28" :class="[otherName(item)[1]==keyWord?'color-pink':'color-black']">{{otherName(item)[1]}}</text>
              <text class="font-28" :class="[otherName(item)[2]==keyWord?'color-pink':'color-black']">{{otherName(item)[2]}}</text>
            </div>
          <text v-if="isElips"  class="elips font-28 color-gray">...</text>
        </div>
        <div class="user-desc">
          <text class="color-pink font-26 desc">{{item.schoolName}}</text>
        </div>
      </div>
    </div>
    <wxc-loading :show="isShow" :need-mask="true"></wxc-loading>
    <text class="funs color-gray">粉丝{{item.fanNum?item.fanNum:0}}</text>
    <div v-if="item.userRelation" @click="unFollow(item)" class="follow"><text class="follow-btn">已关注</text></div>
    <div v-if="!item.userRelation" @click="follow(item)" class="follow2"><text class="follow2-btn">+ 关注</text></div>
  </div>
</template>
<script>
import { putClubMember } from "../../../api/club";
import { putUserFollow, deleteUserFollow } from "../../../api/club";
import { toLogin } from "../../../api/weex";
import { WxcLoading } from "weex-ui";
import mixins from "../../../mixins";
var modal = weex.requireModule("modal");
var storage = weex.requireModule("storage");
export default {
  mixins: [mixins],
  props: {
    item: {},
    keyWord: {}

  },
  components: { WxcLoading },
  data() {
    return {
      isShow: false,
      isElips:false
      // mobile: ""
    };
  },
  created() {
    // storage.getItem("mobile", event => {
    //   if (event.data === "undefined" || event.data === "") {
    //   } else {
    //     this.mobile = event.data;
    //   }
    // });
  },
  methods: {
    // 关注
    follow(item) {
      if (this.mobile) {
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
                item.fanNum +=1;
                modal.toast({
                  message: "关注成功!",
                  duration: 1
                });
              } else if (res.desc === "用户无法关注本人") {
                this.isShow = false;
                modal.toast({
                  message: "用户无法关注本人!",
                  duration: 1
                });
              } else {
                this.isShow = false;
                modal.toast({
                  message: res.desc,
                  duartion: 1
                });
              }
            })
            .catch(err => {});
        }
      } else {
        modal.toast({
          message: "请登录",
          duration: 1
        });
        toLogin({ loginOut: "0" });
      }
    },
    // 取消关注
    unFollow(item) {
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
          _this.isShow = true;
          if (value === "确定") {
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
                  item.fanNum -=1;
                  modal.toast({
                    message: "取消成功!!",
                    duration: 1
                  });
                } else {
                  this.isShow = false;
                  modal.toast({
                    message: res.desc,
                    duartion: 1
                  });
                  console.log(res.desc);
                }
              })
              .catch(err => {});
          }else{
            _this.isShow = true;
          }
        }
      );
    },
      //标红
      otherName(item){
          const stringInit = item.nickname;
          let index= 0;
          let len=this.keyWord.length;
          let string='';
          if(stringInit.length>14){
              string=stringInit.substr(0,14);
              this.isElips=true
          }else{
              string=stringInit;
              this.isElips=false
          }
          index = string.indexOf(this.keyWord);
          if(index == 0){

              return [this.keyWord,string.substr(len),'']
          } else if (index >0){
              return [string.substr(0,index),this.keyWord,string.substr(index+len)]
          }else{
              return ['',string,'']

          }
      }

  }
};
</script>
<style scoped>
/* 公用 */
.font-22 {
  font-size: 22px;
  line-height: 22px;
}
.font-18 {
  font-size: 18px;
  line-height: 18px;
}
.color-gray {
  color: #666666;
}
.color-pink {
  color: #ee1c41;
}
.font-26 {
  font-size: 26px;
  line-height: 26px;
}
.font-28 {
  font-size: 28px;
  line-height: 28px;
  margin-top: 10px;
  margin-bottom: 13px;
}
/* 搜索 */
.user-item {
  width:750px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 28px;
  padding-bottom: 28px;
  padding-left: 36px;
  padding-right: 23px;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
}
.funs {
  font-size: 24px;
  line-height: 88px;
  padding-right: 49px;
}
.left {
  flex-direction: row;
  justify-content: space-around;
}
.img-icon {
  position: relative;
}

.vip {
  position: absolute;
  width: 36px;
  height: 36px;
  bottom: 0;
  right: 10px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  background-color: #ee1c41;
}
.img {
  margin-left: 20px;
  margin-right: 20px;
  width: 88px;
  height: 88px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  background-color: #d9d9d9;
}
.desc {
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-name{
  flex-direction: row;
}
.username {
  lines: 1;
  text-overflow:ellipsis;
}
.follow {
  width: 110px;
  height: 60px;
  background-color: #ee1c41;
  border-width: 2px;
  border-style: solid;
  border-color: #ee1c41;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.follow2 {
  width: 110px;
  height: 60px;
  background-color: #fff;
  border-width: 2px;
  border-style: solid;
  border-color: #ee1c41;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.follow-btn {
  text-align: center;
  line-height: 60px;
  color: #fff;
  font-size: 22px;
}
.follow2-btn {
  text-align: center;
  line-height: 60px;
  color: #ee1c41;
  font-size: 22px;
}
.elips{
  width: 30px;

}

.user-all{
  flex-direction: row;

}
</style>
