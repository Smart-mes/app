//utils.js
 
//因为这个音效听起来是叮的声音，所以我取这个函数名，方便记忆音效，找的合适的场景就能想起来。
function play_ding_success() {
    const innerAudioContext = uni.createInnerAudioContext();
    innerAudioContext.autoplay = true;
    innerAudioContext.src = '/static/radio/success.mp3';
    innerAudioContext.onPlay(() => {});
    innerAudioContext.onError((res) => {
      this.$u.toast(res.errMsg);
    });
    setTimeout(() => {
        innerAudioContext.destroy() // 音效一般为1s，2s后销毁实例
    }, 2000)    
}
function play_ding_fail() {
    const innerAudioContext = uni.createInnerAudioContext();
    innerAudioContext.autoplay = true;
    innerAudioContext.src = '/static/radio/fail.mp3';
    innerAudioContext.onPlay(() => {});
    innerAudioContext.onError((res) => {
      this.$u.toast(res.errMsg);
    });
    setTimeout(() => {
        innerAudioContext.destroy() // 音效一般为1s，2s后销毁实例
    }, 2000)    
}
module.exports = {
    play_ding_success,
    play_ding_fail
}