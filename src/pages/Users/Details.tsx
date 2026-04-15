import { Modal } from "../../components/ui/modal";
import { ModalHook } from "../../hooks/useModal";
import Button from "../../components/ui/button/Button";

interface FormData {
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


interface ModalProps {
  detailsModal: ModalHook;
  userData: FormData;
}

function Details({ detailsModal, userData }: ModalProps) {

  if (!userData) return null;

  return (
    <>
      <Modal
        isOpen={detailsModal.isOpen}
        onClose={detailsModal.closeModal}
        className="max-w-[750px] m-4"
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-10">
          
          {/* Header Section - Status ကို ဒီမှာပဲ ထားပါမယ် */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div>
              <div className="flex items-center gap-3">
                <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  User Information
                </h4>
                {/* Status Badge moved next to Title */}
                <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  userData.isActive 
                  ? "bg-green-500/10 text-green-600 border border-green-200/50" 
                  : "bg-red-500/10 text-red-600 border border-red-200/50"
                }`}>
                  {userData.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Manage and view complete profile details.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            <DetailItem label="Full Name" value={userData.name} />
            <DetailItem label="Email Address" value={userData.email} />
            <DetailItem label="Role" value={userData.role || "N/A"} isHighlight />
            <DetailItem label="Phone Number" value={userData.phone || "Not provided"} />
            <DetailItem label="Gender" value={userData.gender} className="capitalize" />
            <DetailItem label="Username" value={`@${userData.username}`} />

            {/* Address Section */}
            <div className="md:col-span-2 pt-4 mt-2 border-t border-gray-50 dark:border-gray-800/50">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Residential Address</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-white/[0.03] p-4 rounded-xl">
                {userData.address || "No address provided."}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end mt-10">
            <Button 
              size="md" 
              variant="outline" 
              onClick={detailsModal.closeModal}
              className="px-10 rounded-xl"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
    
  );
}

function DetailItem({ label, value, className = "", isHighlight = false }: { label: string; value: string; className?: string; isHighlight?: boolean }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </span>
      <span className={`text-base font-medium ${isHighlight ? "text-brand-500" : "text-gray-800 dark:text-gray-200"} ${className}`}>
        {value}
      </span>
    </div>
  );
}

export default Details;
