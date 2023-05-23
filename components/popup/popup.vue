<template>
  <view>
    <u-popup mode="right" v-model="visible" :closeable="closeable" width="400">
      <scroll-view scroll-y="true" :style="{height:'90%'}" class="popup">
        <u-cell-group>
          <u-cell-item
            v-for="item in list" 
            :key="item[nameKey]" 
            :title="item[labelKey]"
            :title-style="{color: item[nameKey] === active[nameKey] ? '#1890ff' : '#333','font-size': '32rpx'}"
            @click="itemClick(item)"
          />
        </u-cell-group>
      </scroll-view>
    </u-popup>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: 'Popup',
  props: {
    list: {
      type: Array,
      required: true
    },
    nameKey: {
      type: String,
      default: 'value'
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    closeable:{
      type:Boolean,
      default:false
    }
  },
  data () {
    return {
      visible:false,
      active:{},
    }
  },
  methods: {
    itemClick (item) {
      this.visible=false;
      this.active=item;
      this.$emit('itemClick', item)
    }
  },
  mounted () {
    this.itemClick(this.$store.state.line[0]);  
  }
}
</script>
<style scoped lang="scss">
.popup {
  margin-top: 0rpx;
}
</style>