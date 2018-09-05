<template>
  <div class="mscWrapper" @viewappear="miniShow"  @viewdisappear="miniHidder" :style="{paddingTop:source==='iOS'?50:20+'px'}">
  	<!--加载器-->
  	<wxc-loading :show="isShow"></wxc-loading>
    <!--头部-->
    <div class="header ">
       <text class="iconfont re_icon"  @click="pop()">&#xe625;</text>
       <text class="h-title">{{schoolTitle}}</text>
    </div>
    <!--yinyueren幕后音乐英雄 -->
    <list @loadmore="fetchPage" loadmoreoffset="600" style="height:1184px">
      <cell class="musicianList" v-for="(item,index) in musicianLists">
         <div class="musicianLi row" @click="push2('/views/myPlace/myPlace',{mobile:item.mobile})" :class="[platform==='iOS'?'boxShadow':'']">
           <div class="leftLi row">
              <div class="pic">
                <image class="mscPic" :src="'http://media2.myyule.cn/'+item.icon"></image>
                <text class="degree center">{{item.userLevel}}</text>
              </div>
              <div class="singInfo">
               <text class="singTitle">{{item.nickname}}</text>
               <div class="songNameCert">
                  <text class="singName">{{item.userTag}}</text>
                  <text class="iconfont audio_icon" v-if='item.certification==1'>&#xe600;</text>
                  <text class="iconfont audio_icon" v-else-if='item.certification==2'>&#xe633;</text>
                  <text class="iconfont audio_icon" v-else-if='item.certification==3'>&#xe633;</text>
                  <text class="iconfont audio_icon" v-else-if='item.certification==8'>&#xe633;</text>
                  <text class="iconfont audio_icon" v-else-if='item.certification==4'>&#xe65e;</text>
                  <text class="iconfont audio_icon" v-else-if='item.certification==5'>&#xe66d;</text>
                  <text class="iconfont audio_icon" v-else-if='item.certification==6'>&#xe6b7;</text>
                  <text class="iconfont audio_icon" v-else-if='item.certification==7'>&#xe60d;</text>
                  <text class="iconfont audio_icon" v-else-if='item.certification==10'>&#xe6a4;</text>
                  <text class="iconfont audio_icon" v-else-if='item.certification==11'>&#xe604;</text>
                  <text class="iconfont audio_icon" v-else-if='item.certification==12'>&#xe60d;</text>
                  <text class="iconfont audio_icon" v-else-if='item.certification==9'>&#xe605;</text>
                  <text class="iconfont audio_icon" v-else-if='item.certification==13'>&#xe609;</text>
                  <text class="iconfont audio_icon" v-else-if='item.certification==14'>&#xe609;</text>
               </div>
             </div>
           </div>
           <text class="m-button" v-if="item.userRelation==0" @click="focus(item)">+关注</text>
           <text class="m-button btn-active" v-else-if="item.userRelation==1" @click="focusCancel(item)">已关注</text>
           <text class="m-button btn-active" v-else-if="item.userRelation==2" @click="focusCancel(item)">互相关注</text>
        </div>
      </cell>
    </list>
  </div>
</template>

<script>
import { WxcLoading } from "weex-ui";
import mixins from '../../../mixins';
import { getMusicionList, focusOn, deleteFocusOn } from "../../../api/urlDate";
import { sharePage,setMiniPlayerHidden }from "../../../api/weex";
var stream = weex.requireModule("stream");
var modal = weex.requireModule("modal");
var storage = weex.requireModule("storage");
const navigator = weex.requireModule("navigator");
export default {
  mixins:[mixins],
  components: {
    WxcLoading
  },
  data() {
    return {
      schoolTitle: "幕后音乐英雄",
      schoolType: 0,
    	platform:"",
	    isMask:true,
      pageNo: 1,
      //mobile: "",
      isShow: false,
      musicianLists: []
    };
  },
  beforeCreate(){
    this.fontIcon();
  },
  created() {
     // 显示min播放器
      // this.miniShow();
  	//获取平台信息
  	this.platform=weex.config.env.platform;
  	console.log(weex.config.env.platform);
      if (this.webParam()) {
          this.schoolType = this.webParam().schoolType;
          if(this.schoolType==1){
              this.schoolTitle='校园里音乐人';
          }else if(this.schoolType==2){
              this.schoolTitle='校园外音乐人';
          }
          this.musicionList();
      } else {
          //获取音乐人类型
          storage.getItem("data", event => {
              this.schoolType = JSON.parse(event.data).schoolType;
              if(this.schoolType==1){
                  this.schoolTitle='校园里音乐人';
              }else if(this.schoolType==2){
                  this.schoolTitle='校园外音乐人';
              }
              this.musicionList();
          });
      }

  },
  mounted() {
    // 数据埋点
    this.putPageUrlLog(1304)
    },
  methods: {
    // 获取音乐人列表
    musicionList(pageNo) {
      //加载器
      this.isShow = true;
      getMusicionList(
        {
          schoolType: this.schoolType,
          pageNo: pageNo,
          pageSize: 10,
          sort: "new"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            console.log(res);
            this.musicianLists =
              pageNo > 1 ? this.musicianLists.concat(res.object) : res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 加载下一页
    fetchPage() {
      this.pageNo += 1;
      this.musicionList(this.pageNo);
      setTimeout(() => {}, 800);
    },
    // 关注
    focus(item) {
      if (this.mobile !== "") {
        this.isShow = true;
        focusOn(
          {
            mobile: this.mobile,
            toMobile: item.mobile
          },
          { token: this.mobile }
        )
          .then(res => {
            if (res.status == 0) {
              this.isShow = false;
              item.userRelation = 1;
              modal.toast({
                message: "关注成功!",
                duration: 1
              });
            } else {
              console.log("关注失败," + res.desc);
            }
          })
          .catch(err => {});
      } else {
        modal.toast({
          message: "请登录!",
          duration: 1
        });
      }
    },
    // 取消关注
    focusCancel(item) {
	  const _this = this;
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
            deleteFocusOn(
			  {
				mobile:  _this.mobile,
				toMobile: item.mobile
			  },
			  { token:  _this.mobile }
			)
			  .then(res => {
				if (res.status == 0) {
				   _this.isShow = false;
				  item.userRelation = 0;
				  modal.toast({
					message: "取消成功!",
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
    },
	/*toShare() {
	  let itemObj = {
		title:"分享音乐人",
		desc: "校园音乐人分享",
		web_url: "http://www.myyule.com/app/down",
		img_url: "",
		sourse:""
	  };
	  sharePage(itemObj);
	}*/
  }
};
</script>

<style scoped>
.mscWrapper {
  width: 750px;
  flex: 1;
  background-color: #fff;
 /*  padding-top:50px; */
}
.iconfont {
  font-family: iconfont;
}
.row {
  flex-direction: row;
  justify-content: space-between;
}
.center {
  justify-content: center;
  align-items: center;
}
.header {
  height: 100px;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ccc;
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color:#fff;
}
.re_icon {
  color: #ee1c41;
  font-size: 45px;
  font-weight: bold;
  position: absolute;
  top: 30px;
  left: 30px;
}
.share_icon {
  color: #ee1c41;
  font-size: 45px;
  font-weight: bold;
}
.h-title {
  font-weight: bold;
  line-height: 100px;
  font-size: 36px;
}
.musicianList {
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
}
.musicianLi {
  height: 192px;
  padding-left: 30px;
  padding-right: 20px;
  border-radius: 15px;
  margin-bottom: 20px;
  align-items: center;
  background-color: #fff;
  border-width: 1px;
  border-style: solid;
  border-color: #ececee;
}
.boxShadow{
  box-shadow: 0px 0px 11px 0px #d9d9d9;
}
.leftLi {
  align-items: flex-end;
}
.pic {
  position: relative;
  width: 96px;
  height: 96px;
  margin-right: 10px;
}
.mscPic {
  width: 96px;
  height: 96px;
  border-width: 1px;
  border-style: solid;
  border-color: #ccc;
  border-radius: 48px;
}
.degree {
  flex: 1;
  position: absolute;
  right: 0px;
  bottom: 0px;
  width: 36px;
  height: 36px;
  text-align: center;
  line-height: 36px;
  font-size: 20px;
  color: yellow;
  background-color: #ee1c41;
  border-radius: 18px;
}
.singInfo {
  margin-right: 6px;
}
.singTitle {
  font-size: 28px;
  margin-top: 10px;
}
.songNameCert {
  flex-direction: row;
  justify-content: flex-start;
}
.singName {
  font-size: 28px;
  margin-top: 10px;
  color: #ccc;
}
.audio_icon {
  color: #ccc;
  font-size: 45px;
}
.m-button {
  width: 109px;
  height: 58px;
  background-color: #fff;
  color: #ee1c41;
  font-size: 22px;
  border-style: solid;
  border-width: 1px;
  border-color: #ee1c41;
  border-radius: 5px;
  text-align: center;
  padding-top: 12px;
}
.btn-active {
  background-color: #ee1c41;
  color: #fff;
}
</style>
