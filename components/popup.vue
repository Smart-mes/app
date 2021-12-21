<template>
  <view>
    <u-popup mode="right" v-model="visible" :closeable="true" width="400">
      <view class="popup">
        <u-cell-group>
          <u-cell-item
            v-for="(item, i) in list"
            :key="item.wsid"
            :title="item.wsName"
            :title-style="{color: current === i ? '#1890ff' : '#333','font-size': '32rpx'}"
            @click="handleWorkShop(i)"
          />
        </u-cell-group>
      </view>
    </u-popup>
  </view>
</template>

<script>
// import { mapState } from "vuex";
export default {
  name: "Popup",
  props: {
    url: {
      type: String,
      default: "/api/BWorkShop",
    },
  },
  // computed: {
  //   ...mapState(["workShopList"]),
  // },
  data() {
    return {
      visible: false,
      current: 0,
      list:[]
    };
  },
  mounted() {
    // this.workShopList.length && this.handleWorkShop(this.current);
    this.ajax();
  },
  methods: {
    handleWorkShop(i) {
      this.current = i;
      this.$emit("getWorkShop", this.list[this.current]);
      this.visible = false;
    },
    ajax(){
      this.$http.request({url: "/api/BWorkShop",method: "GET"})
      .then(res=>{
        this.list=res;
        this.$emit("getWorkShop", this.list[this.current]);
      });
    }
  },
};
</script>
<style scoped lang="scss">
.popup {
  // touch-action: none;
  margin-top: 100rpx;
}
</style>