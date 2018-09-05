
<template>
  <div class="container11">
  	<div class="top" :style="{paddingTop:source==='iOS'?62:20+'px'}">
      <image class="reImage-view" :src='imgUrl+"back.png"' @click="pop()" ></image>
      <text class="title ">发布活动</text>
      <text class="title red" @click="create()" >发布</text>
  	</div>
    <scroller class="main">
      <div class="release-title margin-top-80">
        <input placeholder='输入活动名称' v-model="formData.title" class="re_inpt padleft-20"/>
      </div>
      <div class="release-words">
        <textarea placeholder='填写活动描述，让更多人参加活动...' v-model="formData.content" class="padleft-20 textarea1"></textarea>
      </div>
      <div class="create-icon">
        <div class="img1" v-for="(item,index) in backImg.arr">
          <image class="img1-view1" resize="cover" :key="index" :src='imageUrl+item' @click="openLightBox(item)"></image>
          <image class="img1-view2" :src='imgUrl+"close1.png"' @click="deleteIcon(index)"></image>
        </div>
        <div class="img2" v-if="backImg.arr.length<9" @click="createIcon()">
          <image class="img2-view" :src='imgUrl+"create11.png"'></image>
        </div>
        <div class="tip-text" v-if="backImg.arr.length==0">
          <text class="tipTxt1">上传第一张图片为封面图</text>
        </div>
      </div>
      <div class="bigImg" @click="closeBigImg" v-if="bigImg" v-for="(item,index) in backImg.arr">
          <image :src='imageUrl+item' resize="cover" :key="index" class="big-img1" v-if="index === imgIndex"></image>
      </div>
      <div class="release-type">
        <text class="release-p-0">活动类型</text>
        <div class="release-type-choice" >
          <text class="release-p" v-for="(item,index) in acTypeTest" :key="index" :class="[active === index?'active':'']" @click="selectAcType(index,item)">{{item.name}}</text>
        </div>
      </div>
      <div class="release-type">
        <text class="release-p-0">选择标签</text>
        <div class="release-type-choice" >
          <text class="release-p-choice" v-for="(item,index) in actTagTest" :key="index" :class="[item.checked?'active':'']" @click="click1(item)">{{item.name}}</text>
        </div>
      </div>
      <div class="release-sign">
        <text :class="[isShow?'release-switch-isSign':'']" class="release-switch" @click="changeIsSign()">活动签到</text>
        <div class="switch-box" >
          <div class="switch-item" v-if="isShow">
            <text class="switch-txt1">参与人数</text>
            <input type="number" class="switch-inpt" v-model="formData.memberLimit"/>
            <text class="switch-txt2">人</text>
          </div>
          <div class="switch-item" v-if="isShow">
            <text class="switch-txt1">活动费用</text>
            <text class="switch-btn" :class="[freeType?'switch-open':'switch-off']" @click='freeType=!freeType'>免费</text>
            <text class="switch-btn" :class="[!freeType?'switch-open':'switch-off']" @click='freeType=!freeType'>费用</text>
          </div>
          <div class="switch-item" v-if="!freeType">
            <text class="switch-txt1">金额</text>
            <input class="switch-inpt"   type="number" v-model="formData.fee"/>
          </div>
          <div class="switch-item border-bom" v-for="(item,index) in formData.award" v-if="isShow">
            <text class="switch-txt1">奖品设置</text>
            <input type="text"  class="switch-inpt" v-model="item.awardName"/>
            <text class="switch-txt3">数量</text>
            <input type="number" class="switch-inpt"  v-model="item.awardNum"/>
            <text class="add switch-btn" @click='add()' v-if="index === 0">新增</text>
            <image class="delImg" :src='imgUrl+"close1.png"' v-else @click='deleteAward(index)'></image>
          </div>
          <div class="switch-item-special">
               <text class="special-text">活动起止时间</text>
               <div class="pick">
                <text @click="selectSTime" class="place-text">{{startDate===''?'开始时间':startDate}}</text>
               </div>
               <text>—</text>
              <div class="pick">
                <text @click="selectETime" class="place-text ">{{endDate===''?'结束时间':endDate}}</text>
              </div>
          </div>
          <div class="switch-item-address" @click="openMap">
            <div class="addressImg">
              <img class="addressImg-view" :src='imgUrl+"location.png"'/>
            </div>
            <text class="address-text">{{activityAddress}}</text>
          </div>
        <!-- 选择部落 -->
        <div class="select-club">
          <div class="tag-wrapper" v-if="confirmClubList.length==0">
            <text @click="choiceClub" class="clubTag">选择部落</text>
          </div>
          <div class="tag-wrapper" @click="choiceClub" v-for="(item,index) in confirmClubList" :key="index" >
            <text class="clubTag">{{item.clubName}}部落</text>
          </div>
        </div>
        <wxc-popup popup-color="#fff"
            :show="isBottomShow"
            @wxcPopupOverlayClicked="popupOverlayBottomClick"
            pos="bottom"
            height="630">
          <div class="demo-content">
            <div class="select-title">
              <text class="close font-28" @click="isBottomShow=false">取消</text>
              <text class="title font-30">我的部落</text>
              <text class="create font-28 color-pink" @click="makeSure">确定</text>
            </div>
            <list class="club-wrapper" @loadmore="fetch" loadmoreoffset='10'>
              <cell @click="selectClub(item)" v-for="(item,index) in clubList" :key="index" class="club-item">
                <div class="item-left">
                  <image class="club-img" :src="imgSrc+item.clubLogo"></image>
                  <div class="club-msg">
                    <text class="club-title font-26">{{item.clubName}}</text>
                    <text class="club-desc font-22 color-gray">人气{{item.clubMemberNum}} 话题{{item.topicNum}}</text>
                    <text class="club-desc font-22 color-gray-light">部落介绍：{{item.clubDesc}}</text>
                  </div>
                </div>
                <image class="item-right" :src='imgUrl+(item.clubRelation==0?"selected.png":"unselected.png")'></image>
              </cell>
            </list>
          </div>
        </wxc-popup>
        </div>
      </div>
    </scroller>
		<wxc-loading :show="isLoading"
                 :need-mask="true"></wxc-loading>
    <wxc-lightbox
      ref="wxc-lightbox"
      height="800"
      :show="lightBoxShow"
      :image-list="imageList"
      :show-indicator = false
      @wxcLightboxOverlayClicked="wxcLightboxOverlayClicked">
    </wxc-lightbox>
  </div>
</template>

<script>
import { WxcPopup } from "weex-ui";
import mixins from "../../mixins";
import {
  putActivity,
  putFile,
  getUserInfo,
  getUserClassclub
} from "../../api/activity.js";
import { getClubList } from "../../api/club.js";
import { PhotoAlbum } from "../../api/weex.js";
import { WxcLoading, WxcLightbox } from "weex-ui";
const modal = weex.requireModule("modal");
const picker = weex.requireModule("picker");
const storage = weex.requireModule("storage");
const myyuleMap = weex.requireModule("MyyuleLocation"); //打开地图
const myyulePhoto = weex.requireModule("MyyulePhotoAlbum"); //打开相册
export default {
  mixins: [mixins],
  components: { WxcLightbox, WxcPopup },
  data() {
    return {
      tabPageHeight: 1284,
      imageList: [],
      isBottomShow: false,
      lightBoxShow: false,
      lng: "",
      lat: "",
      formData: {
        actType: "音乐",
        actTag: ["校友"],
        title: "",
        content: "",
        memberLimit: "",
        feeType: "0",
        isSign: "0",
        fee: "0",
        award: [
          {
            awardName: "",
            awardNum: ""
          }
        ],
        logo: "",
        images: [],
        startTime: "",
        endTime: "",
        longitude: "",
        latitude: "",
        address: "",
        clubIds: []
      },
      active: 0,
      acTypeTest: [
        { name: "音乐", checked: false },
        { name: "讲座", checked: false },
        { name: "展览", checked: false },
        { name: "聚会", checked: false },
        { name: "运动", checked: false },
        { name: "旅行", checked: false },
        { name: "公益", checked: false },
        { name: "课程", checked: false },
        { name: "赛事", checked: false },
        { name: "美术", checked: false },
        { name: "创意", checked: false },
        { name: "游戏", checked: false },
        { name: "宠物", checked: false },
        { name: "美食", checked: false },
        { name: "摄影", checked: false },
        { name: "动漫", checked: false },
        { name: "番剧", checked: false },
        { name: "娱乐", checked: false },
        { name: "时尚", checked: false },
        { name: "书法", checked: false },
        { name: "其他", checked: false }
      ],
      actTagTest: [
        { name: "生活", checked: true },
        { name: "照片", checked: false },
        { name: "回忆", checked: false },
        { name: "读书", checked: false },
        { name: "青春", checked: false },
        { name: "晒", checked: false },
        { name: "心情", checked: false },
        { name: "故事", checked: false },
        { name: "交友", checked: false },
        { name: "吐槽", checked: false },
        { name: "城市", checked: false },
        { name: "情感", checked: false },
        { name: "怀旧", checked: false },
        { name: "电影", checked: false },
        { name: "爱情", checked: false },
        { name: "童年", checked: false },
        { name: "明信片", checked: false },
        { name: "明星", checked: false },
        { name: "DIY", checked: false },
        { name: "大学", checked: false },
        { name: "购物", checked: false },
        { name: "涂鸦", checked: false },
        { name: "表白", checked: false },
        { name: "吃货", checked: false },
        { name: "歌词", checked: false },
        { name: "其他", checked: false }
      ],
      selectData: [],
      isShow: false,
      freeType: true,
      value: "",
      imageUrl: "data:image/jpg;base64,",
      backImg: {
        arr: [],
        url: []
      },
      activityAddress: "活动在哪？",
      studentData: {},
      chooseId: "",
      issueKey: false,
      chooseClub: [],
      clubBox: [],
      studentBox: [],
      studentClub: [],
      num: 0,
      classId: "",
      position: {},
      isLoading: false,
      type: "default",
      loadTime: true,
      bigImg: false,
      imgIndex: 0,
      startDate: "",
      endDate: "",
      startD: "",
      startT: "",
      endD: "",
      endT: "",
      pageNo: 1,
      clubList: [],
      confirmClubList: []
    };
  },
  created() {
    this.fontIcon();
    if (this.webParam()) {
      let club = this.webParam().club;
      club.clubRelation = 0;
      this.clubList.unshift(club);
      this.confirmClubList.push(club);
      this.formData.clubIds.push(club.clubId);
    } else {
      storage.getItem("data", event => {
        if (JSON.parse(event.data).club) {
          let club = JSON.parse(event.data).club;
          club.clubRelation = 0;
          this.clubList.unshift(club);
          console.log(this.clubList);
          this.confirmClubList.push(club);
          this.formData.clubIds.push(club.clubId);
        }
      });
    }
    //查询用户信息
    this.clearStorage();
    getUserInfo(
      {
        mobile: this.mobile
      },
      { token: this.mobile }
    )
      .then(res => {
        if (res.status == 0) {
          this.chooseId = res.id;
          if (this.chooseId == 336005) {
            this.chooseId = 0;
          }
          this.studentData = res.object ? res.object : [];
          if (this.studentData.className) {
            this.studentClub.push(this.studentData.className + "部落");
            this.studentBox.push("" + this.studentData.classId);
            this.formData.clubIds.push(res.object.classId);
          }
          if (this.studentData.icon.substr(0, 4) != "http") {
            this.studentData.icon =
              "http://media2.myyule.cn/" + this.studentData.icon;
          }
        } else {
          console.log(res.desc);
        }
      })
      .catch(err => {}),
      //查询部落列表
      getClubList(
        {
          pageSize: 10,
          pageNo: this.pageNo,
          mobile: this.mobile
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.clubList = this.clubList.concat(res.object);
            //查询用户学校信息
            getUserClassclub(
              {
                mobile: this.mobile
              },
              { token: this.mobile }
            )
              .then(res => {
                if (res.status == 0) {
                  let arr = res.object;
                  arr.clubRelation = 0;
                  this.clubList.unshift(res.object);
                  console.log(this.clubList);
                  this.confirmClubList.push(res.object);
                  this.formData.clubIds.push(res.object.clubId);
                } else {
                  modal.alert({ message: res.desc });
                }
              })
              .catch(err => {});
          } else {
            modal.alert({ message: res.desc });
          }
        })
        .catch(err => {});
  },
  mounted() {
    // 数据埋点
    this.putPageUrlLog(1609);
  },
  methods: {
    // 部落翻页
    fetch() {
      this.pageNo++;
      getClubList(
        {
          pageNo: this.pageNo,
          pageSize: 10,
          mobile: this.mobile
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.clubList = this.clubList.concat(res.object);
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
    },
    //	活动类型传参
    selectAcType(index, item) {
      this.active = index;
      if (item.checked) {
        item.checked = false;
      } else {
        item.checked = true;
      }
      this.formData.actType = item.name;
    },
    //活动标签传参
    click1(item) {
      if (item.checked) {
        item.checked = false;
      } else {
        if (this.selectData.length < 3) {
          item.checked = true;
        } else {
          modal.toast({
            message: `最多选择3个`,
            duration: 0.8
          });
        }
      }
      this.formData.actTag = [];
      this.selectData = [];
      this.actTagTest.forEach((value, index, array) => {
        if (value.checked) {
          this.formData.actTag.push(value.name);
          this.selectData.push(value);
        }
      });
      return this.formData.actTag;
    },
    //活动签到
    changeIsSign() {
      if (this.isShow) {
        this.formData.isSign = 0;
        this.formData.award = [{ awardName: "", awardNum: "" }];
        this.formData.memberLimit = "";
        this.isShow = false;
        this.tabPageHeight = 1284;
      } else {
        this.formData.isSign = 1;
        this.isShow = true;
        this.tabPageHeight = 1084;
      }
    },
    //发布活动
    create() {
      if (this.loadTime) {
        this.formData.logo = this.backImg.url[0];
        console.log(this.formData.fee);
        this.isLoading = true;
        if (this.startDate != "" && this.endDate != "") {
          this.formData.startTime = this.startDate;
          this.formData.endTime = this.endDate;
        }
        this.formData.images = this.backImg.url;
        this.formData.mobile = this.mobile;
        if (!this.freeType) {
          this.formData.feeType = 1;
        } else {
          this.formData.feeType = 0;
        }
        if (this.formData.title == "") {
          modal.toast({
            message: "活动名称不能为空",
            duration: 0.5
          });
          this.isLoading = false;
        } else if (this.formData.content == "") {
          modal.toast({
            message: "活动描述不能为空",
            duration: 0.5
          });
          this.isLoading = false;
        } else if (
          this.formData.images == undefined ||
          this.formData.images.length == 0
        ) {
          modal.toast({
            message: "请上传图片",
            duration: 0.5
          });
          this.isLoading = false;
        } else if (
          this.formData.startTime == "" ||
          this.formData.endTime == ""
        ) {
          modal.toast({
            message: "活动时间需要填写",
            duration: 0.5
          });
          this.isLoading = false;
        } else if (this.formData.startTime > this.formData.endTime) {
          modal.toast({
            message: "结束时间不小于开始时间",
            duration: 0.5
          });
          this.isLoading = false;
        } else if (this.formData.address == "") {
          modal.toast({
            message: "活动地址不能为空",
            duration: 0.5
          });
          this.isLoading = false;
        } else {
          putActivity(this.formData, { token: this.mobile })
            .then(res => {
              if (res.status == 0) {
                this.loadTime = true;
                this.isLoading = false;
                modal.alert({
                  message: "创建成功",
                  duration: 1
                });
                this.pop();
              } else {
                this.loadTime = true;
                this.isLoading = false;
                modal.alert({
                  message: res.desc,
                  duration: 1
                });
              }
            })
            .catch();
        }
      } else {
        this.isLoading = false;
        return;
      }
    },
    // 开始时间
    selectSTime() {
      picker.pickDate(
        {
          value: this.startD
        },
        event => {
          if (event.result === "success") {
            this.startD = event.data;
            setTimeout(() => {
              picker.pickTime(
                {
                  value: this.startT
                },
                event => {
                  if (event.result === "success") {
                    this.startT = event.data;
                    this.startDate = this.startD + " " + this.startT;
                  }
                }
              );
            }, 500);
          }
        }
      );
    },
    //结束时间
    selectETime() {
      picker.pickDate(
        {
          value: this.endD
        },
        event => {
          if (event.result === "success") {
            this.endD = event.data;
            setTimeout(() => {
              picker.pickTime(
                {
                  value: this.endT
                },
                event => {
                  if (event.result === "success") {
                    this.endT = event.data;
                    this.endDate = this.endD + " " + this.endT;
                  }
                }
              );
            }, 500);
          }
        }
      );
    },
    //  活动主页
    toLayout(item) {
      console.log(item.id);
      this.push2("/views/activity/active_layout/active_detail", {
        resId: item.id
      });
    },
    //  新增奖品
    add() {
      this.tabPageHeight = this.tabPageHeight - 50;
      this.formData.award.push({
        awardName: "",
        awardNum: ""
      });
    },
    // 删除奖品
    deleteAward(index) {
      this.formData.award.splice(index, 1);
    },
    //新增相册图片
    createIcon() {
      var self = this;
      var photoLength = "" + (9 - self.backImg.arr.length);
      var updateIndex = 0;
      myyulePhoto.showAlbumViewByMaxNum(photoLength, function(e) {
        if (e.status == 1) {
          //循环的时候传文件
          self.isLoading = true;
          e.images.forEach((value, index, array) => {
            self.backImg.arr.push(value.image); //上传图片
            putFile({
              appid: self.appid,
              fileContent: value.image,
              fileType: "jpg"
            })
              .then(res => {
                if (res.status == 0) {
                  updateIndex++;
                  if (index == 0) {
                    self.backImg.url.unshift(res.object);
                  } else {
                    self.backImg.url.push(res.object);
                  }
                  if (updateIndex == array.length) {
                    self.isLoading = false;
                    modal.alert({ message: "图片上传完毕！" });
                  }
                } else {
                  self.isLoading = false;
                  modal.alert({
                    message: JSON.stringify(res),
                    duration: 0.5
                  });
                }
              })
              .catch();
          });
        }
      });
    },
    //打开地图
    openMap() {
      var self = this;
      var mapObj = {
        latitude: self.formData.latitude,
        longitude: self.formData.longitude,
        locAddrStr: self.formData.address
      };
      if (JSON.stringify(mapObj) == {}) {
        mapObj = "";
      }
      myyuleMap.openMap({}, function(e) {
        self.formData.longitude = e.longitude;
        self.formData.latitude = e.latitude;
        self.formData.address = e.locAddrStr;
        self.activityAddress = e.locAddrStr;
      });
    },
    //取出存储值
    storage(val) {
      storage.getItem(val, res => {
        if (res.result == "success") {
          this.val = res.data;
        }
      });
    },
    //删除照片
    deleteIcon(index) {
      this.backImg.arr.splice(index, 1);
      this.backImg.url.splice(index, 1);
    },
    //点击取消
    close() {
      this.studentBox = [];
      this.clubBox = [];
      this.issueKey = false;
      this.chooseClub = [];
      console.log(this.studentBox);
      console.log(this.clubBox);
    },
    // 选择部落
    selectClub(item) {
      if (item.clubRelation == 0) {
        item.clubRelation = 1;
      } else {
        let a = 0;
        this.clubList.forEach(value => {
          if (value.clubRelation == 0) {
            a++;
          }
        });
        if (a > 2) {
          modal.toast({ message: "最多只能选择3个部落" });
          return;
        }
        item.clubRelation = 0;
      }
    },
    // 确定选择的部落
    makeSure() {
      this.confirmClubList = [];
      this.clubList.forEach(value => {
        if (value.clubRelation == 0) {
          this.confirmClubList.push(value);
          this.formData.clubIds.push(value.clubId);
        }
      });
      console.log(this.confirmClubList);
      this.isBottomShow = false;
    },
    // 关闭部落弹层
    popupOverlayBottomClick() {
      this.isBottomShow = false;
    },
    //放大查看图片
    openLightBox(img) {
      this.imageList[0] = { src: this.imageUrl + img };
      this.lightBoxShow = true;
    },
    //关闭放大查看图片
    wxcLightboxOverlayClicked() {
      // 无状态组件，需要在此次关闭
      this.lightBoxShow = false;
    },
    // 打开弹层
    choiceClub() {
      this.isBottomShow = true;
    },
    closeBigImg() {
      this.bigImg = false;
    },
    clearStorage() {
      storage.removeItem("year1");
      storage.removeItem("year2");
      storage.removeItem("month1");
      storage.removeItem("month2");
      storage.removeItem("day1");
      storage.removeItem("day2");
      storage.removeItem("hour1");
      storage.removeItem("hour2");
      storage.removeItem("min1");
      storage.removeItem("min2");
    }
  }
};
</script>

<style src="../../assets/style/index.scss">
</style>
<style scoped>
.container11 {
  width: 750px;
  flex: 1;
}
.top {
  width: 750px;
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
}
.reImage-view {
  width: 61px;
  height: 61px;
}
.title {
  color: #000;
  line-height: 61px;
  font-size: 32px;
}
.red {
  color: #ef1842;
}
.padleft-20 {
  padding-top: 0px;
  padding-left: 20px;
  padding-bottom: 0px;
  padding-right: 20px;
}
.release-title {
  width: 730px;
  height: 104px;
  padding-top: 0px;
  padding-left: 10px;
  padding-bottom: 0px;
  padding-right: 10px;
  border-bottom-style: solid;
  border-bottom-color: #bababa;
  border-bottom-width: 1px;
}
.re_inpt {
  width: 700px;
  height: 84px;
  font-size: 32px;
  margin-top: 18px;
}
.release-words {
  width: 750px;
  height: 230px;
  padding-top: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
  padding-right: 10px;
}
.textarea1 {
  width: 700px;
  height: 230px;
  line-height: 35px;
  font-size: 30px;
  margin-top: 18px;
}
.create-icon {
  width: 750px;
  padding-top: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
  padding-right: 10px;
  flex-direction: row;
  margin-top: 40px;
  flex-wrap: wrap;
  margin-left: 20px;
}
.tip-text {
  margin-top: 190px;
}
.tipTxt1 {
  font-size: 24px;
  color: #666666;
}
.bigImg {
  position: fixed;
  top: 155px;
  width: 750px;
  height: 1200px;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  justify-content: center;
  align-items: center;
}
.big-img1 {
  width: 600px;
  height: 800px;
  margin-top: 50px;
  margin-bottom: 50px;
}
.img2 {
  width: 154px;
  height: 154px;
}
.img2-view {
  width: 154px;
  height: 154px;
}
.img1 {
  width: 154px;
  height: 154px;
  position: relative;
  flex-direction: row;
  margin-bottom: 20px;
  margin-right: 10px;
}
.img1-view1 {
  width: 154px;
  height: 154px;
}
.img1-view2 {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 0;
  right: 0;
}
.release-type {
  margin-top: 20px;
  border-top-style: solid;
  border-top-color: #e4dede;
  border-top-width: 1px;
  width: 750px;
  position: relative;
}
.release-p-0 {
  position: relative;
  left: 10px;
  margin-top: 40px;
}
.release-p {
  text-align: center;
  width: 100px;
  height: 50px;
  padding-top: 5px;
  padding-left: 5px;
  padding-bottom: 5px;
  padding-right: 5px;
  font-size: 26px;
  background-color: #ece8e8;
  line-height: 36px;
  margin-top: 8px;
  margin-left: 10px;
  margin-bottom: 8px;
  margin-right: 10px;
  border-radius: 10px;
  color: #888484;
}
.release-type-choice {
  top: 0;
  left: 120px;
  width: 610px;
  flex-direction: row;
  flex-wrap: wrap;
}
.release-p-choice {
  text-align: center;
  width: 100px;
  height: 50px;
  padding: 5px;
  font-size: 26px;
  background-color: #ece8e8;
  line-height: 36px;
  margin-top: 8px;
  margin-left: 10px;
  margin-bottom: 8px;
  margin-right: 10px;
  border-radius: 10px;
  color: #888484;
}
.active {
  color: #ffffff;
  background-color: #ef294a;
}
.release-sign {
  width: 750px;
  margin-top: 20px;
  border-top-style: solid;
  border-top-color: #e4dede;
  border-top-width: 1px;
}
.release-switch {
  width: 200px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  color: #ffffff;
  background-color: #bababa;
  border-radius: 10px;
  margin-top: 35px;
  margin-left: 0px;
  margin-bottom: 20px;
  margin-right: 10px;
}
.release-switch-isSign {
  width: 200px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  color: #ffffff;
  background-color: #ef294a;
  border-radius: 10px;
  margin-top: 35px;
  margin-left: 0px;
  margin-bottom: 20px;
  margin-right: 10px;
}

.switch-box {
  width: 750px;
  padding-top: 10px;
  padding-bottom: 50px;
}
.switch-item {
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
  margin-right: 20px;
  width: 600px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.switch-btn {
  margin-left: 12px;
  margin-right: 12px;
  width: 120px;
  text-align: center;
  height: 55px;
  line-height: 55px;
  border-radius: 60px;
}
.switch-txt1 {
  width: 160px;
  text-align: left;
  height: 55px;
  line-height: 55px;
  border-radius: 5px;
}
.switch-txt2 {
  width: 60px;
  text-align: center;
  height: 55px;
  line-height: 55px;
  border-radius: 60px;
}
.switch-txt3 {
  width: 90px;
  text-align: center;
  height: 55px;
  line-height: 55px;
  border-radius: 5px;
}
.switch-inpt {
  width: 150px;
  height: 55px;
  line-height: 55px;
  text-align: center;
  border-width: 1px;
  border-style: solid;
  border-color: #bababa;
  border-radius: 5px;
}
.delImg {
  margin-left: 12px;
  width: 50px;
  height: 50px;
}
.add {
  margin-left: 10px;
  color: #ffffff;
  background-color: #ef294a;
}
.delete {
  margin-left: 10px;
  color: #ffffff;
  background-color: #6b636b;
}
.switch-open {
  color: #ffffff;
  background-color: #ef294a;
}
.switch-off {
  color: #000000;
  background-color: #ffffff;
}
.switch-item-special {
  border-top-style: solid;
  border-top-color: #e4dede;
  border-top-width: 1px;
  margin-top: 0px;
  margin-left: 20px;
  margin-bottom: 0px;
  margin-right: 20px;
  width: 710px;
  padding-top: 20px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.pick {
  width: 150px;
  height: 60px;
  justify-content: center;
  align-content: center;
}
.place-text {
  font-size: 24px;
  color: #828282;
  text-align: center;
}
.special-text {
  height: 40px;
  line-height: 40px;
}
.special-inpt {
  width: 320px;
  height: 40px;
  font-size: 24px;
  line-height: 40px;
  text-align: center;
  border-width: 1px;
  border-style: solid;
  border-color: #bababa;
  border: none;
}
.switch-item-address {
  margin: 20px 0px;
  padding: 10px;
  flex-direction: row;
}
.border-bom {
  width: 750px;
}
.addressImg {
  width: 40px;
  height: 40px;
  margin-top: 7px;
}
.addressImg-view {
  width: 40px;
  height: 40px;
}
.address-text {
  background-color: #f7f7f7;
  color: #666666;
  font-size: 24px;
  lines: 1;
  width: 540px;
  line-height: 40px;
  border-radius: 20px;
}
.club-wrapper {
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
}
.activity {
  right: 0px;
  bottom: 10px;
  transition: all 0.2s linear;
  opacity: 0;
  transform: translate3d(0, 0, 0);
}
.background {
  width: 750px;
  position: fixed;
  left: 0px;
  top: 155px;
  bottom: 0px;
  right: 0px;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 1;
}
.content {
  width: 710px;
  height: 172px;
  flex-direction: row;
  margin-left: 20px;
  border-bottom-style: solid;
  border-bottom-color: #e7efe7;
  border-bottom-width: 1px;
}
.row {
  margin-top: 10px;
  flex-direction: row;
}
.select-title {
  width: 750px;
  flex-direction: row;
  height: 88px;
  border-bottom-width: 1px;
  border-bottom-color: #ececec;
  border-bottom-style: solid;
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;
  justify-content: space-between;
}
.demo-content {
  flex: 1;
}
.item-right {
  width: 70px;
  height: 70px;
}
.club-item {
  width: 750px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 24px;
  padding-top: 24px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
}
.club-item,
.item-left {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.club-title,
.club-desc {
  lines: 1;
  text-overflow: ellipse;
  margin-bottom: 15px;
}
.club-msg {
  width: 200px;
  margin-left: 23px;
}
.select-club {
  width: 750px;
  padding: 21px;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
}
.tag-wrapper {
  background-color: #ee1c41;
  padding: 11px;
  border-radius: 5px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.clubTag {
  lines: 1;
  text-overflow: ellipsis;
  color: #fff;
  font-size: 22px;
}
.club-img {
  width: 130px;
  height: 130px;
  border-radius: 100px;
  background-color: #ececec;
}
</style>