<template>
  <view>
    <navBar :title="navBar.title" :is-back="navBar.isBack" />
    <!--navBar  -->
    <view class="u-page">
      <view class="basic-box">
        <customForm
          :form="formData"
          :formList="formList"
          :rules="rules"
          @getFormData="getFormData"
        />
      </view>
    </view>
    <!-- page -->
		<u-toast ref="uToast" />
  </view>
</template>

<script>
export default {
  name:"CloseAndon",
  data() {
    return {
      navBar: {title: "关闭安灯",isBack: true},
      formData: {lineCode: "", closeComment: ""},
      formList: [
        {
          label: "线别",
          props: "lineCode",
          type: "select",
          sheetShow: false,
          disabled: true,
          optionList: [],
        },
        { label: "关闭说明", props: "closeComment", type: "textarea" },
      ],
      rules: {
        closeComment: [
          {required: true,message: "不能为空",trigger: "blur,change",}
        ],
      },
			BLineDict:null,
			andon:null
    };
  },
	onLoad(options){
   this.andonAjax(options.id)
    .then(()=>this.getBLineDict())
    .then(()=>this.formData.lineCode=this.BLineDict[this.andon.lineCode]);
	},
  methods: {
    andonAjax(id){
       return this.$http.request({url:`/api/PAndonList/${id}`, method: "GET"})
       .then(res=>this.andon=res)
    },
		getBLineDict(){
		  return this.$http.request({url:"/api/Dictionary",method: "GET",data:{keys:"BLine"}})
        .then(({ BLine }) => this.BLineDict = BLine);
		},
    getFormData(formData) {
			 this.andon.state=0;
			 this.andon.closeComment=this.formData.closeComment;
			 this.$http.request({ url: `/api/PAndonList/${this.andon.id}`, method: "PUT", data: this.andon })
			 .then(
				 ()=> this.$refs.uToast.show({ title: "提交成功",type: "success",url: "/pages/andon/andonHistory"})
			 )
		},
  },
};
</script>

<style>
</style>
