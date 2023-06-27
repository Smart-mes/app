<template>
	<view class="login-box">
		<ex-TnavBar  title="登录" :isBack="false"></ex-TnavBar>
		<view class="login-hd">
			<view class="login-content">
				<view class="login-logo">
					<image src="../../static/images/logo.png" mode="aspectFit"></image>
				</view>
				<!-- /logo -->
				<view class="login-form">
					<u-form :model="form" ref="loginForm">
						<u-form-item prop="user" left-icon="account" :left-icon-style="iconStyle">
							<u-input v-model="form.user" :trim="true" :custom-style="{'font-size':'30rpx'}" placeholder="请输入用户名" />
						</u-form-item>
						<u-form-item prop="password" left-icon="lock" :left-icon-style="iconStyle">
							<u-input v-model="form.password" type="password" :password-icon="true" :trim="true" :custom-style="{'font-size':'30rpx'}"
							 placeholder="请输入密码" />
						</u-form-item>
					</u-form>
					<view class="button">
						<u-button type="primary" @click="submit" :loading="loading">登&emsp;录</u-button>
					</view>
				</view>
				<!-- form -->
			</view>
		</view>
		<view class="login-text">©2020广州阳普智能系统科技公司</view>
	</view>
</template>
<script>
	import {mapMutations} from "vuex";
	export default {
		name:"Login",
		data() {
			return {
				loading: false,
				form: {
					user: "admin",
					password: "123456", 
					// ABCD1234
				},
				iconStyle: {
					"font-size": "40rpx",
					color: "#ccc"
				},
				rules: {
					user: [{
						required: true,
						message: '不能为空',
						trigger: 'blur',
					}],
					password: [{
						required: true,
						message: '不能为空',
						trigger: 'blur'
					}]
				}

			}
		},
		onReady() {
			this.$refs.loginForm.setRules(this.rules);
		},
		methods: {
			...mapMutations(['login']),
			submit() {
				this.$refs.loginForm.validate(valid => {
					valid && this.loginAjax()
				});
			},
			loginAjax() {
				const {user,password} = this.form;
				this.loading = true;
				this.$http.request({
					url: '/api/SEmployee/Login',
					method: 'GET',
					data: {
						empCode: user,
						password: password
					}
				})
				 .then((res) => {
					const {empName,empCode} = res
					this.loading = false;
					this.login({token: "",userInfo: {empName,empCode}});
				})
				.then(() => {	
					uni.reLaunch({url: '/pages/index/index'})
				}).catch(() => {
					this.loading = false;
				})
			}
		},
	}
</script>
<style lang="scss" scoped>
	.login-box {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background: $white-color;
	}

	.login-hd {
		flex: auto;
	}

	.login-content {
		width: 100%;
		padding-bottom: 80upx;

		.login-logo {
			padding: 70rpx 0;
			text-align: center;

			image {
				width: 254upx;
				height: 234upx;
			}
		}

		.login-form {
			padding: 0 40upx;

			.button {
				margin-top: 50rpx;
			}

			/deep/.u-border-bottom:after {
				border-color: #ccc;
			}
		}
	}

	.login-text {
		margin-bottom: 100upx;
		font-size: $font-24;
		text-align: center;
		color: $font-light-gray;
	}

	/*#ifdef H5 */
	uni-page-body {
		height: 100%;
	}

	/*#endif */
</style>
