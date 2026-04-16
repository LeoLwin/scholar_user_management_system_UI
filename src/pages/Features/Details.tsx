import { Modal } from "@/components/ui/modal";
import { ModalHook } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";

interface permissionItem {
  id: number;
  name: string;
}

interface FormData {
  id: number;
  name: string;
  permissions: permissionItem[];
  userCount?: number;
}

interface ModalProps {
  detailsModal: ModalHook;
  roleData: FormData;
}

function FeatureDetails({ detailsModal, roleData }: ModalProps) {
  if (!roleData || !roleData.permissions) {
    return null;
  }

  return (
    <Modal isOpen={detailsModal.isOpen} onClose={detailsModal.closeModal} className="max-w-[600px] w-full m-4">
      <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl">
        <div className="mb-8 border-b pb-6 dark:border-gray-800">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">
              {roleData.name}
            </h2>
            <span className="text-gray-400">Feature ID: {roleData.id}</span>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Permissions</h3>
          <div className="flex flex-wrap gap-2">
            {roleData.permissions.map((p) => (
              <span key={p.id} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded dark:bg-blue-500/5 dark:border-blue-500/20 dark:text-blue-400">
                {p.name}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={detailsModal.closeModal}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}

export default FeatureDetails;
