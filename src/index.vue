<template>
  <div class="wrapper" @viewappear="appper"  @viewdisappear="miniHidder">
    <home ref="home"></home>
     <!-- <text style="font-size:30px" @click="push2('/views/club/createClub',{clubId:'1742156'})">我的地盘</text> -->
  </div>
</template>

<script>
import home from "./views/home/home.vue";
import mixins from "./mixins";
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
export default {
  name: "App",
  mixins: [mixins],
  components: {
    home
  },
  data() {
    return {
    };
  },
  beforeCreate() {
    var domModule = weex.requireModule("dom");
    domModule.addRule("fontFace", {
      fontFamily: "iconfont",
      // src: "url('http://at.alicdn.com/t/font_580422_62vodh0mkakyb9.ttf')"
      src:
        "url('https://myyule.teamshub.com/web-icon/font/font_580422_62vodh0mkakyb9.ttf')"
    });
  },
  created() {
    storage.setItem("source", weex.config.env.platform);
    storage.setItem("mobile", getUser().mobile);
  },
  mounted() {
    this.putPageUrlLog(1001);
  },
  methods: {
    appper() {
      this.miniShow();
      // 用户信息
      this.$refs.home.getUserInfoFn();
    }
  }
};
</script>

<style scoped>
.wrapper {
  justify-content: center;
  align-items: center;
  /* padding-top: 50px; */
  padding-bottom: 10px;
}
</style>
