<template>
	<basic-layout>
		<view
			class="img_c w-full h-200px"
			:style="{ backgroundImage: `url(${obj.bgimg})` }"
		>
		</view>
		<view style="border-radius: 10px 10px 0 0" class="p-3 -mt-20px bg-[#fff]">
			<h1 class="py-2 inline-block">{{ obj.name }}</h1>
			<view
				class="py-2"
				style="
					border-bottom: 1px solid rgba(211, 209, 209, 0.56);
					border-top: 1px solid rgba(211, 209, 209, 0.56);
				"
			>
				<nut-space>
					<nut-tag
						v-for="item in obj.labelArr"
						:key="item"
						plain
						color="#FA2400"
					>
						{{ item }}
					</nut-tag>
				</nut-space>
			</view>
			<view
				class="py-3"
				style="border-bottom: 1px solid rgba(211, 209, 209, 0.56)"
			>
				<view style="font-size: 14px">基本信息</view>
				<view class="p-2 mt-2" style="font-size: 14px">
					<view>地址：{{ obj.address }}</view>
					<view>开放时间：{{ obj.openTime }}</view>
					<view>门票价格：{{ obj.ticket }}</view>
					<view>官方电话：{{ obj.tel }}</view>
					<view>预约说明：{{ obj.reservationInstructions }}</view>
				</view>
			</view>
			<view class="py-3">
				<view style="font-size: 14px">场馆简介</view>
				<view class="mt-2" style="font-size: 12px">{{ obj.introduce }}</view>
			</view>
		</view>
		<view class="bg-[#dddddd90] p-4">
			<view style="font-size: 14px" class="mb-2">场馆照片</view>
			<scroll-view
				:scroll-x="true"
				:scroll-with-animation="true"
				style="width: 100%; overflow: hidden; white-space: nowrap"
			>
				<view
					v-for="(item, index) in obj.imgList"
					:key="index"
					class="inline-block"
				>
					<div
						:style="{ backgroundImage: `url(${item})` }"
						class="inline-block !w-150px !h-100px border-rounded mr-2 img_c"
						@click="prviewImage(index)"
					></div>
				</view>
			</scroll-view>
			<nut-image-preview
				:images="imgData"
				:show="showPreview"
				:init-no="imgIndex"
				@close="showPreview = false"
			/>
		</view>
	</basic-layout>
</template>
<script setup lang="ts">
/** 设置页面属性 */
definePageConfig({
	navigationBarTitleText: "展馆详情",
});
import Taro from "@tarojs/taro";

import { ref } from "vue";

const obj = ref<any>({
	imgList: [],
	bgimg: "",
	labelArr: [],
});
obj.value = {
	...obj.value,
	...JSON.parse(Taro.getCurrentInstance().router?.params.data as string),
};
obj.value.labelArr = obj.value.label.split(",");
if (
	obj.value &&
	obj.value.redVenuesPictures &&
	obj.value.redVenuesPictures.length > 0
) {
	obj.value.redVenuesPictures.forEach((item) => {
		obj.value.imgList.push(item.picture);
		if (item.header === "1") {
			obj.value.bgimg = item.picture;
		}
	});
}

const showPreview = ref(false);
const imgData = obj.value.imgList.map((item) => {
	return { src: item };
});
const imgIndex = ref(0);

function prviewImage(index) {
	showPreview.value = true;
	imgIndex.value = index;
}
</script>
<style lang="scss">
.img_c {
	background-position: 100%;
	background-repeat: no-repeat;
	background-size: cover;
}
</style>
