<template>
  <view>
    <u-navbar
      :title="navbar.title"
      :is-back="navbar.isBack"
      :title-color="navbar.color"
      :title-size="navbar.size"
      :height="navbar.height"
      :background="navbar.background"
      title-bold
    >
      <view class="navbar-right" slot="right">
        <view class="navbar-icon">
          <u-icon
            class="icon-item"
            name="list"
            color="#666"
            size="45"
            @click.native="handleMenu"
          />
        </view>
      </view>
    </u-navbar>
    <!-- nav -->
    <view class="sub-info">
      <view class="nav-subTitle">{{ wsName }}</view>
      <view class="tips">
        <view
          v-for="device in deviceState"
          :key="device.value"
          class="tips-item"
        >
          <text class="tips-icon" :style="{ background: device.color }" />
          <text>{{ device.name }}</text>
        </view>
      </view>
    </view>
    <!-- 提示-->
    <view v-for="(item, i) in allList" :key="i" class="failure-item">
      <view class="device-hd" @tap="accordion(item)">
        <text class="device-name">{{ item.processName }}</text>
        <u-icon
          :name="item.visible ? 'arrow-up-fill' : 'arrow-down-fill'"
          color="#ccc"
          size="22"
        />
      </view>
      <!-- {{item.visible}} -->
      <view v-show="item.visible">
        <view class="device-bd">
          <view
            v-for="(deviceItem, j) in item.children"
            :key="j"
            class="device-item"
          >
            <view
              :class="[
                'device-item-box',
                {
                  startUp: deviceItem.state === 1,
                  stop: deviceItem.state === 0,
                  shutDown: deviceItem.state === -1,
                },
              ]"
              @tap="skip(deviceItem)"
            >
              <view class="device-item-left">
                <u-icon name="calendar" size="60" color="#bcbcbc" />
              </view>
              <view class="device-item-right">
                <text class="device-name ellipsis">{{
                  deviceItem.stationName
                }}</text>
                <text class="ellipsis">{{ deviceItem.machineCode }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- list -->
    <u-empty
      v-show="!allList.length"
      margin-top="30"
      icon-size="100"
      text="数据为空"
      mode="data"
    />
    <popup ref="popup" @getWorkShop="getWorkShop" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      navbar: {
        title: "设备报障",
        isBack: true,
        color: "#333",
        size: "36",
        height: "50",
        background: {
          backgroundColor: "#ffffff",
        },
      },
      // 车间
      wsName: "车间列表",
      wsCode: "",
      // 设备
      deviceState: [
        {
          name: "启动",
          value: 1,
          color: "#22b14c",
        },
        {
          name: "停机",
          value: 0,
          color: "#e2b607",
        },
        {
          name: "关机",
          value: -1,
          color: "#696969",
        },
      ],
      // 设备
      current: 2,
      allList: [],
      machineList: [],
      // 工序
      procedureList: [],
    };
  },
  computed: {
    procedureSet() {
      return new Set(this.procedureList.map((p) => p.processCode));
    },
    // 设备
    filteredMachines() {
      const machines = this.machineList.filter((machine) =>
        this.procedureSet.has(machine.processCode)
      );
      if (this.current === 2) {
        return machines;
      }
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
  methods: {
    handleMenu() {
      this.$refs.popup.visible = true;
    },
    getWorkShop(item) {
      const { wsName, wsCode } = item;
      this.wsName = wsName;
      this.wsCode = wsCode;
      // this.wsCode = "004";
      this.init();
    },
    init() {
      this.procedureAjax().then(() => {
        this.deviceAjax();
      });
    },
    // 手风琴展开收齐
    accordion(item) {
      this.$set(item, "visible", !item.visible);
      this.$forceUpdate();
    },
    async procedureAjax() {
      this.procedureList = await this.$http.request({
        url: "/api/BProcessList",
        method: "GET",
      });
    },
    // //获取数据
    deviceAjax() {
      uni.showLoading({
        title: "加载中",
        mask: true,
      });

      return this.$http
        .request({
          url: "/api/MachineReport/allMachineState",
          method: "GET",
          data: {
            wsCode: this.wsCode,
          },
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
        return p;
      });
    },
    skip({ stationName, machineCode }) {
      console.log("跳转", stationName, machineCode);
      uni.navigateTo({
        url: `/pages/device/failureForm?stationName=${stationName}&machineCode=${machineCode}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
// .tips-item {
//   margin-right: 30rpx;
// }
// 设备
.failure-item {
  margin: 0 15rpx 20rpx 15rpx;
  border-radius: 10rpx;
  background-color: $white-color;
  .device-hd {
    display: flex;
    align-items: center;
    padding: 0 20upx;
    height: 70upx;
    font-size: $font-30;
    color: $font-text-color;
    background: $white-color;
    border-radius: 10rpx;
    .device-name {
      flex: 1;
    }
  }
  .device-bd {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px;
    font-size: $font-24;
    border-top: 1px dashed #ddd;
  }
  .device-item {
    box-sizing: border-box;
    padding: 10upx 15upx;
    width: 335upx;
    .device-item-box {
      display: flex;
      flex-direction: row;
      padding: 10upx;
      border: 1px solid #ccc;
      background: $white-color;
    }

    .startUp {
      border: 1px solid $green-color;
    }
    .stop {
      border: 1px solid $yellow-color;
    }
    .shutDown {
      border: 1px solid $shutDown-color;
    }
    .device-item-left {
      margin: 2upx 15upx 0 0;
      width: 55upx;
    }
    .device-item-right {
      text {
        display: block;
      }
      .device-name {
        padding-bottom: 2px;
      }
    }
  }
}
</style>
