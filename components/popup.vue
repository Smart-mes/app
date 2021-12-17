<template>
  <view>
    <u-popup mode="right" v-model="visible" :closeable="true" width="400">
      <view class="popup">
        <u-cell-group>
          <u-cell-item
            v-for="(workShop,i) in workShopList"
            :key="workShop.wsid"
            :title="workShop.wsName"
            :title-style="{color:current===i?'#1890ff':'#333','font-size': '32rpx'}"
            @click="handleWorkShop(i)"
          />
        </u-cell-group>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Popup",
  props: {},
  computed: {
    ...mapState(["workShopList"]),
  },
  data() {
    return {
      visible: false,
      current:3,
    };
  },
  mounted() {   
    this.workShopList.length&&this.handleWorkShop(this.current)
  },
  methods: {
    handleWorkShop(i){
      this.current=i;
      this.$emit('getWorkShop',this.workShopList[i])
      this.visible=false;
    }
  }
};
</script>
<style scoped lang="scss">
.popup {
  // touch-action: none; 
  margin-top: 100rpx;
}
</style>