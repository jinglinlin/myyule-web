<template>
  <div class="create-club">
      <div class="top" :style="{paddingTop:source==='iOS'?62:20+'px'}">
          <div @click="_back()" class="left">
            <image class="image-view" :src='imgUrl+"back.png"' ></image>
          </div>
          <text class="title font-32">创建部落</text>
          <div @click="create()" class="right">
            <text class="right-p font-32">创建</text>
          </div>
      </div>
      <scroller>
      <div class="create-content">
          <div @click="setImg()" class="create-head">
            <image  resize="cover" class="club-icon" :src="icon!==''?('data:image/jpg;base64,'+icon):(imgUrl+'create.png')" :placeholder="imgUrl+'create.png'"></image>
            <text class="icon-name font-28">部落头像</text>
          </div>
        <div class="club-name">
          <text class="color-black font-28" style="padding-right: 36px">部落名称</text>
          <input class="input-text" :maxlength="10" type="text" v-model="formData.clubName" placeholder="填写部落名称，不超过10个字"/>
        </div>
        <div class="club-msg">
          <text class="color-black font-28">部落简介</text>
          <textarea class="input-area" name="" v-model="formData.clubDesc" id="" cols="30" rows="10" placeholder="150字以内的部落简介">
          </textarea>
        </div>
        <div class="club-tag">
          <text class="color-black font-28">部落标签</text>
          <div class="tag-content">
            <div class="tag-value">
              <text v-for="(item,index) in ss" :key="index" class="item color-pink"></text>
            </div>
            <div class="tag-list">
              <div @click="selectTag(item)" v-for="(item,index) in testData" :class="[item.checked?'active':'']" :key="index" class="tag-item">
                <text class="tagSize" :class="[item.checked?'tagnor':'']">{{item.title}}</text>
              </div>
            </div>
          </div>
        </div>
        <div class="notice">
          <text class="font-26 notice-p">部落人数只要超过50人,将在推荐部落中</text>
          <text class="font-26 notice-p" >主打你的部落一周哟~</text>
        </div>
      </div>
    <wxc-loading :show="isShow" loading-text="加载中" :need-mask="true"></wxc-loading>
      </scroller>
  </div>
</template>
<script>
import mixins from "../../mixins";
import { putClub } from "../../api/club";
import { putFile } from "../../api/activity.js";
const modal = weex.requireModule("modal");
const myyulePhotoAlbum = weex.requireModule("MyyulePhotoAlbum");
export default {
  mixins: [mixins],
  data() {
    return {
      formData: {
        clubName: "",
        clubLogo: "",
        clubDesc: "",
        clubTags: []
        //      mobile: ""
        // clubId:'', // 修改部落时用
      },
      imageType: "",
      icon: "",
      testData: [
        {
          title: "音乐",
          checked: true
        },
        {
          title: "公益",
          checked: true
        },
        {
          title: "校友",
          checked: false
        },
        {
          title: "同城",
          checked: false
        },
        {
          title: "老友记",
          checked: false
        },
        {
          title: "聚会",
          checked: false
        },
        {
          title: "旅行",
          checked: false
        },
        {
          title: "原创",
          checked: false
        },
        {
          title: "现场",
          checked: false
        },
        {
          title: "公益",
          checked: false
        },
        {
          title: "运动",
          checked: false
        },
        {
          title: "其他",
          checked: false
        }
      ],
      selectData: []
    };
  },
  computed: {
    ss() {
      this.formData.clubTags = [];
      this.selectData = [];
      this.testData.forEach((value, index, array) => {
        if (value.checked) {
          this.formData.clubTags.push(value.title);
          this.selectData.push(value);
        }
      });
      // for(let i = 0;i<=3-this.formData.clubTags.length;i++){
      //   this.formData.clubTags.push('')
      // }
      console.log(this.formData.clubTags.length);
      return this.formData.clubTags;
    }
  },
  created() {
    this.isShow = false;
    this.formData.mobile = this.mobile;
  },
  mounted() {
    // 数据埋点
    this.putPageUrlLog(1505);
  },
  methods: {
    _back() {
      this.pop();
    },
    // 筛选
    selectTag(item) {
      if (item.checked) {
        item.checked = false;
      } else if (this.selectData.length < 3) {
        item.checked = true;
      } else {
        modal.toast({
          message: `最多选择3个`,
          duration: 0.8
        });
      }
    },
    onOverLimit(limit) {},
    // 创建
    create() {
      if (this.formData.clubName === "") {
        modal.toast({ message: "请填写部落名称", duration: 1 });
      } else if (this.formData.clubLogo === "") {
        modal.toast({ message: "请选择头像", duration: 1 });
      } else if (this.formData.clubDesc === "") {
        modal.toast({ message: "请填写部落简介", duration: 1 });
      } else {
        this.isShow = true;
        putClub(this.formData, { token: this.mobile })
          .then(res => {
            if (res.status == 0) {
              this.isShow = false;
              modal.toast({
                message: "创建成功",
                duration: 1
              });
              if (res.object) {
                this.pop();
                // this.push2("/views/club/club_layout", {
                //   clubId: res.object
                // });
              }
            } else {
              console.log(res.desc);
              this.isShow = false;
              modal.toast({
                message: res.desc,
                duration: 1
              });
            }
          })
          .catch();
      }
    },
    // // 上传头像
    // setImg() {
    //   const _this = this;
    //   myyulePhotoAlbum.showAlbumViewByMaxNum(1, function(ret) {
    //     modal.alert({message:1})
    //     _this.icon = ret.images[0].image;
    //     _this.formData.clubLogo = ret.images[0].image;
    //     _this.imageType = ret.images[0].imageType;
    //     modal.alert({message:JSON.stringify(_this.icon)})
    //   });
    // },

    // 上传头像
    setImg() {
      const _this = this;
      myyulePhotoAlbum.showAlbumViewByMaxNum(1, function(ret) {
        _this.formData.clubLogo = ret.images[0].image;
        _this.icon = _this.formData.clubLogo;
        _this.isShow = true;
        putFile(
          { fileContent: ret.images[0].image, fileType: ret.images[0].imageType },
          { token: _this.mobile }
        )
          .then(res => {
            _this.isShow = false;
            if (res.status == 0) {
              _this.formData.clubLogo = res.object;
            } else {
              modal.toast({
                message: res.desc,
                duration: 1
              });
            }
          })
          .catch();
      });
    }
  }
};
</script>
<style src="../../assets/style/index.scss"></style>
<style scoped>
.image-view {
  height: 61px;
  width: 61px;
}
.create-club {
  width: 750px;
  background: #fff;
  flex: 1;
}
.grid-option {
  margin: 0 !important;
}
.top {
  width: 750px;
  background-color: #fff;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 22px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #d9d9d9;
}
.title {
  color: #000;
  height: 61px;
  padding-top: 16px;
}
.left {
  width: 61px;
  height: 61px;
}
.right {
  /*width: 61px;*/
  height: 61px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
/*p {*/
/*line-height: 61px;*/
/*}*/

.create-content {
  padding-left: 34px;
  padding-right: 34px;
  padding-top: 75px;
  margin-left: 22px;
}
.create-head {
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.club-icon {
  width: 156px;
  height: 156px;
  border-top-right-radius: 90px;
  border-top-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-bottom-left-radius: 90px;
}
.club-name {
  padding-top: 34px;
  padding-bottom: 34px;
  padding-left: 10px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
}
/*p {*/
/*padding-right: 36px;*/
/*}*/

.input-text {
  flex: 1;
  font-size: 26px;
}
.input-area {
  font-size: 26px;
}
.club-msg {
  padding-top: 34px;
  padding-bottom: 34px;
  padding-left: 10px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
}
textarea {
  height: 158px;
  padding-top: 28px;
  padding-bottom: 28px;
}

.club-tag {
  padding-top: 34px;
  padding-bottom: 34px;
  padding-left: 10px;
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

/*p {*/
/*padding-bottom: 26px;*/
/*}*/

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
.active {
  background-color: #ee1c41;
}
p {
  color: #3b3b3b;
}
.notice {
  padding-top: 72px;
  padding-bottom: 72px;
  justify-content: center;
  align-items:center;
}
.notice-p {
  text-align: center;
  line-height: 36px;
}

.icon-name {
  text-align: center;
  padding-top: 28px;
}
.tagSize {
  color: #3b3b3b;
  /*line-height: 42px;*/
  text-align: center;
  font-size: 26px;
}
.tagnor {
  color: white;
}
.right-p {
  color: #ee1c41;
}
</style>
