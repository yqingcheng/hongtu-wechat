<template>
	<basic-layout>
		<img :src="bguser" class="w-full" mode="widthFix" alt="" />
		<view
			class="user-avatar flex flex-col justify-center items-center -mt-37px"
		>
			<button
				style="padding: 0"
				class="avatar-wrapper rounded-full head-content flex items-center justify-center"
				open-type="chooseAvatar"
				@chooseavatar="onChooseAvatar"
			>
				<img class="w-full h-full" :src="personalList.avatar" alt="" />
			</button>
			<input
				type="nickname"
				class="!mt-2 text-center"
				:value="personalList.username"
				placeholder="请输入昵称"
			/>
		</view>
		<view class="cu-list menu sm-border">
			<view
				class="cu-item arrow animation-slide-bottom"
				:style="{ animationDelay: '0.2s' }"
				@click="handleAboutUs"
			>
				<view class="content">
					<text class="cuIcon-friend text-blue" />
					<text>关于我们</text>
				</view>
			</view>
		</view>
	</basic-layout>
</template>

<script lang="ts" setup>
definePageConfig({
	navigationBarTitleText: "个人中心",
});
import { ref } from "vue";
import bguser from "@/assets/image/bguser.jpg";
import logo from "@/assets/image/login.png";
import { navigateTo } from "@tarojs/taro";

const personalList = ref({
	avatar: logo,
	username: "用户",
});
function onChooseAvatar(e: any) {
	personalList.value.avatar = e.detail.avatarUrl;
}
function handleAboutUs() {
	navigateTo({
		url: "/pages/my/about",
	});
}
</script>

<style lang="scss">
.user-avatar {
	z-index: 99;
	.head-content {
		overflow: hidden;
		width: 136rpx;
		height: 136rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
