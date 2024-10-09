import { request } from "@/service/request";

export function getAllArea() {
	return request.post(
		"/redMap/getAllArea",
		{},
		{
			useErrMsg: true,
		},
	);
}
