import { Modal } from "@/components/ui/modal";
import { ModalHook } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { LockIcon, GridIcon, GroupIcon, InfoIcon } from "@/icons";
// import { LockIcon, GridIcon, GroupIcon, InfoIcon } from "@/components/icons"; 


interface RoleItem {
  id: number;
  name: string;
}

interface FormData {
  id: number;
  name: string;
  featureId: number;
  feature: string;
  roles: RoleItem[];
}

interface ModalProps {
  detailsModal: ModalHook;
  permissionData: FormData;
}

function Details({ detailsModal, permissionData }: ModalProps) {
  if (!permissionData) return null;

  return (
    <Modal isOpen={detailsModal.isOpen} onClose={detailsModal.closeModal} className="max-w-[600px]">
      <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl">

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 border-b pb-6 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl">
              <LockIcon className="size-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
                  {permissionData.name.replace(/_/g, ' ')}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-green-100 text-green-700 rounded-md dark:bg-green-500/10 dark:text-green-400">
                  Active
                </span>
              </div>
              <span className="text-sm text-gray-400 font-mono">Permission ID: #{permissionData.id}</span>
            </div>
          </div>

         
        </div>

        {/* Feature Info Section */}
        <div className="mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border dark:border-gray-800">
          <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
            <GridIcon className="size-4" />
            <span className="text-xs uppercase font-bold tracking-wider">Related Feature</span>
          </div>
          <div className="flex justify-between items-end">
            <p className="text-lg text-gray-800 dark:text-gray-200 font-semibold">
              {permissionData.feature}
            </p>
            <span className="text-xs text-gray-400 bg-gray-200/50 dark:bg-gray-800 px-2 py-1 rounded-md">
              ID: {permissionData.featureId}
            </span>
          </div>
        </div>

        {/* Assigned Roles Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-gray-500 dark:text-gray-400">
            <GroupIcon className="size-4" />
            <span className="text-xs uppercase font-bold tracking-wider">
              Assigned Roles ({permissionData.roles?.length || 0})
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {permissionData.roles && permissionData.roles.length > 0 ? (
              permissionData.roles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm"
                >
                  <div className="size-1.5 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {role.name}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-sm text-gray-400 italic">No roles assigned to this permission.</span>
            )}
          </div>
        </div>

        {/* Description Note */}
        <div className="mb-8 p-4 bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 rounded-2xl">
          <div className="flex gap-3">
            <InfoIcon className="size-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-200/80 leading-relaxed">
              This rule allows authorized roles to <strong>{permissionData.name.toLowerCase().replace(/_/g, ' ')}</strong> data within the system's {permissionData.feature} module.
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex justify-end">
          <Button
            onClick={detailsModal.closeModal}
            className="px-8 py-2.5 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-xl font-semibold hover:opacity-90 transition-all"
          >
            Done
          </Button>
        </div>

      </div>
    </Modal>
  );
}

export default Details;