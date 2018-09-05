<template>
    <div @click="push2('/views/activity/active_layout/active_detail',{resId:item.resId})" class="activity-item">
      <div class="left">
        <image class="activity-icon" :src="item.logo.substr(0,4)==='http'?item.logo:('http://media2.myyule.cn/'+item.logo)" placeholder="http://www.myyule.com/images/music/photo192.jpg"></image>
        <div class="activity-content">
          <div class="activity-name">
            <text class="font-28" :class="[otherName(item)[0]==keyWord?'color-pink':'color-gray-dark']">{{otherName(item)[0]}}</text>
            <text class="font-28" :class="[otherName(item)[1]==keyWord?'color-pink':'color-gray-dark']">{{otherName(item)[1]}}</text>
            <text class="font-28" :class="[otherName(item)[2]==keyWord?'color-pink':'color-gray-dark']">{{otherName(item)[2]}}</text>
            <text v-if="isElips"  class="elips font-28 color-gray">...</text>
          </div>
          <div class="">
            <text  class="color-gray font-26 iconfont address color-gray">&#xe609; {{item.address}}</text>
          </div>
          <div class="activity-desc">
            <text class="color-gray font-24 iconfont">&#xe632; {{item.starttime.substr(5,5)}} -{{item.endtime.substr(5,5)}}</text>
            <text class="color-gray font-24 free">{{item.feeType == '1'?'收费':'免费'}}</text>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import mixins from '../../../mixins'
export default {
  mixins:[mixins],
  props: {
    item: {},
    keyWord: {}

  },
    data() {
        return {
            isElips:false,
        }
    },
    methods:{
        //标红
        otherName(item){
            const stringInit = item.title;
            let index= 0;
            let string='';
            if(stringInit.length>14){
                string=stringInit.substr(0,14);
                this.isElips=true
            }else{
                string=stringInit;
                this.isElips=false
            }
            let len=this.keyWord.length;
            index = string.indexOf(this.keyWord);
            if(index == 0){

                return [this.keyWord,string.substr(len),'']
            } else if (index >0){
                return [string.substr(0,index),this.keyWord,string.substr(index+len)]
            }else{
                return ['',string,'']

            }
        }
    }


};
</script>
<style src="../../../assets/style/index.scss">
</style>
<style scoped>
/*图标*/
.iconfont {
  font-family: iconfont;
}
/* 公共样式 */
.color-pink {
  color: #ee1c41;
}
.color-gray {
  columns: #787878;
}
.font-24 {
  font-size: 24px;
  line-height: 24px;
  margin-bottom: 18px;
}
.font-26 {
  font-size: 26px;
  line-height: 26px;
  margin-bottom: 18px;
}
.font-28 {
  font-size: 28px;
  line-height: 28px;
  margin-bottom: 19px;
}
/* 音乐结果 */
.activity-item {
  width:750px;
  justify-content: space-between;
  flex-direction: row;
  align-items: flex-end;
  padding-left: 36px;
  padding-top: 26px;
  padding-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #eeccee;
  background-color: #fff;
}

.left {
  flex-direction: row;
  align-items: flex-end;
}
.free {
  padding-right: 21px;
}
.activity-icon {
  width: 159px;
  height: 159px;
  background-color: #eeccee;
  margin-right: 36px;
}
.activity-name{
  /*width:320px;*/
   flex-direction: row;
}
.activity-desc {
  width:500px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
  .address{
    lines:1;
    width: 480px;
    text-overflow: ellipsis;
  }
</style>
