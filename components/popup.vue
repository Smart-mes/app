<template>
  <view>
    <u-popup mode="right" v-model="visible" :closeable="true" width="400">
      <scroll-view scroll-y="true" :style="{height:'90%'}" class="popup">
        <u-cell-group>
          <u-cell-item
            v-for="(item, i) in list"
            :key="item.wsid"
            :title="item.wsName"
            :title-style="{color: current === i ? '#1890ff' : '#333','font-size': '32rpx'}"
            @click="handleWorkShop(i)"
          />
        </u-cell-group>
      </scroll-view>
    </u-popup>
  </view>
</template>

<script>
import { mapState} from "vuex";
export default {
  name: "Popup",
  props: {
    url: {
      type: String,
      default: "/api/BWorkShop",
    },
  },
  computed:{
    ...mapState(["line"])
  },
  data() {
    return {
      visible: false,
      current: 0,
      list:[]
    };
  },
  mounted() {
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
        res.forEach((el,i) => {       
          if(el.wsCode===this.line[0].value){
            this.current=i;
          }
        });
        this.list=res;
        this.$emit("getWorkShop", this.list[this.current]);
      });
    }
  },
};
</script>
<style scoped lang="scss">
.popup {
  margin-top: 100rpx;
}
</style>