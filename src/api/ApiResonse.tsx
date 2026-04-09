
interface ApiResult {
	status: "success" | "error" | "warning" | "info";
	message: string;
	data?: any
}


interface ApiResponseType{
  code : string,
  status : string,
  message?: string;
  data?: any;
}
  
export function handleApiResponse(res: ApiResponseType): ApiResult {
	switch (res.code) {
		case "200":
			return { status: "success", message: res.message || "Operation successful" };
		case "422":
			return { status: "info", message: res.message || "Unprocessable Entity" };
		case "400":
			return { status: "error", message: res.message || "Bad request" };
		case "409":
			return { status: "info", message: res.message || "Already Exist" };
		case "401":
			return { status: "error", message: res.message || "Unauthorized" };
		case "500":
			return { status: "error", message: res.message || "Server error" };
		
		default:
			return { status: "error", message: res.message || "Something went wrong" };
	}
}
