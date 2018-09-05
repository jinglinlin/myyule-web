<template>
  <div class="businessState">
    <wxc-loading loading-text="加载中" :show="isShow" :need-mask="true"></wxc-loading>
    <div class="top" :style="{paddingTop:source==='iOS'?62:20+'px'}">
        <text class="iconfont re_icon"  @click="pop()">&#xe625;</text>
        <text class="title font-32">商务合作状态</text>
        <text style="width:44px"></text>
    </div>
    <wxc-tab-page ref="wxc-tab-page"
                :tab-titles="tabTitles"
                :tab-styles="tabStyles"
                 wrap-bg-color="#ffffff"
                title-type="text"
                :needSlider="needSlider"
                :is-tab-view="isTabView"
                :tab-page-height="tabPageHeight"
                @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
        <list 
              class="item-container"
              @loadmore="fetch" loadmoreoffset="600">
          <cell v-for="(item,index) in userDigital" :key="index" class="item">
            <div class="lefts">
              <image class="user-image" :src="'http://media2.myyule.cn/'+item.logo"></image>
              <div class="msg">
                <text class="title">申请的单曲</text>
                <div class="coins">
                  <text class="font-22 name">{{item.title}}</text>
                  <text class="font-22 songer">{{item.songer}}</text>
                </div>
              </div>
            </div>
            <div v-if="item.applyPublish == 3" class="rights">
              <image class="notic image" :src="imgUrl+'notic.png'"></image>
              <text class="color-pink title1">因歌非原创</text>
              <text class="color-pink title1">导致审核未通过</text>
            </div>
            <div v-if="item.applyPublish == 1" class="rights">
              <image class="examine image" :src="imgUrl+'examine-ing.png'"></image>
              <text class="color-blur title1">1-3天审核期</text>
            </div>
            <div v-if="item.applyPublish == 2" class="rights">
              <image class="examine image" :src="imgUrl+'examine-sucess.png'"></image>
              <text class="color-green title1">已上架</text>
            </div>
          </cell>
        </list>
        <list 
              class="item-container"
              @loadmore="fetch" loadmoreoffset="600" >
          <cell v-for="(item,index) in userDigital" :key="index" class="item">
            <div class="lefts">
              <image class="user-image" :src="'http://media2.myyule.cn/'+item.logo"></image>
              <div class="msg">
                <text class="title">申请的专辑</text>
                <div class="coins">
                  <text class="font-22 name">{{item.title}}</text>
                  <text class="font-22 songer">{{item.nickname}}</text>
                </div>
              </div>
            </div>
            <div v-if="item.applyPublish == 3" class="rights">
              <image class="notic image" :src="imgUrl+'notic.png'"></image>
              <text class="color-pink title1">因歌非原创</text>
              <text class="color-pink title1">导致审核未通过</text>
            </div>
            <div v-if="item.applyPublish == 1" class="rights">
              <image class="examine image" :src="imgUrl+'examine-ing.png'"></image>
              <text class="color-blur title1">1-3天审核期</text>
            </div>
            <div v-if="item.applyPublish == 2" class="rights">
              <image class="examine image" :src="imgUrl+'examine-sucess.png'"></image>
              <text class="color-green title1">已上架</text>
            </div>
          </cell>
        </list>
    </wxc-tab-page>
    <text class="bottom-text color-gray">期待更多合作哟~</text>
  </div>
</template>
<script>
import mixins from "../../mixins";
import { WxcTabPage, Utils } from 'weex-ui';
import {getUserDigital } from '../../api/userInfo'
import Config from '../../utils/config';
const dom = weex.requireModule('dom');
export default {
  mixins: [mixins],
  components: { WxcTabPage},
  data: () => ({
    userDigital:[], // 商务合作
    pageNo:1,
    iStyle:'song',
    tabTitles: Config.tabBusiness,
    tabStyles: Config.tabStyles3,
    tabList: [],
    needSlider: true,
    demoList: [1, 2],
    supportSlide: true,
    isTabView: true,
    tabPageHeight: 1334
  }),
  beforeCreate(){
    this.fontIcon();
  },
  created () {
    this.tabList = [...Array(this.tabTitles.length).keys()].map(i => []);
    this.getUserDigitalData(this.iStyle);
  },
  mounted(){
    this.putPageUrlLog(1202)
  },
  methods:{
    // 加载下一页
    fetch (event) {
      if(!this.isShow){
          this.isShow = true;
          this.pageNo +=1
          this.getUserDigitalData(this.iStyle)
          setTimeout(() => {
          }, 800)
        }
    },
    getUserDigitalData(item){
      // 获取商务合作信息
      getUserDigital({
        mobile: this.mobile,
        digitalType:item,
        pageNo:this.pageNo,
        pageSize:10
      },{token:this.mobile})
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.userDigital = this.userDigital.concat(res.object);
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
    },
    wxcTabPageCurrentTabSelected (e) {
      const self = this;
      const index = e.page;
      this.pageNo = 1;
      this.userDigital = [];
      if(index == 1){
        this.iStyle = 'songAlbum'
      } else if(index == 0) {
        this.iStyle = 'song'
      }
      this.getUserDigitalData(this.iStyle)
      /* Unloaded tab analog data request */
      if (!Utils.isNonEmptyArray(self.tabList[index])) {
        setTimeout(() => {
          // Vue.set(self.tabList, index, self.demoList);
        }, 100);
      }
    },
    wxcPanItemPan (e) {
      if (Utils.env.supportsEBForAndroid()) {
        this.$refs['wxc-tab-page'].bindExp(e.element);
      }
    }
  }
};

</script>
<style scoped>
.businessState {
  width: 750px;
  background-color: #fff;
  flex:1;
  position: relative;
  }
  .top {
    width: 750px;
    background-color: #fff;
    text-align: center;
    padding-bottom: 22px;
    padding-left: 40px;
    padding-right: 40px;
    border-bottom-style:solid ;
    border-bottom-color:#d9d9d9 ;
    border-bottom-width: 1px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
 }
.title {
color: #000;
}
.left{
width: 61px;
height: 61px;
}
.right {
width: 61px;
height: 61px;
}
.tab-page-wrap{
background-color:#fff;
}
.bottom-text{
text-align: center;
padding-top:20px;
padding-bottom:20px;
}
.item-container {
   width: 750px;
   background-color: #fff;
   height:1140px;
}
.item{
width:750px ;
padding-top: 32px;
padding-bottom: 32px;
padding-left: 21px;
padding-right: 21px;
border-bottom-style:solid ;
border-bottom-color:#ececec ;
border-bottom-width: 1px;
flex-direction: row;
justify-content: space-between;
align-items: center;
}
.user-image{
width:103px;
height:103px;
background-color:#ececec;
margin-right:18px;
}
.re_icon {
font-family: iconfont;
color: #ee1c41;
font-size: 40px;
font-weight: bold;
} 
.lefts{
flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.title1{
font-size: 26px;
text-align: center;
}
.name{
padding-bottom:10px;
padding-top:10px;
lines: 1;
width:300px;
}
.font-22 {
font-size: 22px;
line-height: 22px;
}
.font-32 {
    font-size: 32px;
    line-height: 32px;
}
.songer{
lines: 1;
width:300px;
}
.rights{
width:141px;
flex-direction: column;
justify-content: center;
align-items: center;
text-align: center;
}
.image{
justify-content: center;
align-items: center;
margin-bottom:13px;
}
.notic{
width:46px;
height:46px;
}
.examine{
width:106px;
height:79px;
}
.color-pink {
color: #EE1C41 !important;
}
.color-gray {
color: #666666;
}
.color-white {
color: #fff;
}
.color-blur {
color: #0066ff;
}
.color-green {
color: #1cb24b;
}
.color-black {
color: #000;
}
</style>
