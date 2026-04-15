import { useState, useEffect } from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import DataTable from "@/components/tables/DataTable";
// import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import Filter from "./Filter";
import CreateForm from "./CreateForm";
import EditForm from "./EditForm";
import Details from "./Details";
// import Notification from "@/components/ui/notification/Notification";
import DeleteConfirmModal from "@/pages/common/DeleteConfirmModal";
import { PencilIcon, TrashBinIcon, EyeIcon } from "../../icons";

import {
  getRoles,
  // getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "@/api/roleService";
import Notification from "@/components/ui/notification/Notifiaction";

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

const sortCols = ["name", "description"];

interface queryParamType {
  [key: string]: unknown;
}

interface ApiResult {
  status: "success" | "error" | "warning" | "info";
  message: string;
  data?: unknown;
}

export default function Role() {
  // Modal Form for CRUD
  const createModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();
  const detailsModal = useModal();

  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | number>("");
  const [deleteId, setDeleteId] = useState<string | number>("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [role, setRole] = useState<RoleItem>({
    id: 0,
    name: "",
    userCount: 0,
    permissions: [],
  });

  //Pagination
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPagination, setIsPagination] = useState(true);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Column Dynamic Bind - can be different depend on module fields
  const columns = [
    { 
      key: "name", 
      header: "Role Name", 
      render: (role: RoleItem) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 dark:text-white/90">{role.name}</span>
          <span className="text-xs text-gray-400">{role.userCount} users assigned</span>
        </div>
      )
    },
    {
      key: "permissions",
      header: "Permissions (Preview)",
      render: (role: RoleItem) => (
        <div className="flex flex-wrap gap-1 max-w-[300px]">
          {role.permissions?.slice(0, 3).map((p) => (
            <span key={p.id} className="px-2 py-0.5 text-[10px] bg-blue-50 text-blue-600 border border-blue-100 rounded dark:bg-blue-500/5 dark:border-blue-500/20 dark:text-blue-400">
              {p.name.replace('_', ' ')}
            </span>
          ))}
          {role.permissions?.length > 3 && (
            <span className="text-[10px] text-gray-400">+{role.permissions.length - 3} more</span>
          )}
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (role: RoleItem) => (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => viewDetails(role.id,role)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group">
            <EyeIcon className="size-5 text-gray-400 group-hover:text-blue-500 fill-blue-500" />
          </button>
          <button onClick={() => handleEdit(role.id,role)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group">
            <PencilIcon className="size-5 text-gray-400 group-hover:text-amber-500" />
          </button>
          <button onClick={() => handleDelete(role.id)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group">
            <TrashBinIcon className="size-5 text-gray-400 group-hover:text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  // Query Parameter for Data Fetch
  const [queryParams, setQueryParams] = useState<queryParamType>({
    isPagination: isPagination,
    page: page,
    per_page: 10,
    sort_by: "id",
    sort_order: "desc",
    filters: {},
  });

  // Used Fillter & DataTable
  const handleParamUpdate = (updateParams: queryParamType) => {
    setQueryParams((prev) => ({
      ...prev,
      ...updateParams,
    }));
  };

  useEffect(() => {
    fetchData();
  }, [
    queryParams.page,
    queryParams.per_page,
    queryParams.sort_by,
    queryParams.sort_order,
    JSON.stringify(queryParams.filters),
  ]);

  const fetchData = async () => {
    setLoading(true);
    try{
      const result = await getRoles(queryParams); // call API
      if (result.status === "success") {
        const res = result as {
          status: "success";
          message: string;
          data: {
            data: RoleItem[];
            totalEntries: number;
            totalPages: number;
            page: number;
          };
        };
        setRoles(res?.data?.data);
        setTotalEntries(res.data.totalEntries);
        setTotalPages(res.data.totalPages);
        setPage(res.data.page);
      } else {
        const res = result as { status: "success"; message: string };
        Notification(res?.status, res.status, res.message);
      }
    }finally{
      setLoading(false);
    }
  };

  const viewDetails = async (id: number, role: RoleItem) => {
    // let result: ApiResult = { status: "error", message: "", data: {} };
    // result = await getRoleById(id);
    // if (result.data) {
    //   const roleData = result.data as RoleItem;
      setRole(role);
      detailsModal.openModal();
    // }
  };

  const handleEdit = async (id: number, role: RoleItem) => {
    // let result: ApiResult = { status: "error", message: "", data: {} };
    // result = await getRoleById(id);
    // if (result.data) {
      // const roleData = result.data as RoleItem;
      console.log("Edit Role Data:", role);
      setRole(role);
      editModal.openModal();
    // }
  };

  const saveData = async (data: RoleItem) => {
    let result: ApiResult = { status: "error", message: "" };
    console.log("Saving Role Data:", data);
    if (!data.id) {
      result = await createRole(data);
      createModal.closeModal();
    } else {
      result = await updateRole(role.id, data);
      editModal.closeModal();
    }
    Notification(result.status, result.status, result.message);
    setRole({
      id: 0,
      name: "",
      userCount: 0,
      permissions: [],
    });
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
      const result = await deleteRole(deleteId);

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
        console.log("Button clicked");
        createModal.openModal();
    }

  return (
    <>
      <PageBreadcrumb
        pageTitle="Roles"
        links={[
          { name: "Roles", path: "/roles" },
          { name: "Listing", path: "/roles" },
        ]}
      />
      <div className="flex justify-end mb-5">
        {/* <Button
          size="sm"
          startIcon={<PlusIcon />}
          onClick={createModal.openModal}
        >
          Create Role
        </Button> */}
      </div>
      <Filter onChangeParam={handleParamUpdate} />
      <div className="space-y-6">
        <ComponentCard title="Listing" buttonText="Create Role" handleButtonClick={handleButtonClick}>
          
          <DataTable
            columns={columns}
            data={roles}
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
      <CreateForm createModal={createModal} roleData={role} onSave={saveData} />
      <EditForm editModal={editModal} roleData={role} onSave={saveData} />
      <DeleteConfirmModal
        deleteModal={deleteModal}
        selectedId={selectedId}
        confirmDelete={confirmDelete}
        loading={deleteLoading}
        message="Are you sure this Role delete?"
      />
      <Details detailsModal={detailsModal} roleData={role}/>
    </>
  );
}
