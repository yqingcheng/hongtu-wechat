<template xmlns="">
	<basic-layout class="!bg-[#eae5e5]">
		<view class="fixed -top-2px w-full z-99">
			<nut-searchbar
				v-model="val"
				background="#a85959"
				input-background="#fff"
				@focus="focusSearch"
				@change="changeSearch"
			>
				<template v-if="show" #rightout>
					<view @click="cancellation" class="text-white"> 取消 </view>
				</template>
			</nut-searchbar>
		</view>
		<view
			v-show="show"
			class="h-full w-full bg-[#00000090] fixed top-46px z-99"
		>
		</view>
		<view
			v-show="show"
			style="height: calc(100vh - 100px)"
			class="fixed top-46px w-full p-3 z-100 pt-0"
		>
			<view
				class="h-full bg-[#fff] mr-6 pt-2"
				style="border-radius: 0 0 10px 10px"
			>
				<scroll-view
					:scroll-y="true"
					class="h-full px-3"
					:scroll-with-animation="true"
					@scrolltolower="scrolltolowerSeaech"
					style="height: calc(100vh - 100px)"
				>
					<nut-empty
						v-if="list.length < 1 && !loadingSearch"
						description="暂无数据"
					></nut-empty>
					<view
						class="flex pb-4 mb-3 mr-6"
						v-for="(item, index) in list"
						style="border-bottom: 1px solid rgba(211, 209, 209, 0.56)"
						:key="index"
						@click="imgBlockClick(item)"
					>
						<img
							class="!w-90px !h-90px border-rounded"
							:src="item.redVenuesPictures[0].picture"
							alt=""
						/>
						<view class="flex-1 flex flex-col justify-between mx-2">
							<view style="font-size: 14px"> {{ item.name }} </view>
							<view style="font-size: 12px"> {{ item.address }} </view>
						</view>
						<view class="color-red w-70px flex flex-col justify-between">
							<view></view>
							<view style="font-size: 12px"> 详情页 >> </view>
						</view>
					</view>
					<view v-if="loadingSearch" class="flex justify-center mt-2">
						<IconFont name="loading"></IconFont>
					</view>
					<view class="flex justify-center mt-2" style="font-size: 14px">
						<view v-if="isHasDataSearch"> 暂无更多数据 </view>
						<view v-else>&nbsp;</view>
					</view>
					<view v-if="isHasDataSearch || loadingSearch" class="w-full">
						&nbsp;
					</view>
				</scroll-view>
			</view>
		</view>
		<scroll-view
			:scroll-y="true"
			class="h-full"
			:scroll-with-animation="true"
			style="height: calc(100vh - 10px)"
			@scrolltolower="scrolltolower"
		>
			<nut-backtop height="100%">
				<template #content>
					<view class="pt-55px px-3">
						<view class="flex justify-between">
							<view>离我最近</view>
							<view class="color-red" @click="allClick">全部 ></view>
						</view>
						<nut-row :gutter="5" class="mt-3">
							<nut-col :span="15">
								<div
									class="content relative"
									:style="{
										backgroundImage: `url(${recentlyList[0]?.redVenuesPictures[0].picture})`,
									}"
									@click="imgBlockClick(recentlyList[0])"
								>
									<view> {{ recentlyList[0]?.name }} </view>
								</div>
							</nut-col>
							<nut-col :span="9">
								<div
									class="content relative"
									:style="{
										backgroundImage: `url(${recentlyList[1]?.redVenuesPictures[0].picture})`,
									}"
									@click="imgBlockClick(recentlyList[1])"
								>
									<view> {{ recentlyList[1]?.name }} </view>
								</div>
							</nut-col>
						</nut-row>
						<nut-row :gutter="5" class="mt-2">
							<nut-col :span="9">
								<div
									class="content relative"
									:style="{
										backgroundImage: `url(${recentlyList[2]?.redVenuesPictures[0].picture})`,
									}"
									@click="imgBlockClick(recentlyList[2])"
								>
									<view> {{ recentlyList[2]?.name }} </view>
								</div>
							</nut-col>
							<nut-col :span="15">
								<div
									class="content relative"
									:style="{
										backgroundImage: `url(${recentlyList[3]?.redVenuesPictures[0].picture})`,
									}"
									@click="imgBlockClick(recentlyList[3])"
								>
									<view> {{ recentlyList[3]?.name }} </view>
								</div>
							</nut-col>
						</nut-row>
						<view class="mt-3">
							<grid-view type="masonry" main-axis-gap="10" cross-axis-gap="10">
								<view
									v-for="item in dataList"
									:key="item"
									class="bg-[#fff] border-rounded"
									@click="imgBlockClick(item)"
								>
									<img
										class="w-100% border-rounded"
										:src="item.redVenuesPictures[0].picture"
										mode="widthFix"
										alt=""
									/>
									<view class="p-3" style="font-size: 14px">
										{{ item.name }}
									</view>
								</view>
							</grid-view>
						</view>
					</view>
				</template>
			</nut-backtop>
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
import Taro, { navigateTo } from "@tarojs/taro";
import { ref } from "vue";
import { getAllVenues, getRedMapVenues } from "./index.api";
import bguser from "@/assets/image/bguser.jpg";
import { IconFont } from "@nutui/icons-vue-taro";

definePageConfig({
	navigationBarTitleText: "红岭地图",
});

const val = ref("");
const show = ref(false);
const list = ref<any>([]);
const currentLocation = ref("");
const dataList = ref<any>([]);
const loading = ref<boolean>(false);
const isHasData = ref<boolean>(false);
const pageTotal = ref(0);
const pageData = ref({
	pageIndex: 1,
	pageSize: 10,
});
function cancellation() {
	show.value = false;
	val.value = "";
}
function allClick() {
	navigateTo({
		url: `/pages/index/zgList?address=${currentLocation.value}`,
	});
}
function imgBlockClick(obj: any) {
	navigateTo({
		url: `/pages/index/detail?data=${JSON.stringify(obj)}`,
	});
}

Taro.getLocation({
	type: "wgs84",
	success: function (res) {
		currentLocation.value = `${res.latitude},${res.longitude}`;
		init();
	},
	fail: (res) => {
		init();
	},
});
const recentlyList = ref([
	{
		redVenuesPictures: [
			{
				picture: bguser,
			},
		],
	},
	{
		redVenuesPictures: [
			{
				picture: bguser,
			},
		],
	},
	{
		redVenuesPictures: [
			{
				picture: bguser,
			},
		],
	},
	{
		redVenuesPictures: [
			{
				picture: bguser,
			},
		],
	},
]);
async function init() {
	getAllVenues({
		distance: true,
		currentLocation: currentLocation.value,
	}).then((res) => {
		if (res.success && res.success.length > 4) {
			recentlyList.value = res.success.slice(0, 4);
		}
	});
	pageNationGet(1);
}
function pageNationGet(n: any) {
	isHasData.value = false;
	loading.value = true;
	if (n == 1) {
		dataList.value = [];
		pageData.value.pageIndex = 1;
		pageTotal.value = 0;
	}
	getRedMapVenues({
		...pageData.value,
		distance: true,
		currentLocation: currentLocation.value,
	}).then((res) => {
		dataList.value = res.success?.records;
		loading.value = false;
		pageTotal.value = res.success?.pages;
	});
}
function scrolltolower() {
	console.log(pageTotal.value, pageData.value, "[[[");
	if (pageTotal.value > pageData.value.pageIndex) {
		pageData.value.pageIndex++;
		pageNationGet("n");
	} else {
		isHasData.value = true;
	}
}
function focusSearch() {
	show.value = true;
	getSearchData(1);
}
function getSearchData(n: any) {
	isHasDataSearch.value = false;
	loadingSearch.value = true;
	if (n == 1) {
		list.value = [];
		pageDataSearch.value.pageIndex = 1;
		pageTotalSearch.value = 0;
	}
	getRedMapVenues({
		...pageDataSearch.value,
		name: val.value,
	}).then((res) => {
		list.value = res.success?.records;
		loadingSearch.value = false;
		pageTotalSearch.value = res.success?.pages;
	});
}

const loadingSearch = ref<boolean>(false);
const isHasDataSearch = ref<boolean>(false);
const pageTotalSearch = ref(0);
const pageDataSearch = ref({
	pageIndex: 1,
	pageSize: 10,
});
function scrolltolowerSeaech() {
	console.log(pageTotalSearch.value, pageDataSearch.value);
	if (pageTotalSearch.value > pageDataSearch.value.pageIndex) {
		pageDataSearch.value.pageIndex++;
		getSearchData("n");
	} else {
		isHasDataSearch.value = true;
	}
}
function changeSearch() {
	getSearchData(1);
}
</script>
<style lang="scss">
.content {
	height: 120px;
	background-position: 100%;
	background-repeat: no-repeat;
	background-size: cover;
	view {
		position: absolute;
		left: 5px;
		bottom: 5px;
		color: #fff;
		font-size: 12px;
	}
}
page {
	height: 100%;
}
</style>
