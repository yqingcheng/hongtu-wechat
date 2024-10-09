<template>
	<basic-layout>
		<view class="img_c w-full h-200px">
			<view class="w-full flex pt-90px">
				<img
					class="!w-120px !h-120px border-rounded -mb-30px ml-30px"
					:src="obj.bgimg"
					alt=""
				/>
				<view class="ml-4 text-white">
					<h1>{{ obj.name }}</h1>
					<nut-space class="mt-3">
						<nut-tag
							v-for="item in obj.labelArr"
							:key="item"
							plain
							color="#a85959"
						>
							{{ item }}
						</nut-tag>
					</nut-space>
				</view>
			</view>
		</view>
		<view
			style="border-radius: 10px 0 0 0"
			class="p-4 pt-40px -mt-20px bg-[#fff]"
		>
			<view class="flex justify-between items-center">
				<h2>{{ obj.address }}</h2>
				<img class="!w-30px !h-30px" :src="dh" alt="" @click="goCg(obj)" />
			</view>
			<view class="mt-4" style="font-size: 14px">
				<!--				<view>地址：{{ obj.address }}</view>-->
				<view>开放时间：{{ obj.openTime }}</view>
				<view>门票价格：{{ obj.ticket }}</view>
				<view>官方电话：{{ obj.tel }}</view>
				<view>预约说明：{{ obj.reservationInstructions }}</view>
			</view>
			<view class="mt-4">
				<view style="font-size: 14px">场馆简介</view>
				<view class="mt-2" style="font-size: 12px">{{ obj.introduce }}</view>
			</view>
			<view class="mt-4">
				<view style="font-size: 14px">场馆照片</view>
				<view class="mt-2">
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
			</view>
		</view>
		<map class="map h-0" id="mapcc"> </map>
	</basic-layout>
</template>
<script setup lang="ts">
/** 设置页面属性 */
import Taro from "@tarojs/taro";
import { ref } from "vue";
import dh from "@/assets/image/dh.png";

definePageConfig({
	navigationBarTitleText: "场馆详情",
});
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
function goCg(obj: any) {
	const mapCtx = Taro.createMapContext("mapcc", this);
	mapCtx.openMapApp({
		latitude: obj.lat * 1,
		longitude: obj.lng * 1,
		destination: obj.name,
	});
}
// function goCg() {
// 	const mapCtx = Taro.createMapContext("mapcc", this);
// 	mapCtx.openMapApp({
// 		latitude: 23.10229,
// 		longitude: 113.3245211,
// 		destination: "山西临汾",
// 	});
// }
const imgIndex = ref(0);
const showPreview = ref(false);
const imgData = obj.value.imgList.map((item: any) => {
	return { src: item };
});
function prviewImage(index: any) {
	showPreview.value = true;
	imgIndex.value = index;
}
</script>
<style lang="scss">
.img_c {
	background-image: url("https://sungrow-local.oss-cn-beijing.aliyuncs.com/upload/file_1661138704851");
	background-position: 100%;
	background-repeat: no-repeat;
	background-size: cover;
}
</style>
