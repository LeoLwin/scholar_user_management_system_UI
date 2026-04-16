import api from "./api";
// import { useState, useEffect } from "react";
import { handleApiResponse } from "./ApiResonse";


interface RoleItem {
    id: number;
    name: string;
}

interface PermissionsItem {
    id: number;
    name: string;
    featureId: number;
    feature: string;
    roles: RoleItem[];
}

interface APIPermissonsItem {
    permissions: PermissionsItem[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        limit: number;
    };
}


interface PermissionsListResponseType {
    code: string;
    status: string;
    message: string;
    data: APIPermissonsItem;
}


interface ApiResponseType {
    code: string;
    status: string;
    message?: string;
    data?: PermissionsItem;
}

type CreatePermissionData = {
    id?: number;
    name: string;
    featureId: number;
};

type ApiRolePermissionItem = {
    code: string;
    status: string;
    message?: string;
    data?: {
        roleId: number;
        roleName: string;
        permissions: PermissionsItem[];
    };
};


export const getPermisssions = async (queryParams: unknown) => {
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

    const res: PermissionsListResponseType = await api.get(`/permissions/list?current=${page || 1}&limit=${per_page}`);
    console.log("API Response:", res);
    try {
        const responseJson = handleApiResponse(res);
        return {
            ...responseJson,
            data: {
                data: res.data?.permissions,
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

export const createPermissions = async (data: CreatePermissionData) => {

    // const { id, name, featureId } = data;
    console.log('createPermissions payload', data);
    const res: ApiResponseType = await api.post("/permissions", data);
    return handleApiResponse(res);
};

export const getPermissionById = async (id: number) => {
    const res: ApiResponseType = await api.get(`/permissions/${id}`);
    console.log('getPermissionById', res);
    const response = handleApiResponse(res);
    return {
        ...response,
        data: res.data,
    };
};

export const createRolePermissions = async (data: { roleId: number; permissionIds: number[] }) => {
    console.log('createRolePermissions payload', data);
    const res: ApiResponseType = await api.post("/permissions/roles-permissions", data);
    const response = handleApiResponse(res);
    return {
        ...response,
        data: res.data,
    };
};

export const detailsRolesPermissions = async (roleId: number) => {
    console.log('detailsRolesPermissions payload', roleId);
    const res: ApiRolePermissionItem = await api.get(`/roles/${roleId}/permissions`);
    const response = handleApiResponse(res);
    return {
        ...response,
        data: res.data,
    };
};

export const deletePermission = async (id: number) => {
    const res: ApiResponseType = await api.delete(`/permissions/${id}`);
    return handleApiResponse(res);
};


export const updatePermission = async (id: number, data: CreatePermissionData) => {
    console.log('updatePermission payload', id, data);
    const res: ApiResponseType = await api.put(`/permissions/${id}`, data);
    const response = handleApiResponse(res);
    return {
        ...response,
        data: res.data,
    }
}

export const getPermissionNames = async (roleId: number) => {
  const res = await api.get(`/permissions/name-value?roleId=${roleId}`);
  return {
    message: "Permission Names",
    data: res.data,
  };
};