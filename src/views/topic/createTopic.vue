<template>
  <div :class="['create-topic',source==='iOS'?'':'active']">
    <!-- 发布话题页面 -->
    <div class="create-wrapper">
      <!-- 头部-->
      <div class="top">
        <text class="close font-28" @click="close">取消</text>
        <text class="title font-30">发话题</text>
        <text class="create font-28 color-pink" @click="create()">发表</text>
      </div>
      <!-- 创建话题主体 -->
      <div class="body">
        <div class="topic-tag">
          <text class="font-30 color-pink">{{tags}}</text>
          <div v-if="createTagKey" class="create-tag" @click="createTag"><text class="color-white font-22">+</text></div>
        </div>
        <textarea class="font-30 topic-content" v-model="formData.content"></textarea>
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
        <div class="select-adress">
        <div @click="openMap" class="setAdress">
          <text class="iconfont font-22 color-gray adress">&#xe609;{{activityAddress}}</text>
        </div>
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
    <!-- 搜索创建标签 -->
    <div v-if="key" :class="['search-wrapper',source==='iOS'?'':'active']">
      <wxc-searchbar ref="wxc-searchbar"
        :always-show-cancel="true"
        autofocus = "true"
        placeholder="#话题、电影、书、歌曲、地点、股票"
        @wxcSearchbarInputOnFocus="wxcSearchbarInputOnFocus"
        @wxcSearchbarCancelClicked="wxcSearchbarCancelClicked"
        @wxcSearchbarInputOnInput="wxcSearchbarInputOnInput"
        @wxcSearchbarCloseClicked="wxcSearchbarCloseClicked">
      </wxc-searchbar>
      <list class="list">
        <cell v-if="value" @click="toCreate(value)" class="createTopic">
          <div class="topic-left">
            <image class="topic-img" :src="imgUrl+'topic-img.png'"></image>
            <div class="topic-desc">
              <text class="topic-title font-28">#{{value}}#</text>
              <text class="new-topic font-22 color-gray">新话题</text>
            </div>
          </div>
          <text class="topic-right font-24 color-gray">#话题#</text>
        </cell>
        <cell @click="toCreate(item.topicTag)" class="topicItem" v-for="(item,index) in topicList" :key="index">
          <div class="topic-left">
            <text class="topic-title font-28">#{{item.topicTag}}#</text>
          </div>
          <text class="topic-right font-24 color-gray">#话题#</text>
        </cell>
      </list>
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
import { getTopicHistoryTag, getTopicTag, putTopic } from "../../api/topic";
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");
const myyulePhotoAlbum = weex.requireModule("MyyulePhotoAlbum");
const myyuleMap = weex.requireModule("MyyuleLocation"); //打开地图

export default {
  mixins: [mixins],
  components: { WxcSearchbar, WxcPopup },
  data() {
    return {
      createTagKey: true,
      isBottomShow: false,
      clubList: [],
      backing: false,
      tags: "",
      formData: {
        topicTags: [],
        content: "",
        images: [],
        address: "",
        longitude: "",
        latitude: "",
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
      key: true,
      imageType: "",
      selectData: [],
      confirmClubList: [],
      historyTopicList: []
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
          console.log(this.clubList)
          this.confirmClubList.push(club);
          this.formData.clubIds.push(club.clubId);
        }
      });
    }
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
                console.log(this.clubList)
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
    this.putPageUrlLog(1703);
  },
  computed: {},
  methods: {
    close() {
      if (this.backing) {
        this.key = false;
        this.backing = false;
      } else {
        this.pop();
      }
      // this.value = '';
      // this.tags = '';
      // this.formData.topicTags = [];
      // this.topicList = this.historyTopicList;
    },
    // 部落列表翻页
    fetch() {
      this.pageNo++;
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
          } else {
            modal.alert({ message: res.desc });
          }
        })
        .catch();
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
        let outLine = 0;
        this.formData.topicTags.forEach(value => {
          if (value.split("").length > 20) {
            outLine += 1;
            value = value.substr(0, 20);
          }
        });
        if (outLine > 0) {
          modal.alert({
            message: "标签长度超过20个字符，将只会显示前20个字符！"
          });
        }
        putTopic(this.formData, { mobile: this.mobile })
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
    // 选择标签
    createTag() {
      this.backing = true;
      this.key = true;
      this.value = "";
      this.topicList = this.historyTopicList;
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
    // 热搜
    clickSearch(item) {
      this.value = item;
      this.light = false;
    },
    // 搜索框上的事件
    wxcSearchbarCloseClicked() {
      if (this.backing) {
        this.key = false;
        this.backing = false;
      } else {
        this.pop();
      }
    },
    wxcSearchbarInputOnFocus() {
      this.$refs["wxc-searchbar"].setValue(this.value);
    },
    // 搜索
    wxcSearchbarInputOnInput(e) {
      console.log(e);
      this.value = e.value;
      // modal.alert({message:this.value})
      getTopicTag(
        {
          mobile: this.mobile,
          pageNo: this.pageNo,
          pageSize: 10,
          topicTag: this.value
        },
        { mobile: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            // modal.alert({ message: JSON.stringify(res.object) });
            this.topicList = res.object;
          } else {
            // modal.alert({ message: res.desc });
          }
        })
        .catch();
    },
    // 打开创建页面
    toCreate(data) {
      let repeatKey = false;
      this.formData.topicTags.forEach((value, index, array) => {
        if (value == data) {
          modal.alert({ message: "标签不能重复" });
          repeatKey = true;
        }
      });
      if (!repeatKey || this.formData.topicTags.length == 0) {
        this.key = false;
        this.tags = this.tags + "#" + data + "#";
        this.formData.topicTags.push(data);
        if (this.formData.topicTags.length > 2) {
          this.createTagKey = false;
        }
      }
    },
    // 取消
    wxcSearchbarCancelClicked() {
      if (this.backing) {
        this.key = false;
        this.backing = false;
      } else {
        this.pop();
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
      myyuleMap.openMap({}, function(e) {
        _this.formData.longitude = e.longitude;
        _this.formData.latitude = e.latitude;
        // modal.alert({message:e.locAddrStr})
        _this.formData.address = e.locAddrStr;
        _this.activityAddress = e.locAddrStr;
      });
    },
    // 关闭部落弹层
    popupOverlayBottomClick() {
      this.isBottomShow = false;
    },
    // 打开弹层
    choiceClub() {
      this.isBottomShow = true;
    }
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
  margin-top: 10px;
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
  padding-top: 27px;
  align-items: center;
  padding-bottom: 27px;
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
}
.topic-icon {
  margin-left: 30px;
  margin-bottom: 50px;
  flex-direction: row;
  flex-wrap: wrap;
}
.setAdress {
  padding: 11px;
  border-radius: 30px;
  background-color: #ececec;
  margin-left: 30px;
  max-width: 700px;
}
.adress {
  lines: 1;
  text-overflow: ellipsis;
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
.select-adress {
  width: 750px;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
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
.topic-desc {
  width: 400px;
}
.topic-title {
  width: 400px;
  lines: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #454545;
}
</style>
