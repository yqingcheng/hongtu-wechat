<template>
	<map
		v-if="!blockShow"
		id="myMap"
		style="width: 100%; height: 100%"
		:longitude="markers[0] ? markers[0].longitude : ''"
		:latitude="markers[0] ? markers[0].latitude : ''"
		scale="14"
		:markers="markers"
		:show-location="true"
		@markertap="markertap"
	/>
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
	<view v-show="show" class="h-full w-full bg-[#00000090] fixed top-46px z-99">
	</view>
	<view
		v-show="show"
		style="height: calc(100vh - 100px)"
		class="fixed top-46px w-full p-3 pt-0 z-100"
	>
		<view class="h-full bg-[#fff] mr-6" style="border-radius: 0 0 10px 10px">
			<scroll-view
				:scroll-y="true"
				class="px-3"
				:scroll-with-animation="true"
				style="height: calc(100vh - 100px)"
				@scrolltolower="scrolltolowerSeaech"
			>
				<nut-empty
					v-if="listImg.length < 1 && !loadingSearch"
					description="暂无数据"
				></nut-empty>
				<view
					class="flex p-2 mr-4 flex justify-between items-center"
					v-for="(item, index) in listImg"
					style="
						border-bottom: 1px solid rgba(211, 209, 209, 0.56);
						font-size: 13px;
					"
					:key="index"
					@click="detailClick(item)"
				>
					<view class="flex items-center flex-1">
						<IconFont name="search" size="14" color="#fa2c19"></IconFont>
						<view class="flex-1 ml-2 text-clip overflow-hidden">
							{{ item.name }}
						</view>
					</view>
					<view class="text-[red]">详情 >></view>
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
	<view class="fixed top-46px left-0 w-full">
		<nut-tabs
			v-model="value"
			title-scroll
			title-gutter="10"
			name="tabName"
			style="background: red"
		>
			<nut-tab-pane
				v-for="item in list"
				:key="item.id"
				:title="item.text"
				:pane-key="item.id"
				class="!h-0 !p-0"
			>
			</nut-tab-pane>
		</nut-tabs>
		<nut-tabs
			v-model="value1"
			title-scroll
			title-gutter="10"
			name="tabNamec"
			background="#fff"
		>
			<template #titles>
				<div
					v-for="item in list[value].children"
					:key="item.id"
					class="custom-tab-item flex items-center"
					@click="areaClick(item)"
				>
					<div
						class="custom-title px-2 py-1 mx-2"
						:class="{
							active: value1 === item.id,
						}"
					>
						{{ item.text }}
					</div>
				</div>
			</template>
			<nut-tab-pane
				v-for="item in list[value].children"
				:key="item.id"
				:title="item.text"
				:pane-key="item.id"
				class="!h-0 !p-0"
			>
			</nut-tab-pane>
		</nut-tabs>
	</view>
	<view v-if="!show" class="fixed right-20 top-150px z-999">
		<view @click="blockClick">
			<view
				class="w-30px h-30px flex justify-center items-center bg-[#fff] border-rounded shadow-lg"
				style="border: 1px solid #eceef1"
			>
				<IconFont name="horizontal" size="20" color="#fa2c19"></IconFont>
			</view>
		</view>
	</view>
	<view
		v-if="!blockShow"
		class="fixed bottom-30 left-15px"
		style="width: calc(100vw - 30px)"
	>
		<view
			class="viewlistblock"
			style="background: none"
			@click="moveTolocation"
		>
			<view
				class="w-30px h-30px flex justify-center items-center bg-[#fff] border-rounded shadow-lg"
			>
				<IconFont name="location" size="22" color="#000"></IconFont>
			</view>
		</view>
		<view v-if="showBlo" class="mt-4 p-3 border-rounded bg-[#fff]">
			<view style="font-size: 18px; border-left: 2px solid red" class="px-2">{{
				mapDetai.name
			}}</view>
			<nut-space class="mt-2">
				<nut-tag
					v-for="item in mapDetai?.label.split(',')"
					:key="item"
					plain
					color="#FA2400"
				>
					{{ item }}
				</nut-tag>
			</nut-space>
			<view class="mt-2 flex justify-between items-center">
				<view style="font-size: 13px" class="pr-2">
					{{ mapDetai.toCurrentDistance }} |
					{{ mapDetai.address }}
				</view>
				<nut-button type="primary" size="small" @click="detailClick(mapDetai)">
					查看详情
				</nut-button>
			</view>
		</view>
	</view>
	<view
		v-if="blockShow"
		class="p-3 w-full pt-145px bg-[#fff]"
		style="height: calc(100% - 180px)"
	>
		<scroll-view
			style="height: calc(100%)"
			:scroll-y="true"
			class="h-full"
			:scroll-with-animation="true"
			@scrolltolower="scrolltolower"
		>
			<nut-empty
				v-if="listImgBlock.length < 1 && !loading"
				description="暂无数据"
			></nut-empty>
			<view
				class="flex py-3 mr-6"
				v-for="(item, index) in listImgBlock"
				style="border-bottom: 1px solid rgba(211, 209, 209, 0.56)"
				:key="index"
				@click="detailClick(item)"
			>
				<img
					class="!w-80px !h-80px border-rounded"
					:src="item.redVenuesPictures[0].picture"
					alt=""
				/>
				<view class="flex-1 flex flex-col justify-between mx-2">
					<view style="font-size: 15px"> {{ item.name }} </view>
					<view style="font-size: 12px"> {{ item.address }} </view>
				</view>
				<view class="color-red w-70px flex flex-col justify-between">
					<view></view>
					<view style="font-size: 12px"> 详情页 >> </view>
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
	</view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Taro, { navigateTo } from "@tarojs/taro";
import { IconFont } from "@nutui/icons-vue-taro";
import { getAllArea } from "./map.api";
import { getAllVenues, getRedMapVenues } from "@/pages/index/index.api";

const val = ref("");
const show = ref(false);
const value = ref(0);
const value1 = ref(0);
const valueName = ref("");
const blockShow = ref(false);
const listImg = ref<any>([]);
const listImgBlock = ref<any>([]);
const list = ref([
	{
		id: 0,
		text: "江苏",
		children: [],
	},
]);
const showBlo = ref(false);
const markers = ref<any>([]);
const markersData = ref<any>([]);
const loadingSearch = ref<boolean>(false);
const isHasDataSearch = ref<boolean>(false);
const pageTotalSearch = ref(0);
const pageDataSearch = ref({
	pageIndex: 1,
	pageSize: 10,
});
const loading = ref<boolean>(false);
const isHasData = ref<boolean>(false);
const pageTotal = ref(0);
const pageData = ref({
	pageIndex: 1,
	pageSize: 10,
});
init();
async function init() {
	await getAllArea().then((res) => {
		if (res.success && res.success.length > 0) {
			list.value[0].children = res.success.map((item: any, index: string) => {
				return {
					id: index,
					text: item,
				};
			});
			valueName.value = list.value[0].children[0].text;
		}
	});
	await getAreaData();
}
function getAreaData() {
	getAllVenues({
		area: valueName.value,
	}).then((res) => {
		console.log(res, "????res");
		if (res.success && res.success.length > 0) {
			markersData.value = res.success;
			markers.value = res.success.map((item: any) => {
				return {
					id: item.id,
					latitude: item.lat,
					longitude: item.lng,
					width: 40,
					height: 40,
					title: item.name,
					iconPath: "../../assets/image/ccv.png",
				};
			});
		}
	});
}
function focusSearch() {
	show.value = true;
	getSearchData(1);
}
function getSearchData(n: any) {
	isHasDataSearch.value = false;
	loadingSearch.value = true;
	if (n == 1) {
		listImg.value = [];
		pageDataSearch.value.pageIndex = 1;
		pageTotalSearch.value = 0;
	}
	getRedMapVenues({
		...pageDataSearch.value,
		name: val.value,
	}).then((res) => {
		listImg.value = res.success?.records;
		loadingSearch.value = false;
		pageTotalSearch.value = res.success?.pages;
	});
}
function scrolltolowerSeaech() {
	console.log(111);
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
function blockClick() {
	blockShow.value = !blockShow.value;

	getBlockData(1);
}
function getBlockData(n: any) {
	isHasData.value = false;
	loading.value = true;
	if (n == 1) {
		listImgBlock.value = [];
		pageData.value.pageIndex = 1;
		pageTotal.value = 0;
	}
	getAllVenues({
		// ...pageData.value,
		area: valueName.value,
	}).then((res) => {
		listImgBlock.value = res.success;
		// listImgBlock.value = res.success?.records;
		loading.value = false;
		// pageTotal.value = res.success?.pages;
	});
}
function scrolltolower() {
	console.log(3333);
	if (pageTotal.value > pageData.value.pageIndex) {
		pageData.value.pageIndex++;
		getBlockData("n");
	} else {
		isHasData.value = true;
	}
}
const mapDetai = ref({});
function markertap(e) {
	console.log("markertap:", e.detail.markerId);
	showBlo.value = true;
	markersData.value.forEach((item) => {
		if (item.id == e.detail.markerId) {
			mapDetai.value = item;
		}
	});
}
const mapCtx = Taro.createMapContext("myMap");
function moveTolocation() {
	Taro.getLocation({
		type: "wgs84",
		success: function (res) {
			mapCtx.moveToLocation(res);
		},
	});
}
function areaClick(item: any) {
	value1.value = item.id;
	valueName.value = item.text;
	console.log(blockShow.value, "blockShow.value");
	if (blockShow.value) {
		getBlockData(1);
	} else {
		getAreaData();
	}
}
function detailClick(item: any) {
	navigateTo({
		url: `/pages/map/cgdetail?data=${JSON.stringify(item)}`,
	});
}
function cancellation() {
	show.value = false;
	val.value = "";
}
</script>
<style lang="scss">
page {
	height: 100%;
	width: 100%;
	.custom-title {
		font-size: 12px;
		color: black;
		cursor: pointer;
		background: #eceef1;
		border-radius: 5px;
	}
	.custom-title.active {
		background: red;
		color: #fff;
	}
}
</style>
