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
        className="max-w-[700px] m-4"
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="uppercase mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Create Role
            </h4>
          </div>
          <div className="px-2 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>Role Name</Label>
                <Input
                  type="text"
                  // value=""
                  placeholder="Enter Role Name"
                  name="name"
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              <div>
                <Label>Role Description</Label>
                <Input
                  type="text"
                  // value=""
                  placeholder="Enter Description"
                  name="description"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={createModal.closeModal}
            >
              Close
            </Button>
            <Button size="sm" onClick={saveData} disabled={loading}>
              {loading ? <LoadingCircle description="Saving..." /> : "Save"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CreateForm;
