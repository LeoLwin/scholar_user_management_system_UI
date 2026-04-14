import api from "./api";
import { handleApiResponse } from "./ApiResonse";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
  code: string;
}

type Role = {
  id: string,
  name: string;
  description: string;
}
export interface LoginResponse {
  code: string;
  status: string;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
    };
  };
}


interface ApiResponseType {
  code: string;
  status: string;
  message?: string;
  data?: unknown;
}

export const testAPI = async () => {
  const res = await api.get("/index");
  console.log('test API', res);
}

export const login = async (
  data: LoginPayload
) => {
  const payload = data;
  const res: LoginResponse = await api.post("/auth/login", payload);
  const responseJson = handleApiResponse(res);
  return {
    ...responseJson,
    data: res.data,
  };
};

export const doForgotPassword = async (
  data: ForgotPasswordPayload
) => {
  const payload = data;
  const res: ApiResponseType = await api.post("/auth/forgetPassword", payload);
  return handleApiResponse(res);
};

export const sendOTPCode = async (
  email: string
) => {
  const payload = { email: email };
  const res: ApiResponseType = await api.post("/auth/otp/send", payload);
  return handleApiResponse(res);
};

export const verifiedOTPCode = async (
  email: string,
  otp: string
) => {
  const payload = { email: email, otp: otp };
  const res: ApiResponseType = await api.post("/auth/otp/verify", payload);
  return handleApiResponse(res);
};


