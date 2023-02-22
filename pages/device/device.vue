<template>
  <view>
    <ex-TnavBar :title="navBar.title" :is-back="navBar.isBack" title-bold>
      <view class="navbar-right" slot="right">
        <view class="navbar-icon">
          <u-icon class="icon-item" name="list" color="#666" size="45" @click.native="handleMenu"/>
        </view>
      </view>
    </ex-TnavBar>
    <!-- nav -->
    <view class="u-page">
      <u-tabs
        ref="uTabs"
        height="65"
        bar-width="70"
        bar-height="5"
        active-color="#2979ff"
        inactive-color="#606266"
        font-size="28"
        :list="tabList"
        :is-scroll="false"
        :current="tabCurrent"
        @change="tabsChange"
      />
      <!-- tabs -->
      <view class="sub-info">
        <view class="nav-subTitle">{{ this.active.label}}</view>
        <view class="tips">
          <view class="tips-item">
            <text class="tips-icon green-icon"></text>
            <text>工单进度</text>
          </view>
          <view class="tips-item">
            <text class="tips-icon"></text>
            <text>模具维修进度</text>
          </view>
        </view>
      </view>
      <!-- 提示  -->
      <view class="device-list" v-for="(item, i) in allList" :key="i">
        <view class="device-hd" @tap="visibleHandle(item)">
          <text class="device-name">{{ item.processName }}</text>
          <u-icon
            :name="item.visible ? 'arrow-up-fill' : 'arrow-down-fill'"
            color="#ccc"
            size="22"
          />
        </view>
        <view v-show="item.visible">
          <view class="device-bd">
            <block v-for="(device, j) in item.children" :key="j">
              <!-- 启动  -->
              <view class="device-item" v-if="device.state === 1">
                <view class="device-item-box startUp">
                  <view class="device-item-no">{{ device.machineCode }}</view>
                  <view class="device-item-center">
                    <view class="device-item-left">
                      <u-icon name="calendar" size="60" color="#999" />
                    </view>
                    <view class="device-item-right">
                      <text class="ellipsis">
                        工单：{{ device.orderNo || "无" }}
                      </text>
                      <text>状态：{{ device.stopreasonName || "无" }}</text>
                    </view>
                  </view>
                  <view class="device-item-trouble ellipsis">
                    {{ device.troubleDesc }}
                  </view>
                  <view class="device-item-progress">
                    <view class="progress-bar">
                      <u-line-progress
                        :percent="100"
                        :height="10"
                        active-color="#3890d8"
                        :show-percent="false"
                      />
                    </view>
                    <view class="progress-text">100%</view>
                  </view>
                  <view class="device-item-progress">
                    <view class="progress-bar">
                      <u-line-progress
                        :percent="100"
                        :height="10"
                        active-color="#22b14c"
                        :show-percent="false"
                      />
                    </view>
                    <view class="progress-text">100%</view>
                  </view>
                </view>
              </view>
              <!-- 停机 -->
              <view class="device-item" v-if="device.state === 0">
                <view :class="[ 'device-item-box', !device.stopState ? 'stop' : 'fault']">
                  <!-- fault -->
                  <view class="device-item-no">{{ device.machineCode }}</view>
                  <view class="device-item-center">
                    <view class="device-item-left">
                      <u-icon name="calendar" size="60" color="#999" />
                    </view>
                    <view class="device-item-right">
                      <text>
                        {{ device.stepTimeHours }}小时{{device.stepTimeMinutes}}分{{ device.stepTimeSeconds }}秒
                      </text>
                      <text>状态：{{ device.stopreasonName || "无" }}</text>
                    </view>
                  </view>
                  <view class="device-item-trouble ellipsis">{{
                    device.troubleDesc
                  }}</view>
                  <view class="device-item-progress">
                    <view class="progress-bar">
                      <u-line-progress
                        :percent="100"
                        :height="10"
                        active-color="#3890d8"
                        :show-percent="false"
                      />
                    </view>
                    <view class="progress-text">100%</view>
                  </view>
                  <view class="device-item-progress">
                    <view class="progress-bar">
                      <u-line-progress
                        :percent="100"
                        :height="10"
                        active-color="#22b14c"
                        :show-percent="false"
                      />
                    </view>
                    <view class="progress-text">100%</view>
                  </view>
                </view>
              </view>
              <!-- /关机 -->
              <view class="device-item" v-if="device.state === -1">
                <view
                  :class="['device-item-box',!device.stopState ? 'normal' : 'fault', ]"
                >
                  <!-- fault  -->
                  <view class="device-item-no">{{ device.machineCode }}</view>
                  <view class="device-item-center">
                    <view class="device-item-left">
                      <u-icon name="calendar" size="60" color="#999" />
                    </view>
                    <view class="device-item-right">
                      <text>
                        {{ device.stepTimeHours }}小时{{ device.stepTimeMinutes}}分{{ device.stepTimeSeconds }}秒
                      </text>
                      <text>状态：{{ device.stopreasonName || "无" }}</text>
                    </view>
                  </view>
                  <view class="device-item-trouble ellipsis">
                    {{ device.troubleDesc}}
                  </view>
                  <view class="device-item-progress">
                    <view class="progress-bar">
                      <u-line-progress
                        :percent="100"
                        :height="10"
                        active-color="#3890d8"
                        :show-percent="false"
                      />
                    </view>
                    <view class="progress-text">100%</view>
                  </view>
                  <view class="device-item-progress">
                    <view class="progress-bar">
                      <u-line-progress
                         active-color="#22b14c"
                        :percent="100"
                        :height="10"
                        :show-percent="false"
                      />
                    </view>
                    <view class="progress-text">100%</view>
                  </view>
                </view>
              </view>
            </block>
          </view>
        </view>
      </view>
      <!-- 内容 -->
      <u-empty
        v-show="!allList.length"
        margin-top="30"
        icon-size="100"
        text="数据为空"
        mode="data"
      />
    </view>
    <!-- page -->
    <!-- 底部菜单-->
    <ex-BNavBar :active="2"></ex-BNavBar>
    <!-- popup -->
    <popup ref="popup" :active="line" :list="wsList"  @itemClick="wsClick" />
  </view>
</template>
<script>
import { mapState } from "vuex";
import dictToOpts from '@/utils/dictToOpts';
export default {
  name: "Device",
  data() {
    return {
      navBar: {title: "设备管理", isBack: false},
      // 车间
      active:{},
      wsList:[],
      //tabs
      tabList: [
        { name: "全部", value: 2},
        {name: "启动",value: 1},
        {name: "停机",value: 0},
        {name: "关机", value: -1},
      ],
      tabCurrent: 0,
      current: 2,
      allList: [],
      // 设备
      machineList: [],
      // 工序
      procedureList: [],
    };
  },
  computed: {
    ...mapState({
      line: state => state.line[0]
    }),
    procedureSet() {
      return new Set(this.procedureList.map((p) => p.processCode));
    },
    // 设备
    filteredMachines() {
      const machines = this.machineList.filter((machine) =>
        this.procedureSet.has(machine.processCode)
      );
      if (this.current === 2) {return machines;}
      return machines.filter((machine) => machine.state === this.current);
    },
    fileredProcedure() {
      const processCodeSet = new Set(
        this.filteredMachines.map((machine) => machine.processCode)
      );
      return this.procedureList.filter((procedure) =>
        processCodeSet.has(procedure.processCode)
      );
    },
  },
  onLoad(){
    this.dictAjax();  
  },
  onPullDownRefresh() {
    this.deviceAjax().then(() => uni.stopPullDownRefresh());
  },
  methods: {
    handleMenu() {
      this.$refs.popup.visible=true;
    },
    wsClick(item){
      this.active=item;
      this.procedureAjax().then(() =>this.deviceAjax());
    },
    tabsChange(index) {
      this.tabCurrent = index;
      this.current = this.tabList[index].value;
      this.setDeviceData();
    },
    // 展开收起
    visibleHandle(item) {
      this.$set(item, "visible", !item.visible);
    },
     procedureAjax() {
       return this.$http.request({url: "/api/BProcessList", method: "GET"})
        .then(res => this.procedureList=res);
    },
    dictAjax() {
      return this.$http.request({url: "/api/Dictionary", method: "GET", data: { keys: "BWorkShop" }})
        .then(({ BWorkShop }) => this.wsList=dictToOpts(BWorkShop));
    },
    // //获取数据
    deviceAjax() {
      uni.showLoading({ title: "加载中",mask: true});

      return this.$http
        .request({
          url: "/api/MachineReport/allMachineState",
          method: "GET",
          data: {wsCode:this.active.value},
        })
        .then(({ machineState: machines }) => {
          uni.hideLoading();
          this.machineList = machines;
          // 筛选数据
          this.setDeviceData();
        })
        .catch(() => {
          uni.hideLoading();
        });
    },
    setDeviceData() {
      const machineMap = {};
      this.filteredMachines.map((m) => {
        if (!machineMap[m.processCode]) {
          machineMap[m.processCode] = [];
        }
        machineMap[m.processCode].push(m);
      });

      this.allList = this.fileredProcedure.map((p) => {
        p.visible = true;
        p.children = machineMap[p.processCode] || [];
        return {...p};
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.device-list {
  margin: 15rpx 15rpx;
  background-color: $white-color;
  border-radius: 10rpx;

  .device-hd {
    display: flex;
    align-items: center;
    padding: 0 20upx;
    height: 80upx;
    font-size: $font-30;
    color: $font-text-color;
    background: $white-color;
    border-radius: 10rpx;
    .device-name {
      flex: 1;
    }
    .iconfont {
      width: 30upx;
      font-size: $font-26;
      color: $font-light-gray;
    }
  }

  .device-bd {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px;
    font-size: $font-26;
    border-top: 1px dashed #ddd;
    .device-item {
      box-sizing: border-box;
      padding: 10upx 15upx;
      width: 340upx;
      .device-item-box {
        height: 240upx;
        border: 1px solid #ccc;
        background: $white-color;
        .device-item-no {
          height: 50upx;
          line-height: 50upx;
          background: #ccc;
          text-align: center;
        }
        .device-item-center {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 10upx 10upx 0 10upx;
          height: 90upx;
        }
        .device-item-left {
          overflow: hidden;
          margin-right: 10upx;
        }
        .device-item-right {
          overflow: hidden;
          flex: 1;
          display: flex;
          flex-direction: column;
          color: $font-text-color;
          line-height: 1.5;
          font-size: $font-26;
        }
        .device-item-progress {
          margin: 0 20upx;
          display: flex;
          flex-direction: row;
          align-items: center;
          height: $font-24;
          .progress-bar {
            flex: 1;
            font-size: 0;
            line-height: 0;
          }
          .progress-text {
            margin-left: 10upx;
            font-size: $font-20;
            color: $font-light-gray;
          }
        }
      }
      .startUp {
        border: 1px solid $green-color;
        .device-item-no {
          color: $white-color;
          background: $green-color;
        }
      }
      .device-item-trouble {
        margin: 0 20upx 10upx 20upx;
        padding: 0 5upx;
        font-size: $font-24;
        line-height: 1.2;
        color: $white-color;
        background-color: $red-color;
      }
      .stop {
        border: 1px solid $yellow-color;
        .device-item-no {
          color: $white-color;
          background: $yellow-color;
        }
      }
      .fault {
        border: 1px solid $red-color;
        .device-item-no {
          color: $white-color;
          background: $red-color;
        }
      }
      // 正常
      .normal {
        border: 1px solid $shutDown-color;
        .device-item-no {
          color: $white-color;
          background: $shutDown-color;
        }
      }
    }
  }
}
</style>
