<template>
  <div class="myPlace">
    <myPlaceNormal ref="place" :is="userInfo.userType==0?(webVersion?'myPlaceNormalShare':'myPlaceNormal'):(webVersion?'myPlaceMusicShare':'myPlaceMusic')" :userInfo="userInfo" :iMobile="iMobile"></myPlaceNormal>
    <download-notice type="myPlace"></download-notice>
  </div>
</template>
<script>
import { getUserInfo } from "../../api/userInfo";
import mixins from "../../mixins";
import downloadNotice from "../../components/downloadNotice.vue";
import myPlaceNormal from "./myPlaceNormal.vue";
import myPlaceMusic from "./myPlaceMusic.vue";
import myPlaceMusicShare from "./myPlaceMusicShare.vue";
import myPlaceNormalShare from "./myPlaceNormalShare.vue";
import { getUser, sharePage } from "../../api/weex";
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
export default {
  mixins: [mixins],
  components: {
    myPlaceNormal,
    myPlaceMusic,
    myPlaceNormalShare,
    downloadNotice,
    myPlaceMusicShare
  },
  data() {
    return {
      userInfo: [],
      tabPageHeight2: 1334,
      // mobile: getUser().mobile,
      iMobile: ""
    };
  },
  created() {
    this.fontIcon();
    if (this.webParam()) {
      this.iMobile = this.webParam().mobile;
      this.request();
    } else {
      storage.getItem("data", event => {
        this.iMobile = JSON.parse(event.data).mobile;
        this.request();
      });
    }
  },
  mounted() {
    // 数据埋点
    if (this.webVersion) {
      this.putPageUrlLog(1806);
    } else {
      this.putPageUrlLog(1402);
    }
  },
  methods: {
    fetchPage() {
      this.$refs.place.fetchPage();
    },
    request() {
      // 获取用户信息
      getUserInfo(
        {
          mobile: this.iMobile
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.userInfo = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
    }
  }
};
</script>
<style src="../../assets/style/index.scss">
</style>
<style scoped>
.myPlace {
  position: relative;
  width: 750px;
  flex: 1;
}
.top {
  position: absolute;
  width: 750px;
  left: 0;
  top: 0;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 22px;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 50px;
}
.left,
.right {
  flex-direction: row;
  align-items: center;
}
.left-image-view {
  width: 61px;
  height: 61px;
}
</style>
