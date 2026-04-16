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
}

interface FormData {
  id: number;
  name: string;
  permissions: permissionItem[];
  userCount?: number;
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
    permissions: [],
    userCount: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setFormData(roleData);
  }, [roleData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = async () => {
    const errors: FormErrors = {};
    if (!formData.name) errors.name = "Name is required";
    return errors;
  };

  const saveData = async () => {
    const validationErrors = await validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        await onSave(formData);
        setFormData({ id: 0, name: "", permissions: [], userCount: 0 });
        setErrors({});
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <Modal isOpen={createModal.isOpen} onClose={createModal.closeModal} className="max-w-[500px] w-full m-4">
      <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl">
        <h2 className="text-xl font-bold mb-4">Create Feature</h2>
        <div className="mb-4">
          <Label htmlFor="name">Feature Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter feature name"
            error={!!errors.name}
          />
          {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
        </div>
        <div className="flex justify-end">
          <Button onClick={saveData} disabled={loading}>
           {loading ? (
                <div className="flex items-center gap-2">
                   <LoadingCircle description="Creating ..." /> 
                </div>
              ) : (
                "Create Feature"
              )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default CreateForm;
