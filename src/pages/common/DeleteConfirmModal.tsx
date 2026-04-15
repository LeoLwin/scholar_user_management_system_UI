import { Modal } from "../../components/ui/modal";
import { ModalHook } from "../../hooks/useModal";
import Button from "../../components/ui/button/Button";
import LoadingCircle from "@/components/common/LoadingCircle";

interface ModalProps {
  deleteModal: ModalHook;
  selectedId: string | number;
  message: string;
  confirmDelete: (deleteId: string | number) => void;
  loading?: boolean;
}

function DeleteConfirmModal({
  deleteModal,
  selectedId,
  message,
  confirmDelete,
  loading = false,
}: ModalProps) {

  const handleConfirm = () => {
    if (selectedId) {
      confirmDelete(selectedId);
    }
  };

  return (
    <>
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        className="max-w-[700px] m-4"
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {message}
            </h4>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={deleteModal.closeModal}
            >
              Close
            </Button>
            <Button
              // onClick={() => setDeleteId(selectedId)}
              onClick={handleConfirm}
              disabled={loading}
              size="sm"
            >
              {loading ? <LoadingCircle description="Deleting..." /> : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DeleteConfirmModal;
