<template>
  <view>
    <navBar :title="navBar.title" :is-back="navBar.isBack" title-bold/>
    <!-- navBar -->
    <view class="u-page">
      <view class="basic-box">
        <customForm
          :form="formData"
          :seletform="formSeletData"
          :formList="formList"
          :buttonHide="false"
          @selectChange="selectChange"
        />
      </view>
      <!-- form -->
      <view class="basic-box">
        <view class="menu-title">
          <u-section
            title="设备"
            font-size="30"
            :show-line="false"
            :right="false"
          />
        </view>
        <view
          class="equip"
          v-for="machines in currentMachines"
          :key="machines.machineCode"
        >
          <view class="equip-icon">
            <u-icon
              name="devices"
              custom-prefix="custom-icon"
              size="70"
              color="#999"
            />
          </view>
          <view class="equip-info">
            <view class="equip-info-item">
              <view class="name">编号</view>
              <view class="text">{{ machines.machineCode }}</view>
            </view>
            <view class="equip-info-item">
              <view class="name">名称</view>
              <view class="text">{{ machines.machineName }}</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 设备 -->
      <view class="equip-list">
        <view class="menu-title">
          <u-section
            title="工装"
            font-size="30"
            :show-line="false"
            :right="false"
          />
        </view>
        <view
          class="basic-box"
          v-for="WorkTool in workToolList"
          :key="WorkTool.workToolCode"
        >
          <view class="equip">
            <view class="equip-icon">
              <u-icon
                name="devices"
                custom-prefix="custom-icon"
                size="80"
                color="#999"
              />
            </view>
            <view class="equip-info">
              <view class="equip-info-item">
                <view class="name">编号</view>
                <view class="text">{{ WorkTool.workToolCode }}</view>
              </view>
              <view class="equip-info-item">
                <view class="name">批号</view>
                <view class="text">{{ WorkTool.modelCode }}</view>
              </view>
              <view class="equip-info-item">
                <view class="name">程度</view>
                <view class="text">
                  <u-line-progress
                    :percent="(WorkTool.times / WorkTool.maxTimes) * 100"
                    :height="20"
                    active-color="#22b14c"
                  />
                </view>
              </view>
            </view>
            <view class="equip-close">
              <u-icon
                name="close"
                size="30"
                color="#999"
                @click="del(WorkTool)"
              />
            </view>
          </view>
        </view>
        <u-empty 
          v-show="!workToolList.length" 
          margin-top="30" 
          icon-size="100" 
          text="数据为空" 
          mode="data" />
      </view>
    </view>
    <!-- page -->
    <u-toast ref="uToast" />
    <!-- uToast -->
    <view class="fix-add">
      <u-button type="primary" size="medium" @click="popupShow = !popupShow">
        <u-icon name="plus" color="#fff" size="28"></u-icon>
      </u-button>
    </view>
    <!-- 添加 -->
    <u-popup v-model="popupShow" mode="bottom" height="100%">
      <view class="popup">
        <view class="hd">
          <text class="no" @click="cancel">取消</text>
          <text class="title">添加工装</text>
          <text class="yes" @click="define">确定</text>
        </view>
        <!-- hd -->
        <view class="search">
          <view class="name">编号</view>
          <view class="input">
            <u-input v-model="workToolCode" />
            <u-icon
              name="scan"
              custom-prefix="custom-icon"
              size="38"
              @click="scan"
            />
          </view>
          <view class="btn" @click="search">搜索</view>
        </view>
        <!-- 搜索 -->
        <view
          class="equip"
          v-for="WorkTool in WorkToolValidList"
          :key="WorkTool.modelCode"
        >
          <view class="equip-info">
            <view class="equip-info-item">
              <view class="name">批号</view>
              <view class="text">{{ WorkTool.modelCode }}</view>
            </view>
            <view class="equip-info-item">
              <view class="name">程度</view>
              <view class="text">
                <u-line-progress
                  :percent="(WorkTool.times / WorkTool.maxTimes) * 100"
                  :height="20"
                  active-color="#22b14c"
                />
              </view>
            </view>
          </view>
        </view>
        <!-- equip -->
      </view>
    </u-popup>
  </view>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "Equip",
  data() {
    return {
      navBar: {
        title: "设备工装",
        isBack: true,
      },
      formSeletData: {
        lineCode: "",
        machineCode: "",
      },
      formData: {
        lineCode: "",
        machineCode: "",
      },
      formList: [
        {
          label: "线别",
          props: "lineCode",
          type: "select",
          sheetShow: false,
          disabled: true,
          optionList: [],
        },
        {
          label: "设备",
          props: "machineCode",
          type: "select",
          sheetShow: false,
          optionList: [],
        },
      ],
      machinesList: [],
      // 工装
      workToolList: [],
      popupShow: false,
      workToolCode: "",
      WorkToolValidList: [],
    };
  },
  computed: {
    ...mapState(["line", "userInfo"]),
    currentMachines() {
      return this.machinesList.filter(
        ({ machineCode }) => machineCode === this.formSeletData.machineCode
      );
    },
  },
  onLoad() {
    this.formData.lineCode = this.line[1].label;
    this.machinesAjax().then(
      () => this.formData.machineCode && this.workToolAjax()
    );
  },
  methods: {
    selectChange(propsType, [{ value, label }]) {
      if (propsType && value && label) {
        this.formData[propsType] = label;
        this.formSeletData[propsType] = value;
        this.workToolAjax();
      }
    },
    del({ workToolCode }) {
      this.delWorkToolAjax({
        machineCode: this.formSeletData.machineCode,
        workToolCode,
        EmpCode: this.userInfo.empCode,
      }).then(() => this.workToolAjax());
    },
    search() {
      if (!this.workToolCode) {
        return void this.$refs.uToast.show({ title: "编码不能为空" });
      }
      this.WorkToolValidAjax();
    },
    define() {
      if (!this.workToolCode && !this.WorkToolValidList.length) {
        return void this.$refs.uToast.show({
          title: "编码不能为空或者编码存在",
        });
      }
      this.addWorkToolAjax()
        .then(() => {
          this.popupShow = false;
          this.clearWorkTool();
        })
        .then(() => this.workToolAjax());
    },
    cancel() {
      this.popupShow = false;
      this.clearWorkTool();
    },
    scan() {
      uni.scanCode({
        success:res=>{
           console.log('扫描成功');
          this.workToolCode=res.result;
        },
        fail:()=>{
          console.log('扫描失败');
        }
      });
    },
    // 请求
    machinesAjax() {
      return this.$http
        .request({
          url: "/api/MachineWorkTool/Machines",
          method: "GET",
          data: { lineCode: this.line[1].value },
        })
        .then((res) => {
          if (res.length) {
            const optionList = res.map(({ machineCode, machineName }) => {
              return { label: machineName, value: machineCode };
            });
            this.machinesList = res;
            this.formList[1].optionList = optionList;
            this.formSeletData.machineCode = optionList[0].value;
            this.formData.machineCode = optionList[0].label;
          }
        });
    },
    workToolAjax() {
      uni.showLoading({ title: "加载中", mask: true });
      this.$http
        .request({
          url: "/api/MachineWorkTool/InstalledWorkTools",
          method: "GET",
          data: { machineCode: this.formSeletData.machineCode },
        })
        .then((res) => {
          uni.hideLoading();
          this.workToolList = res;
        })
        .catch(() => uni.hideLoading());
    },
    WorkToolValidAjax() {
      this.$http
        .request({
          url: "/api/MachineWorkTool/UnusedWorkTools",
          method: "GET",
          data: { workToolCode: this.workToolCode },
        })
        .then((res) => (this.WorkToolValidList = res));
    },
    addWorkToolAjax() {
      return this.$http
        .request({
          url: "/api/MachineWorkTool/Install",
          method: "POST",
          data: {
            machineCode: this.formSeletData.machineCode,
            workToolCode: this.workToolCode,
            EmpCode: this.userInfo.empCode,
          },
        })
        .then((res) => {
          this.$refs.uToast.show({ title: "添加成功", type: "success" });
        })
        .catch(() =>
          this.$refs.uToast.show({ title: "添加成功", type: "error" })
        );
    },
    delWorkToolAjax(parame) {
      return this.$http
        .request({
          url: "/api/MachineWorkTool/Uninstall",
          method: "POST",
          data: parame,
        })
        .then(() => {
          this.$refs.uToast.show({ title: "删除成功", type: "success" });
        })
        .catch(() =>
          this.$refs.uToast.show({ title: "删除失败", type: "error" })
        );
    },
    clearWorkTool() {
      this.workToolCode = "";
      this.WorkToolValidList = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-title {
  margin-bottom: 10rpx;
}
.equip {
  display: flex;
  .equip-icon {
    margin: 10rpx 50rpx 0 0;
  }
  .equip-info {
    flex: 1;
  }
  .equip-info-item {
    display: flex;
    line-height: 1.6;
    .name {
      margin-right: 20rpx;
      width: 55rpx;
      color: $font-gray;
    }
    .text {
      width: 400rpx;
    }
  }
}
.equip-list {
  margin-top: 30rpx;
  .menu-title {
    margin: 20rpx;
  }
}
.fix-add {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  padding: 20rpx;
  background: $gray-bj-color;
  /deep/.u-size-medium {
    width: 100%;
  }
}
.popup {
  padding: 30rpx;
  .hd {
    //  background: red;
    overflow: hidden;
    padding: 20rpx 0;
    display: flex;
    // height: 60rpx;
    line-height: 60rpx;
    .no {
      width: 60rpx;
      color: $font-gray;
    }
    .yes {
      width: 60rpx;
      color: $blue-color;
    }
    .title {
      flex: 1;
      font-size: $font-35;
      text-align: center;
    }
  }
  .search {
    margin: 20rpx 0;
    display: flex;
    align-items: center;
    .name {
      margin-right: 20rpx;
      width: 55rpx;
      color: $font-gray;
    }
    .input {
      display: flex;
      flex: 1;
      padding: 0 20rpx;
      border: 1px solid #ddd;
    }
    .btn {
      margin-left: 20rpx;
    }
  }
  .equip {
    .equip-info-item {
      line-height: 2;
    }
  }
}
</style>
