// import { useState, useEffect } from "react";
import { Modal } from "../../components/ui/modal";
import { ModalHook } from "../../hooks/useModal";
// import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";



interface permissionItem {
  id: number;
  name: string;
  feature: string;
}

interface FormData {
  id: number;
  name: string;
  userCount: number;
  permissions: permissionItem[];

}
interface ModalProps {
  detailsModal: ModalHook;
  roleData: FormData;
}

function Details({ detailsModal, roleData }: ModalProps) {
  // const [data, setData] = useState<FormData>({
  //   id: 0,
  //   name: "",
  //   userCount: 0,
  //   permissions: [],
  // });

  // useEffect(() => {
  //   setData(roleData);
  // }, [roleData]);

  const groupedPermissions = roleData.permissions.reduce((acc: Record<string, unknown[]>, p) => {
    if (!acc[p.feature]) acc[p.feature] = [];
    acc[p.feature].push(p);
    return acc;
  }, {});

  if (!roleData || !roleData.permissions) {
    return null;
  }

  return (
    <>


      <Modal isOpen={detailsModal.isOpen} onClose={detailsModal.closeModal} className="max-w-[800px]">
        <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl">

          {/* Header Section - Revised for better layout */}
          <div className="mb-8 border-b pb-6 dark:border-gray-800">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">
                {roleData.name}
              </h2>

              <div className="flex items-center gap-4 mt-2">
                {/* User Count Badge - Now under the title */}
                <div className="flex items-center gap-2 px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                    {roleData.userCount} Users Assigned
                  </span>
                </div>

                <span className="text-sm text-gray-400">|</span>

                <p className="text-sm text-gray-500 font-medium">
                  Authorized permissions for this role
                </p>
              </div>
            </div>
          </div>

          {/* Permissions List Section */}
          <div className="space-y-5 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar">
            {Object.keys(groupedPermissions).length > 0 ? (
              Object.keys(groupedPermissions).map((feature) => (
                <div key={feature} className="group p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05] hover:border-brand-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <div className="p-1 rounded-md bg-white dark:bg-gray-800 shadow-sm">
                        <span className="block w-2 h-2 rounded-full bg-brand-500"></span>
                      </div>
                      {feature}
                    </h5>
                    <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-200/50 dark:bg-gray-800 px-2 py-0.5 rounded">
                      {groupedPermissions[feature].length} Actions
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(groupedPermissions[feature] as permissionItem[]).map((p) => (
                      <span key={p.id} className="px-3 py-1.5 bg-white dark:bg-gray-800 text-[11px] font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-brand-500 hover:text-brand-500 transition-colors cursor-default">
                        {p.name.split('_').join(' ')}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
                <p className="text-gray-400">No permissions found for this role.</p>
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="mt-8 flex justify-end border-t pt-6 dark:border-gray-800">
            <Button
              onClick={detailsModal.closeModal}
              variant="outline"
              className="px-10 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-gray-50 active:scale-95"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Details;
