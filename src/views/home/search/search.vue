<template>
  <div :class="['search-wrapper',source==='iOS'?'':'active']">
    <wxc-searchbar ref="wxc-searchbar"
    :always-show-cancel="true"
    :autofocus="light"
                     @wxcSearchbarCancelClicked="wxcSearchbarCancelClicked"
                     @wxcSearchbarInputOnInput="wxcSearchbarInputOnInput"
                     @wxcSearchbarCloseClicked="wxcSearchbarCloseClicked"
                     @wxcSearchbarInputOnBlur="wxcSearchbarInputOnBlur"></wxc-searchbar>
      <!-- <scroller class="search-history-hot" ref="searchHistoryHout">
        <div class="search-history">
          <div class="list-wrapper">
            <div v-for="index in 3" :key="index"  class="history-item">
              <div class="history-left">
                <text class="history-text">0 remix</text>
              </div>
              <div class="history-right">
                <text class="history-text">x</text>
              </div>
            </div>
          </div>
        </div>
        <div class="search-hot">
          <text class="hot-title">今日热搜</text>
          <div class="hot-list">
            <div @click="clickSearch(item)" v-for="(item,index) in 5" :key="index" class="list-item">
              <text class="hot-text">{{item}}</text>
            </div>
          </div>
        </div>
      </scroller> -->
      <searchResult ref="result" :value="value" ></searchResult>
  </div>
</template>
<script>
import { WxcSearchbar } from "weex-ui";
import searchResult from "./searchResult.vue";
import mixins from "../../../mixins";
export default {
  mixins: [mixins],
  components: { WxcSearchbar, searchResult },
  data: () => ({
    value: "",
    light: true
  }),
  mounted() {
    // 数据埋点
    this.putPageUrlLog(1311);
  },
  methods: {
    // 热搜
    clickSearch(item) {
      this.value = item;
      this.light = false;
    },
    // 搜索框上的事件
    // 失去焦点
    wxcSearchbarInputOnBlur() {
      this.$refs.result.show();
    },
    wxcSearchbarCloseClicked() {
      this.pop();
    },
    // 搜索
    wxcSearchbarInputOnInput(e) {
      console.log(e);
      this.value = e.value;
    },
    // 取消
    wxcSearchbarCancelClicked() {
      console.log("wxcSearchbarCancelClicked");
      this.light = true;
      this.pop();
    }
  }
};
</script>

<style scoped>
.search-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 750px;
  height: 1334px;
  background-color: #fff;
  padding-top: 40px;
}
.active {
  padding-top: 20px;
}
.search-bar-input-gray {
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
}
.search-history-hot {
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #ececec;
  height: calc(100% - 44px);
}
.search-history {
  background-color: #ffff;
  margin-bottom: 20px;
  border-bottom-width: 12px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
}
.history-item {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 19px;
  padding-bottom: 21px;
  flex-direction: row;
  justify-content: space-between;
}
.search-hot {
  background-color: #ffff;
  padding-left: 20px;
}
.hot-list {
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: row;
  padding-left: 38px;
  padding-right: 58px;
  color: #666666;
}
.list-item {
  padding: 5px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-color: green;
  border-width: 1px;
  border-style: solid;
  border-color: #989898;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 25px;
  padding-right: 25px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.hot-title {
  padding-top: 31px;
  padding-bottom: 29px;
  color: #666666;
}
.history-text {
  color: #666666;
  font-size: 26px;
}
.hot-text {
  color: #666666;
  font-size: 24px;
}
</style>
