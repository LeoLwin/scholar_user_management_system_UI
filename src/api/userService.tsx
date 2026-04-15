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
  phone: string;
  gender: string;
  address: string;
  status?: string;
  username?: string;
}

interface APIUserItem {
  users: UserItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
    current: number;
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
  data?: APIUserItem | unknown;
}

export const getUserNames = async () => {
  const res = await api.get("/user/getUserNames");
  return {
    message: "User Names",
    data: res.data,
  };
};

export const getUsers = async (queryParams: unknown) => {
  const { page, per_page, sort_by, sort_order, filters } = queryParams as {
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: string;
    filters?: Record<string, unknown>;
  };
  const payload = {
    current: Number(page) || 1,
    limit: Number(per_page) || 10,
    sort_by: sort_by || "id",
    sort_order: sort_order || "asc",
    filters: filters || {},
  };
  console.log("Fetching users with payload:", payload);

  const res: UserListResponseType = await api.get(`/users/list?current=${page || 1}&limit=${per_page}`);
  try {
    const responseJson = handleApiResponse(res);

    return {
      ...responseJson,
      data: {
        data: res.data?.users,
        totalEntries: res.data?.pagination?.totalRecords,
        totalPages: res.data?.pagination?.totalPages,
        page: res.data?.pagination?.current,
      },
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error fetching users:", errorMessage);
    
    return {
      status: "error",
      message: `Error fetching users: ${errorMessage}`,
    };
  }
};

export const createUser = async (data: UserFormType) => {
  const { ...payload } = data;
  console.log("Creating user with payload:", payload);
  const res: ApiResponseType = await api.post("/users", payload);
  return handleApiResponse(res);
};

export const getUserById = async (id: string | number) => {
  const res: ApiResponseType = await api.get(`/users/${id}`);
  const response = handleApiResponse(res);
  return {
    ...response,
    data: res.data,
  };
};

export const updateUser = async (id: string | number, data: UserFormType) => {
  const res: ApiResponseType = await api.put(`/users/${id}`, data);
  return handleApiResponse(res);
};

export const deleteUser = async (id: string | number) => {
  const res: ApiResponseType = await api.delete(`/users/${id}`);
  return handleApiResponse(res);
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  console.log({ userId, currentPassword, newPassword });
  const res: ApiResponseType = await api.post(`/user/changePassword`, { userId, currentPassword, newPassword });
  return handleApiResponse(res);
};
