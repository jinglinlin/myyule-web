<template>
  <div class="all-club" @viewappear="appear">
    <wxc-loading :show="isShow"></wxc-loading>
    <div class="all-club-title" :style="{paddingTop:source==='iOS'?62:20+'px'}">
        <div class="title-wrapper">
          <text @click="back()" class="iconfont back">&#xe625;</text>
          <text @click="toggle()" class="title-text iconfont">{{clubTags[0]}}部落{{seletKey?'&#xe62c;':'&#xe62d;'}}</text>
          <text style="width:44px"></text>
        </div>
        <div v-if="seletKey" class="select-tag">
          <text v-for="(item,index) in tagList" :class="['tag-item', 'btn-' + item.value]" @click="select(item)" :key="index">{{item.title[0]}}</text>
        </div>
    </div>
    <list class="myClub" @loadmore="fetchPage" loadmoreoffset="600" style="height:1162px">
      <cell v-for="(item,index) in clubData" :key="index" @click="push2('/views/club/club_layout',{clubId:item.clubId})" class="wrapper">
      <div :class="['club-item',source==='iOS'?'club-item-active':'']">
        <div class="left">
          <div class="user-img">
            <image class="img" :src="item.clubLogo?'http://media2.myyule.cn/'+item.clubLogo:''" alt="" width="120" height="120"></image>
          </div>
          <div class="user-info">
            <text lines='1' class="title">{{item.clubName}}</text>
            <div style="flex-direction:row;padding-bottom: 18px;">
              <text class="font-26 color-gray" style="padding-right:30px">人气{{item.clubMemberNum}}</text>
              <text class="font-26 color-gray">话题{{item.topicNum}}</text>
            </div>
            <text class="font-24 desc">{{item.clubDesc}}</text>
          </div>
        </div>
        <div v-if="item.clubRelation"  class="follow"><text class="follow-text">已加入</text></div>
        <div v-if="!item.clubRelation" @click="joinClub(item)"  class="follow2"><text class="follow2-text">+ 加入</text></div>
    </div>
    </cell>
    </list>
  </div>
</template>
<script>
import { WxcLoading } from "weex-ui";
import { getClubList, putClubMember } from "../../../api/club";
import mixins from "../../../mixins";
import { startNewWebView } from "../../../api/weex";
import { toLogin } from "../../../api/weex";
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");
const navigator = weex.requireModule("navigator");
export default {
  mixins: [mixins],
  data() {
    return {
      pageNo: 1,
      clubData: [],
      clubTags: ["全部"],
      isShow: false,
      seletKey: false,
      tagList: [
        { title: ["全部"], value: "1" },
        { title: ["音乐"], value: "0" },
        { title: ["公益"], value: "0" },
        { title: ["校友"], value: "0" },
        { title: ["老友记"], value: "0" },
        { title: ["娱乐圈"], value: "0" },
        { title: ["原创"], value: "0" },
        { title: ["聚会"], value: "0" },
        { title: ["旅行"], value: "0" },
        { title: ["现场"], value: "0" },
        { title: ["同城"], value: "0" },
        { title: ["其他"], value: "0" }
      ]
    };
  },
  components: {
    WxcLoading
  },
  beforeCreate(){
    this.fontIcon();
  },
  created() {
    // this.clubList(this.clubTags,this.pageNo);
  },
  mounted(){
    // 数据埋点
    this.putPageUrlLog(1501);
    },
  methods: {
    //刷新
    appear(){
      this.pageNo = 1;
      this.clubList(this.clubTags,this.pageNo);
    },
    toggle() {
      if (this.seletKey) {
        this.seletKey = false;
      } else {
        this.seletKey = true;
      }
    },
    // 加入部落
    joinClub(item) {
      if (this.mobile !== "") {
        if (!this.isShow) {
          this.isShow = true;
          putClubMember(
            {
              clubId: item.clubId,
              mobile: this.mobile
            },
            { token: this.mobile })
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                item.clubRelation = 1;
                modal.alert({
                  message: "加入部落成功!",
                  duration: 1
                });
              } else {
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
    // 获取部落列表
    clubList(tag, pageNo) {
      this.isShow = true;
      if (tag) {
        this.clubTags = tag;
      }
      getClubList(
        {
          clubTags: this.clubTags[0] === "全部" ? [] : this.clubTags,
          pageNo: pageNo,
          pageSize: 10,
          sort:'hot'
        },
        { token: this.mobile }
      )
        .then(res => {
          this.isShow = false;
          if (res.status == 0) {
            this.clubData =
              pageNo > 1 ? this.clubData.concat(res.object) : res.object;
          } else {
            modal.toast({
              message: res.desc,
              duartion: 1
            });
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 筛选
    select(item) {
      this.pageNo = 1;
      this.clubTags = item.title;
      this.tagList.forEach((value, index, array) => {
        value.value = "0";
      });
      item.value = "1";
      this.clubList(item.title, this.pageNo);
      this.toggle();
    },
    // 加载下一页
    fetchPage() {
      this.pageNo += 1;
      this.clubList(this.clubTags, this.pageNo);
      setTimeout(() => {}, 800);
    },
    back(){
      // 发送返回通知
      const channel = new BroadcastChannel('backFlesh')
      channel.postMessage(JSON.stringify({static:'backFlesh'}));
      this.pop()
    }
  }
};
</script>
<style scoped>
.iconfont {
  font-family: iconfont;
}

/* 标题 */
.all-club-title {
  position: relative;
  width: 750px;
  box-shadow: 0 0 10px 10px #f6f6f6;
  margin-bottom: 10px;
  background-color: #fff;
}
.back {
  padding-left: 30px;
  color: #ee1c41;
  font-size: 45px;
}
.user-info{
  width:400px;
}
.title-wrapper {
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
.title-text {
  line-height: 100px;
  text-align: center;
  font-size: 36px;
}
.select-tag {
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 45px;
  flex-direction: row;
  background-color: #fff;
  flex-wrap: wrap;
}
.tag-item {
  margin-top: 16px;
  margin-bottom: 16px;
  margin-left: 14px;
  margin-right: 14px;
  padding-left: 26px;
  padding-right: 26px;
  padding-top: 9px;
  padding-bottom: 9px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #ececec;
  font-size: 24px;
}
.btn-1 {
  color: #fff;
  background-color: #ee1c41;
}
.all-club {
  width: 750px;
  background-color: #fff;
}
.font-26 {
  font-size: 26;
  line-height: 26px;
  color: #828282;
}
.font-24 {
  font-size: 24;
  line-height: 24px;
  color: #828282;
}
/* 部落 */
.myClub {
  width: 750px;
}
.wrapper{
}
.club-item {
  padding-top: 44px;
  padding-bottom: 44px;
  padding-left: 34px;
  padding-right: 23px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececee;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.club-item-active{
  box-shadow: 0px 0px 11px 0px #d9d9d9;
}
.left {
  flex-direction: row;
  justify-content: space-around;
}
.user-img {
  position: relative;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 20px;
  margin-right: 20px;
  width: 120px;
  height: 120px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  background-color: #d9d9d9;
}
.img-vip {
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}
.img {
  width: 120px;
  height: 120px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}
.title {
  lines:1;
  width: 213px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 28px;
  color: #000;
  margin-bottom: 18px;
}
.desc {
  height: 24px;
  text-overflow: ellipsis;
  margin-bottom: 18px;
  color: #828282;
  line:1;
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
.follow-text {
  font-size: 26px;
  text-align: center;
  line-height: 60px;
  color: #fff;
}
.follow2-text {
  font-size: 26px;
  text-align: center;
  line-height: 60px;
  color: #ee1c41;
}
</style>
