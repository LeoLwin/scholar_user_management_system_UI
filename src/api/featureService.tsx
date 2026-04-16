import api from "./api";
// import { useState, useEffect } from "react";
import { handleApiResponse } from "./ApiResonse";

interface permissionItem {
  id: number;
  name: string;
}
interface FeatureItem {
  id: number;
  name: string;
  userCount : number;
  permissions: permissionItem[];
}
// interface RoleLists {
//   value: string;
//   label: string;
// }
interface APIFeatureItem {
  features: FeatureItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
  };
}
interface FeatureListResponseType {
  code: string;
  status: string;
  message: string;
  data: APIFeatureItem;
}

interface ApiResponseType {
  code: string;
  status: string;
  message?: string;
  data?: FeatureListResponseType | unknown;
}

export const getFeatureNames = async () => {
  const res = await api.get("/features/name-value");
  return {
    message: "Feature Names",
    data: res.data,
  };
};

export const getFeatures = async (queryParams: unknown) => {
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

  const res: FeatureListResponseType = await api.get(`/features/list?current=${page || 1}&limit=${per_page}&name=${filters.name || ""}`);
  console.log("API Response:", res);
  try {
  const responseJson = handleApiResponse(res);
  return {
    ...responseJson,
    data: {
      data: res.data?.features,
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

export const createFeature = async (data: any) => {
  
  const { id, ...payload } = data;
  console.log('createFeature payload', id);
  const res: ApiResponseType = await api.post("/features", payload);
  return handleApiResponse(res);
};

export const getFeatureById = async (id: string | number) => {
  const res:ApiResponseType = await api.get(`/feature/details/${id}`);
  console.log('getFeatureById', res);
  const response = handleApiResponse(res);
  return {
    ...response,
    data: res.data,
  };
};

export const updateFeature = async (id: string | number, data: FeatureItem) => {
  const res: ApiResponseType = await api.put(`/features/${id}`, data);
  return handleApiResponse(res);
};

export const deleteFeature = async (id: string | number) => {
  const res: ApiResponseType = await api.delete(`/features/${id}`);
  return handleApiResponse(res);
};
