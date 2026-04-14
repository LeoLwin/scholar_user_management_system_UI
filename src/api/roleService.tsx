import api from "./api";
// import { useState, useEffect } from "react";
import { handleApiResponse } from "./ApiResonse";
interface RoleItem {
  id: string |number;
  name: string;
  description: string;
}
// interface RoleLists {
//   value: string;
//   label: string;
// }
interface APIRoleItem {
  by: RoleItem[];
  pagination: {
    currentPage: number;
    rowsPerPage: number;
    total: number;
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

export const getRoles = async (queryParams: any) => {
  const { page, per_page, sort_by, sort_order, filters } = queryParams;

  const payload = {
    currentPage: Number(page) || 1,
    limit: Number(per_page) || 10,
    sort_by: sort_by || "id",
    sort_order: sort_order || "asc",
    filters: filters || {},
  };

  const res: RoleListResponseType = await api.post("/role/list", payload);
  try {
  const responseJson = handleApiResponse(res);
  return {
    ...responseJson,
    data: {
      data: res.data?.by,
      totalEntries: res.data?.pagination?.total,
      totalPages: res.data?.pagination?.rowsPerPage,
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
  const res: ApiResponseType = await api.post("/role/create", payload);
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
  const res: ApiResponseType = await api.put(`/role/update/${id}`, data);
  return handleApiResponse(res);
};

export const deleteRole = async (id: string | number) => {
  const res: ApiResponseType = await api.delete(`/role/delete/${id}`);
  return handleApiResponse(res);
};
