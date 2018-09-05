<template>
  <div class="myMission">
    <scroller>
      <div class="d-content">
        <div v-for="(item,index) in myMissions" :key="index" class="item">
          <div class="lefts">
            <image class="image" resize="cover" :src="'http://media2.myyule.cn/'+item.missionIcon" />
            <text class="name font-28">{{item.missionName}}</text>
          </div>
          <div class="rights">
            <text class="color-pink font-28">+{{item.reward}}乐币</text>
            <div v-if="item.isComplete == 1" @click="getReward(item)" class="button success"><text class="font-26 getDom">可领取</text></div>
            <div v-if="item.isComplete == 0" class="button normal"><text class="font-26 getDom">做任务</text></div>
            <image v-if="item.isComplete== 2" class="image" :src="imgUrl+'get-ok.png'" />
          </div>
        </div>
      </div>
      <div class="top" :style="{paddingTop:source==='iOS'?62:20+'px'}">
          <div @click="pops()" class="left">
            <image class="image-view" :src="imgUrl+'back.png'" />
          </div>
          <div class="title">
            <text class="font-32 title-1">每日任务</text>
            <text class="font-22 gray">{{overMission}}/{{myMissions.length}}</text>
          </div>
          <div class="right"></div>
      </div>
    </scroller>
    <wxc-loading loading-text="加载中" :show="isShow" :need-mask="true"></wxc-loading>
  </div>
</template>
<script>
import mixins from '../../mixins';
import {getMission,putMissionReward} from '../../api/userInfo';
const modal = weex.requireModule("modal");
export default {
  mixins:[mixins],
  data(){
    return{
      myMissions:[]
    }
  },
  computed: {
    overMission(){
      let overMissionNum=0
      this.myMissions.forEach((value,index,array)=>{
        if(value.isComplete == 1 || value.isComplete == 2){
          overMissionNum ++
        }
      })
      return overMissionNum
    }
  },
  mounted(){
    this.putPageUrlLog(1203)
    // modal.alert({message:this.mobile})
    getMission({
      mobile: this.mobile,
      missionType:'day'
    },{token:this.mobile})
      .then(res => {
        if (res.status == 0) {
          this.isShow = false;
          this.myMissions = res.object;
        } else {
          console.log(res.desc);
        }
      })
      .catch(err => {});
  },
  methods:{
    // 领取奖励
    getReward(item){
      this.isShow = true;
      putMissionReward({
        mobile: this.mobile,
        missionId:item.missionId
      })
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            item.isComplete = 2
            modal.alert(
              {
                message: "领取成功！",
                duration: 0.3
              },
              function(value) {}
            );
          } else {
            console.log(res.desc);
          }
        })
    },
      pops() {
          // 发送返回通知
          const channel = new BroadcastChannel('backShow')
          channel.postMessage(JSON.stringify({back:'pop'}));
          weex.requireModule('navigator').pop({
              animated: 'true'
          })
      }
  }
}
</script>
<style src="../../assets/style/index.scss">

</style>
<style  scoped>

.myMission{
  width:750px;
  background-color:#fff;
  /*z-index: 200;*/
  }
  .top {
  	 border-bottom-width: 1px;
      border-bottom-style: solid;
      border-bottom-color:#ececec ;
	    position: absolute;
	    width: 750px;
	    /*z-index: 3;*/
	    left: 0;
	    background-color: #fff;
	    flex-direction: row;
	    justify-content: space-between;
	    align-items:center;
	    padding-bottom: 22px;
	    padding-left: 40px;
	    padding-right: 40px;
	    top: 0px;
    }
      .title{
        color: #000;
        padding-bottom: 5px;
        padding-top: 5px;
        align-items: center;
        justify-content: center;
      }
    .left{
      width: 61px;
      height: 61px;
    }
    .right {
      width: 61px;
      height: 61px;
    }
  
  	.d-content{
	    padding-top:158px;
	    }
    .item{
    	padding-bottom: 27px;
    	padding-top: 27px;
    	padding-right: 30px;
    	padding-left: 30px;
    	flex-direction: row;
        justify-content: space-between;
        align-items:center;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color:#ececec ;
      }
	  .lefts{
	    flex-direction: row;
	    align-items: center;
	    }
      .image{
        width:90px;
        height:90px;
        margin-right:22px;
      }
      
      .rights{
        flex-direction: row;
        align-items: center;
        }
        .button{
          margin-left:18px;
          width:114px;
          height:48px;
          align-items: center;
  	   		justify-content: center;
          border-bottom-left-radius: 25px;
          border-bottom-right-radius: 25px;
          border-top-left-radius: 25px;
          border-top-right-radius: 25px;
          }
          .getDom{
	      	   align-items: center;
	      	   justify-content: center;
        		color:#fff;
          }
          .success{
            background-color:#EE1C41;
          }
          .normal{
            background-color:#0066FF;
          }
        
        .image{
          margin-left:18px;
          width: 88px;
          height:88px;
        }
   .image-view{
   	width: 61px;
   	height: 61px;
   }
</style>
