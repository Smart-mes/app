<template>
	<view style="background-color: #fff; margin-top: 20rpx;padding:0 20rpx;">
    <ex-form 
		:borderBottom="false"
		:formOpts="formOpts" 
		@getFormData="getFormData"></ex-form>
	</view>
</template>

<script>

	export default {
		name:"Demo",
		data() {
			return {
				formOpts:{
					formData:{
					lineCode: '',
					orderNo:'',
					remark:'',
					checkbox: [],
					radio:''
				},
				formItem:[
						{ label: "线别",props: "lineCode",type: "select",list:'lineCodeList',border: true},
						{ label: "工单", props: "orderNo", type: "input",border: true},
						{ label: "备注", props: "remark", type: "textarea",border: true},
						{ label: "复选框",props: "checkbox",type: "checkbox",list:'checkboxList',width:'50%'},
						{ label: "单选框",props: "radio ",type: "radio",list:'radioList',width:'50%'},
				],
				rules: {
					lineCode: [ {required: true,message: "不能为空",trigger: "blur,change"}],
					orderNo: [{required: true,message: "不能为空",trigger: "blur,change"}],
				},
				event:{
					orderNoConfirm(e,formData){
						console.log('eDDD',e,formData)
					}
				},
				optionList:{
					lineCodeList:[
					{value: 'apple',label: '苹果'},
					{value: 'banner',label: '香蕉'},
					{value: 'orange',label: '橘子'},
				 ],
				 checkboxList: [
						{label: '苹果1',value: 'apple',checked: false},
						{label: '香蕉1',value: 'banner',checked: false},
						{label: '橘子1',value: 'orange',checked: false}
			   ],
				 radioList:[
				    {label: '苹果2',value: 'apple'},
						{label: '香蕉2',value: 'banner'},
						{label: '橘子2',value: 'orange'}
				 ]
				}					
				}
			}
		},
		methods: {
			getFormData(formData){
				console.log(JSON.stringify(formData))
			}
		}
	}
</script>

<style>

</style>
