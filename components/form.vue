<template>
  <view>
    <u-form :model="form" ref="uForm" label-width="120">
      <u-form-item
        v-for="(formItem, index) in formList"
        :key="formItem.props"
        :label="formItem.label"
        :prop="formItem.props"
      >
        <template v-if="formItem.type === 'input'">
          <u-input
            v-model="form[formItem.props]"
            :disabled="formItem.disabled"
          />
        </template>
        <template v-else-if="formItem.type === 'textarea'">
          <u-input
            v-model="form[formItem.props]"
            :type="formItem.type"
            :disabled="formItem.disabled"
          />
        </template>
        <template v-else-if="formItem.type === 'checkbox'">
          <u-checkbox-group @change="formGroupChange">
            <u-checkbox
              v-for="(checkItem, key) in formItem.checkboxList"
              :key="key"
              :name="checkItem.name"
              v-model="checkItem.checked"
              :disabled="checkItem.disabled"
              @change="formChange(formItem.props)"
            >
              {{ checkItem.name }}
            </u-checkbox>
          </u-checkbox-group>
        </template>
        <template v-else-if="formItem.type === 'radio'">
          <u-radio-group v-model="form[formItem.props]">
            <u-radio
              v-for="(radioItem, key) in formItem.radioList"
              :key="key"
              :name="radioItem.name"
              :disabled="radioItem.disabled"
            >
              {{ radioItem.name }}
            </u-radio>
          </u-radio-group>
        </template>
        <template v-else-if="formItem.type === 'select'">
          <u-input
            type="select"
            :select-open="formItem.sheetShow"
            v-model="form[formItem.props]"
            @click="selectClick(formItem.props, index)"
          />
        </template>
      </u-form-item>
    </u-form>
    <u-button type="primary" class="btn"  @click="getFormData()">提交</u-button>
    <u-select
      v-model="selectShow"
      mode="single-column"
      :list="list"
      @confirm="selectconfirm"
    />
  </view>
</template>
<script>
export default {
  name: "Form",
  props: {
    form: {
      type: Object,
      default: null,
    },
    seletform: {
      type: Object,
      default: null,
    },
    formList: {
      type: Array,
      default: null,
    },
    rules: {
      type: Object,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      propsType: "",
      // form: {},
      list: [],
      show: false,
      // sheet
      selectShow: false,
      selectIndex: 0,
    };
  },
  mounted() {
    this.$refs.uForm.setRules(this.rules);
  },
  watch: {
    selectShow(val) {
      if (!val) {
        this.formList[this.selectIndex].sheetShow = false;
      }
    },
  },
  methods: {
    formGroupChange(e) {
      this.form[this.propsType] = e;
    },
    formChange(type) {
      this.propsType = type;
    },
    // sheet
    selectClick(type, i) {
      if (this.formList[i].disabled) {
        return false;
      }
      this.formList[i].sheetShow = true;
      this.selectShow = true;
      this.selectIndex = i;
      this.formChange(type);
      this.list = this.formList[i].optionList;
    },
    selectconfirm(e) {
      this.$emit("selectChange", this.propsType, e);
    },
    getFormData() {
      this.$refs.uForm.validate((val) => {
        if (val) {

         const form={};   
          for(let key in this.form){    
              form[key]=this.seletform!==null&&this.seletform[key]?this.seletform[key]:this.form[key];
          }

         
 
          this.$emit("getFormData",form);
        }
      });
    },
    resetForm() {
      this.$refs.uForm.resetFields();
    },
  },
};
</script>
<style lang="scss" scoped>
.btn {
  margin-top: 30rpx;
}
</style>