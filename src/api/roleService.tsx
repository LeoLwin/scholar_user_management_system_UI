import api from "./api";
// import { useState, useEffect } from "react";
import { handleApiResponse } from "./ApiResonse";

interface permissionItem {
  id: number;
  name: string;
  feature: string;
}
interface RoleItem {
  id: number;
  name: string;
  userCount : number;
  permissions: permissionItem[];
}
// interface RoleLists {
//   value: string;
//   label: string;
// }
interface APIRoleItem {
  roles: RoleItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
  };
}
interface RoleListResponseType {
  code: string;
  status: string;
  message: string;
  data: APIRoleItem;
}

interface ApiResponseType {
  code: string;
  status: string;
  message?: string;
  data?: APIRoleItem | unknown;
}

export const getRoleNames = async () => {
  const res = await api.get("/roles/name-value");
  return {
    message: "Role Names",
    data: res.data,
  };
};

export const getRoles = async (queryParams: unknown) => {
  const { page, per_page, sort_by, sort_order, filters } = queryParams as {
    page: number;
    per_page: number;
    sort_by: string;
    sort_order: string;
    filters: Record<string, unknown>;
  };

  const payload = {
    currentPage: Number(page) || 1,
    limit: Number(per_page) || 10,
    sort_by: sort_by || "id",
    sort_order: sort_order || "asc",
    filters: filters || {},
  };
  console.log("Fetching roles with payload:", payload);

  const res: RoleListResponseType = await api.get(`/roles/list?current=${page || 1}&limit=${per_page}&name=${filters.name || ""}`);
  try {
  const responseJson = handleApiResponse(res);
  return {
    ...responseJson,
    data: {
      data: res.data?.roles,
      totalEntries: res.data?.pagination?.totalRecords,
      totalPages: res.data?.pagination?.totalPages,
      page: res.data?.pagination?.currentPage,
    },
  };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error fetching roles:", errorMessage);
    return {
      status: "error",
      message: errorMessage,
    };
  }
};

export const createRole = async (data: any) => {
  
  const { id, ...payload } = data;
  console.log('createRole payload', id);
  const res: ApiResponseType = await api.post("/roles", payload);
  return handleApiResponse(res);
};

export const getRoleById = async (id: string | number) => {
  const res:ApiResponseType = await api.get(`/role/details/${id}`);
  console.log('getRoleById', res);
  const response = handleApiResponse(res);
  return {
    ...response,
    data: res.data,
  };
};

export const updateRole = async (id: string | number, data: RoleItem) => {
  const res: ApiResponseType = await api.put(`/roles/${id}`, data);
  return handleApiResponse(res);
};

export const deleteRole = async (id: string | number) => {
  const res: ApiResponseType = await api.delete(`/roles/${id}`);
  return handleApiResponse(res);
};
