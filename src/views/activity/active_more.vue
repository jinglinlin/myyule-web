<!--现场活动-->
<template>
  <div class="second-container-special">
  	<div class="top" :style="{paddingTop:source==='iOS'?50:20+'px'}">
      <image class="reImage-view" :src='imgUrl+"back.png"' @click="pop()" ></image>
      <text class="title font-32">更多活动</text>
      <image @click="sao" class="image-view1" :src='imgUrl+"scan.png"'></image>
  	</div>
    <div class="share-sort1" >
    	<div class='row' v-for="(item,index) in navList" @click="tab(index)">
	  		<text class='sort1-text' :key="index" :class="[active === index?'active1':'']">{{item.text}}</text>
	  		<div class="img-show1">
	          <image class="show1-view" :src='imgUrl+"down-gray.png"' v-if="active != index"></image>
	          <image class="show1-view" :src='imgUrl+"up-red.png"' v-if="active === index"></image>
	        </div>
  		</div>
	  </div>
	 <!--<div class="now-box">-->
	<div class="null-content" v-if="activityData.length == 0">
    		<image class="cont-view" resize="contain"  :src='imgUrl+"noContent.png"'></image>
    	</div>
	<list class="wrap" @loadmore="fetchPage" loadmoreoffset="600">
		<cell v-for="(item,index) in activityData" :key="index">
          <div class="clubActivity-item" :class="[platform==='iOS'?'shadow1':'border1']">		        
              <div class="activity-banner" @click="toLayout(item)">
  		           <div class="banner-show">
  			          	<image class="banner-view"  resize="cover" :src="item.logo.substr(0,4)==='http'?item.logo:mylImg+item.logo"></image>
  			         </div>
  	               <div class="activity-static" v-if="light">
  		                <text class='static-txt' v-if="item.judge === 0">{{stateText1}}</text>
  		                <text class='static-txt' v-if="item.judge === 1">{{stateText2}}</text>
  		                <text class='static-txt' v-if="item.judge === 2">{{stateText3}}</text>
  	               </div>
  		        </div>
  		        <div class="activity-content">
  			        <div class="activity-title">
  			          <text class="font-32 tit-text">{{item.title}}</text>
  			          <text class="content-span" @click="toScene(item)">{{item.actType}}</text>
  			        </div>
  			        <div class="content-1 contRow">
  			          <div class="adress contRow">
  			            <div class="contImage">
  			              <image class="contImage-view" :src='imgUrl+"adress.png"'></image>
  			            </div>
  			            <text  class="fix-width fix-span">{{item.address}}</text>
  			          </div>
  			        </div>
  			        <div class="content-2 contRow">
  			          <div class="time contRow">
  			            <div class="contImage">
  			              <image class="contImage-view" :src='imgUrl+"time.png"'></image>
  			            </div>
  			            <text class="fix-width fix-span">{{item.starttime}}-{{item.endtime}}</text>
  			          </div>
  			        </div>
  			        <div class="content-3 contRow">
  			          <div class="feeType contRow">
  			            <div class="contImage">
  			              <image class="contImage-view" :src='imgUrl+"feeType.png"'></image>
  			            </div>
  			            <text class="fix-width fix-span" v-if="item.feeType==0">免费</text>
  			            <text class="fix-width fix-span" v-if="item.feeType!=0">{{item.fee}}.00</text>
  			          </div>
  			        </div>
  			      </div>
  		        <div class="activity-foot">
  			      	  <div class="heart" @click="toLayout(item)">
  				          	<image class="heart-view" :src='imgUrl+"comment.png"'></image>
                      <text class="fix-span">{{item.commentNum}}</text>
  		          	</div>
  		            <div class="heart" @click="toThumb(item)" v-if="item.isThumb == 0" >
    				          	<image class="heart-view"  :src='imgUrl+"thumbNum.png"'></image>
  		          		<text class="heart-span">{{item.thumbNum}}</text>
  		            </div>
                   <div class="heart" @click="toDeleteThumb(item)" v-if="item.isThumb == 1">
                      <image class="heart-view"  :src='imgUrl+"thumbNumActive.png"'></image>
                      <text class="heart-span">{{item.thumbNum}}</text>
                  </div>
  			        <div class="heart-special" @click="toLayout(item)">
  			          	 <text class="special-span">想参加{{item.joinNum}}人</text>
  			        </div>
  		            <div class="heart-action" v-if='mobile!=item.mobile' @click="moreOpt(item)">
  		          		 <text class="action-span">...</text>
  		            </div>
  		          	<div class="heart-action" v-if='mobile==item.mobile' @click="moreOpt1(item)">
  		          	 	<text class="action-span">...</text>
  		          	</div>
  		          </div>
              </div>
		</cell>
	</list>
  	<!--</div>-->
    <wxc-popup popup-color="#fff"
               :show="isBottomShow"
               @wxcPopupOverlayClicked="popupOverlayBottomClick"
               pos="bottom"
               height="227"
               width="750">
      <div class="demo-content">
          <div class="botMoreOpt col" ref="botMoreOptBg" >
	        <div class="optItems col">
	           <text @click="toReport()" class="optDesc">举报</text>
	        </div>
	        <text class="optDesc" @click="close()">取消</text>
	      </div>
      </div>
    </wxc-popup>
   <wxc-popup popup-color="#fff"
					   :show="isBottomShow1"
					   @wxcPopupOverlayClicked="popupOverlayBottomClick1"
					   pos="bottom"
					   height="341"
					   width="750">
      <div class="demo-content">
          <div class="botMoreOpt col" ref="botMoreOptBg1" >
	        <div class="optItems col">
	         	<text @click="toRevise(itemObj1)" class="optDesc">修改</text>
	           <text @click="toDelete(item)" class="optDesc">删除</text>
	        </div>
	        <text class="optDesc" @click="close1()">取消</text>
	      </div>
      </div>
    </wxc-popup>
    <wxc-loading :show="isLoading"
                 :type="type"
                 :loading-text="loadingText"
                 :interval="interval"></wxc-loading>
     <div class="move">
    	<div v-if="active === 0||active === 1||active === 2||active === 3" class="issue-item activity">
    		<div class="background" @click="swithActive"></div>
    	</div>
    </div>
    <!-- 筛选条件 -->
    <div v-if="active != 'tab'">
      <div class="share-sort3" v-if="active == 0">
        <text class="sort3-text" v-for="(item,index) in typeList" :key="index" :class="[act1 === index?'active3':'']" @click="selectType(index,item)" >{{item.text}}</text>
      </div>
      <div class="share-sort2" v-if="active == 1">
        <div v-for="(item,index) in schoolList" class='row2' @click="selectSchool(index,item)" >
          <text  class='sort2-text'  :key="index" :class="[act2 === index?'active2':'']">{{item.text}}</text>
          <div class="img-show2" >
            <image class="show2-view" :src='imgUrl+"select.png"' v-if="act2=== index"></image>
          </div>
        </div>
      </div>
      <div class="share-sort2" v-if="active == 2">
        <div v-for="(item,index) in timeList" class='row2' @click="selectTime(index,item)" >
          <text class='sort2-text'  :key="index" :class="[act3 === index?'active2':'']">{{item.text}}</text>
          <div class="img-show2" >
            <image class="show2-view" :src='imgUrl+"select.png"' v-if="act3=== index"></image>
          </div>
        </div>
      </div>
      <div class="share-sort2" v-if="active == 3">
        <div v-for="(item,index) in priceList" class='row2' @click="selectPrice(index,item)">
          <text class='sort2-text'  :key="index" :class="[act4 === index?'active2':'']">{{item.text}}</text>
          <div class="img-show2">
            <image class="show2-view" :src='imgUrl+"select.png"' v-if="act4=== index"></image>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { WxcPopup, Utils, WxcLoading } from "weex-ui";
import { scan ,toLogin} from "../../api/weex";
import mixins from "../../mixins";
import {
  getActivity,
  deleteActivity,
  putReport,
  putThumb,
  deleteThumb
} from "../../api/activity.js";
import { getUserInfo } from "../../api/userInfo.js";
var modal = weex.requireModule("modal");
var navigator = weex.requireModule("navigator");
export default {
  components: {
    WxcPopup,
    WxcLoading
  },
  mixins: [mixins],
  data() {
    return {
      userInfo: [],
      mylImg: "http://media2.myyule.cn/",
      formData: {
        resId: "",
        feeType: "",
        actType: "",
        actScope: "",
        sort: "",
        pageNo: 1
      },
      stateText1: "即将开始",
      stateText2: "进行中",
      stateText3: "已结束",
      commonUrl: "http://172.19.192.194:30301/web/#",
      nowDay: "",
      activityData: [],
      active: "tab",
      tagList: [{ name: "activityLayout", text: "更多活动" }],
      navList: [
        { text: "类型" },
        { text: "全部" },
        { text: "近期" },
        { text: "价格" }
      ],
      typeList: [
        { text: "全部", isShow: true, parameter: "all" },
        { text: "音乐", isShow: false, parameter: "音乐" },
        { text: "讲座", isShow: false, parameter: "讲座" },
        { text: "展览", isShow: false, parameter: "展览" },
        { text: "聚会", isShow: false, parameter: "聚会" },
        { text: "运动", isShow: false, parameter: "运动" },
        { text: "公益", isShow: false, parameter: "公益" },
        { text: "旅行", isShow: false, parameter: "旅行" },
        { text: "课程", isShow: false, parameter: "课程" },
        { text: "赛事", isShow: false, parameter: "赛事" },
        { text: "美术", isShow: false, parameter: "美术" },
        { text: "创意", isShow: false, parameter: "创意" },
        { text: "游戏", isShow: false, parameter: "游戏" },
        { text: "宠物", isShow: false, parameter: "宠物" },
        { text: "美食", isShow: false, parameter: "美食" },
        { text: "摄影", isShow: false, parameter: "摄影" },
        { text: "动漫", isShow: false, parameter: "动漫" },
        { text: "番剧", isShow: false, parameter: "番剧" },
        { text: "娱乐", isShow: false, parameter: "娱乐" },
        { text: "时尚", isShow: false, parameter: "时尚" },
        { text: "书法", isShow: false, parameter: "书法" },
        { text: "其他", isShow: false, parameter: "其他" },
      ],
      schoolList: [
        { text: "全部", isShow: false, parameter: "all" },
        { text: "校内", isShow: false, parameter: "school" },
        { text: "同院系", isShow: false, parameter: "depart" },
        { text: "同班级", isShow: false, parameter: "class" }
      ],
      timeList: [
        { text: "全部", isShow: false, parameter: "all" },
        { text: "最热", isShow: false, parameter: "hot" },
        { text: "最新", isShow: false, parameter: "new" }
      ],
      priceList: [
        { text: "全部", isShow: false, parameter: "all" },
        { text: "免费", isShow: false, parameter: 0 },
        { text: "付费", isShow: false, parameter: 1 }
      ],
      actType: "",
      act1: "",
      act2: "1",
      act3: "1",
      act4: "1",
      isBottomShow: false,
      isBottomShow1: false,
      itemObj: {},
      itemObj1: {},
      isShow: true,
      light: true,
      isLoading: false,
      interval: 0,
      type: "default",
      loadingText: "",
      loadTime: true,
      activityLength: "",
      platform: "", //平台信息
      schoolName: "" //学校关系
    };
  },
  beforeCreate() {
    this.fontIcon();
  },
  created() {
    //获取平台信息
    this.platform = weex.config.env.platform;
    console.log(weex.config.env.platform);
    // 获取活动列表
    this.getInfo();
  },

  mounted(){
    // 数据埋点
    this.putPageUrlLog(1601);
  },
  methods: {
    getInfo() {
      this.isLoading = true;
      // 获取用户信息 判断是否包含学校信息，进行校内活动筛选
      getUserInfo(
        {
          mobile: this.mobile
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isLoading = false;
            this.userInfo = res.object;
            // if (res.object.schoolName) {
            //   this.act2 = 1;
            //   this.navList[1].text = "校内";
            //   this.formData.actScope = "school";
            //   this.formData.pageNo = "1";
            //   this.requestSelected(this.formData);
            // } else {
              this.request({ token: this.mobile });
            // }
            storage.setItem("userIcon", res.object.icon);
          } else {
            this.isLoading = false;
            this.request({ token: this.mobile });
            // modal.toast({
            //    message:JSON.stringify(res.desc),
            //    duration: 1
            //  });
            console.log(res.desc);
          }
        })
        .catch(err => {});
    },
    //上拉加载
    fetchPage() {
      if (!this.isLoading) {
        this.formData.pageNo++;
        if (this.activityLength < 10) {
          return;
        } else {
          this.request(this.formData);
        }
        console.log(this.activityLength);
      }
    },
    //  活动主页(OK)
    toLayout(item) {
      this.push2("/views/activity/active_layout/active_detail", {
        resId: item.resId,
        judge: item.judge
      });
    },
    //现场活动
    toScene(item) {
      console.log(item.resId);
      this.push2("/views/activity/activity", {
        resId: item.resId,
        actType: item.actType
      });
    },
    //删除活动
    toDelete(item) {
      this.isBottomShow1 = false;
      var self = this;
      modal.confirm(
        {
          message: "确定删除吗?",
          okTitle: "确定",
          cancelTitle: "再想想",
          duration: 0.3
        },
        function(value) {
          if (value == "确定") {
            deleteActivity(
              {
                mobile: self.itemObj1.mobile,
                resId: self.itemObj1.resId
              },
              { token: self.itemObj1.mobile }
            )
              .then(res => {
                if (res.status == 0) {
                  modal.toast({
                    message: "删除成功",
                    duration: 1
                  });
                  this.light = true;
                  this.request();
                } else {
                  modal.alert({
                    message: res.desc,
                    duration: 1
                  });
                  this.light = true;
                }
              })
              .catch();
          } else {
            this.light = true;
          }
        }
      );
    },
    //编辑
    toRevise(item) {
      //var self = this;
      if (this.activeState(item) === "已结束") {
        modal.alert({ message: "活动已经结束无法进行修改！" });
      } else if (this.activeState(item) === "进行中") {
        modal.alert({ message: "活动进行中无法进行修改！" });
      } else {
        this.push2("/views/release/releaseContentRevise", {
          resId: item.resId
        });
      }
      //var self = this;
      //console.log(self.itemObj1.resId);
      //this.push2("/views/release/releaseContentRevise", { resId: self.itemObj1.resId });
    },
    activeState(item) {
      let itime = new Date();
      let stime = new Date(item.starttime.replace(new RegExp(/-/gm), "/"));
      let etime = new Date(item.endtime.replace(new RegExp(/-/gm), "/"));
      console.log(Number(stime));
      if (Number(stime) > Number(itime)) {
        return "即将开始";
      } else if (Number(itime) > Number(etime)) {
        return "已结束";
      } else {
        return "进行中";
      }
    },
    // 举报
    toReport() {
        this.isBottomShow = false;
        if (!this.mobile || this.mobile == "") {
            toLogin({ loginOut: "0" });
            return;
        }
      var self = this;
      modal.prompt(
        {
          message: "举报",
          okTitle: "确定",
          cancelTitle: "取消",
          duration: 1
        },
        value => {
          if (value.result == "确定") {
            this.reportData = value.data;
            putReport(
              {
                toUsercode: "myyule_service",
                reason: this.reportData,
                mobile: this.mobile,
                url:
                  this.commonUrl + "/activityDetail?resId=" + self.itemObj.resId
              },
              { token: this.mobile }
            )
              .then(res => {
                if (res.status == 0) {
                  modal.alert({
                    message: "举报成功",
                    duration: 1
                  });
                  this.light = true;
                } else {
                  this.light = true;
                  modal.alert({
                    message: res.desc,
                    duration: 1
                  });
                }
              })
              .catch();
          } else {
            this.light = true;
          }
        }
      );
    },
    //活动点赞
    toThumb(item) {
        if (!this.mobile || this.mobile == "") {
            toLogin({ loginOut: "0" });
            return;
        }
      this.isLoading = true;
      if (this.loadTime) {
        this.loadTime = false;
        putThumb(
          {
            appid: this.appid,
            resId: item.resId,
            resType: "activity",
            mobile: this.mobile
          },
          { token: this.mobile }
        )
          .then(res => {
            if (res.status == 0) {
              item.thumbNum = item.thumbNum + 1;
              item.isThumb = 1;
              this.isLoading = false;
              this.loadTime = true;
            } else {
              modal.alert({
                message: res.desc,
                duration: 1
              });
              this.isLoading = false;
              this.loadTime = true;
            }
          })
          .catch();
      } else {
        this.isLoading = false;
        return;
      }
    },
    //取消活动点赞
    toDeleteThumb(item) {
        const _this=this;
      // this.isLoading = true;
      if (this.loadTime) {
          modal.confirm(
              {
                  message: "确定取消点赞么 ?",
                  okTitle: "确定",
                  cancelTitle: "取消",
                  duration: 0.3
              },
              function(value) {
                  if (value === "确定") {
                      _this.isLoading = true;
                      deleteThumb(
                          {
                              appid: _this.appid,
                              resId: item.resId,
                              resType: "activity",
                              mobile: _this.mobile
                          },
                          { token: _this.mobile }
                      )
                          .then(res => {
                              if (res.status == 0) {
                                  item.thumbNum = item.thumbNum - 1;
                                  item.isThumb = 0;
                                  _this.isLoading = false;
                                  _this.loadTime = true;
                              } else {
                                  console.log(res.desc);
                                  modal.alert({
                                      message: res.desc,
                                      duration: 1
                                  });
                                  _this.isLoading = false;
                                  _this.loadTime = true;
                              }
                          })
                          .catch();
                  }
              }
          )

      } else {
        this.isLoading = false;
        return;
      }
    },
    //筛选条件选项卡，
    tab(index) {
      if (index === this.active) {
        this.active = "tab";
      } else {
        this.active = index;
      }
    },
    //类型
    selectType(index, item) {
      this.act1 = index;
      this.navList[0].text = item.text;
      this.formData.actType = item.parameter;
      this.formData.pageNo = "1";
      this.requestSelected(this.formData);
      this.active = "tab";
      console.log(this.activityLength);
    },
    //学校
    selectSchool(index, item) {
      this.act2 = index;
      this.navList[1].text = item.text;
      this.formData.actScope = item.parameter;
      this.formData.pageNo = "1";
      this.requestSelected(this.formData);
      this.active = "tab";
    },
    selectTime(index, item) {
      this.act3 = index;
      this.navList[2].text = item.text;
      this.formData.sort = item.parameter;
      this.formData.pageNo = "1";
      this.requestSelected(this.formData);
      this.active = "tab";
    },
    selectPrice(index, item) {
      this.act4 = index;
      this.navList[3].text = item.text;
      this.formData.feeType = item.parameter;
      this.formData.pageNo = "1";
      this.requestSelected(this.formData);
      this.active = "tab";
    },
    //调用活动列表接口
    request(data) {
      this.isLoading = true;
      getActivity(data, { token: this.mobile })
        .then(res => {
          if (res.status == 0) {
            this.isLoading = false;
            this.activityLength = res.object.length;
            this.activityData = res.object
              ? this.activityData.concat(res.object)
              : [];
            for (let i = 0; i < this.activityData.length; i++) {
              var nowTime = this.activityData[i].currentTime;
              console.log(nowTime);
              var lastTime = nowTime.substr(0, 16);
              console.log(lastTime);
              var date1 = this.activityData[i].starttime;
              console.log(date1);
              var date2 = this.activityData[i].endtime;
              console.log(date2);
              this.activityData[i].judge = "";
              if (lastTime < date1) {
                this.activityData[i].judge = 0;
              } else if (date2 >= lastTime && lastTime >= date1) {
                this.activityData[i].judge = 1;
              } else if (date2 < lastTime) {
                this.activityData[i].judge = 2;
              }
              console.log(JSON.stringify(this.activityData[i].judge));
            }
          } else {
            this.isLoading = false;
            modal.alert({
              message: res.desc,
              duration: 1
            });
          }
        })
        .catch(err => {});
    },
    //调用活动列表接口
    requestSelected(data) {
      this.isLoading = true;
      getActivity(data, { token: this.mobile })
        .then(res => {
          if (res.status == 0) {
            this.activityLength = res.object.length;
            this.activityData = res.object;
            //           ? this.activityData.concat(res.object) : []
            for (let i = 0; i < this.activityData.length; i++) {
              if (this.activityData[i].logo.substr(0, 4) != "http") {
                this.activityData[i].logo =
                  "http://media2.myyule.cn/" + this.activityData[i].logo;
              }
              var nowTime = res.object[i].currentTime,
                lastTime = nowTime.substr(0, 16);
              var date1 = this.activityData[i].starttime;
              var date2 = this.activityData[i].endtime;
              this.activityData[i].judge = "";
              if (lastTime < date1) {
                this.activityData[i].judge = 0;
              } else if (date2 >= lastTime && lastTime >= date1) {
                this.activityData[i].judge = 1;
              } else if (date2 < lastTime) {
                this.activityData[i].judge = 2;
              }
              // if(i>10) {
              //   this.activityData[i].judge
              // }
            }
            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.activityData=[];
            modal.alert({
              message: res.desc,
              duration: 1
            });
          }
        })
        .catch(err => {});
    },
    // 更多操作
    moreOpt(item) {
      this.itemObj = item;
      this.isBottomShow = true;
      //this.isShow = false;
      this.light = false;
    },
    // 更多操作
    moreOpt1(item) {
      this.itemObj1 = item;
      this.isBottomShow1 = true;
      this.light = false;
      //this.isShow = false;
    },
    //非状态组件，需要在这里关闭
    popupOverlayBottomClick() {
      this.isBottomShow = false;
      this.light = true;
      //this.isShow = true;
    },
    popupOverlayBottomClick1() {
      this.isBottomShow1 = false;
      this.light = true;
      //this.isShow = true;
    },
    close() {
      this.itemObj = {};
      this.isBottomShow = false;
      this.light = true;
    },
    close1() {
      this.itemObj = {};
      this.isBottomShow1 = false;
      this.light = true;
    },
    //切换蒙版
    swithActive() {
      this.active = "tab";
    },
    openTextLoading() {
      this.interval = 300;
      this.loadingText = this.loadingText ? "" : "正在加载中";
    },
    sao() {
      scan();
    }
  }
};
</script>

<style scope>
/* .wxc-overlay {
width: 750px;
} */
.second-container-special {
  width: 750px;
  flex: 1;
}
.head-top {
  width: 750px;
  height: 50px;
  background-color: #fff;
  top: 0;
  left: 0;
  position: fixed;
}
.top {
  /*top: 0px;*/
  width: 750px;
  /*left: 0;*/
  background-color: #fff;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 40px;
  padding-bottom: 22px;
  padding-right: 40px;
  border-bottom-style: solid;
  border-bottom-color: #d9d9d9;
  border-bottom-width: 1px;
  /*position: fixed;*/
}
.reImage-view {
  width: 61px;
  height: 61px;
}
.re_icon {
  font-family: iconfont;
  color: #ee1c41;
  font-size: 40px;
  font-weight: bold;
}
.title {
  color: #000;
  line-height: 61px;
  font-size: 32px;
}

.image-view1 {
  width: 50px;
  height: 50px;
}
.share-sort1 {
  /*position: fixed;*/
  width: 750px;
  height: 90px;
  /*top: 134px;*/
  /*left: 0;*/
  flex-direction: row;
  background-color: #fff;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom-style: solid;
  border-bottom-color: #878787;
  border-bottom-width: 1px;
  justify-content: space-around;
  align-items: center;
}
.row {
  width: 140px;
  margin-left: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.active1 {
  color: #ef2952;
}
.sort1-text {
  color: black;
  width: 100px;
  height: 74px;
  line-height: 74px;
  text-align: center;
  font-size: 28px;
  border-radius: 15px;
}
.img-show1 {
  width: 40px;
  height: 40px;
}
.show1-view {
  width: 40px;
  height: 40px;
}
.share-sort3 {
  padding-top: 30px;
  padding-bottom: 170px;
  position: fixed;
  top: 224px;
  left: 0;
  background-color: white;
  width: 750px;
  height: 354px;
  flex-direction: row;
  flex-wrap: wrap;
}
.active3 {
  color: white;
  background-color: #ef2952;
}
.sort3-text {
  text-align: center;
  width: 100px;
  height: 50px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 26px;
  background-color: #ece8e8;
  line-height: 36px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 12px;
  margin-right: 12px;
  border-radius: 10px;
  color: #888484;
}
.share-sort2 {
  position: fixed;
  background-color: white;
  left: 0;
  top: 224px;
  width: 750px;
  padding-bottom: 20px;
  flex-direction: column;
}
.active2 {
  color: #ef2952;
}
.row2 {
  margin-top: 10px;
  flex-direction: row;
  justify-content: space-between;
}
.sort2-text {
  color: #8e8989;
  width: 95px;
  height: 40px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 65px;
  margin-right: 65px;
  line-height: 40px;
  font-size: 28px;
  border-radius: 15px;
}
.img-show2 {
  width: 40px;
  height: 40px;
  margin-right: 50px;
}
.show2-view {
  width: 50px;
  height: 50px;
}
.now-box {
  width: 750px;
}
.null-content {
  margin-top: 206px;
  margin-left: 45px;
  width: 660px;
  height: 379px;
}
.cont-view {
  width: 660px;
  height: 379px;
  margin-top: 40px;
}
.wrap {
  width: 750px;
  /*height:1050px;*/
  /*margin-top: 224px;*/
}
.clubActivity-item {
  flex-direction: column;
  /*height: 940px;*/
  background-color: #fff;
  border-radius: 15px;
  justify-content: flex-start;
  margin-left: 25px;
  margin-top: 40px;
  margin-bottom: 40px;
}
.border1 {
  width: 700px;
  border-width: 1px;
  border-style: solid;
  border-color: #bababa;
}
.shadow1 {
  width: 698px;
  box-shadow: 3px 7px 20px 0px #bbbbbb;
}
.activity-banner {
  position: relative;
  width: 698px;
  height: 590px;
  border-radius: 10px;
  margin-bottom: 10px;
  border-radius: 15px;
  overflow: hidden;
}
.banner-show {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 698px;
  height: 600px;
  border-radius: 15px;
}
.banner-view {
  width: 698px;
  height: 600px;
  border-radius: 15px;
}
.activity-static {
  width: 350px;
  background-color: rgba(0, 0, 0, 0.6);
  text-align: left;
  transform: rotate(-45deg);
  transform-origin: 50% 250%;
  position: absolute;
}
.static-txt {
  font-size: 26px;
  color: #fff;
  width: 300px;
  height: 57px;
  line-height: 57px;
  text-align: center;
  border-radius: 10px;
}
.activity-content {
  position: relative;
  width: 680px;
  left: 0px;
  border-bottom-width: 2px;
  border-bottom-style: dashed;
  border-bottom-color: #d9d9d9;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
}
.contRow {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.contImage-view {
  width: 40px;
  height: 40px;
}
.fix-width {
  line-height: 42px;
  margin-left: 13px;
  width: 550px;
}
.fix-span {
  line-height: 50px;
  font-size: 26px;
  color: #828282;
  lines: 1;
}
.activity-title {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
}
.margin-20 {
  margin-top: 20px;
  lines: 1;
  width: 500px;
}
.tit-text {
  line-height: 50px;
  color: #000;
  font-size: 28px;
  width: 500px;
  lines: 1;
  text-align: left;
}
.content-span {
  font-size: 24px;
  line-height: 50px;
  color: #ef1842;
  width: 100px;
  height: 50px;
  margin-right: 20px;
  text-align: center;
  border-width: 2px;
  border-style: solid;
  border-color: #ef1842;
  border-radius: 5px;
}
.type {
  width: 100px;
  height: 35px;
  border-width: 2px;
  border-style: solid;
  border-color: #000;
  border-radius: 15px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-left: 30px;
}
.type-span {
  line-height: 33px;
  text-align: center;
}
.activity-foot {
  position: relative;
  width: 690px;
  left: 0px;
  top: 20px;
  padding-bottom: 40px;
  flex-direction: row;
  justify-content: space-around;
}
.heart {
  width: 118px;
  height: 56px;
  margin-left: 10px;
  flex-direction: row;
  border-radius: 10px;
  border-width: 2px;
  border-style: solid;
  border-color: #bababa;
}
.heart-show {
  width: 60px;
  height: 60px;
  margin-left: 10px;
}
.heart-view {
  width: 50px;
  height: 50px;
  margin-left: 10px;
}
.heart-span {
  line-height: 50px;
  color: #828282;
  font-size: 26px;
}
.heart-special {
  width: 150px;
  height: 56px;
  margin-left: 10px;
  flex-direction: row;
  background-color: #ef1842;
  border-radius: 15px;
}
.special-span {
  width: 150px;
  color: #ffffff;
  text-align: center;
  line-height: 56px;
  font-size: 24px;
}
.heart-action {
  width: 118px;
  height: 56px;
  margin-left: 10px;
  flex-direction: row;
  border-width: 2px;
  border-style: solid;
  border-color: #bababa;
  border-radius: 10px;
}
.action-span {
  width: 118px;
  color: #888787;
  text-align: center;
  line-height: 40px;
}
.botMoreOpt {
  width: 750px;
}
.optItems {
  margin-bottom: 10px;
}
.optDesc {
  width: 750px;
  color: #000;
  text-align: center;
  line-height: 112px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ccc;
  background-color: #fff;
}
/*底部操作结束*/
.on {
  color: #ee1c41;
}
.issue-item {
  position: fixed;
  top: 50px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  width: 750px;
  border-radius: 90px;
}
.background {
  width: 750px;
  position: fixed;
  left: 0px;
  top: 250px;
  bottom: 0px;
  right: 0px;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 1;
}
</style>
