const storage = weex.requireModule('storage');
const navigator = weex.requireModule('navigator');
const modal = weex.requireModule('modal');

// 外链url
export const outUrl = 'http://wap.myyule.teamshub.com/web/'
//图片url
export const imgUrl = 'http://wap.myyule.teamshub.com/web-icon/'

// 跳外链
export function jump(url) {
  navigator.push({
    url: url,
    animated: "true"
  }, event => {})
}
// 返回
export function pop() {
  modal.toast({message:0})
  // this.$router.go(-1)
  navigator.pop({
    animated: 'true'
  })
}
// 跳转
export function push(url, data) {
  this.$router.push({
    path: url,
    query: data
  });
}

export function register(component) {
  return {
    weexComponent: component,
    install: function (Vue) {
      /* istanbul ignore if */
      if (install.installed) return
      Vue.component(component.name, component)
    }
  }
}
export function mobile(params) {
  let mobile = 'jdhrYnupiPYhHg1pUx0lzA=='
  // storage.getItem('moblie',event=>{
  //   mobile = event.data
  // })
  return mobile
}
// 转为unicode 编码  
export function encodeUnicode(str) {
  var res = [];
  for (var i = 0; i < str.length; i++) {
    res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
  }
  return "\\u" + res.join("\\u");
}
// 解码 
export function decodeUnicode(str) {
  str = str.replace(/\\/g, "%");
  return unescape(str);
}