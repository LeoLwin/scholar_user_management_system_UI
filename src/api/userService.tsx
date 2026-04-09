import api from "./api";
import { handleApiResponse } from "./ApiResonse";

interface RoleItem {
  id: string | number;
  name: string;
  description: string;
}
interface UserItem {
  id: string | number;
  name: string;
  email: string;
  password?: string;
  roles: RoleItem;
  phoneNo: string;
  gender: string;
  address: string;
  status?: string;
}

interface UserFormType {
  id: string | number;
  name: string;
  email: string;
  password?: string;
  phoneNo: string;
  gender: string;
  address: string;
  status?: string;
}

interface APIUserItem {
  by: UserItem[];
  pagination: {
    currentPage: number;
    rowsPerPage: number;
    total: number;
  };
}

interface UserListResponseType {
  code: string;
  status: string;
  message: string;
  data: APIUserItem;
}

interface ApiResponseType {
  code: string;
  status: string;
  message?: string;
  data?: APIUserItem | any;
}

export const getUserNames = async () => {
  const res = await api.get("/user/getUserNames");
  return {
    message: "User Names",
    data: res.data,
  };
};

export const getUsers = async (queryParams: any) => {
  const { page, per_page, sort_by, sort_order, filters } = queryParams;
  const payload = {
    currentPage: Number(page) || 1,
    limit: Number(per_page) || 10,
    sort_by: sort_by || "id",
    sort_order: sort_order || "asc",
    filters: filters || {},
  };

  const res: UserListResponseType = await api.post("/user/list", payload);
  try {
    let responseJson = handleApiResponse(res);
    return {
      ...responseJson,
      data: {
        data: res.data?.by,
        totalEntries: res.data?.pagination?.total,
        totalPages: res.data?.pagination?.rowsPerPage,
        page: res.data?.pagination?.currentPage,
      },
    };
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message || "Login failed",
    };
  }
};

export const createUser = async (data: UserFormType) => {
  const { id, ...payload } = data;
  const res: ApiResponseType = await api.post("/user/create", payload);
  return handleApiResponse(res);
};

export const getUserById = async (id: string | number) => {
  const res: ApiResponseType = await api.get(`/user/details/${id}`);
  const response = handleApiResponse(res);
  return {
    ...response,
    data: res.data,
  };
};

export const updateUser = async (id: string | number, data: UserFormType) => {
  const res: ApiResponseType = await api.put(`/user/update/${id}`, data);
  return handleApiResponse(res);
};

export const deleteUser = async (id: string | number) => {
  const res: ApiResponseType = await api.delete(`/user/delete/${id}`);
  return handleApiResponse(res);
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  console.log({ userId, currentPassword, newPassword });
  const res: ApiResponseType = await api.post(`/user/changePassword`, { userId, currentPassword, newPassword });
  return handleApiResponse(res);
};
