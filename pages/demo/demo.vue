<template>
	<view>
		 <ex-describe 
				title="Nvue特性相关" 
				:keyShow="descKeyShow"
				:data="descData" 
				:dict="descDict" 
				shape="square" 
				margin="15rpx 0"/>
		 <ex-list 
				type="link"
				hover
				title="标题列表" 
				:keyShow="listKeyShow"
				:data="list" 
				:dict="listDict" 
					
		 />
	</view>
</template>

<script>
  import exDescribe from "@/components/describe/describe.vue"
	import exList from "@/components/list/list.vue"
	export default {
		name:"Demo",
		components: { exDescribe,exList},
		data() {
			return {
				// info
				descKeyShow:['line','headJsonData'],
				descData:{
					 line:'控制器生产一线',	
					 a:'测试',
					 b:'测试数据',
					 headJsonData:{
						workOrder:'DGD46541313',
						station:'安装控制板01工位',
						device:'贴片机',
						b:'测试',
					 },
					 bodyJsonData:{
						a:'a',
						b:'b',
						c:'c'
					 }	 
				},
				descDict:{
					line:'产线',
					workOrder:'工单',
					station:'工位',
					device:'设备'
				},
				// list
				list:[
					{
						id:1,
						name:'动平衡机',
						worderOder:'EQE585641654654',
						device:'贴片机',
					 bodyJsonData:{
						a:'a',
						b:'b',
						c:'c'
					 }	 
					},
					{
						id:2,
						name:'铁芯入轴机',
						worderOder:'EQEGDSFHBGFE454',
						device:'注塑机',
					 bodyJsonData:{
						a:'a',
						b:'b',
						c:'c'
					 }	 
					},
					{
						id:3,
						name:'表磁检测',
						worderOder:'EQE58532422654',
						device:'制糖机械设备',
					 bodyJsonData:{
						a:'a',
						b:'b',
						c:'c'
					 }	 
					},
				],
				listKeyShow:['name','worderOder','device','bodyJsonData'],
				listDict:{
					name:'名称',
					worderOder:'工单号',
					device:'设备'
				}
			}
		},
	}
</script>

<style>

</style>
