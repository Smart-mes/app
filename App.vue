<script>
import { mapState, mapActions } from "vuex";
export default {
  onLaunch: function () {
    // this.cid();
    this.init();
  },
  onShow: function () {},
  onHide: function () {},
  computed: {
    ...mapState(["hasLogin", "userInfo"]),
  },
  methods: {
    // ...mapActions(["getWorkShop"]),
    init() {
      // 锁定竖屏
      // #ifdef APP-PLUS
      plus.screen.lockOrientation("portrait-primary"); 
			// #endif
      if (this.hasLogin) {
        uni.reLaunch({ url: "/pages/index/index" });
      } else {
        uni.reLaunch({ url: "pages/login/login" });
      }
    },

    cid() {
      // #ifdef APP-PLUS
      var pinf = plus.push.getClientInfo();
      console.log(pinf);
      var cid = pinf.clientid; //客户端标识
      console.log("cid：" + cid);

      plus.push.addEventListener("click", (msg) => { console.log("click:", msg)},false);

      plus.push.addEventListener("receive", (msg) => {
          plus.runtime.setBadgeNumber(8);
          plus.push.createMessage("receive", msg);
        },false);
      // #endif
    }
  },
};
</script>

<style lang="scss">
@import "static/style/font/iconfont.css";
@import "static/style/style.scss";
@import "uview-ui/index.scss";
@import url("components/ly-tree/ly-tree.css");
</style>
