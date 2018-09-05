<template>
  <div class="clubMembe">
    <wxc-loading loading-text="加载中" :show="isShow" :need-mask="true"></wxc-loading>
    <div class="top" :style="{paddingTop:source==='iOS'?62:20+'px'}">
        <div @click="_back()" class="left">
          <image class="image-view" :src='imgUrl+"back.png"' ></image>
        </div>
        <text class="Title font-32">部落成员</text>
        <div class="right"></div>
    </div>
    <list class="wrapper" @loadmore="fetchPage" loadmoreoffset="600">
        <cell v-for="(item,index) in membeData" @click="pathOutPlace(item)" :key="index" class="clubMembe-item">
            <div  :class="[mobile === iMobile && item.mobile !== mobile?'leftP':'leftPP']">
          <div class="leftP-left">
            <div class="user-img">
              <image class="image-view pic" resize="cover" :src="item.icon?'http://media2.myyule.cn/'+item.icon:(imgUrl+'userIcon.png')" alt=""></image>
            </div>
              <div class="user-info">
                  <text class="titles styleb" style="color:#000">{{item.nickname}}</text>
                  <text v-if="item.schoolName"  class="font-22 styleb">{{item.schoolName}}</text>
                  <text class="font-22 styleb">已签到{{item.serialSignDay?item.serialSignDay:0}}天</text>
              </div>
          </div>
          <div v-if="item.userRelation == 0 && item.mobile !== mobile" @click="follow(item)" class="follow"><text class="followCare font-26">+ 关注</text></div>
          <div v-if="item.userRelation == 1||item.userRelation == 2" @click="deleteFollow(item)" class="follow active"><text class="followCare followCare2 font-26">已关注</text></div>
          <div v-if="mobile === iMobile && item.mobile !== mobile" @click="takeOut(item)" class="takeOut"><text class="leaveClub font-26">踢出部落</text></div>
      </div>
        </cell>
    </list>
      <wxc-popup popup-color=""
                 :show="isBottomShow"
                 @wxcPopupOverlayClicked="popupOverlayBottomClick"
                 pos="bottom"
                 ref="wxcPopup"
                 height="300"
                 width="750">
          <div class="demo-content">
                  <div class="titlePo">
                      <text>{{content}}</text>
                  </div>
                  <div @click="enter()" class="ok"><text>确定</text></div>
                  <div class="cancel" @click="isBottomShow=false">
                      <text>取消</text>
                  </div>
          </div>
      </wxc-popup>
  </div>
</template>
<script>
import {
  getClubMember,
  putUserFollow,deleteClub, deleteUserFollow, getChat
} from "../../api/club.js";
import {
    toLogin
} from '../../api/weex.js'
import mixins from "../../mixins";
import { WxcPopup,Utils } from 'weex-ui';
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");

export default {
  mixins: [mixins],
  components: {WxcPopup,Utils},
  created() {
      if (this.webParam()) {
          this.iMobile = this.webParam().mobile;
          this.clubId = this.webParam().clubId;
          this.clubList();
      } else {
          storage.getItem("data", event => {
              this.iMobile = JSON.parse(event.data).mobile;
              this.clubId = JSON.parse(event.data).clubId;
              this.clubList();
          });
      }

    // this.clubId = "1732450";
    // this.iMobile = "54CB3433C66DA3977FEB26AA11DC61E1";
    // this.clubList();
    // 获取签到榜的数据

  },
  mounted(){
    // 数据埋点
    this.putPageUrlLog(1503);
    
  },
  data() {
    return {
      pageNo: 1,
      membeData: [],
      thisMember: {},
      iMobile:'',
      clubId: "",
      club:"",
      confirmType: "",
      content: '',
      isBottomShow: false,
    }
  },
  methods: {
    _back() {
      this.pop();
    },
    // 加载下一页
    fetchPage(event) {
      console.log(1)
      // this.isShow = true;
      if (!this.isShow) {
        this.pageNo += 1;
        this.clubList();
        setTimeout(() => {}, 800);
      }
    },
    clubList() {
      this.isShow = true;
      getClubMember({
        clubId: this.clubId,
        pageNo: this.pageNo,
        pageSize: 10
      },{token:this.mobile})
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.membeData = this.membeData.concat(res.object);
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
    },
    // 跳转到其他人的地盘
    pathOutPlace(item){
        this.push2('/views/myPlace/myPlace',{mobile:item.mobile});
    },
    // 踢出部落
    takeOut(item) {
      if(item.mobile == this.mobile){
        modal.toast({
          message:'不能踢出自己！',
          duration: 1
        })
        return
      } else {
        this.thisMember = item;
        this.content = "确定踢出此人?";
        this.confirmType = "deleteClub";
        this.shows();

      }
    },
    // 关注
    follow(item) {
      if(!this.mobile||this.mobile === ''){
          toLogin({loginOut: "0"});
          return
      }
      else if(item.mobile == this.mobile){
        modal.toast({
          message:'不能关注自己！',
          duration: 1
        })
        return
      }
      putUserFollow({
        mobile: this.mobile,
        toMobile: item.mobile
      },{token:this.mobile})
        .then(res => {
          if (res.status == 0) {
            item.userRelation = 1;
              modal.toast({
                  message:'已关注',
                  duration:1
              })
            console.log("success");
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
    },
    // 取消关注
    deleteFollow(item) {
      this.show=true;
      this.thisMember = item;
      this.content = "确认取消关注?";
      this.confirmType = "deleteFollow";
      this.shows();
    },
      shows() {
          this.isBottomShow = true;
          // 进入群聊
          getChat({
              mobile: this.mobile,
              resId: this.clubId,
              resType: "club"
          },{token:this.mobile})
              .then(res => {
                  if (res.status == 0) {
                      const status =  openChat({ chatacct: "2", chattype: res.object }).status
                  } else {
                      console.log(res.desc);
                  }
              })
              .catch();
      },
      popupOverlayBottomClick () {
          this.isBottomShow = false;
      },
      enter() {
          if (this.confirmType === "deleteClub") {
              deleteClub({
                  clubId: this.clubId,
                  mobile: this.thisMember.mobile
              },{token:this.mobile})
                  .then(res => {
                      if (res.status == 0) {
                          this.isBottomShow = false;
                          this.membeData.forEach((value,index,array)=>{
                            if(this.thisMember.mobile == value.mobile){
                              this.membeData.splice(index,1)
                            }
                          })
                          modal.toast({
                              message:'踢出成功',
                              duration:1
                          })
                          getMemberVal(this.confirmType)
                      } else {
                          console.log(res.desc);
                      }
                  })
                  .catch(err => {});
          } else if (this.confirmType === "deleteFollow") {

              deleteUserFollow({
                  mobile: this.mobile,
                  toMobile: this.thisMember.mobile
              },{token:this.mobile})
                  .then(res => {
                      if (res.status == 0) {
                          this.isBottomShow = false;
                          this.thisMember.userRelation = 1;
                          modal.toast({
                              message:'取消关注成功',
                              duration:1
                          })
                          getMemberVal(this.confirmType)
                      } else {
                          console.log(res.desc);
                      }
                  })
                  .catch(err => {});
          } else if (this.confirmType === "chat") {
              // 进入群聊
              getChat({
                  mobile: this.mobile,
                  resId: this.clubId,
                  resType: "club"
              },{token:this.mobile})
                  .then(res => {
                      if (res.status == 0) {
                          openChat({ chatacct: "2", chattype: res.object });
                      } else {
                          console.log(res.desc);
                      }
                  })
                  .catch();
          }
      },
      getMemberVal(item){
        modal.alert({
            message:item
        })
        if(item=='deleteFollow'){
            this.thisMember.userRelation=0
        }
      }

  }
};
</script>
<style src="../../assets/style/index.scss">

</style>
<style  scoped>
.clubMembe {
  width: 750px;
  background-color: #ffffff;
  flex: 1;
}
  .top {
    width: 750px;
    background-color: #fff;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 22px;
    padding-right: 40px;
    padding-left: 40px;
    border-bottom-width:1px;
    border-bottom-style: solid;
    border-bottom-color: #d9d9d9;
  }
  .wrapper{
      height: 1240px;
  }
    .Title {
      color: #000;
      align-items: center;
    }

    .right {
      width: 61px;
      height: 61px;
    }
    .left {
      width: 61px;
      height: 61px;
    }

  .clubMembe-item {
      width: 750px;
      flex-direction: row;
      justify-content: flex-start;
      padding-left:30px;
      align-items: center;
      padding-top: 47px;
      padding-bottom: 47px;
      background-color: #fff;
  }
    .leftP {
      flex-direction: row;
      justify-content:flex-start;
      align-items: center;
      width: 700px;
    }
    .leftPP{
      flex-direction: row;
      justify-content:space-between;
      align-items: center;
      width: 700px;
    }
    .leftP-left{
        flex-direction: row;
        justify-content:space-between;
        align-items: center;
    }
      .user-img {
        margin-top: 0px;
        margin-left: 20px;
        margin-bottom: 0px;
        margin-right: 20px;
        width: 120px;
        height: 120px;
        border-bottom-left-radius: 90px;
        border-bottom-right-radius: 90px;
        border-top-left-radius: 90px;
        border-top-right-radius:90px;
        background-color: #d9d9d9;
      }

      .user-info {
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        width: 280px;
      }
      .titles{
          color: #000;
          lines:1;
          text-overflow:ellipsis;
        }
     .styleb {
          padding-bottom: 8px;
          color: #828282;
        }
     .stylec{
         padding-bottom: 0px;
     }
    .follow {
      width: 110px;
      height: 60px;
      border-width: 2px;
      border-style: solid;
      border-color: #EE1C41;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      border-top-left-radius: 10px;
      border-top-right-radius:10px;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .followCare {
        justify-content:center;
        align-items: center;
        color: #ee1c41;
      }
    .active {
         background-color: #ee1c41;
       }
      .followCare2 {
          color: #fff;
        }
    .takeOut {
      height: 60px;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
      background-color: #ee1c41;
      border-width: 2px;
      border-style: solid;
      border-color: #EE1C41;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      border-top-left-radius: 10px;
      border-top-right-radius:10px;
    }
  .leaveClub {
        padding-top: 0px;
        padding-bottom: 0px;
        padding-right: 10px;
        padding-left: 10px;
        justify-content: center;
        align-items: center;
        color: #fff;
      }
  .image-view{
    width:61px;
    height:61px;
    border-bottom-left-radius: 90px;
    border-bottom-right-radius: 90px;
    border-top-left-radius: 90px;
    border-top-right-radius:90px;
  }
  .pic{
    width:120px;
    height:120px;
    border-bottom-left-radius: 90px;
    border-bottom-right-radius: 90px;
    border-top-left-radius: 90px;
    border-top-right-radius:90px;
  }
.title {
    background-color: #fff;
    padding-top: 30px;
    padding-bottom: 30px;
}
.ok {
    background-color: #fff;
    padding-top: 30px;
    padding-bottom: 30px;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;

}
.cancel {
    background-color: #fff;
    padding-top: 30px;
    padding-bottom: 30px;
    padding-bottom: 30px;
    justify-content: center;
    align-items: center;
}
.titlePo{
    background-color: #fff;
    padding-top: 30px;
    padding-bottom: 30px;
    justify-content: center;
    align-items: center;
}
</style>
