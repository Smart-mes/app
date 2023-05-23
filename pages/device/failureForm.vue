<template>
  <view class="failureForm">
    <ex-TnavBar :title="'报障_' + stationName" :is-back="true"/>
    <!-- nav -->
    <view class="form-box">
      <u-form ref="failureForm" :model="form" :label-width="140">
        <u-form-item label="故障项" prop="faultphenomenonCode" required>
          <u-input
            type="select"
            :select-open="faultSheetShow"
            v-model="form.faultphenomenonCode"
            placeholder="请选择故障项"
            @click="faultSheetShow = true"
          />
        </u-form-item>
        <u-form-item label="上报级别" prop="grade" required>
          <u-input
            type="select"
            :select-open="gradeSheetShow"
            v-model="form.grade"
            placeholder="请选择上报级别"
            @click="gradeSheetShow = true"
          />
        </u-form-item>
        <u-form-item label="备注" prop="remarks" required>
          <u-input type="textarea" :height="200" v-model="form.remarks" />
        </u-form-item>
      </u-form>
      <u-form-item :border-bottom="false" >
        <u-row gutter="20" class="w-full m-t20">
          <u-col span="6"><u-button size="default"  @click="reset()">重置</u-button></u-col>
          <u-col span="6"><u-button type="primary" :loading="btnLoading"  @click="submit()"> 提交 </u-button></u-col>
        </u-row> 
      </u-form-item>   
    </view>
    <!-- u-action-sheet -->
    <u-action-sheet
      :list="faultSheetList"
      :cancel-btn="true"
      v-model="faultSheetShow"
      @click="faultSheetCallback"
    />
    <u-action-sheet
      :list="gradeSheetList"
      :cancel-btn="true"
      v-model="gradeSheetShow"
      @click="gradeSheetCallback"
    />
    <u-toast ref="uToast" />
  </view>
</template>

<script>
export default {
  name: "FailureForm",
  data() {
    return {
      // 参数
      machineCode: "",
      stationName: "",
      btnLoading:false,
      form: {
        faultphenomenonCode: "",
        grade: "",
        remarks: "",
      },
      rules: {
        faultphenomenonCode: [
          {
            required: true,
            message: "请输入故障项",

            trigger: ["change", "blur"],
          },
        ],
        grade: [
          {
            required: true,
            message: "请输入上报级别",
            trigger: ["change", "blur"],
          },
        ],
        remarks: [
          {
            required: true,
            message: "请输入备注",
            trigger: ["change", "blur"],
          },
        ],
      },
      faultSheetList: [],
      faultSheetShow: false,
      //  上级
      gradeSheetList: [
        {value: 1, text: "一级" },
        { value: 2, text: "二级"},
        { value: 3, text: "三级"},
      ],
      gradeSheetShow: false,
    };
  },
  onLoad(option) {
    this.machineCode = option.machineCode;
    this.stationName = option.stationName;

    this.faultAjax();
  },
  onReady() {
    this.$refs.failureForm.setRules(this.rules);
  },
  computed: {
    faultCode() {
      const faultObj = {};
      this.faultSheetList.map((gradeItem) => {
        const { text, value } = gradeItem;
        faultObj[text] = value;
      });
      return faultObj;
    },
    gradetCode() {
      const gradeObj = {};
      this.gradeSheetList.map((gradeItem) => {
        const { text, value } = gradeItem;
        gradeObj[text] = value;
      });
      return gradeObj;
    },
  },
  methods: {
    reset(){
      this.$refs.failureForm.resetFields();
    },
    submit() {
      this.$refs.failureForm.validate((valid) => {
        valid && this.faultFormAjax();
      });
    },
    faultSheetCallback(index) {
      this.form.faultphenomenonCode = this.faultSheetList[index].text;
    },
    gradeSheetCallback(index) {
      uni.hideKeyboard();
      this.form.grade = this.gradeSheetList[index].text;
    },
    faultAjax() {
      this.$http
        .request({
          url: "/api/PMachineState/GetMachineFaultphenomenon",
          method: "GET",
          data: {
            machineCode: this.machineCode,
          },
        })
        .then((res) => {
          this.faultSheetList = res.map((faultItem) => {
            const { faultphenomenonCode: value, faultphenomenonName: text } =
              faultItem;
            return { value, text };
          });
        });
    },
    faultFormAjax() {
      const { faultphenomenonCode, grade, remarks } = this.form;
      // 报障提交
      this.btnLoading=true;
      this.$http
        .request({
          url: "/api/PMachineState/AddMachineException",
          method: "POST",
          data: {
            machineCode: this.machineCode,
            faultphenomenonCode: this.faultCode[faultphenomenonCode],
            grade: this.gradetCode[grade],
            remarks,
          },
        })
        .then(() =>{
            this.btnLoading=false;
            this.$refs.uToast.show({title: "提交成功",type: "success",url: "/pages/device/failure" })
          }
        ).catch(()=>{
           this.btnLoading=false;
        })
    },
  },
};
</script>

<style lang="scss" scoped>
.failureForm {
  min-height: 100%;
}

.form-box {
  margin: 15rpx 15rpx;
  padding: 30rpx;
  border-radius: 10rpx;
  background-color: $white-color;
}
</style>
