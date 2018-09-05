<template>
	<div class="club-msg">
		<div class="top" :style="{paddingTop:source==='iOS'?62:20+'px'}">
			<div @click="_back()" class="left">
				<image class="image-view" :src='imgUrl+"back.png"'></image>
			</div>
			<text class="title font-32">部落资料</text>
			<div class="right" @click="share()">
				<image class="image-view" :src="imgUrl+'share.png'"></image>
			</div>
		</div>
		<scroller class="scroller">

			<div class="msg-content">
				<div class="content-base">
					<div class="content-base2">
						<div class="msg-img">
							<image class="pic" resize="cover" :src="club.clubLogo?'http://media2.myyule.cn/' + club.clubLogo:''" alt=""></image>
						</div>
						<div>
							<text class="title color-gy font-28">{{club.clubName}}</text>
							<text class="createTime font-22">创建于{{club.createTime.substr(0,10)}}</text>
						</div>
					</div>
					<div v-if="club.mobile === mobile" @click="modify" class="revise">
						<div class="img">
							<image class="image-view" :src='imgUrl+"edit.png"'></image>
						</div>
						<text class="font-26 color-pink">修改资料</text>
					</div>
				</div>
				<div class="content-info">
					<text class="title font-28 color-gy">部落简介</text>
					<text class="color-gray font-26" style="margin-top: 20px">{{club.clubDesc}}</text>
				</div>
				<div class="content-classify">
					<div class="">
						<text class="font-28  color-gy">部落分类</text>
					</div>
					<div class="tag-wrapper">
						<div class="tag" v-for="(item,index) in club.clubTags" :key="index">
							<text class="font-22 color-red tagText">{{item}}</text>
						</div>
					</div>
				</div>
				<div class="content-member">
					<div class="box-top">
						<text class="title font-28 color-gy">部落成员</text>
						<div @click="push2('/views/club/club_member', { clubId: club.clubId, mobile: club.mobile })" class="number">
							<text class="font-26">{{club.clubMemberNum}}人</text>
							<div class="" style="width:22px;height:22px;padding-right:10px">
								<image class="image-view clubPic" :src='imgUrl+"right-gray.png"'></image>
							</div>
						</div>
					</div>
					<div class="member-list">
						<div @click="push2('/views/myPlace/myPlace',{mobile:item.mobile})" v-for="(item,index) in filteredMember" :key="index" class="member-item">
							<div class="member-img">
								<image class="image-view pic2" resize="cover" :src="item.icon?'http://media2.myyule.cn/' + item.icon:''" width="116" height="116" alt=""></image>
								<div v-if="item.mobile===club.mobile" class="userSign"><text class="color-white userSign-text font-26">创</text></div>
								<!--<div  class="userSign"><text class="color-white userSign-text font-26">创</text></div>-->
							</div>

							<text class="font-22 memberWith">{{item.nickname}}</text>
						</div>
					</div>
				</div>

				<div class="content-switch">
					<text @click="onchange()" class="title font-28">接收通知</text>
					<switch v-if="source==='iOS'" :checked="switchKey" @change="onchange()"></switch>
					<div v-if="source!=='iOS'" @click="onchange()">
						<mySwitch :switchKey="switchKey"></mySwitch>
					</div>
				</div>
			</div>
			<div v-if="club.clubRelation" @click="delClub()" class="delete-button">
				<text class="delete-p">{{club.mobile === mobile?'删除部落':'退出部落'}}</text>
			</div>
			<wxc-mask height="362" width="650" border-radius="20" duration="200" mask-bg-color="white" :has-animation="hasAnimation" :has-overlay="true" :show-close="false" :show="Bshow" :border-radius="20" @wxcMaskSetHidden="wxcMaskSetHidden">
				<div class="content">
					<div class="content-text">
						<text class="titleMsk font-32">编辑</text>
						<wxc-cell label="部落名称" @wxcCellClicked="wxcCellClicked">
							<slot name="value">
								<input class="input" type="text" v-model="formData.clubName">
							</slot>
						</wxc-cell>
						<wxc-cell label="部落简介" @wxcCellClicked="wxcCellClicked">
							<slot name="value">
								<input class="input" type="text" v-model="formData.clubDesc">
							</slot>
						</wxc-cell>
						<div class="bottom">
							<text class="cancel font-32" @click="Bshow=false">取消</text>
							<text class="ok font-32" @click="edit()">确定</text>
						</div>
					</div>
				</div>
			</wxc-mask>
		</scroller>
	</div>

</template>

<script>
import mixins from "../../mixins";
import { getClubMember, putClub, deleteClub } from "../../api/club.js";
import mySwitch from "../../components/mySwitch.vue";
import { WxcMask, WxcCell } from "weex-ui";
import { sharePage } from "../../api/weex.js";
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");
export default {
  mixins: [mixins],
  components: {
    WxcMask,
    WxcCell,
    mySwitch
  },
  data() {
    return {
      switchKey: false, // 开关
      Bshow: false, // 蒙层
      overlayCanClose: true,
      isFalse: false,
      hasAnimation: true,
      club: {},
      formData: {
        clubDesc: "",
        clubName: "",
        mobile: "",
        clubId: ""
      },
      clubMember: []
    };
  },
  computed: {
    filteredMember() {
      return this.clubMember.slice(0, 4);
    }
  },
  created() {
      if (this.webParam()) {
          this.club = this.webParam().club;
          this.show();
      } else {
          storage.getItem("data", event => {
              this.club = JSON.parse(event.data).club;
              this.show();
          });
	  }

    // this.club ={"createTime":"2017-07-11 14:53:54","clubId":1742156,"clubTags":["娱乐圈"],"nickname":"校园真象","userId":3448555,"clubLogo":"group1/M00/0A/22/wKgB2Vlkc-eAL4thAAEJEL7xMtY111.jpg","clubName":"时尚零距离","clubDesc":"明星大片写真","modifyTime":"2017-08-03 13:00:00","clubRelation":1,"clubMemberNum":4,"mobile":"9EFC7F96C52DEA4FB234765796F96B4A"};
    // this.show();
  },
  mounted(){
    // 数据埋点
    this.putPageUrlLog(1504);
  },
  methods: {
    _back() {
      this.pop();
    },
    show() {
      this.formData = {
        clubDesc: this.club.clubDesc,
        clubName: this.club.clubName,
        clubId: this.club.clubId,
        clubTags: this.club.clubTags,
        clubLogo: this.club.clubLogo,
        mobile: this.mobile
      };
      getClubMember(
        {
          clubId: this.club.clubId,
          pageNo: 1,
          pageSize: 10
        },
        {
          token: this.mobile
        }
      )
        .then(res => {
          if (res.status == 0) {
            this.clubMember = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
    },
    // 编辑部落
    edit() {
      putClub(this.formData, {
        token: this.mobile
      })
        .then(res => {
          if (res.status == 0) {
            modal.toast({
              message: "修改成功",
              duration: 1
            });
            this.Bshow = false;
            this.club.clubDesc = this.formData.clubDesc;
            this.club.clubName = this.formData.clubName;
          } else {
            modal.toast({
              message: res.desc,
              duration: 1
            });
          }
        })
        .catch(err => {});
    },
    // 删除退出部落
    delClub() {
      deleteClub(
        {
          clubId: this.club.clubId,
          mobile: this.mobile
        },
        {
          token: this.mobile
        }
      )
        .then(res => {
          if (res.status == 0) {
            modal.toast({
              message: "操作成功",
              duration: 1
            });
            storage.setItem(
              "data",
              JSON.stringify({ clubId: this.club.clubId })
            );
            this.pop();
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
    },
    onchange() {
      if (this.switchKey) {
        this.switchKey = false;
      } else {
        this.switchKey = true;
      }
    },
    // openMask (e) {
    //     this.Bshow = true;
    //     this.hasAnimation = true;
    // },
    wxcMaskSetHidden() {
      this.Bshow = false;
    },
    // openNoAnimationMask (e) {
    //     this.Bshow = true;
    //     this.hasAnimation = false;
    // },
    wxcCellClicked(e) {
      console.log(e);
    },
    // 分享
    share() {
      let _this = this;
      let sObj = {
        title: "分享部落：" + _this.club.clubName,
        desc: _this.club.clubDesc,
        web_url:
          _this.commonUrl+"myyuleWeb/webShare/club/index.html?clubId=" +
          _this.clubId,
        img_url: "http://media2.myyule.cn/" +_this.club.clubLogo,
        sourse: "myyule"
      };
      sharePage(sObj);
    },
    modify() {
      this.Bshow = true;
    }
  }
};
</script>
<style src="../../assets/style/index.scss">
</style>
<style scoped>
.font-22 {
  font-size: 22px;
}

.color-red {
  color: #ee1c41;
}

.color-gy {
  color: #3b3b3b;
}

.userSign {
  position: absolute;
  bottom: 22px;
  right: 22px;
  width: 44px;
  height: 44px;
  background-color: #ee1c41;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.userSign-text {
  justify-content: center;
  align-items: center;
}

.club-msg {
  position: fixed;
  top: 0;
  width: 750px;
  left: 0;
  background-color: #ffffff;
  flex: 1;
}

.top {
  width: 750px;
  background-color: #fff;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 22px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #d9d9d9;
}

.title {
  color: #3b3b3b;
  /*width: 200px;*/
  align-items: center;
}

.left {
  width: 61px;
  height: 61px;
}

.right {
  width: 61px;
  height: 61px;
}

.msg-content {
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 0px;
}

.content-base {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 29px;
  padding-top: 23px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.content-base2 {
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.left {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.msg-img {
  width: 95px;
  height: 95px;
  background-color: #d9d9d9;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  margin-right: 20px;
}

.createTime {
  color: #666666;
  margin-top: 10px;
  font-size: 24px;
}

.revise {
  padding-top: 11px;
  justify-content: center;
  align-items: center;
}

.img {
  width: 61px;
  height: 61px;
  margin-top: 0;
  margin-bottom: 0;
  margin-right: auto;
  margin-left: auto;
}

.content-info {
  border-bottom-width: 6px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 26px;
  padding-bottom: 26px;
}

.tag-wrapper {
  width: 500px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.content-classify {
  border-bottom-width: 6px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 20px;
  padding-bottom: 20px;
}

.tag {
  width: 96px;
  height: 54px;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  margin-bottom: 10px;
  border-width: 2px;
  border-style: solid;
  border-color: #ee1c41;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.content-member {
  border-bottom-width: 6px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 39px;
  padding-bottom: 46px;
}

.box-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 49px;
}

.number {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.font-26 {
  font-size: 26px;
  /*padding-right: 10px;*/
}

.member-list {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: -20px;
  /*padding-bottom: 49px;*/
}

.member-img {
  position: relative;
  width: 160px;
  height: 160px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 0;
  margin-bottom: 0;
  margin-right: auto;
  margin-left: auto;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  overflow: visible;
}

.content-switch {
  border-bottom-width: 6px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 38px;
  padding-bottom: 38px;
  align-items: flex-start;
}

.delete-button {
  width: 750px;
  height: 91px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #ee1c41;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
}

.delete-p {
  color: #fff;
}

input {
  font-size: 30px;
}

.bottom {
  width: 650px;
  height: 90px;
  background-color: transparent;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.cancel {
  width: 325px;
  text-align: center;
}

.ok {
  width: 325px;
  background-color: #ee1c41;
  height: 90px;
  color: white;
  padding-top: 30px;
  text-align: center;
}

.image-view {
  height: 61px;
  width: 61px;
}

.pic {
  height: 95px;
  width: 95px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}

.pic2 {
  height: 116px;
  width: 116px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}

.clubPic {
  width: 22px;
  height: 22px;
}

.member-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  /*margin-left: 10px;*/
  position: relative;
}

.memberWith {
  text-align: center;
  /*padding-top: 20px;*/
  margin-top: 20px;
  width: 130px;
  word-wrap: break-word;
}

.titleMsk {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
}
.input {
  height: 80px;
  width: 530px;
}
</style>