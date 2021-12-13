<template>
	<view>
		<navBar :title="navBar.title" :is-back="navBar.isBack" />
		<view class="u-page">
			<view class="search-box">
				<u-form>
					<u-form-item label="时间">
						<u-row>
							<u-col span="5">
								<u-input v-model="form.startDate" placeholder="输入开始时间" @click="handleTime" />
							</u-col>
							<u-col span="2">至</u-col>
							<u-col span="5">
								<u-input v-model="form.endDate" placeholder="输入结束时间" @click="handleTime" />
							</u-col>
						</u-row>
					</u-form-item>
				</u-form>
				<view class="btn">
					<u-row gutter="20">
						<u-col span="6">
							<u-button>重置</u-button>
						</u-col>
						<u-col span="6">
							<u-button type="primary">搜索</u-button>
						</u-col>
					</u-row>
				</view>
			</view>
			<!-- 搜索 -->
			<view class="bill">
				<u-section title="单据列表" font-size="30" :show-line="false" :right="false" />
				<view class="task-list">
					<view class="task-item" v-for="(bill, key) in billList" :key="key">
						<view class="task-left">
							<view class="row">
								<view class="col-name">工单号：</view>
								<view class="col-text">{{ bill.order }}</view>
							</view>
							<view class="row">
								<view class="col-name">工序：</view>
								<view class="col-text">{{ bill.procedure }}</view>
							</view>
							<view class="row">
								<view class="col-name">批次数量：</view>
								<view class="col-text">{{ bill.quantity }}</view>
							</view>
						</view>
						<view class="task-right">
							<u-button type="success" plain :custom-style="customStyle">填报</u-button>
							<!--   <u-button type="warning" size="mini" plain>重置</u-button> -->
						</view>
					</view>
				</view>
				<u-empty v-show="!billList.length" margin-top="30" icon-size="100" text="数据为空" mode="data" />
			</view>
			<!-- 列表 -->
		</view>
		<!-- page -->
		<u-calendar v-model="timeVisible" mode="medium" max-date="2050-12-31" @change="timeChange" />
		<!--calendar -->
	</view>
</template>

<script>
	import uForm from "../../uview-ui/components/u-form/u-form.vue";
	export default {
		components: {
			uForm
		},
		data() {
			return {
				name: "HistoryBill",
				navBar: {
					title: "历史单据",
					isBack: true,
				},
				// form
				form: {
					startDate: "",
					endDate: "",
				},
				timeVisible: false,
				// 填报列表
				customStyle: {
					height: "60rpx",
					lineHeigh: "60rpx",
				},
				billList: [{
						order: "FGD131DFAS01",
						procedure: "FDA464DG",
						quantity: 100,
					},
					{
						order: "FGD131DFAS02",
						procedure: "FDA464DG",
						quantity: 150,
					},
					{
						order: "FGD131DFAS03",
						procedure: "FDA464DG",
						quantity: 120,
					},
				],
			};
		},
		methods: {
			// form
			clear() {
				Object.keys(this.form).forEach((key) => {
					this.form[key] = "";
				});
				this.$refs.uForm.resetFields();
			},
			handleTime() {
				uni.hideKeyboard();
				this.timeVisible = !this.timeVisible;
			},
			timeChange(e) {
				const {
					startDate,
					endDate
				} = e;
				this.form.startDate = startDate;
				this.form.endDate = endDate;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.bill {
		margin: 15rpx 15rpx;
		padding: 30rpx;
		border-radius: 10rpx;
		background-color: $white-color;
	}

	.task-list {
		margin-top: 20rpx;
		.task-icon {margin-right: 20rpx;}
		.task-item {
			margin: 0;
			padding: 20rpx 10rpx;
			border-radius: 0;
			border-bottom: 1px dashed $line-dark-color;
			&:active {background-color: #fff;}
		}

		.col-name {width: 140rpx;}
		.task-right {padding-left: 0;}
	}
</style>
