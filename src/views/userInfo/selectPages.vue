<template>
  <div :style="{paddingTop:source==='iOS'?62:20+'px'}" class="perfectInfo active" ref="test1">
    <wxc-loading :show="isShow" :need-mask="true"></wxc-loading>
    <div class="install-title" >
          <text @click="pop()" class="iconfont back">&#xe625;</text>
          <text class="title-text iconfont">选择{{pageTitle()}}</text>
          <div class="title-text sure"></div>
    </div>
    <wxc-searchbar ref="wxc-searchbar"
      v-if="selectType!=='class'"
      :bar-style="barStyle"
      :always-show-cancel="false"
      @wxcSearchbarCancelClicked="wxcSearchbarCancelClicked"
      @wxcSearchbarInputOnInput="wxcSearchbarInputOnInput"
      @wxcSearchbarCloseClicked="wxcSearchbarCloseClicked">
    </wxc-searchbar>
    <div class="contain">
      <text v-if="searchResult" class="search-result font-24">{{searchResult}}</text>
      <div v-if="prevprevItem||prevItem" class="step-cell">
        <text v-if="prevprevItem" class="iconfont color-pink font-24">{{prevprevItem.name}} &#xe656;</text>
        <text v-if="prevItem" class="iconfont color-pink font-24">{{prevItem.name}} &#xe656;</text>
      </div>
      <!-- <div v-if="key" class="createItem" @click="createItem" >
        <text class="createText">添加{{pageTitle()}} — {{value}}</text>
      </div> -->
      <list class="search-wrapper" :style="{height:(tabPageHeight-160)+'px'}" @loadmore="fetch" loadmoreoffset='10'>
        <cell @click="select(item)" v-for="(item,index) in arryData" :key="index" class="cell">
          <text class="cell-title font-26 color-gray">{{item.name}}</text>
          <text class="cell-right iconfont">&#xe656;</text>
        </cell>
      </list>
    </div>
  </div>
</template>
<script>
import { WxcSearchbar, WxcIcon, WxcLoading, Utils } from "weex-ui";
import mixins from "../../mixins";
import { putPlace, getPlace, putUserPwd } from "../../api/userInfo";
const modal = weex.requireModule("modal");
const animation = weex.requireModule("animation");
const storage = weex.requireModule("storage");
export default {
  mixins: [mixins],
  components: { WxcIcon, WxcLoading, WxcSearchbar },
  data() {
    return {
      value:'',
      key:false,
      tabPageHeight: 1334,
      isShow: false,
      searchResult: "",
      selectItem: [],
      prevItem: [],
      prevprevItem: [],
      selectMap: ["school", "dept", "class"],
      selectIndex: 0,
      barStyle: {
        fontSize: 16,
        backgroundColor: "#000",
        fontColor: "#fff"
      },
      selectType: "",
      arryData: [],
      pageNo: 1
    };
  },
  computed: {},
  created() {
    this.fontIcon();
    this.tabPageHeight = Utils.env.getPageHeight();
    if (this.webParam()) {
      this.selectType = this.webParam().selectType;
      this.prevItem = this.webParam().selectItem;
      this.prevprevItem = this.webParam().prevItem;
      this.request();
    } else {
      storage.getItem("data", event => {
        this.selectType = JSON.parse(event.data).selectType;
        this.selectMap.forEach((value, index, array) => {
          if (value == this.selectType) {
            this.selectIndex = index;
          }
        });
        this.prevItem = JSON.parse(event.data).selectItem;
        this.prevprevItem = JSON.parse(event.data).prevItem;
        this.request();
      });
    }
  },
  mounted() {},
  methods: {
    // 初始化
    request() {
      if (this.selectType == "school") {
        this.searchResult = "附近的学校";
      } else if (this.selectType == "class") {
        this.arryData = [
          { name: "1班" },
          { name: "2班" },
          { name: "3班" },
          { name: "4班" },
          { name: "5班" },
          { name: "6班" },
          { name: "7班" },
          { name: "8班" },
          { name: "9班" },
          { name: "10班" }
        ];
        return
      }
      putPlace(
        { pageNo: 1, pageSize: 20, pType: this.selectType,pid:this.prevItem?this.prevItem.id:'' },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.arryData = res.object;
          } else {
            modal.toast({
              message: res.desc,
              duration: 1
            });
          }
        })
        .catch();
    },
    // 添加创建
    // createItem(){
    //   this.select({name:this.value})
    // },
    // 标题
    pageTitle() {
      if (this.selectType == "school") {
        return "学校";
      } else if (this.selectType == "dept") {
        return "院系";
      } else if (this.selectType == "class") {
        return "班级";
      }
    },
    // 选择
    select(item){
      if(this.selectType == 'class'){
        this.push2('/views/userInfo/perfectInfo',{school:this.prevprevItem,dept:this.prevItem,class:item})
      }else{
        this.push2('/views/userInfo/selectPages',{selectType:this.selectMap[this.selectIndex+1],selectItem:item,prevItem:this.prevItem})
    }},
    wxcCellClicked() {},
    // 取消
    wxcSearchbarCancelClicked() {
      this.pop();
    },
    // 搜索
    wxcSearchbarInputOnInput(e) {
      console.log(e);
      this.value = e.value;
      getPlace(
        {
          name: this.value,
          pageNo: this.pageNo,
          pType: this.selectType,
          pageSize: 10
        },
        { mobile: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.arryData = res.object;
            if (this.arryData.length == 0) {
              this.key = true;
              this.searchResult = "无搜索结果";
            } else if (this.selectType == "school") {
              this.key = false;
              this.searchResult = "附近的学校";
            } else {
              this.key = false;
              this.searchResult = "";
            }
          } else {
            modal.alert({ message: res.desc });
          }
        })
        .catch();
    },
    // 下一页
    fetch() {
      this.pageNo++;
      if (this.selectType=='class') {
        return
      }
      getPlace(
        {
          name: this.value,
          pageNo: this.pageNo,
          pType: this.selectType,
          pageSize: 10
        },
        { mobile: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.arryData = this.arryData.concat(res.object);
          } else {
            modal.alert({ message: res.desc });
          }
        })
        .catch();
    },
    wxcSearchbarCloseClicked() {}
  }
};
</script>
<style src="../../assets/style/index.scss">
</style>
<style scoped>
.iconfont {
  font-family: iconfont;
}
.perfectInfo {
  width: 750px;
  background-color: #fff;
}
.cell {
  width: 750px;
  height: 100px;
  padding-left: 30px;
  padding-right: 30px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
}
.createText {
  lines: 1;
  text-overflow: ellipsis;
  color: #fff;
  font-size: 24px;
}
.createItem {
  background-color: #ee1c41;
  padding: 11px;
  border-radius: 5px;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-left:30px;
}
.search-wrapper {
  width: 750px;
}
.contain{
  align-items: flex-start;
  flex-wrap: wrap;
}
.search-result {
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 30px;
  padding-right: 30px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
  font-size: 24px;
}
.step-cell {
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 30px;
  padding-right: 30px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
  flex-direction: row;
}
/* 导航 */
.install-title {
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
  width: 45px;
}
.msg {
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  color: #666;
}
.input {
  height: 50px;
}
</style>
