

export function connectYixinJSBridge() {
  if (window.YixinJSBridge) {
    // alert(0)
    YixinJSBridge.invoke('getUserInfo', '', res=>{
      alert(res.Version)
      return res.Version
    });
  }
}
