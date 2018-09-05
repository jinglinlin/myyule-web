<template>
  <div class="container11 padleft-20" >
  	<div class="head-top"></div>
  	<div class="top" :style="{paddingTop:source==='iOS'?62:20+'px'}">
  	  <image class="reImage-view" :src='imgUrl+"back.png"' @click="pop()" ></image>
      <text class="title">修改活动</text>
      <text class="title red" @click="create()">修改</text>
  	</div>
  	<scroller class="scroller-box">
	    <div class="release-title">
	    	<input  placeholder='输入活动名称' v-model="formData.title" class="padleft-20 re-inpt">
	    </div>
	    <div class="release-words">
	    	<textarea v-model="formData.content" class="padleft-20 txtarea"></textarea>
	    </div>
	    <div class="create-icon">
	    	<div class="img1" v-for="(item,index) in backImg.url">
		      	<image class="img1-view1" resize="cover"  :key="index" :src="item"></image>
		      	<image class="img1-view2" :src='imgUrl+"close1.png"' @click="deleteIcon(index)"></image>
	    	</div>
	    	<div class="img2" v-if="backImg.url.length<9" @click="createIcon()">
	      		<image class="img2-view" :src='imgUrl+"create11.png"'></image>
	    	</div>
	    	<div class="tip-text" v-if="backImg.url.length==0">
	      		<text class="tipTxt1">上传第一张图片为封面图</text>
	    	</div>
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
	    		<text class="release-p-choice" v-for="(item,index) in actTagTest" :key="index" @click="click1(item)" :class="[item.checked?'active':'']">{{item.name}}</text>
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
	            <text class="switch-btn":class="[freeType?'switch-open':'switch-off']" @click='freeType=!freeType'>免费</text>
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
	            <text class="switch-btn add" @click='add()' v-if="index === 0">新增</text>
	            <image class="delImg" :src='imgUrl+"close1.png"' v-else @click='deleteAward(index)'></image>
	            <!-- <text class="delete" v-else @click='deleteAward(index)'>删除</text>  -->
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
	            <!--@click="openMap"-->
	            <div class="addressImg">
	              <img class="addressImg-view" :src='imgUrl+"location.png"'/>
	            </div>
	            <text class="address-text">{{activityAddress}}</text>
	          </div>
	    	</div>
	    </div>
    </scroller>
		
		<wxc-loading :show="isLoading"
                 :need-mask="true"></wxc-loading>
  </div>
</template>

<script>
import mixins from "../../mixins";
import { putActivityInfo, putActivity, putFile } from "../../api/activity.js";
const modal = weex.requireModule("modal");
const picker = weex.requireModule("picker");
const storage = weex.requireModule("storage");
const myyuleMap = weex.requireModule("MyyuleLocation"); //打开地图
const myyulePhoto = weex.requireModule("MyyulePhotoAlbum"); //打开相册
export default {
  components: {},
  mixins: [mixins],
  data() {
    return {
      lng: "",
      lat: "",
      formData: {
        longitude: "",
        latitude: "",
        address: "",
        actTag: [],
        award: [
          {
            awardName: "",
            awardNum: ""
          }
        ]
      },
      resId: "", //this.$route.query.resId,
      active: "",
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
        { name: "其他", checked: false },
      ],
      actTagTest: [
        { name: "生活", checked: false },
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
        { name: "其他", checked: false },
      ],
      selectData: [],
      isShow: "",
      freeType: true,
      studentData: {},
      schoolData: {},
      clubData: [],
      selectClubData: [],
      imageUrl: "data:image/jpg;base64,",
      backImg: {
        arr: [],
        url: []
      },
      isLoading: false, //加载标记
      loadTime: true, //提交标记
      activityAddress: "",
      startDate: "",
      endDate: "",
      startD: "",
      startT: "",
      endD: "",
      endT: ""
    };
  },
  beforeCreate() {
    this.fontIcon();
  },
  created() {
      if(this.webParam()){
          this.resId=this.webParam().resId;
          // 获取活动详情
          // 获取活动详情
          this.ActivityInfo();
      }else {
          storage.getItem("data", event => {
              this.resId = JSON.parse(event.data).resId;
              // 获取活动详情
              this.ActivityInfo();
          });
      }
  },
  mounted() {
    // 数据埋点
    this.putPageUrlLog(1610);
  },
  methods: {
    // 获取活动详情
    ActivityInfo() {
      putActivityInfo(
        {
          appid: this.appid,
          resId: this.resId
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.formData.mobile = this.mobile;
            this.formData.actId = this.resId;
            this.formData.logo = res.object.logo;
            this.formData.title = res.object.title;
            this.formData.content = res.object.content;
            this.formData.images = res.object.images;
            console.log(this.formData.images[0]);
            for (let i = 0; i < this.formData.images.length; i++) {
              if (this.formData.images[i].substr(0, 4) != "http") {
                this.formData.images[i] =
                  "http://media2.myyule.cn/" + this.formData.images[i];
              }
            }
            let tagValue = ''
            res.object.actTag.forEach(value=>{
              tagValue = value
              this.actTagTest.forEach((value,index,array)=>{
                if(value.name == tagValue){
                  value.checked = true
                }
              })
            })
            this.backImg.url = this.formData.images;
            this.backImg.arr = this.formData.images;
            this.formData.actType = res.object.actType;
            for (let i = 0; i < this.acTypeTest.length; i++) {
              if (res.object.actType == this.acTypeTest[i].name) {
                this.active = i;
              }
            }
            this.formData.actTag = res.object.actTag;
            // this.formData.startTime = res.object.starttime.replace(/ /, "T");
            // this.formData.endTime = res.object.endtime.replace(/ /, "T");
            this.formData.startTime = res.object.starttime;
            this.formData.endTime = res.object.endtime;

            this.startDate = res.object.starttime;
            this.startD = this.startDate.substr(0, 10);
            this.startT = this.startDate.substring(10);
            this.endDate = res.object.endtime;
            this.endD = this.endDate.substr(0, 10);
            this.endT = this.endDate.substring(10);

            this.formData.address = res.object.address;
            this.activityAddress = res.object.address;
            this.formData.longitude = res.object.longitude;
            this.lng = res.object.longitude;
            this.formData.latitude = res.object.latitude;
            this.lat = res.object.latitude;
            this.formData.isSign = res.object.isSign;

            // modal.alert({
            //   message: JSON.stringify(res.object.starttime),
            //   duration: 0.8
            // });
            if (this.formData.isSign == 1) {
              //签到功能 1开启
              this.isShow = true;
              console.log(this.isShow);
              this.formData.memberLimit = res.object.memberLimit;
              this.formData.award = res.object.award;
              this.formData.feeType = res.object.feeType;
              if (this.formData.feeType == 1) {
                this.freeType = false;
                this.formData.fee = res.object.fee;
              } else if (this.formData.feeType == 0) {
                this.freeType = true;
                this.formData.fee = 0;
              }
            } else if (this.formData.isSign == 0) {
              //	      	this.formData.memberLimit = 0;
              this.formData.award = [
                {
                  awardName: "",
                  awardNum: ""
                }
              ];
              this.isShow = false;
            }
          } else {
            modal.alert({
              message: res.desc,
              duration: 0.8
            });
          }
        })
        .catch(err => {});
    },
    //活动类型传参
    selectAcType(index, item) {
      this.active = index;
      if (item.checked) {
        item.checked = false;
      } else {
        item.checked = true;
      }
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
      for (let i = 0; i < 3 - this.formData.actTag.length; i++) {
        this.formData.actTag.push("");
      }
      return this.formData.actTag;
    },
    changeIsSign() {
      // if (this.isShow) {
      //   this.formData.isSign = 0;
      //   this.isShow = false;
      // } else {
      //   this.formData.isSign = 1;
      //   this.isShow = true;
      // }
      // console.log(this.isShow);
      // console.log(this.formData.isSign);
    },
    //发布活动
    create() {
      if (this.loadTime) {
        this.isLoading = true;
        this.loadTime = false;
        // 取出存储 有空优化
        this.formData.mobile = this.mobile;
        this.formData.logo = this.backImg.url[0];
        this.formData.images = this.backImg.url;
      this.formData.actTag = [];
      this.actTagTest.forEach((value, index, array) => {
        if (value.checked) {
          this.formData.actTag.push(value.name);
        }
      });
      this.acTypeTest.forEach((value,index,array)=>{
        if (value.checked) {
          this.formData.actType = value.name;
        }
      })
        if (!this.freeType) {
          this.formData.feeType = 1;
        } else {
          this.formData.feeType = 0;
        }
        if (this.isSign == 1) {
          if (this.memberLimit == "" || this.memberLimit == 0) {
            modal.toast({
              message: "请填写参与人数",
              duration: 0.5
            });
            this.isLoading = false;
          }
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
          putActivity(this.formData)
            .then(res => {
              if (res.status == 0) {
                this.isLoading = false;
                this.loadTime = true;
                modal.toast({
                  message: "修改成功",
                  duration: 1
                });
                // this.push2("/views/activity/active_layout/active_detail", {
                //   resId: this.resId
                // });
                this.pop();
              } else {
                this.isLoading = false;
                this.loadTime = true;
                modal.toast({
                  message: res.desc,
                  duration: 1
                });
              }
            })
            .catch();
          this.isLoading = false;
        }
      } else {
        this.loadTime = false;
        return;
      }
    },
    //  新增奖品
    add() {
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
      myyulePhoto.showAlbumViewByMaxNum(photoLength, function(e) {
        if (e.status == 1) {
          //循环的时候传文件
          for (let i = 0; i < e.images.length; i++) {
            // self.backImg.arr.push(self.imageUrl+e.images[i].image); //上传图片
            putFile({
              appid: self.appid,
              fileContent: e.images[i].image,
              fileType: "jpg"
            })
              .then(res => {
                if (res.status == 0) {
                  self.backImg.url.push(
                    "http://media2.myyule.cn/" + res.object
                  );
                  // modal.alert({message:JSON.stringify(self.backImg.url)})
                } else {
                  modal.alert({
                    message: res.desc,
                    duration: 0.5
                  });
                }
              })
              .catch();
          }
        }
      });
    },
    deleteIcon(index) {
      this.backImg.arr.splice(index, 1);
      this.backImg.url.splice(index, 1);
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
      myyuleMap.openMap(mapObj, function(e) {
        self.formData.longitude = e.longitude;
        self.formData.latitude = e.latitude;
        self.formData.address = e.locAddrStr;
        self.activityAddress = e.locAddrStr;
      });
    },
    //选择开始时间
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
                    this.formData.startTime = this.startD + " " + this.startT;
                  }
                }
              );
            }, 500);
          }
        }
      );
    },
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
                    this.formData.endTime = this.endD + " " + this.endT;
                  }
                }
              );
            }, 500);
          }
        }
      );
    }
  }
};
</script>

<style scope>
.container11 {
  width: 720px;
  flex: 1;
  position: relative;
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
  top: 0;
  width: 750px;
  left: 0;
  background-color: #fff;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 22px;
  padding-left: 40px;
  padding-bottom: 22px;
  padding-right: 40px;
  border-bottom-style: solid;
  border-bottom-color: #d9d9d9;
  border-bottom-width: 1px;
  position: fixed;
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
.red {
  color: #ef1842;
}
.padleft-20 {
  padding-top: 0;
  padding-left: 20px;
  padding-bottom: 0;
  padding-right: 20px;
}
.margin-top-80 {
  margin-top: 133px;
}
.margin-top-40 {
  margin-top: 103px;
}
.scroller-box {
  flex: 1;
  width: 750px;
  height: 1284px;
}
.release-title {
  width: 730px;
  height: 104px;
  margin-top: 155px;
  padding-top: 0;
  padding-left: 10px;
  padding-bottom: 0;
  padding-right: 10px;
  border-bottom-style: solid;
  border-bottom-color: #bababa;
  border-bottom-width: 1px;
}
.re-inpt {
  width: 700px;
  height: 94px;
  font-size: 32px;
  margin-top: 8px;
}
.release-words {
  width: 720px;
  height: 230px;
  padding: 10px;
}
.txtarea {
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
  width: auto;
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
}
.big-img1 {
  width: 600px;
  height: 800px;
  margin-top: 50px;
  margin-bottom: 50px;
  margin-left: auto;
  margin-right: auto;
  background-size: cover;
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
  /* padding-left: 10px;
  padding-right:10px;
  padding-top:10px;
  padding-bottom: 10px; */
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
  width: 720px;
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
  margin-bottom: 8px;
  margin-left: 10px;
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
  padding-top: 5px;
  padding-left: 5px;
  padding-bottom: 5px;
  padding-right: 5px;
  font-size: 26px;
  background-color: #ece8e8;
  line-height: 36px;
  margin-top: 8px;
  margin-bottom: 8px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 10px;
  color: #888484;
}
.active {
  color: #ffffff;
  background-color: #ef294a;
}
.release-sign {
  width: 720px;
  margin-top: 20px;
  border-bottom-style: solid;
  border-bottom-color: #e4dede;
  border-bottom-width: 1px;
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
  margin-bottom: 20px;
  margin-left: 10px;
  margin-right: 0px;
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
  margin-bottom: 20px;
  margin-left: 10px;
  margin-right: 0px;
}
.switch-box {
  width: 720px;
  margin-top: -20px;
  padding-top: 40px;
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
.add {
  color: #ffffff;
  background-color: #ef294a;
}
.delImg {
  margin-left: 12px;
  width: 50px;
  height: 50px;
}
.delete {
  margin-left: 10px;
  color: #ffffff;
  background-color: #6b636b;
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
.switch-open {
  color: #ffffff;
  background-color: #ef294a;
}
.switch-off {
  color: #666;
  background-color: #f7f7f7;
}
.switch-item-special {
  border-top-style: solid;
  border-top-color: #e4dede;
  border-top-width: 1px;
  margin-top: 0px;
  margin-bottom: 0px;
  width: 720px;
  padding-top: 20px;
  padding-bottom: 20px;
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
  height: 60px;
  margin: 20px 0px;
  padding: 10px;
  flex-direction: row;
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
  color: #000;
  font-size: 24px;
  lines: 1;
  width: 540px;
  line-height: 40px;
  height: 40px;
  border-radius: 20px;
}
.border-bom {
  width: 750px;
}
</style>