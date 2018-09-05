<template>
  <div :class="['create-topic',source==='iOS'?'':'active']">
    <!-- 发布话题页面 -->
    <div class="create-wrapper">
      <!-- 头部-->
      <div class="top">
        <text class="close font-28" @click="close">取消</text>
        <text class="title font-30">编辑话题</text>
        <text class="create font-28 color-pink" @click="create()">发表</text>
      </div>
      <!-- 创建话题主体 -->
      <div class="body">
        <div class="topic-tag">
          <text class="font-28 color-pink">{{tags}}</text>
        </div>
        <textarea  class="topic-content" v-model="formData.content"></textarea>
        <!-- 选择图片 -->
        <div class="topic-icon">
          <div class="img1" v-for="(item,index) in formData.images" :key="index">
            <image class="img1-view1" resize="cover" :key="index" :src='imgSrc+item' @click="openLightBox(item)"></image>
            <image class="img1-view2" :src='imgUrl+"close1.png"' @click="deleteIcon(index)"></image>
          </div>
          <div class="img2" v-if="formData.images.length<9" @click="createIcon()">
            <image class="img2-view" :src='imgUrl+"create11.png"'></image>
          </div>
        </div>
        <!-- 选择地址 -->
        <div @click="openMap" class="setAdress">
          <text class="iconfont font-22 color-gray adress">&#xe609;{{activityAddress}}</text>
        </div>
      </div>
    </div>
    
    <wxc-loading :show="isShow"
                :need-mask="true"></wxc-loading>
  </div>
</template>
<script>
import { WxcSearchbar, WxcPopup } from "weex-ui";
// import topicResult from "./topicResult.vue";
import mixins from "../../mixins";
import { putFile, getUserClassclub } from "../../api/activity";
import { getClubList } from "../../api/club";
import { getTopicHistoryTag, getTopicTag, updateTopic,topicDetail } from "../../api/topic";
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");
const myyulePhotoAlbum = weex.requireModule("MyyulePhotoAlbum");
const myyuleMap = weex.requireModule("MyyuleLocation"); //打开地图

export default {
  mixins: [mixins],
  components: { WxcSearchbar, WxcPopup },
  data: () => ({
    createTagKey: true,
    isBottomShow: false,
    clubList: [],
    tags:'',
    formData: {
      topicTags: [],
      content: "",
      images: [],
      address: "",
      longitude: "",
      latitude: "",
      topicId:'',
      clubIds: []
    },
    topicImgArr: [],
    topicImgUrl: [],
    activityAddress: "你在哪里？",
    value: "",
    light: true,
    pageNo: 1,
    topicList: [],
    isShow: false,
    key: false,
    imageType: "",
    selectData: [],
    confirmClubList: [],
    historyTopicList:[]
  }),
  created() {
    this.fontIcon();
    storage.getItem("data", event => {
      this.isShow = true;
      // 获取当前话题
      topicDetail(
        { resId: JSON.parse(event.data).resId },
        { mobile: this.mobile }
      )
        .then(res => {
        this.isShow = false;
          if (res.status == 0) {
            this.formData.address = res.object.address;
            this.formData.topicTags = res.object.topicTags;
            this.formData.mobile = this.mobile;
            this.formData.images = res.object.images;
            // this.formData.clubIds = res.object.clubIds;
            this.formData.longitude = res.object.longitude;
            this.formData.latitude = res.object.latitude;
            this.formData.topicId = JSON.parse(event.data).resId;
            this.formData.content = res.object.content;

            this.activityAddress = this.formData.address;
            this.formData.topicTags.forEach(value=>{
              this.tags = this.tags+'#'+value+'#';
            })
          } else {
            modal.alert({ message: res.desc });
          }
        })
        .catch();
    })
    // 查看历史话题
    getTopicHistoryTag(
      { mobile: this.mobile, pageNo: this.pageNo, pageSize: 10 },
      { mobile: this.mobile }
    )
      .then(res => {
        if (res.status == 0) {
          this.topicList = res.object;
          this.historyTopicList = res.object;
        } else {
          modal.alert({ message: res.desc });
        }
      })
      .catch();
  },
  mounted() {
    // 数据埋点
    this.putPageUrlLog(1705);
  },
  computed: {
  },
  methods: {
    close(){
      this.pop()
    },
    // 发布话题
    create() {
      if (this.formData.content == "") {
        modal.toast({
          message: "话题内容不能为空",
          duration: 0.5
        });
      } else if (
        this.formData.topicTags == undefined ||
        this.formData.topicTags.length == 0
      ) {
        modal.toast({
          message: "话题标签不能为空",
          duration: 0.5
        });
      } else {
        this.isShow = true;
        updateTopic(this.formData, { mobile: this.mobile })
          .then(res => {
            this.isShow = false;
            if (res.status == 0) {
              modal.toast({ message: "发布成功" });
              this.pop();
            } else {
              modal.alert({ message: res.desc });
            }
          })
          .catch();
      }
    },
    
    
    //放大查看图片
    openLightBox(img) {
      this.imageList[0] = { src: this.imgSrc + img };
      this.lightBoxShow = true;
    },
    // 删除图片
    deleteIcon(index) {
      this.topicImgArr.splice(index, 1);
      this.formData.images.splice(index, 1);
    },
    //新增相册图片
    createIcon() {
      var _this = this;
      var photoLength = "" + (9 - _this.topicImgArr.length);
      myyulePhotoAlbum.showAlbumViewByMaxNum(photoLength, function(e) {
        if (e.status == 1) {
          //循环的时候传文件
          _this.isShow = true;
          e.images.forEach((value, index, array) => {
            putFile({
              appid: _this.appid,
              fileContent: value.image,
              fileType: "jpg"
            })
              .then(res => {
                if (res.status == 0) {
                  _this.isShow = false;
                  _this.topicImgArr.push(value.image); //上传图片
                  _this.formData.images.push(res.object);
                  if (_this.formData.images.length == index) {
                    _this.isShow = false;
                  }
                } else {
                  _this.isShow = false;
                  modal.alert({
                    message: res.desc,
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
      var _this = this;
      var mapObj = {
        latitude: _this.formData.latitude,
        longitude: _this.formData.longitude,
        locAddrStr: _this.formData.address
      };
      if (JSON.stringify(mapObj) == {}) {
        mapObj = "";
      }
      myyuleMap.openMap(mapObj, function(e) {
        _this.formData.longitude = e.longitude;
        _this.formData.latitude = e.latitude;
        // modal.alert({message:e.locAddrStr})
        _this.formData.address = e.locAddrStr;
        _this.activityAddress = e.locAddrStr;
      });
    },
  }
};
</script>


<style src="../../assets/style/index.scss">
</style>

<style scoped>
.iconfont {
  font-family: iconfont;
}

.club-msg {
  width: 200px;
  margin-left: 23px;
}
.topic-tag {
  margin-top: 20px;
  margin-left: 30px;
  /* flex-direction: row; */
  /* align-items: center; */
  /* flex-wrap:wrap; */
}
.create-tag {
  width: 50px;
  height: 30px;
  align-items: center;
  justify-content: center;
  background-color: #ee1c41;
  margin-left: 5px;
  border-radius: 10px;
  margin-top:10px;
}
.club-title,
.club-desc {
  lines: 1;
  text-overflow: ellipse;
  margin-bottom: 15px;
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
.demo-content {
  flex: 1;
}
.create-topic {
  width: 750px;
  background-color: #fff;
  padding-top: 40px;
  flex: 1;
}
.search-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  flex: 1;
  width: 750px;
  padding-top: 40px;
  bottom: 0;
  background-color: #fff;
}
.active {
  padding-top: 20px;
}
.createTopic {
  flex-direction: row;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  height: 160px;
  padding-top: 18px;
  align-items: center;
  padding-bottom: 18px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #eeccee;
}
.topicItem {
  flex-direction: row;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 22px;
  align-items: center;
  padding-bottom: 22px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #eeccee;
}
.topic-left {
  flex-direction: row;
  align-items: center;
}
.new-topic {
  margin-top: 7px;
}
.topic-img {
  margin-right: 33px;
  width: 124px;
  height: 124px;
}
.create-wrapper {
}
.top,
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
.topic-content {
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 32px;
  margin-bottom: 50px;
  font-size: 28px;
}
.topic-icon {
  margin-left: 30px;
  margin-bottom: 50px;
  flex-direction: row;
  flex-wrap: wrap;
}
.setAdress {
  width: 360px;
  height: 50px;
  padding-left: 10px;
  padding-right: 10px;
  align-items: center;
  flex-direction: row;
  border-radius: 30px;
  background-color: #ececec;
  margin-left: 30px;
  overflow: hidden;
}
.adress {
  lines: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 360px;
}
.tag-tag {
  padding-top: 34px;
  padding-bottom: 34px;
  padding-left: 30px;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
  align-items: flex-start;
}
.tag-content {
  width: 500px;
  margin-left: 30px;
}
.tag-value {
  flex-direction: row;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: 26px;
}
.tag-list {
  flex-direction: row;
  flex-wrap: wrap;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.tag-item {
  width: 86px;
  height: 42px;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
  background-color: #e0e0e0;
  margin-right: 19px;
  margin-left: 19px;
  margin-top: 10px;
  margin-bottom: 10px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.tagnor {
  color: white;
}
.tag-active {
  background-color: #ee1c41;
}
.tagSize {
  color: #3b3b3b;
  font-size: 26px;
}
.img1 {
  width: 154px;
  height: 154px;
  position: relative;
  flex-direction: row;
  margin-bottom: 20px;
  margin-right: 20px;
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
.img2 {
  width: 154px;
  height: 154px;
}
.img2-view {
  width: 154px;
  height: 154px;
}
.select-club {
  position: fixed;
  bottom: 0;
  width: 750px;
  padding: 21px;
  background-color: #ececec;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
}
.clubTag {
  padding: 11px;
  border-radius: 5px;
  color: #fff;
  background-color: #ee1c41;
  font-size: 22px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.club-img {
  width: 130px;
  height: 130px;
  border-radius: 100px;
  background-color: #ececec;
}
.topic-desc {
  width:400px;
}
.topic-title {
  width:400px;
  lines: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
