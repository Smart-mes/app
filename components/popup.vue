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
    active:{
      type:Object,
      default:null
    },
    closeable:{
      type:Boolean,
      default:false
    }
  },
  data () {
    return {
      visible:false,
      // itemActive:null,
    }
  },
  watch: {
    active: {
      handler (value) {
          this.itemActive =value
          this.itemClick(value)       
      },
      immediate: true
    }
  },
  methods: {
    itemClick (item) {
      this.visible=false;
      this.$emit('itemClick', item)
    }
  }
}
</script>
<style scoped lang="scss">
.popup {
  margin-top: 100rpx;
}
</style>