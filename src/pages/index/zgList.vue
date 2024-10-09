<template>
	<basic-layout>
		<scroll-view
			:scroll-y="true"
			class="w-full h-full"
			:scroll-with-animation="true"
			style="height: calc(100vh - 10px)"
			@scrolltolower="scrolltolower"
		>
			<view
				class="flex p-4 pr-3"
				v-for="(item, index) in list"
				style="border-bottom: 1px solid rgba(211, 209, 209, 0.56)"
				:key="index"
				@click="detailClick(item)"
			>
				<img
					class="!w-90px !h-90px border-rounded"
					:src="item.redVenuesPictures[0].picture"
					alt=""
				/>
				<view class="flex-1 flex flex-col justify-between mx-2">
					<view style="font-size: 15px"> {{ item.name }} </view>
					<view style="font-size: 12px"> {{ item.address }} </view>
				</view>
				<view class="color-red w-70px flex flex-col justify-between">
					<view style="font-size: 12px" class="flex flex-row-reverse">
						<view class="ml-1">{{ item.toCurrentDistance }}</view>
						<IconFont name="jdl" size="12" color="#fa2c19"></IconFont>
					</view>
					<view style="font-size: 12px" class="text-right"> 详情页 >> </view>
				</view>
			</view>
			<view v-if="loading" class="flex justify-center mt-2">
				<IconFont name="loading"></IconFont>
			</view>
			<view class="flex justify-center mt-2 mb-1" style="font-size: 14px">
				<view v-if="isHasData"> 暂无更多数据 </view>
				<view v-else>&nbsp;</view>
			</view>
		</scroll-view>
	</basic-layout>
</template>
<script setup lang="ts">
definePageConfig({
	navigationBarTitleText: "我要进馆",
});

import Taro, { navigateTo } from "@tarojs/taro";
import { ref } from "vue";
import { IconFont } from "@nutui/icons-vue-taro";
import { getAllVenues } from "./index.api";

const address = Taro.getCurrentInstance().router?.params.address as string;
const list = ref<any>([]);
const loading = ref<boolean>(false);
const isHasData = ref<boolean>(false);
const pageTotal = ref(0);
const pageData = ref({
	pageIndex: 1,
	pageSize: 10,
});
init(1);
function init(n: any) {
	isHasData.value = false;
	loading.value = true;
	if (n == 1) {
		list.value = [];
		pageData.value.pageIndex = 1;
		pageTotal.value = 0;
	}
	getAllVenues({
		...pageData.value,
		distance: true,
		currentLocation: address,
	}).then((res) => {
		list.value = res.success;
		loading.value = false;
		pageTotal.value = res.success?.pages;
	});
}

function detailClick(item: any) {
	navigateTo({
		url: `/pages/index/detail?data=${JSON.stringify(item)}`,
	});
}

function scrolltolower() {
	console.log(pageTotal.value, pageData.value, "[[[");
	if (pageTotal.value > pageData.value.pageIndex) {
		pageData.value.pageIndex++;
		init("n");
	} else {
		isHasData.value = true;
	}
}
</script>
<style lang="scss"></style>
