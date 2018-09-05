<template>
  <div class="perfectInfo active" :style="{paddingTop:source==='iOS'?62:20+'px'}" ref="test1">
      <div class="install-title" >
            <text @click="pop()" class="iconfont back">&#xe625;</text>
            <text class="title-text iconfont">完善资料</text>
            <text @click="makeSure()" class="title-text sure">确定</text>
      </div>
      <div class="info=wrapper">
      <div @click="setImg()" class="userInfo">
        <image class="m-img" resize="cover" :src="icon.substr(0,4)==='http'?icon:('data:image/jpg;base64,'+icon)" placeholder="http://www.myyule.com/images/head-02.jpg"></image>
        <text class="text">点击设置头像</text>
        <!-- <text>{{formData.content}}</text> -->
      </div>
      <div class="demo">
        <wxc-cell label="设置昵称"
          :has-arrow="false"
          :has-margin="true">  
          <input type="text" slot="title" class="input" @change="changeName" :value="formData.nickname" />
        </wxc-cell>
        <wxc-cell label="选择学校"
          title=""
          :has-arrow="true"
          @wxcCellClicked="pickSchool"
          :has-margin="true">
          <text slot="title" class="h-title">{{formData.schoolName}}</text>
        </wxc-cell>
        <wxc-cell label="选择院系"
          :has-arrow="true"
          @wxcCellClicked="pickDepart"
          :has-margin="true">
          <text slot="title" class="h-title">{{formData.deptName}}</text>
        </wxc-cell>
        <wxc-cell label="选择入学时间"
          :has-arrow="true"
          @wxcCellClicked="pickData"
          :has-margin="true">
          <text slot="title" class="h-title">{{formData.year}}</text>
        </wxc-cell>
        <wxc-cell label="选择班级"
          :has-arrow="true"
          @wxcCellClicked="pickClass"
          :has-margin="true">
          <text slot="title" class="h-title">{{formData.className}}</text>
        </wxc-cell>
        <text class="msg">推荐你所属的学校、院系、班级的有趣活动，分享快乐，让你的大学生活更加精彩!</text>
        </div>
        <wxc-loading :show="isShow" :need-mask="true"></wxc-loading>
      </div>
      </div>
</template>
<script>
import { WxcCell, WxcIcon, WxcLoading } from "weex-ui";
import mixins from "../../mixins";
import { showAlbumView } from "../../api/weex";
import { getUserInfo } from "../../api/userInfo";
import { putFile } from "../../api/activity.js";
import {
  putUserInfo,
  putUserNickname,
  putPlace,
  putUserIcon
} from "../../api/userInfo";
const picker = weex.requireModule(
  weex.config.env.platform == "iOS" ? "picker" : "WXAndroidPickersModule"
);
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");
const myyulePhotoAlbum = weex.requireModule("MyyulePhotoAlbum");
export default {
  mixins: [mixins],
  components: { WxcCell, WxcIcon, WxcLoading },
  data() {
    return {
      userData: [],
      isShow: false,
      formData: {
        mobile: "",
        schoolName: "",
        deptName: "",
        className: "",
        enterCode: "",
        content: "",
        contentType: "jpg",
        nickname: "",
        year: ""
      },
      icon: "",
      schoolData: [],
      schoolCodeData: [],
      departData: [],
      yearData: [],
      classData: [
        "1班",
        "2班",
        "3班",
        "4班",
        "5班",
        "6班",
        "7班",
        "8班",
        "9班",
        "10班"
      ]
    };
  },
  beforeCreate() {
    this.fontIcon();
  },
  created() {
    this.request();
    for (let i = 0; i < 2020; i++) {
      if (i > 1949) {
        this.yearData.unshift(i);
      }
    }
  },
  mounted() {
    this.putPageUrlLog(1105);
  },
  methods: {
    // 请求
    request() {
      this.isShow = true;
      // 用户信息
      getUserInfo(
        {
          mobile: this.mobile
        },
        { token: this.mobile }
      )
        .then(res => {
          this.isShow = false;
          if (res.status == 0) {
            this.userData = res.object;
            this.formData.nickname = this.userData.nickname;
            this.formData.schoolName = this.userData.schoolName;
            this.formData.enterCode = this.userData.schoolId;
            this.formData.deptName = this.userData.departName;
            this.formData.className = this.userData.className;
            this.icon = "http://media2.myyule.cn/" + this.userData.icon;
            this.formData.year = this.userData.year;
            this.formData.mobile = this.userData.mobile;
            storage.getItem("data", event => {
              this.formData.schoolName = JSON.parse(event.data).school.name;
              this.formData.enterCode = JSON.parse(event.data).school.id;
              this.formData.deptName = JSON.parse(event.data).dept.name;
              this.formData.className = JSON.parse(event.data).class.name;
            });
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
      putPlace(
        { pageNo: 1, pageSize: 500, pType: "school" },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            res.object.forEach(value => {
              this.schoolData.push(value.name);
              this.schoolCodeData.push(value.id);
            });
          } else {
            console.log(res.desc);
          }
        })
        .catch();
      putPlace(
        { pageNo: 1, pageSize: 5000, pType: "dept" },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            res.object.forEach(value => {
              this.departData.push(value.name);
            });
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 修改昵称
    changeName(event) {
      this.formData.nickname = event.value;
    },
    // 提交
    makeSure() {
      if (this.formData.nickname === "" || !this.formData.nickname) {
        modal.toast({
          message: "请输入昵称",
          duration: 1
        });
      } else if (this.formData.schoolName === "" || !this.formData.schoolName) {
        modal.toast({
          message: "请选择学校",
          duration: 1
        });
      } else if (this.formData.deptName === "" || !this.formData.deptName) {
        modal.toast({
          message: "请选择院系",
          duration: 1
        });
      } else if (this.formData.year === "" || !this.formData.year) {
        modal.toast({
          message: "请选择入学时间",
          duration: 1
        });
      } else if (this.formData.className === "" || !this.formData.className) {
        modal.toast({
          message: "请选择班级",
          duration: 1
        });
      } else {
        if (!this.isShow) {
          this.isShow = true;
          putUserInfo(this.formData, { token: this.mobile })
            .then(res => {
              if (res.status == 0) {
                this.isShow = false;
                modal.toast({
                  message: "保存成功",
                  duration: 1
                });
                this.userData.nickname = this.formData.nickname;
                this.userData.schoolName = this.formData.schoolName;
                // modal.alert({ message: this.userData.icon });
                // this.userData.icon = this.formData.content;
                storage.setItem("userData", JSON.stringify(this.userData));
                this.pop();
                // // 发送用户信息修改通知
                // const channel = new BroadcastChannel("changeInfo");
                // channel.postMessage(JSON.stringify({ static: "changeInfo" }));
              } else {
                this.isShow = false;
                modal.toast({
                  message: res.desc,
                  duration: 1
                });
                console.log(res.desc);
              }
            })
            .catch();
        }
      }
    },
    // 上传头像
    setImg() {
      const _this = this;
      myyulePhotoAlbum.showAlbumViewByMaxNum(1, function(ret) {
        _this.formData.content = ret.images[0].image;
        _this.formData.contentType = ret.images[0].imageType;
        _this.icon = _this.formData.content;
        putFile(
          {
            fileContent: _this.formData.content,
            fileType: _this.formData.contentType
          },
          { token: _this.mobile }
        )
          .then(res => {
            if (res.status == 0) {
              _this.userData.icon = res.object;
              // modal.alert({ message: this.userData.icon });
            } else {
              modal.toast({
                message: res.desc,
                duration: 1
              });
            }
          })
          .catch();
      });
    },
    pickSchool() {
      if (this.userData.schoolName === "" || !this.userData.schoolName) {
        this.push2("/views/userInfo/selectPages", { selectType: "school" });
          // picker.pick(
          //   {
          //     items: this.schoolData
          //   },
          //   res => {
          //     if (res.result === "success") {
          //       this.formData.schoolName = this.schoolData[res.data];
          //       this.formData.enterCode = this.schoolCodeData[res.data];
          //       this.formData.deptName = "";
          //       this.formData.className = "";
          //     }
          //   }
          // );
      }
    },
    pickDepart() {
      if (this.userData.departName === "" || !this.userData.departName) {
        if (this.formData.schoolName) {
          this.push2("/views/userInfo/selectPages", {
            selectType: "dept",
            selectItem: { name: this.formData.schoolName }
          });
        } else {
          this.push2("/views/userInfo/selectPages", { selectType: "school" });
        }
          // picker.pick(
          //   {
          //     items: this.departData
          //   },
          //   res => {
          //     if (res.result === "success") {
          //       this.formData.deptName = this.departData[res.data];
          //     }
          //   }
          // );
      }
    },
    pickClass() {
      if (this.userData.className === "" || !this.userData.className) {
        if (this.formData.deptName) {
          this.push2("/views/userInfo/selectPages", {
            selectType: "class",
            selectItem: { name: this.formData.deptName },
            prevItem: { name: this.formData.schoolName }
          });
        } else if (this.formData.schoolName) {
          this.push2("/views/userInfo/selectPages", {
            selectType: "dept",
            selectItem: { name: this.formData.schoolName }
          });
        } else {
          this.push2("/views/userInfo/selectPages", { selectType: "school" });
        }
          // picker.pick(
          //   {
          //     items: this.classData
          //   },
          //   res => {
          //     if (res.result === "success") {
          //       this.formData.className = this.classData[res.data];
          //     }
          //   }
          // );
      }
    },
    pickData() {
      if (this.userData.year === "" || !this.userData.year) {
        picker.pick(
          {
            items: this.yearData
          },
          res => {
            if (res.result === "success") {
              this.formData.year = this.yearData[res.data];
            }
          }
        );
      }
    }
    // pickData() {
    //   picker.pickDate(
    //     {
    //       value: this.formData.year
    //     },
    //     res => {
    //       if (res.result === "success") {
    //         this.formData.year = res.data;
    //       }
    //     }
    //   );
    // }
  }
};
</script>
<style scoped>
.iconfont {
  font-family: iconfont;
}
.active {
  top: 0;
}
.perfectInfo {
  width: 750px;
  height: 1334px;
  background-color: #fff;
}
/* 导航 */
.install-title {
  position: relative;
  margin-bottom: 10px;
  background-color: #fff;
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
.back {
  padding-left: 30px;
  color: #ee1c41;
  font-size: 45px;
}
.title-text {
  line-height: 100px;
  text-align: center;
  font-size: 36px;
}
.sure {
  padding-right: 20px;
}
.userInfo {
  margin-top: 40px;
}
.m-img {
  width: 150px;
  height: 150px;
  margin-left: 300px;
  margin-right: 300px;
  border-radius: 100px;
  margin-right: 15px;
}
.text {
  width: 750px;
  padding-top: 10px;
  text-align: center;
  color: #666;
  font-size: 28px;
}
.demo {
  padding-left: 40px;
  padding-right: 40px;
  margin-top: 40px;
}
.msg {
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  color: #666;
}
.input,
.h-title {
  font-size: 26px;
}
</style>
