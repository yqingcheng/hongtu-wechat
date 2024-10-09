<template>
	<basic-layout>
		<view class="index-bg-color h-screen">
			<view class="page">
				<view class="title"> 红岭地图</view>
				<view class="content">
					<view class="">
						<text :userSelect="true"> 祝您旅途愉快！ </text>
					</view>
				</view>
				<view class="foot flex items-center justify-center safe-area-bottom">
					<text class="">联系我们：</text>
					<text class="phone" @tap="handlePhoneCall">15135798896</text>
				</view>
			</view>
		</view>
	</basic-layout>
</template>
<script lang="ts" setup>
definePageConfig({
	navigationBarTitleText: "关于我们",
});
import Taro from "@tarojs/taro";

const handlePhoneCall = () => {
	//模拟器仅弹出示例，真机直接跳转至手机拨打电话界面
	Taro.makePhoneCall({
		phoneNumber: "15135798896",
	});
};
</script>
<style lang="scss">
.page {
	padding: 50px 39px;

	.title {
		font-size: 16px;
		line-height: 30px;
		font-weight: 500;
		margin-bottom: 13px;
	}

	.content {
		line-height: 24px;
	}

	.foot {
		width: 79%;
		position: fixed;
		bottom: 20px;

		.phone {
			color: #448aff;
		}
	}
}
</style>
