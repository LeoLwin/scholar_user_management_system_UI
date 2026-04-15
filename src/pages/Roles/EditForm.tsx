import { useState, useEffect, useMemo } from "react";
import { Modal } from "../../components/ui/modal";
import { ModalHook } from "../../hooks/useModal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
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
  editModal: ModalHook;
  roleData: FormData;
  onSave: (data: FormData) => Promise<void>;
}

function EditForm({ editModal, roleData, onSave }: ModalProps) {
  const [formData, setFormData] = useState<FormData>(roleData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    setFormData(roleData);
  }, [roleData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const groupedPermissions = useMemo(() => {
    return formData.permissions.reduce((acc: any, p) => {
      if (!acc[p.feature]) acc[p.feature] = [];
      acc[p.feature].push(p);
      return acc;
    }, {});
  }, [formData.permissions]);




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
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        className="max-w-[700px] m-4"
      >
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          {/* Header */}
          <div className="px-2 pr-14 mb-6">
            <h4 className="uppercase mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Role
            </h4>
            <p className="text-sm text-gray-500">Update role information and permissions.</p>
          </div>

          {/* Scrollable Content Area - CreateForm နဲ့ အမြင့်တူအောင် ညှိထားတဲ့နေရာ */}
          <div className="px-2 overflow-y-auto custom-scrollbar max-h-[300px]">
            {roleData && (
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {/* Role Name Input */}
                <div>
                  <Label>Role Name</Label>
                  <Input
                    type="text"
                    value={formData.name}
                    placeholder="Enter Role Name"
                    name="name"
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* User Count (Read Only) */}
                <div>
                  <Label>Users Assigned</Label>
                  <div className="mt-1 flex items-center h-[46px] px-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.1] rounded-lg text-gray-500">
                    <span className="text-sm font-medium">{formData.userCount} Users</span>
                  </div>
                </div>

                {/* Permissions Section (Full Width) */}
                <div className="lg:col-span-2 mt-2">
                  <Label className="mb-3 block">Permissions List</Label>
                  <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                    {formData.permissions?.map((p) => (
                      <span
                        key={p.id}
                        className="px-3 py-1 bg-white dark:bg-gray-800 text-[11px] font-semibold text-gray-500 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm"
                      >
                        {p.name.replace('_', ' ')}
                      </span>
                    ))}
                    {(!formData.permissions || formData.permissions.length === 0) && (
                      <span className="text-sm text-gray-400">No permissions assigned.</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center gap-3 px-2 mt-8 lg:justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={editModal.closeModal}
              className="px-6"
            >
              Close
            </Button>
            <Button size="sm" onClick={saveData} disabled={loading} className="px-8">
              {loading ? <LoadingCircle description="Saving..." /> : "Update Role"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default EditForm;
