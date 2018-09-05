<template>
    <div class="second-container1" >
        <div class="top" :style="{paddingTop:source==='iOS'?62:20+'px'}">
            <image class="image-view" :src='imgUrl+"back.png"' @click="pop()"></image>
            <text class="title font-32">发表评论</text>
            <text class="title font-32" @click="toPutComment()">发送</text>
        </div>
        <div class="release-words">
            <div class="textareaBg" v-if="!isShow" @click="onclick">
                <text class="tvalue":style="{color:content===''?'#ccc':'#333'}">{{textarea_value}}</text>
            </div>
            <textarea class="textarea" rows="13" v-model="content" v-if="isShow"  autofocus="true" :placeholder="placeholder" @blur="onblur" @change="onchange"></textarea>

        </div>
        <!-- 加载器 -->
        <wxc-loading :show="isLoading" type="default" need-mask="true"></wxc-loading>
    </div>
</template>
<script>
    import mixins from "../../mixins";
    import { putComment } from "../../api/activity.js";
    import { getCookie } from "../../utils/cookie.js";
    import { WxcLoading } from "weex-ui";
    const modal = weex.requireModule("modal");
    var storage = weex.requireModule("storage");
    export default {
        mixins: [mixins],
        name: "share-success",
        components: {
            WxcLoading
        },
        data() {
            return {
                isShow: false,
                placeholder: "评论写的屌一点，人生才够完美！",
                textarea_value: "",
                content: "",
                isLoading: false,
                submitFlag: true,
                resId: "", //this.$route.query.resId,
                mobile1: "", //this.$route.query.mobile,
                toCommentId: "" //this.$route.query.toCommentId,
            };
        },

        beforeCreate() {
            this.fontIcon();
        },
        created() {

            storage.getItem("data", event => {
                this.resId = JSON.parse(event.data).resId;
                this.toCommentId = JSON.parse(event.data).toCommentId;
            });
            storage.getItem("mobile", event => {
                this.mobile1 = event.data;
            });
        },

        mounted() {
            // 数据埋点
            this.putPageUrlLog(1603);
            this.textarea_value = this.placeholder;
        },
        methods: {
            onclick() {
                this.isShow = true;
            },
            onchange(event) {
                let _value = event.value;
                if (_value != "") {
                    this.textarea_value = this.content = _value;
                } else {
                    this.textarea_value = this.placeholder;
                }
            },
            onblur(event) {
                this.isShow = false;
            },
            toPutComment() {
                if (this.content == "") {
                    modal.toast({
                        message: "请输入评论",
                        duration: 1
                    });
                } else {
                    if (this.submitFlag) {
                        this.isLoading = true;
                        this.submitFlag = false;
                        putComment(
                            {
                                appid: this.appid,
                                resId: this.resId,
                                content: this.content,
                                resType: "topic",
                                toCommentId: this.toCommentId,
                                mobile: this.mobile
                            },
                            { token: this.mobile }
                        )
                            .then(res => {
                                if (res.status == 0) {
                                    this.isLoading = false;
                                    this.submitFlag = true;
                                    modal.toast({
                                        message: "发表成功",
                                        duration: 1
                                    });
                                    this.pop();
                                } else {
                                    this.isLoading = false;
                                    this.submitFlag = true;
                                    console.log(res.desc);
                                    modal.toast({
                                        message: res.desc,
                                        duration: 1
                                    });
                                }
                            })
                            .catch();
                    }
                }
            }
        }
    };
</script>

<style scope>
    .re_icon {
        font-family: iconfont;
        color: #ee1c41;
        font-size: 40px;
        font-weight: bold;
    }
    .second-container1 {
        width: 750px;
        height: 1000px;
        flex: 1;
        align-items: center;
    }
    .head-top {
        width: 750px;
        height: 50px;
        background-color: #fff;
        top: 0;
        left: 0;
        position: fixed;
    }
    .top {
        top: 0px;
        width: 750px;
        left: 0;
        background-color: #fff;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 22px;
        padding-left: 40px;
        padding-right: 40px;
        border-bottom-style: solid;
        border-bottom-color: #d9d9d9;
        border-bottom-width: 1px;
        position: fixed;
    }
    .title {
        color: #000;
        line-height: 61px;
    }
    .image-view {
        width: 61px;
        height: 61px;
    }
    .release-words {
        height: 1314px;
        align-items: center;
        margin-left: 20px;
        /* position: relative; */
    }
    .textareaBg {
        width: 700px;
        flex: 1;
        margin-top: 166px;
        padding-top: 20px;
        padding-bottom: 10px;
        padding-left: 20.5px;
        padding-right: 1px;
    }
    .tvalue {
        color: #ccc;
        font-size: 30px;
        line-height: 36px;
    }
    .textarea {
        width: 700px;
        margin-top: 166px;
        padding-top: 20px;
        padding-bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;
        color: #333;
        placeholder-color: #ccc;
        font-size: 30px;
        line-height: 36px;
    }
    .release-btn {
        width: 200px;
        height: 100px;
        padding: 20px;
        margin-left: 250px;
    }
    button {
        background-color: #984bca;
        color: white;
        height: 100px;
        text-align: center;
        border-radius: 15px;
    }
    .font-32 {
        font-size: 32px;
        line-height: 32px;
    }
</style>