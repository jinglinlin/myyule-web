const animation = weex.requireModule('animation')
// 过度动画
export function move() {
  var testEl = this.$refs.el;
  animation.transition(testEl, {
    styles: {
      transform: 'translate(750px, 0)',
      transformOrigin: 'center center'
    },
    duration: 800, //ms
    timingFunction: 'ease',
    delay: 0 //ms
  }, function () {
  })
}