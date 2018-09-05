<template>
    <div @click="push2('/views/club/club_layout',{clubId:item.clubId})" class="club-item">
      <div class="left">
        <image class="img" :src="item.clubLogo?'http://media2.myyule.cn/'+item.clubLogo:''" placeholder="http://www.myyule.com/images/club_logo_middle.jpg"></image>
        <div class="user-info">
          <div class="club-name">
            <text class="font-28 " :class="[otherName(item)[0]==keyWord?'color-pink':'color-black']">{{otherName(item)[0]}}</text>
            <text class="font-28 " :class="[otherName(item)[1]==keyWord?'color-pink':'color-black']">{{otherName(item)[1]}}</text>
            <text class="font-28 " :class="[otherName(item)[2]==keyWord?'color-pink':'color-black']">{{otherName(item)[2]}}</text>
            <text v-if="isElips"  class="elips font-28 color-gray">...</text>

          </div>
          <div class="desc-all">
              <div class="club-desc">
                <text  class="font-26 " :class="[otherNick(item)[0]==keyWord?'color-pink':'color-gray']">{{otherNick(item)[0]}}</text>
                <text  class="font-26 " :class="[otherNick(item)[1]==keyWord?'color-pink':'color-gray']">{{otherNick(item)[1]}}</text>
                <text  class="font-26 " :class="[otherNick(item)[2]==keyWord?'color-pink':'color-gray']">{{otherNick(item)[2]}}</text>
              </div>
              <text  v-if="isElips2"  class="elips font-28 color-gray">...</text>
          </div>
        </div>
      </div>
      <wxc-loading :show="isShow" :need-mask="true"></wxc-loading>
      <div v-if="item.clubRelation" class="follow"><text class="follow-btn">已加入</text></div>
      <div @click="joinClub()" v-if="!item.clubRelation" class="follow2"><text class="follow2-btn">+ 加入</text></div>
  </div>
</template>
<script>
import { putClubMember } from "../../../api/club";
import { WxcLoading } from "weex-ui";
import { toLogin } from "../../../api/weex";
import mixins from "../../../mixins";
import { startNewWebView } from "../../../api/weex";
var modal = weex.requireModule("modal");
var storage = weex.requireModule("storage");
export default {
  mixins: [mixins],
  components: { WxcLoading },
  props: {
    item: {},
    keyWord: {}

  },
  data() {
    return {
      isShow: false,
      isElips:false,
      isElips2:false
    }
  },
  methods: {
    // 加入部落
    joinClub() {
      if (this.mobile) {
        if (!this.isShow) {
          this.isShow = true;
          putClubMember(
            {
              clubId: this.item.clubId,
              mobile: this.mobile
            },
            { token: this.mobile }
          )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                this.item.clubRelation = 1;
                modal.alert({
                  message: "加入部落成功!",
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
        }
      } else {
        modal.toast({
          message: "请登录!",
          duration: 1
        });
        toLogin({ loginOut: "0" });
      }
    },
      //标红
      otherName(item){
          const stringInit = item.clubName;
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
      },
      //标红
      otherNick(item){
          const stringInit = item.clubDesc;
          let index= 0;
          let len=this.keyWord.length;
          let string='';

          if(stringInit.length>14){

              string=stringInit.substr(0,14);
              console.log(string)
              this.isElips2=true
          }else{
              string=stringInit;
              this.isElips2=false
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
}
</script>
<style scoped>
/* 公用 */
.font-22 {
  font-size: 22px;
}
.color-gray {
  color: #828282;
}
.color-pink {
  color: #ee1c41;
}
.font-26 {
  font-size: 26px;
}
.font-28 {
  font-size: 28px;
  padding-top: 10px;
  padding-bottom: 13px;
}
/* 搜索 */
.club-item {
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
.left {
  flex-direction: row;
  justify-content: space-around;
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
/*.desc {*/
  /*lines:2;*/
  /*text-overflow:ellipsis;*/
/*}*/
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
  font-size: 22px;
  color: #ee1c41;
}
.clubName{

}
.club-name{
  flex-direction: row;
}
.club-desc{
  flex-direction: row;
}
.desc-all{
  flex-direction: row;
}
.elips{
  width: 30px;

}


</style>
