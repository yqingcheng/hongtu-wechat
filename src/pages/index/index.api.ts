import { request } from "@/service/request";

export function getAllVenues(data: any) {
	return request.post("/redMap/getAllVenues", data, {
		useErrMsg: true,
	});
}
export function getRedMapVenues(data: any) {
	return request.post("/redMap/getRedMapVenues", data, {
		useErrMsg: true,
	});
}
