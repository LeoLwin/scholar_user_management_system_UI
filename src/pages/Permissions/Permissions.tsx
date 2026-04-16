import { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import DataTable from "@/components/tables/DataTable";
import { useModal } from "@/hooks/useModal";
import FeatureFilter from "./Filter";
// import CreateFeatureForm from "./CreateForm";
import EditForm from "./EditForm";
import Details from "./Details";
import DeleteConfirmModal from "@/pages/common/DeleteConfirmModal";
import { PencilIcon, TrashBinIcon, EyeIcon, LockIcon, GridIcon, GroupIcon } from "../../icons";
import {
  getPermisssions,
  // createPermissions,
  // updatePermission,
  deletePermission,
  createRolePermissions,
  // getPermissionById,
  // createRolePermissions,
  // detailsRolesPermissions,
  // deletePermission
} from "@/api/permissionService";
import Notification from "@/components/ui/notification/Notifiaction";
// import CreateForm from "./CreateForm";
import AssignRoleForm from "./AssignRoleForm";


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


const sortCols = ["name"];

interface queryParamType {
  [key: string]: unknown;
}

interface ApiResult {
  status: "success" | "error" | "warning" | "info";
  message: string;
  data?: unknown;
}

export default function Permissions() {
  const createModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();
  const detailsModal = useModal();
  const assignRolesModal = useModal();

  const [permissions, setPermissions] = useState<PermissionsItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | number>("");
  const [deleteId, setDeleteId] = useState<string | number>("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [permission, setPermission] = useState<PermissionsItem>(
    {
      id: 0,
      name: "",
      featureId: 0,
      feature: "",
      roles: [],
    });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPagination, setIsPagination] = useState(true);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      key: "name",
      header: "Permission Name",
      render: (item: unknown) => {
        const data = item as { name: string };
        return (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <LockIcon className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-medium text-gray-800 dark:text-white/90">
              {data.name?.replace(/_/g, ' ')}
            </span>
          </div>
        );
      },
    },
    {
      key: "feature",
      header: "Feature Group",
      render: (item: unknown) => {
        const data = item as { feature: string };
        return (
          <div className="flex items-center gap-2">
            <GridIcon className="size-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {data.feature}
            </span>
          </div>
        );
      },
    },
    {
      key: "roles",
      header: "Assigned Roles",
      render: (item: unknown) => {
        const data = item as { roles: { id: number; name: string }[] };
        const count = data.roles?.length || 0;
        return (
          <div className="flex items-center gap-1.5">
            <GroupIcon className="size-4 text-gray-400" />
            <span className={`text-sm ${count > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
              {count} {count > 1 ? 'Roles' : 'Role'}
            </span>

          </div>
        );
      },
    },
    {
      key: "action",
      header: "Actions",
      render: (item: unknown) => {
        const data = item as PermissionsItem;
        return (
          <div className="flex items-center justify-end gap-1">


            {/* View Detail Button */}
            <button
              onClick={() => viewDetails(data.id, data)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group"
              title="View Details"
            >
              <EyeIcon className="size-5 text-gray-400 group-hover:text-blue-500 fill-blue-500" />
            </button>

            {/* Edit Button */}
            <button
              onClick={() => handleEdit(data.id, data)}
              className="p-2 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-full transition-colors group"
              title="Edit Permission"
            >
              <PencilIcon className="size-4.5 text-gray-400 group-hover:text-amber-500" />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(data.id)}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors group"
              title="Delete Permission"
            >
              <TrashBinIcon className="size-4.5 text-gray-400 group-hover:text-red-500" />
            </button>
          </div>
        );
      },
    },
  ];
  const [queryParams, setQueryParams] = useState<queryParamType>({
    isPagination: isPagination,
    page: page,
    per_page: 10,
    sort_by: "id",
    sort_order: "desc",
    filters: {},
  });

  const handleParamUpdate = (updateParams: queryParamType) => {
    console.log("Updating query params with:", updateParams);
    setQueryParams((prev) => ({
      ...prev,
      ...updateParams,
    }));
  };

  const handleAssignRoles = () => {
    // console.log("Assign roles for permission ID:", id, permission);
    // setPermission(permission);
    assignRolesModal.openModal();
    // Notification("info", "info", `Assign roles for permission: ${permission.name}`);
  }

  useEffect(() => {
    console.log("Query params changed:", queryParams);
    fetchData();
  }, [
    queryParams.page,
    queryParams.per_page,
    queryParams.sort_by,
    queryParams.sort_order,
    JSON.stringify(queryParams.filters),
  ]);

  const fetchData = async () => {
    console.log("Fetching data with query params:", queryParams);
    setLoading(true);
    try {
      const result = await getPermisssions(queryParams);
      // console.log("API Result:", result);
      if (result.status === "success") {
        const res = result as {
          status: "success";
          message: string;
          data: {
            data: PermissionsItem[];
            totalEntries: number;
            totalPages: number;
            page: number;
          };
        };
        setPermissions(res?.data?.data);
        setTotalEntries(res.data.totalEntries);
        setTotalPages(res.data.totalPages);
        setPage(res.data.page);
      } else {
        const res = result as { status: "success"; message: string };
        Notification(res?.status, res.status, res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (id: number, permission: PermissionsItem) => {
    setPermission(permission);
    detailsModal.openModal();
  };

  const handleEdit = async (id: number, permission: PermissionsItem) => {
    setPermission(permission);
    editModal.openModal();
  };

  const saveData = async (data: PermissionsItem) => {
    const result: ApiResult = { status: "error", message: "" };
    if (!data.id) {
      // result = await createPermissions(data);
      createModal.closeModal();
    } else {
      // result = await updatePermission(feature.id, data);
      editModal.closeModal();
    }
    Notification(result.status, result.status, result.message);
    setPermission({
      id: 0,
      name: "",
      featureId: 0,
      feature: "",
      roles: [],
    });
    fetchData();
  };

  const onAssignRolesSave = async (data: { roleId: number; permissionIds: number[] }) => {
    let result: ApiResult = { status: "error", message: "" };

    result = await createRolePermissions(data);

    Notification(result.status, result.status, result.message);

    assignRolesModal.closeModal();
    fetchData();

    

  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    deleteModal.openModal();
  };

  const confirmDelete = (deleteId: string | number) => {
    setDeleteId(deleteId);
  };

  useEffect(() => {
    doDelete();
  }, [deleteId]);

  const doDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const result = await deletePermission(Number(deleteId));
      Notification(result.status, result.status, result.message);
      fetchData();
    } finally {
      setDeleteLoading(false);
      deleteModal.closeModal();
      setSelectedId("");
      setDeleteId("");
    }
  };

  const handleButtonClick = () => {
    console.log("Create button clicked");
    createModal.openModal();
  };


  return (
    <>
      <PageBreadcrumb
        pageTitle="Features"
        links={[
          { name: "Features", path: "/features" },
          { name: "Listing", path: "/features" },
        ]}
      />
      <div className="flex justify-end mb-5"></div>
      <FeatureFilter onChangeParam={handleParamUpdate} />
      <div className="space-y-6">
        <ComponentCard title="Listing" buttonText="Create Permission" customButtonText="Assign Roles" customButtonClick={handleAssignRoles} handleButtonClick={handleButtonClick}>
          <DataTable
            columns={columns}
            data={permissions}
            sortCols={sortCols}
            isPagination={isPagination}
            onChangeParam={handleParamUpdate}
            totalEntries={totalEntries}
            totalPages={totalPages}
            page={page}
            loading={loading}
          />
        </ComponentCard>
      </div>
      {/* <CreateForm createModal={createModal} onSave={saveData} />
      
      <EditForm editModal={editModal} featureData={feature} onSave={saveData} /> */}
      <AssignRoleForm createModal={assignRolesModal} onSave={onAssignRolesSave} />
      {/* <AssignRoleForm createModal={assignRolesModal} /> */}

      <DeleteConfirmModal
        deleteModal={deleteModal}
        selectedId={selectedId}
        confirmDelete={confirmDelete}
        loading={deleteLoading}
        message="Are you sure this Feature delete?"
      />
      <Details detailsModal={detailsModal} permissionData={permission} />
    </>
  );
}
