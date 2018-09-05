<template>
	<div class="share-body" :style="{marginTop:source==='iOS'?50:20+'px'}">
	 <div class="share-success">
	  	<div class="check-icon">
		  	<div class="portrait-img">
		 		<image class="hdImg-view" :src="icon"></image>
			</div>
		  </div>
		  <div class="check-info">
		  	<div class="share-img">
			  	<image class="shareImg-view" :src="imgUrl+'check.png'"></image>
			  </div>
			  <div class="share-text">
			  	<text class="font-style1">
			  		{{text}}
			  	</text>

			  </div>
		  </div>
		  <div class="check-num">
			  	<text class="font-style2">本次签到的签到码{{signCode}}</text>
			</div>
			<div class="check-user">
				<text class="font-style3">{{formData.nickname}}</text>
			  	<text class="font-style3">{{formData.schoolName}}</text>
			  	<text class="font-style3">签到时间：{{formData.signTime}}</text>
			</div>
		  <div class="scan" @click='sao'>
		  	<text class="font-style4">{{btnText}}</text>
		  </div>
		</div>
		<div class="share-chose"  @click="pop()">
	  	<image class="img-view" :src="imgUrl+'close.png'"></image>
	  </div>
	  <!-- 加载器 -->
      <wxc-loading :show="isLoading" type="default" need-mask="true"></wxc-loading>
	</div>
</template>
<script>
import mixins from '../../../mixins';
import { putActivitySign} from "../../../api/activity.js";
import { WxcMask,WxcLoading } from "weex-ui";
import {scan} from '../../../api/weex';
const modal = weex.requireModule('modal');
const storage = weex.requireModule("storage");
export default {
  mixins: [mixins],
  name: 'share-success',
  components: {
    WxcLoading,
  },
  data() {
    return {
    	isLoading: false,
		text: '确认中......',
		btnText: '继续扫描二维码',
		devMobile:'',//发布者mobile
		resId:'',//this.$route.query.resId.split('_')[0],
		signCode:'',//this.$route.query.resId.split('_')[1],
		formData:{},
		icon:'http://wap.myyule.teamshub.com/web-icon/in.png',
    };
  },
  beforeCreate(){
    this.fontIcon();
  },
   created () {
  	 storage.getItem("data", event => {
      this.resId = JSON.parse(event.data).resId;
      this.devMobile= JSON.parse(event.data).mobile;

      // 活动签到
      this.activitySign();
    });
  },
  mounted() {
  },

  methods: {
  	 // 活动签到
  	activitySign() {
        this.isLoading=true;
	    putActivitySign({
	      appid: this.appid,
	      resId:this.resId,
	      signType:'host',
	      mobile:this.devMobile
	    },{token:this.mobile})
	      .then(res => {
	        if (res.status == 0||res.status == 2){
	        	this.isLoading=false;
	        	this.signCode =res.object.signCode;
	        	this.formData = res.object;
	        	this.text = '信息核对成功';
	     		if(this.formData.icon.substr(0,4)!='http'){
	     			this.formData.icon = 'http://media2.myyule.cn/'+this.formData.icon;
	     		}
	     		if(this.formData.schoolName == undefined){
					this.formData.schoolName = '暂无学校信息';
				}
	        } else {
	        	this.isLoading=false;
	          	modal.alert({
			        message:res.desc,
			        duration:1
		     	})
	        }
	      })
	      .catch(err => {});
   	},
	sao(){
        scan();
    }
  },
}
</script>

<style scope>
.share-body{
width: 750px;
position: fixed;
bottom: 0;
left: 0;
flex: 1;
background-color:rgba(90, 95, 90, 0.6);
align-items: center;
}
.share-success{
width:660px;
margin-top: 100px;
margin-bottom: 100px;
margin-left: auto;
margin-right: auto;
position: relative;
border-width: 5px;
border-style: solid;
border-color: #E71842;
border-bottom-left-radius: 15px;
border-bottom-right-radius:15px;
border-top-left-radius: 15px;
border-top-right-radius:15px;
align-items: center;
}
.check-info{
flex-direction: row;
justify-content: center;
margin-top: 80px;
align-items: center;
width: 650px;
}
.portrait-img{
align-items: center;
}
.hdImg-view{
width:114px;
height:114px;
margin-left: auto;
margin-right: auto;
}
.share-img{
width:100px;
height:100px;
}
.shareImg-view{
width: 100px;
height: 100px;
}
.share-text{
width: 300px;
height: 78px;
margin-left: 20px;
}
.font-style1{
width: 280px;
font-size: 32px;
font-weight: 600;
line-height: 18px;
text-overflow: ellipsis;
white-space: nowrap;
}
.check-num{
align-items: center;
}
.font-style2{
height: 100px;
font-size: 38px;
font-weight: 600;
line-height: 100px;
}
.check-user{
align-items: center;
}
.font-style3{
width: 460px;
text-align: center;
height: 50px;
font-size: 28px;
font-weight: 600;
line-height: 50px;
}
.scan{
width: 416px;
height: 110px;
margin-top: 50px;
margin-bottom: 50px;
margin-left: auto;
margin-right: auto;
border-bottom-left-radius: 15px;
border-bottom-right-radius:15px;
border-top-left-radius: 15px;
border-top-right-radius:15px;
background-color: #EE1C41;

}
.font-style4{
line-height: 110px;
text-align: center;
color: #FFFFFF;
font-size: 28px;
}
.share-chose{
align-items: center;
width: 750px;
height: 114px;
margin-top: -50px;
border-bottom-left-radius: 57px;
border-bottom-right-radius: 57px;
border-top-left-radius:  57px;
border-top-right-radius: 57px;;

}
.img-view{
width: 114px;
height: 114px;
}
</style>