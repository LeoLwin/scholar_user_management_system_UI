import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { ModalHook } from "@/hooks/useModal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import LoadingCircle from "@/components/common/LoadingCircle";



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

interface FormErrors {
  name?: string;
}

interface ModalProps {
  createModal: ModalHook;
  roleData: FormData;
  onSave: (data: FormData) => Promise<void>;
}

function CreateForm({ createModal, roleData, onSave }: ModalProps) {
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    name: "",
    userCount: 0,
    permissions: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setFormData(roleData);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input changed:", e.target.name, e.target.value);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveData = async () => {
    const validationErrors = await validateForm();

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        await onSave(formData);
        setErrors({});
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = async () => {
    const errors: FormErrors = {};
    if (!formData.name) errors.name = "Role Name is required";
    return errors;
  };

  return (
    <>
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.closeModal}
        className="max-w-[500px] m-4" 
      >
        <div className="relative w-full p-6 overflow-hidden bg-white rounded-2xl dark:bg-gray-900 lg:p-10">
          {/* Header Section */}
          <div className="mb-8">
            <h4 className="text-xl font-bold tracking-tight text-gray-900 uppercase dark:text-white">
              Create New Role
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Assign a unique name to define this user group.
            </p>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="role-name" className="text-sm font-medium">
                Role Name
              </Label>
              <div className="relative">
                <Input
                  id="role-name"
                  type="text"
                  placeholder="e.g. Sales Manager, Content Editor"
                  name="name"
                  onChange={handleInputChange}
                  className={`h-11 px-4 transition-all duration-200 border-gray-200 focus:ring-2 focus:ring-primary-500/20 ${errors.name ? 'border-red-500 focus:ring-red-500/20' : ''
                    }`}
                />
                {/* Optional: Add a small icon inside input for better look */}
              </div>

              {errors.name && (
                <div className="flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
                  <span className="text-xs font-medium text-red-500">
                    {errors.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-10">
            <Button
              size="md"
              variant="outline"
              onClick={createModal.closeModal}
              className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              size="md"
              onClick={saveData}
              disabled={loading}
              className="px-6 font-semibold shadow-sm shadow-primary-500/20"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                   <LoadingCircle description="Creating ..." /> 
                </div>
              ) : (
                "Create Role"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CreateForm;
