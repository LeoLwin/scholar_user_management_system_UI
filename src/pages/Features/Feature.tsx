import { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import DataTable from "@/components/tables/DataTable";
import { useModal } from "@/hooks/useModal";
import FeatureFilter from "./Filter";
import CreateForm from "./CreateForm";
import EditFeatureForm from "./EditForm";
import FeatureDetails from "./Details";
import DeleteConfirmModal from "@/pages/common/DeleteConfirmModal";
import { PencilIcon, TrashBinIcon, EyeIcon } from "../../icons";
import {
  getFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
} from "@/api/featureService";
import Notification from "@/components/ui/notification/Notifiaction";

interface permissionItem {
  id: number;
  name: string;
}
interface FeatureItem {
  id: number;
  name: string;
  permissions: permissionItem[];
  userCount: number;


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

export default function Feature() {
  const createModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();
  const detailsModal = useModal();

  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | number>("");
  const [deleteId, setDeleteId] = useState<string | number>("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [feature, setFeature] = useState<FeatureItem>({
    id: 0,
    name: "",
    permissions: [],
    userCount: 0,
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
      header: "Feature Name",
      render: (feature: FeatureItem) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 dark:text-white/90">{feature.name}</span>
          {feature.userCount !== undefined && (
            <span className="text-xs text-gray-400">{feature.userCount} users assigned</span>
          )}
        </div>
      ),
    },
    {
      key: "permissions",
      header: "Permissions (Preview)",
      render: (feature: FeatureItem) => (
        <div className="flex flex-wrap gap-1 max-w-[300px]">
          {feature.permissions?.slice(0, 3).map((p) => (
            <span key={p.id} className="px-2 py-0.5 text-[10px] bg-blue-50 text-blue-600 border border-blue-100 rounded dark:bg-blue-500/5 dark:border-blue-500/20 dark:text-blue-400">
              {p.name.replace('_', ' ')}
            </span>
          ))}
          {feature.permissions?.length > 3 && (
            <span className="text-[10px] text-gray-400">+{feature.permissions.length - 3} more</span>
          )}
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (feature: FeatureItem) => (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => viewDetails(feature.id, feature)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group">
            <EyeIcon className="size-5 text-gray-400 group-hover:text-blue-500 fill-blue-500" />
          </button>
          <button onClick={() => handleEdit(feature.id, feature)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group">
            <PencilIcon className="size-5 text-gray-400 group-hover:text-amber-500" />
          </button>
          <button onClick={() => handleDelete(feature.id)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group">
            <TrashBinIcon className="size-5 text-gray-400 group-hover:text-red-500" />
          </button>
        </div>
      ),
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
    try {
      const result = await getFeatures(queryParams);
      if (result.status === "success") {
        const res = result as {
          status: "success";
          message: string;
          data: {
            data: FeatureItem[];
            totalEntries: number;
            totalPages: number;
            page: number;
          };
        };
        setFeatures(res?.data?.data ?? []);
        setTotalEntries(res.data.totalEntries);
        setTotalPages(res.data.totalPages);
        setPage(res.data.page);
      } else {
        setFeatures([]);
        const res = result as { status: "success"; message: string };
        Notification(res?.status, res.status, res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (id: number, feature: FeatureItem) => {
    console.log("Viewing details for Feature ID:", id);
    setFeature(feature);
    detailsModal.openModal();
  };

  const handleEdit = async (id: number, feature: FeatureItem) => {
    console.log("Editing Feature ID:", id);
    setFeature(feature);
    editModal.openModal();
  };

  const saveData = async (data: FeatureItem) => {
    let result: ApiResult = { status: "error", message: "" };
    if (!data.id) {
      result = await createFeature(data);
      createModal.closeModal();
    } else {
      result = await updateFeature(feature.id, data);
      editModal.closeModal();
    }
    Notification(result.status, result.status, result.message);
    setFeature({
      id: 0,
      name: "",
      permissions: [],
      userCount: 0,
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
      const result = await deleteFeature(deleteId);
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
    createModal.openModal();
  };


  useEffect(() => {
    setIsPagination(queryParams.isPagination as boolean);
  }, []);
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
        <ComponentCard title="Listing" buttonText="Create Feature" handleButtonClick={handleButtonClick}>
          <DataTable
            columns={columns}
            data={features}
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
      <CreateForm createModal={createModal} roleData={feature} onSave={saveData} />
      <EditFeatureForm editModal={editModal} roleData={feature} onSave={saveData} />
      <DeleteConfirmModal
        deleteModal={deleteModal}
        selectedId={selectedId}
        confirmDelete={confirmDelete}
        loading={deleteLoading}
        message="Are you sure this Feature delete?"
      />
      <FeatureDetails detailsModal={detailsModal} roleData={feature} />
    </>
  );
}
