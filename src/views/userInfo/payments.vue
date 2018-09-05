<template>
	<div class="payments">
		<wxc-loading loading-text="加载中" :show="isShow" :need-mask="true"></wxc-loading>
		<list class="list" @loadmore="fetch" loadmoreoffset="600">
			<cell v-for="(item,index) in billsData" :key="index" class="item cell">
				<div class="lefts">
					<text class="titles font-28">{{item.title}}</text>
					<text class="font-22 colorg">乐币余额:{{item.leftAccount}}</text>
				</div>
				<div class="rights">
					<text class="time font-24 colorg" >{{nowDays(item.createTime)}}</text>
					<text v-if="item.type=='in'" class="font-28 color-pink">+{{item.sum}}乐币</text>
					<text v-if="item.type=='out'" class="font-28 color-pink">-{{item.sum}}乐币</text>
				</div>
			</cell>
		</list>
		<!-- 遮罩 -->
		 <wxc-popup popup-color=""
                 :show="isBottomShow"
                 @wxcPopupOverlayClicked="popupOverlayBottomClick"
                 pos="top"
                 ref="wxcPopup"
                 height=""
                 width="750">
          <div class="demo-content">
				  <div class="top">
					  <div @click="hide()" class="left">
						  <image class="image-view" :src="imgUrl+'back.png'" />
					  </div>
					  <div @click="sliderShow" class="title">
						  <text class="font-32 title-1">{{bTitle}}</text>
						  <image v-if="!sliderKey" class="image" :src="imgUrl+'down-gray.png'" />
						  <image v-if="sliderKey" class="image" :src="imgUrl+'up-gray.png'" />
					  </div>
					  <div class="right"></div>
				  </div>
	              <div  v-if="sliderKey" class="top-slider">

					<div v-for="(item,index) in sliderList" @click="selectIndex(index)" :key="index" class="itemPoup">
						<text class="titleBg">{{item}}</text>
						<image v-if="index == crurentIndex" class="select-img" :src="imgUrl+'select.png'" />
					</div>
				</div>
          </div>
      </wxc-popup>
        <div class="top">
			<div @click="hide()" class="left">
				<image class="image-view" :src="imgUrl+'back.png'" />
			</div>
			<div @click="sliderShow" class="title">
				<text class="font-32 title-1">{{bTitle}}</text>
				<image v-if="!sliderKey" class="image" :src="imgUrl+'down-gray.png'" />
				<image v-if="sliderKey" class="image" :src="imgUrl+'up-gray.png'" />
			</div>
			<div class="right"></div>
		</div>
	</div>
</template>
<script>
	import { WxcPopup } from 'weex-ui';
	import mixins from '../../mixins';
	import { getBillsInfo } from "../../api/userInfo";
	const modal = weex.requireModule('modal');

	export default {
		mixins: [mixins],
		components: {
			WxcPopup
		},
		data() {
			return {
				sliderKey: false,
				refreshing: false, // 下拉刷新
				pageNo: 1,
				sliderList: ['全部', '支出', '收入'],
				billsData: [],
				crurentIndex: 0,
				dateTime:'',
				isBottomShow:false,
                bTitle:'收支明细',
			}
		},
		created() {
			this.getPayments();
		},
		mounted(){
			this.putPageUrlLog(1204)
		},
		methods: {
			hide() {
				this.pop();
			},
			sliderShow() {
				if(this.sliderKey) {
					this.sliderKey = false;
		        	this.isBottomShow = false;
					// this.sliderHide()
				} else {
					this.sliderKey = true;
					this.isBottomShow=true;
					// this.$refs.bg.show();
				}
			},
			  popupOverlayBottomClick () {
	  	 		this.sliderKey = false;
		        this.isBottomShow = false;
		      },
			
			// 下拉选择收支
			selectIndex(index) {
				this.crurentIndex = index;
				this.pageNo = 1;
				this.sliderKey = false;
		        this.isBottomShow = false;
				this.isShow = true;
				if(index=='0'){this.bTitle='收支明细'; }
				if(index=='1'){this.bTitle='支出';}
				if(index=='2'){this.bTitle='收入'}
				this.getPayments();

			},
			// 获取收支明细
			getPayments() {
				let param = {
					mobile: this.mobile,
					pageNo: this.pageNo,
					pageSize: 20
				}
				console.log(this.crurentIndex);
				if(this.crurentIndex == 1) {
					param.infoType = 'out'
				} else if(this.crurentIndex == 2) {
					param.infoType = 'in'
				}
				getBillsInfo(param, {
						token: this.mobile
					})
					.then(res => {
						if(res.status == 0) {
							this.isShow = false;
							if(this.pageNo == 1) {
								this.billsData = res.object;
							} else {
								this.billsData = this.billsData.concat(res.object);
							}
							console.log(this.billsData)
						} else {
							console.log(res.desc);
						}
					})
					.catch(err => {});
			},

			fetch(event) {
				// modal.toast({ message: 'loadmore', duration: 1 })\
				if(!this.isShow) {
					this.isShow = true;
					this.pageNo += 1
					this.getPayments()
					setTimeout(() => {}, 800)
				}
			},
			// 下拉刷新
			onrefresh(event) {
				// modal.toast({ message: '正在刷新', duration: 1 })
				this.isShow = true;
				this.refreshing = true
				setTimeout(() => {
					this.refreshing = false
				}, 2000)
			},
			onpullingdown(event) {
				this.pageNo = 1;
				this.billsData = [];
				this.getPayments();
			},
			nowDays(item){

	          var nowTime =new Date(item);
	          var Y = nowTime.getFullYear() + '-';
	          var M = (nowTime.getMonth()+1 < 10 ? '0'+(nowTime.getMonth()+1) : nowTime.getMonth()+1) + '-';
	          var D = nowTime.getDate()<10 ?  '0'+nowTime.getDate()+' ': nowTime.getDate()+' ';
	          var nowTimes=Y+M+D;
	         return nowTimes;
		  }
		}
	}
</script>
<style src="../../assets/style/index.scss">

</style>
<style scoped>
	.colorg{color:#666666;}
	.color-pink{color: #EE1C41;}
	.payments {
		width: 750px;
		background-color: #fff;
		flex: 1;
	}
	/*@include translateX();*/
	.list{
		margin-top: 150px;
	}
	.top {
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color:#ececec ;
		position: fixed;
		width: 750px;
		left: 0;

		background-color: #fff;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 22px;
		padding-left: 40px;
		padding-right: 40px;
		padding-top: 72px;
		top: 0px;
	}
	
	.title {
		position: relative;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	
	.title-1 {
		color: #000;
		padding-bottom: 5px;
		padding-top: 5px;
	}
	
	.image {
		width: 40px;
		height: 40px;
	}
	
	.left {
		width: 61px;
		height: 61px;
	}
	
	.right {
		width: 61px;
		height: 61px;
	}
	
	.top-slider {
		position: fixed;
		top: 154px;
		left: 0;
		width: 750px;
		background-color: #fff;
		border-top-width: 1px;
		border-top-color: #ececec;
		border-top-style: solid;
	}
	
	.select-img {
		width: 44px;
		height: 44px;
	}
	
	.pay-content {
		padding-top: 155px;
	}
	
	.item {
		border-bottom-width: 1px;
		border-bottom-color: #ececec;
		border-bottom-style: solid;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-left: 30px;
		padding-right: 30px;
		padding-top: 33px;
		padding-bottom: 33px;
	}
	
	.titles {
		padding-bottom: 12px;
	}
	
	.time {
		padding-bottom: 16px;
		color: #000000;
	}
	.image-view{
		height: 61px;
		width: 61px;
	}
	.top-slider{
		background-color: white;
		width: 750px;
	}
	.itemPoup{
		width: 750px;
		border-bottom-width: 1px;
		border-bottom-color: #ececec;
		border-bottom-style: solid;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-left: 30px;
		padding-right: 30px;
		padding-top: 33px;
		padding-bottom: 33px;
	}
</style>