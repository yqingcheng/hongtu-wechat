export default defineAppConfig({
	pages: [
		"pages/index/index",
		"pages/my/index",
		"pages/map/index",
		"pages/my/about",
		"pages/index/detail",
		"pages/index/zgList",
		"pages/map/cgdetail",
	],
	window: {
		backgroundColor: "#fff",
		backgroundTextStyle: "light",
		navigationBarBackgroundColor: "#a85959",
		navigationBarTitleText: "红岭地图",
		navigationBarTextStyle: "white",
		// navigationStyle: "custom",
	},
	subPackages: [
		{
			root: "package",
			pages: [
				"package-a/index",
				"package-b/index",
				"package-c/index",
				"icon/index",
			],
		},
	],
	tabBar: {
		custom: false,
		color: "#000000",
		selectedColor: "#1FA4FE",
		list: [
			{
				pagePath: "pages/index/index",
				iconPath: "assets/image/home.png",
				selectedIconPath: "assets/image/home-active.png",
				text: "首页",
			},
			{
				pagePath: "pages/map/index",
				iconPath: "assets/image/map.png",
				selectedIconPath: "assets/image/map-active.png",
				text: "地图",
			},
			{
				pagePath: "pages/my/index",
				iconPath: "assets/image/my.png",
				selectedIconPath: "assets/image/my-active.png",
				text: "我的",
			},
		],
	},
	permission: {
		"scope.userLocation": {
			desc: "你的位置信息将用于小程序位置接口的效果展示",
		},
	},
	requiredPrivateInfos: ["getLocation"],
});
