<template>
  <div v-if="key" class="sliderList">
    <wxc-popup popup-color="#fff"
              :show="key"
              @wxcPopupOverlayClicked="toggle"
              pos="bottom"
              :height="(isType !== ''&&iMobile === mobile)?454:227"
              width="750">
      <div class="demo-content">
          <div class="botMoreOpt col" ref="botMoreOptBg" >
              <div class="optItems col">
                  <text v-if="isType !== ''&&iMobile === mobile" @click="_delete()" class="optDesc">删除</text>
                  <text v-if="isType !== ''&&iMobile === mobile" @click="push2('/views/release/releaseContentRevise',{resId:resId})" class="optDesc">编辑</text>
                  <text @click="report()" class="optDesc">举报</text>
              </div>
              <text class="optDesc" @click="toggle()">取消</text>
          </div>
      </div>
    </wxc-popup>
  </div>
</template>
<script>
import mixins from "../mixins";
import { deleteActivity } from "../api/activity";
import { putReport } from "../api/club";
import { WxcPopup } from "weex-ui";
const modal = weex.requireModule("modal");
export default {
  mixins: [mixins],
  components: { WxcPopup },
  props: {
    isType:{}
  },
  data() {
    return {
      iMobile: '',
      resId: '',
      key: false,
      deletMobile: "",
      reportData: ""
    };
  },
  created(){
    // modal.alert({message:this.isType})
  },
  methods: {
    toggle() {
      this.key = !this.key;
    },
    show(item){
      console.log(item)
      this.key = true
      this.iMobile = item.resData?item.resData.mobile:item.feedData.mobile;
      this.resId = item.resId;
    },
    _delete() {
      this.$emit("delet-mobile", this.iMobile);
      // deleteActivity(
      //   {
      //     resId: this.resId,
      //     mobile: this.mobile
      //   },
      //   { token: this.mobile }
      // )
      //   .then(res => {
      //     if (res.status == 0) {
      //       this.deletMobile = this.iMobile;
      //       this.$emit("delet-mobile", this.iMobile);
      //       this.key = false;
      //     } else {
      //       modal.toast({
      //         message: res.desc,
      //         duration: 1
      //       });
      //       console.log(res.desc);
      //     }
      //   })
      //   .catch();
    },
    // 举报(出现问题，需要解决)
    report() {
      modal.prompt(
        {
          message: "举报",
          okTitle: "确定",
          cancelTitle: "取消",
          duration: 1
        },
        value => {
          this.reportData = value.data;
          putReport(
            {
              mobile: this.mobile,
              toUsercode: "myyule_service",
              reason: this.reportData,
              url: this.commonUrl + "/activityDetail?resId=" + this.resId
            },
            { token: this.mobile }
          )
            .then(res => {
              if (res.status == 0) {
                modal.toast({
                  message: "举报成功",
                  duration: 1
                });
                this.toggle()
              } else {
                console.log(res.desc);
              }
            })
            .catch();
        }
      );
    }
  }
};
</script>
<style src="../assets/style/index.scss">
</style>
<style scoped>
.optItems {
  margin-bottom: 10px;
}
.optDesc {
  color: #000;
  text-align: center;
  line-height: 112px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ccc;
  background-color: #fff;
  font-size:26px;
}
</style>
