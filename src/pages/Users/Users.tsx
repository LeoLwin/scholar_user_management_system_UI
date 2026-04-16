import { createUser, getUserById, getUsers, updateUser } from '@/api/userService'
import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import PageMeta from '@/components/common/PageMeta'
// import BasicTableOne from '@/components/tables/BasicTables/BasicTableOne'
import DataTable from '@/components/tables/DataTable'
import Notification from '@/components/ui/notification/Notifiaction'
import { useModal } from '@/hooks/useModal'
import { EyeIcon, PencilIcon } from '@/icons'
import { useCallback, useEffect, useState } from 'react'
import CreateForm from './CreateForm'
import EditForm from './EditForm'
import Details from './Details'

interface RoleItem {
    id: string | number;
    name: string;
}
// interface FormData {
//     id: number;
//     name: string;
//     username: string;
//     email: string;
//     // password: string;
//     roleId: number;
//     // role: RoleItem;
//     phone: string;
//     gender: string;
//     address: string;
//     isActive: boolean;
// }

interface UserItem {
    id: number;
    name: string;
    username: string;
    email: string;
    // password: string;
    roleId: number;
    role: RoleItem;
    phone: string;
    gender: string;
    address: string;
    isActive: boolean;
}

interface queryParamType {
    [key: string]: unknown;
}

interface ApiResult {
    status: "success" | "error" | "warning" | "info";
    message: string;
    data?: unknown;
}

interface UserFormType {
    id: string | number;
    name: string;
    email: string;
    // password: string;
    roleId: number;
    phone: string;
    gender: string;
    address: string;
    status?: string;
}

interface UserDetailsType {
    id: number;
    name: string;
    username: string;
    email: string;
    // password: string;
    roleId: number;
    role: string;
    phone: string;
    gender: string;
    address: string;
    isActive: boolean;
}
const sortCols = ["name", "roles.name"];

const Users = () => {

    const [users, setUsers] = useState<UserItem[]>([]);
    
    // const [showAdminsOnly, setShowAdminsOnly] = useState(false);
    const [showAdminsOnly]= useState(false);
    const [user, setUser] = useState<UserItem>({
        id: 0,
        name: "",
        username: "",
        email: "",
        roleId: 0,
        role: { id: 0, name: "" },
        phone: "",
        gender: "male",
        address: "",
        isActive: true,
    });
    const [userDetails, setUserDetails] = useState<UserDetailsType>({
        id: 0,
        name: "",
        username: "",
        email: "",
        roleId: 0,
        role: "",
        phone: "",
        gender: "male",
        address: "",
        isActive: true,
    });

    //Pagination
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const [isPagination, setIsPagination] = useState(true);
    const [isPagination] = useState(true);
    const [totalEntries, setTotalEntries] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [queryParams, setQueryParams] = useState<queryParamType>({
        isPagination: isPagination,
        page: page,
        per_page: 10,
        sort_by: 'created_at', // id
        sort_order: "desc",
        filters: {},
    });

    const createModal = useModal();
    const editModal = useModal();
    const detailsModal = useModal();




    const columns = [
        // { key: "id", header: "ID", render: (user: UserItem) => user.id },
        { key: "name", header: "User Name", render: (user: UserItem) => user.name },
        { key: "email", header: "Email", render: (user: UserItem) => user.email },
        {
            key: "roles.name",
            header: "Role Name",
            render: (user: UserItem) => user.role?.name,
        },
        {
            key: "phoneNo",
            header: "Phone No",
            render: (user: UserItem) => user.phone,
        },
        {
            key: "gender",
            header: "Gender",
            render: (user: UserItem) => user.gender,
        },
        {
            key: "address",
            header: "Address",
            render: (user: UserItem) => user.address,
        },
        {
            key: "status",
            header: "Status",
            render: (user: UserItem) => user.isActive ? (<span className="text-green-500">Active</span>) : (<span className="text-red-500">Inactive</span>),
        },
        {
            key: "action",
            header: "Action",
            render: (user: UserItem) => (
                <div className="col-span-1 flex items-center gap-2">
                    <button
                        className="btn text-blue-500"
                        onClick={() => viewDetails(user.id)}
                    >
                        <EyeIcon className="fill-blue-500 size-5" />
                    </button>
                    <button
                        className="btn text-blue-500"
                        onClick={() => handleEdit(user.id)}
                    >
                        <PencilIcon className="size-5" />
                    </button>
                    {/* {user.role?.name === "admin" && (
            <button
              className="btn text-red-500"
              onClick={() => handleDelete(user.id)}
            >
              <TrashBinIcon className="size-5" />
            </button>
          )} */}
                </div>
            ),
        },
    ];

    const viewDetails = async (id: string | number) => {
        const result: ApiResult = await getUserById(id);
        if (
            typeof result === 'object' &&
            result !== null &&
            'status' in result &&
            'data' in result
        ) {

            const res = result as { status: string; data: UserDetailsType };

            if (res.status === "success") {
                // setUser(res.data);
                setUserDetails(res.data);
                detailsModal.openModal();
            }
        }
    };

    const handleEdit = async (id: number) => {
        if (!id) return;

        const result: ApiResult = await getUserById(id);
        if (
            typeof result === 'object' &&
            result !== null &&
            'status' in result &&
            'data' in result
        ) {

            const res = result as { status: string; data: UserItem };

            if (res.status === "success") {
                setUser(res.data);
                editModal.openModal();
            }
        }
    };

    const handleParamUpdate = (updateParams: queryParamType) => {
        setQueryParams((prev) => ({
            ...prev,
            ...updateParams,
        }));
    };

    const handleButtonClick = () => {
        createModal.openModal();
    }

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getUsers(queryParams); // call API

            if (result.status === "success") {
                const res = result as {
                    status: "success";
                    message: string;
                    data: {
                        data: UserItem[];
                        totalEntries: number;
                        totalPages: number;
                        page: number;
                    };
                };
                setUsers(res?.data?.data || []);
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
    }, [queryParams]); // Include queryParams in the dependency array

    const saveData = async (data: UserFormType) => {
        let result: ApiResult = { status: "error", message: "" };
        if (data.id == "") {
            result = await createUser(data);
            // message = result.message;
            createModal.closeModal();
        } else {
            result = await updateUser(data.id, data);
            // message = result.message;
            editModal.closeModal();
        }
        Notification(result.status, result.status, result.message);
        setUser({
            id: 0,
            name: "",
            username: "",
            email: "",
            roleId: 0,
            role: { id: 0, name: "" },
            phone: "",
            gender: "male",
            address: "",
            isActive: true,
        });
        fetchData();
    };


    useEffect(() => {
        fetchData();
    }, [fetchData]);
    return (
        <>
            <PageMeta
                title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Users" links={[
          { name: "user", path: "/users" },
          { name: "Listing", path: "/users" },
        ]} />
            <div className="space-y-6">
                <ComponentCard title="Basic Table 1" handleButtonClick={handleButtonClick} buttonText="Create User">
                    <DataTable
                        columns={columns}
                        data={
                            showAdminsOnly
                                ? users.filter((u) => u.role?.name === "admin")
                                : users
                        }
                        sortCols={sortCols}
                        isPagination={isPagination}
                        onChangeParam={handleParamUpdate}
                        totalEntries={
                            showAdminsOnly
                                ? users.filter((u) => u.role?.name === "admin").length
                                : totalEntries
                        }
                        totalPages={totalPages}
                        page={page}
                        loading={loading}
                    />
                </ComponentCard>
            </div>
            <CreateForm createModal={createModal} onSave={saveData} />
            <EditForm editModal={editModal} userData={user} onSave={saveData} />
            <Details detailsModal={detailsModal} userData={userDetails} />

        </>
    )
}

export default Users