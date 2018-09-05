<template>
  <div class="myPlace" @viewappear="fetchPage">
    <text ref="place" :is="userInfo.userType==0?'ownPlaceNormal':'ownPlaceMusic'" :userInfo="userInfo" :iMobile="mobile"></text>
  </div>
</template>
<script>
import { getUserInfo } from "../../api/userInfo";
import mixins from "../../mixins";
import ownPlaceNormal from "./ownPlaceNormal.vue";
import ownPlaceMusic from "./ownPlaceMusic.vue";
import { getUser,sharePage } from "../../api/weex";
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
export default {
  mixins: [mixins],
  components: { ownPlaceNormal, ownPlaceMusic },
  data() {
    return {
      userInfo: [],
      tabPageHeight2: 1334,
      // mobile: getUser().mobile
    };
  },
  created() {
      // this.mobile = '9EFC7F96C52DEA4FB234765796F96B4A';
      // modal.alert({message:this.mobile})
      this.request()
  },
  mounted(){
    // 数据埋点
    this.putPageUrlLog(1401);
  },
  methods:{
    fetchPage(){
      this.request()
      this.$refs.place.onrefresh()
    },
    request(){
      // 获取用户信息
      getUserInfo(
        {
          mobile: this.mobile
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.userInfo = res.object;
            storage.setItem("userIcon",res.object.icon);
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
.myPlace{
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
