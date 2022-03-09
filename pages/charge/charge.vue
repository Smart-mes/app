<template>
  <view>
    <navBar :title="navBar.title" :is-back="navBar.isBack" title-bold />
    <!-- navBar -->
    <view class="u-page">
      <view class="basic-box">
        <customForm
          ref="form"
          buttonHide
          :form="form.formData"
          :formList="form.formList"
          @icon-click="scan"
        />
      </view>
      <!-- 扫描 -->
      <view class="basic-box">
        <view class="public-title">
          <view class="title-left">
            <u-section title="列表" font-size="30" :show-line="false" :right="false" />
          </view>
          <view class="title-right"> 共计：{{ materialList.length }}</view>
        </view>
        <!-- 标题 -->
        <view class="charge-list">
          <view class="row" v-for="materia in materialList" :key="materia.id">
            <view class="col">
              <text class="name">插槽:</text>
              <text>{{ materia.slotNo }}</text>
            </view>
            <view class="col stuff">
              <view class="stuff-item">
                <text class="name">物料:</text>
                <text>{{ materia.matCode }}</text>
              </view>
              <view class="stuff-item">
                <text class="name">料号:</text>
                <text>***</text>
              </view>
            </view>
            <view class="col">
              <u-button
                type="primary"
                plain
                :custom-style="customStyle"
                @click="changeHandle(materia)"
              >
                换料
              </u-button>
            </view>
          </view>
        </view>
        <u-empty
          v-show="!materialList.length"
          margin-top="30"
          icon-size="100"
          text="数据为空"
          mode="data"
        />
      </view>
      <!-- 内容 -->
    </view>
    <u-modal
      ref="modal"
      width="95%"
      show-cancel-button
      v-model="modelShow"
      :title="modelType === 'add' ? '上料' : '换料'"
      :async-close="true"
      @cancel="modalCancel"
      @confirm="modalConfirm"
    >
      <view class="slot-content">
        <customForm
          ref="modalForm"
          buttonHide
          :form="modalForm.formData"
          :formList="modalForm.formList"
          :rules="modalForm.rules"
          @icon-click="modalScan"
        />
      </view>
    </u-modal>
    <u-toast ref="uToast" />
  </view>
</template>
<script>
import { mapState } from "vuex";
import form from "@/models/Forms/charge/form.js";
import modalForm from "@/models/Forms/charge/modalForm.js";
export default {
  data() {
    return {
      name: "charge",
      navBar: {title: "SMT装料",isBack: true},
      form,
      modalForm,
      // 按钮
      customStyle: { height: "60rpx", lineHeigh: "60rpx" },
      // 物料扫描
      modelType: "add",
      modelShow: false,
      MaterialCtrl: null,
      materialWip: null,
      // 列表
      materialList: [],
    };
  },
  computed: {
    ...mapState(["line", "userInfo"]),
  },
  onLoad() {
    this.form.formData.lineCode = this.line[1].label;
    this.orderAjax();
  },
  methods: {
    scan(prop) {
      // uni.scanCode({
      //   success: (res) => {
          this.materialWip = null;
          this.modelType = "add";

          if (prop === "machineCode") {
            this.form.formData[prop] = "FSL_AOI_1";
            this.materialListAjax();
          } else if (prop === "slotNo") {
            this.form.formData[prop] = "1001";
            // "1008";
            const { orderNo, slotNo } = this.form.formData;
            this.materialCtrlAjax({ orderNo, slotNo });
          }
      //   },
      //   fail: () => {
      //     this.$refs.uToast.show({ title: "扫码失败", type: "error" });
      //   },
      // });
    },
    modalScan(prop) {
      // uni.scanCode({
      //   success: (res) => {
          if (this.MaterialCtrl.beCtrl) {
            this.modalForm.formData[prop] = "FLSM0002";
            this.materialCheckAjax();
          } else {
            this.modalForm.formData[prop] = "100063";
          }
      //   },
      //   fail: () => {
      //     this.$refs.uToast.show({ title: "扫码失败", type: "error" });
      //   },
      // });
    },
    modalConfirm() {
      this.$refs.modalForm.validateForm().then((valid) => {
        if (!this.validation(valid)) return false;
        const { beCtrl, matCode, slotNo, stationCode } = this.MaterialCtrl;
        this.addAjax({
          seed: !beCtrl ? null : this.materialWip,
          matCode,
          beCtrl,
          slotNo,
          stationCode,
          orderNo: this.form.formData.orderNo,
          empCode: this.userInfo.empCode,
          wsCode: this.line[0].value,
        });
      });
    },
    modalCancel() {
      this.modelShow = false;
    },
    validation(valid) {
      const { matCode, matSFC } = this.modalForm.formData;
      const { beCtrl } = this.MaterialCtrl;

      if (!valid) {
        return void this.$refs.modal.clearLoading();
      }

      if (!beCtrl && matCode !== matSFC) {
        this.$refs.modal.clearLoading();
        return void this.$refs.uToast.show({ title: "料号不一致",type: "error"});
      }

      if (beCtrl && this.materialWip === null) {
        this.$refs.modal.clearLoading();
        return void this.$refs.uToast.show({title: "该批次物料不可用", type: "error"});
      }
      return true;
    },
    // 换料
    changeHandle({ slotNo }) {
      this.modelType = "change";
      this.materialWip = null;
      this.materialCtrlAjax({ orderNo: this.form.formData.orderNo, slotNo });
    },
    orderAjax() {
      this.$http.request({
          url: "/api/POrderInLine",
          method: "GET",
          data: { state: 1, lineCode: this.line[1].value },
        })
        .then((res) => {
          if (res.length) {
            this.form.formData.orderNo = res[0].orderNo;
          }
        });
    },
    materialListAjax() {
      const { orderNo, machineCode } = this.form.formData;
      uni.showLoading({ title: "加载中", mask: true });
      this.$http.request({
          url: "/api/BMaterialStation/MaterialList",
          method: "GET",
          data: { machineCode, orderNo },
        })
        .then((res) => {
          uni.hideLoading();
          this.materialList = res.filter(({ matCode }) => matCode !== "");
        })
        .catch(() => uni.hideLoading());
    },
    materialCtrlAjax(parame) {
      return this.$http.request({
          url: "/api/BMaterialStation/MaterialCtrl",
          method: "GET",
          data: parame,
        })
        .then((res) => {
          this.modelShow = true;
          this.MaterialCtrl = res;
          this.modalForm.formList[2].label = !res.beCtrl ? "料号" : "批号";
          this.modalForm.formData.slotNo = res.slotNo;
          this.modalForm.formData.matCode = res.matCode;
        });
    },
    materialCheckAjax() {
      this.$http.request({
          url: "/api/BMaterialStation/MatWipSeed",
          method: "GET",
          data: {
            orderNo: this.form.formData.orderNo,
            matCode: this.modalForm.formData.matCode,
            lotNo: this.modalForm.formData.matSFC,
          },
        })
        .then((res) => (this.materialWip = res));
    },
    addAjax(parame) {
      const type  =this.modelType === "add"? "Submit": "ChangeMat";
      this.$http.request({ 
        url:`/api/BMaterialStation/${type}`,
         method: "POST", 
         data: parame 
         })
        .then(() => {
          this.$refs.modal.clearLoading();
          this.$refs.uToast.show({ title: "提交成功", type: "success" });
          this.modelShow = false;
          this.materialListAjax();
        })
        .catch(() => this.$refs.modal.clearLoading());
    },
  },
};
</script>
<style lang="scss" scoped>
.charge-list {
  font-size: $font-24;
  .name {
    display: inline-block;
    padding-right: 10rpx;
    color: $font-gray;
  }
  .row {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1px solid $line-color;
    &:nth-child(even) {
      background-color: #fbfcfe;
    }
    .col {width: 160rpx;}
    .stuff {
      flex: 1;
      margin: 0 20rpx 0 40rpx;
      .stuff-item {
        &:first-child { margin-bottom: 5rpx;}
      }
    }
  }
}
.slot-content { padding: 0 30rpx;}
</style>
