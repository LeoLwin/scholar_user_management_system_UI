import {  useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ModalHook } from "@/hooks/useModal";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import LoadingCircle from "@/components/common/LoadingCircle";
import { getPermissionNames } from "@/api/permissionService";
import CustomSelect from "@/components/form/switch/CustomSelect";
import { getRoleNames } from "@/api/roleService";

interface FormData {
  roleId: number;
  permissionIds: number[];
}

// Error တွေကို စာသားနဲ့ပြဖို့ string type ပြောင်းထားပါတယ်
interface FormErrors {
  roleId?: string;
  permissionIds?: string;
}

interface nameValuePair {
  value: number;
  label: string;
}

interface ModalProps {
  createModal: ModalHook;
  onSave: (data: FormData) => Promise<void>;
}

function AssignRoleForm({ createModal, onSave }: ModalProps) {
  const [formData, setFormData] = useState<FormData>({
    roleId: 0,
    permissionIds: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [permissionOptions, setPermissionOptions] = useState<nameValuePair[]>([]);
  const [rolesOptions, setRolesOptions] = useState<nameValuePair[]>([]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.roleId) newErrors.roleId = "Role is required";
    if (!formData.permissionIds.length) newErrors.permissionIds = "At least one permission is required";
    return newErrors;
  };

  const saveData = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        await onSave(formData);
        setFormData({ roleId: 0, permissionIds: [] });
        setErrors({});
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    if (formData.roleId) {
      setFormData((prev) => ({ ...prev, permissionIds: [] }));
      const fetchPermissions = async () => {
        const res = await getPermissionNames(formData.roleId);
        const pOptions = res.data.map((item: { name: string; value: number }) => ({
          label: item.name,
          value: item.value,
        }));
        setPermissionOptions(pOptions);
      }
      fetchPermissions();
    }
  }, [formData.roleId]);

  useEffect(() => {
    if (createModal.isOpen) {
      const fetchData = async () => {
        try {
         

          const rolesRes = await getRoleNames();
          const rOptions = rolesRes.data.map((item: { label: string; value: number }) => ({
            label: item.label,
            value: item.value,
          }));
          setRolesOptions(rOptions);
        } catch (error) {
          console.error("Error fetching assignment data:", error);
        }
      };
      fetchData();
    }
  }, [createModal.isOpen]);

  useEffect(() => { console.log("Form Data:", formData); }, [formData]);

  return (
    <Modal
      isOpen={createModal.isOpen}
      onClose={createModal.closeModal}
      className="max-w-[550px] m-4 overflow-visible"
    >
      <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Assign Role Permissions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Select a role and assign multiple permissions to it.</p>
        </div>

        {/* Role Select Section */}
        <div className="mb-6">
          <Label className="mb-2 block font-semibold">Target Role</Label>
          <CustomSelect
            options={rolesOptions}
            placeholder="--- Choose Role ---"
            value={rolesOptions.find(option => option.value === formData.roleId) || null}
            onChange={(v: unknown) => {
              const selectedOption = v as nameValuePair;
              setFormData({ ...formData, roleId: selectedOption?.value || 0 });
              if (errors.roleId) setErrors(prev => ({ ...prev, roleId: "" }));
            }}
          />
          {errors.roleId && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.roleId}</p>}
        </div>

        <div className="mb-8">
          <Label className="mb-2 block font-semibold">Permissions List</Label>
          <CustomSelect
            isMulti={true}
            options={permissionOptions}
            placeholder="--- Select Multiple Permissions ---"
            value={permissionOptions.filter(option => formData.permissionIds.includes(option.value))}
            onChange={(v: unknown) => {
              const selectedOptions = v as nameValuePair[];
              const ids = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
              setFormData({ ...formData, permissionIds: ids });
              if (errors.permissionIds) setErrors(prev => ({ ...prev, permissionIds: "" }));
            }}
          />
          {errors.permissionIds && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.permissionIds}</p>}
          <p className="mt-2 text-[10px] text-gray-400 italic">You can select one or more permissions from the list.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
          <button
            onClick={createModal.closeModal}
            className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <Button
            onClick={saveData}
            disabled={loading}
            className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/20"
          >
            {loading ? <LoadingCircle description="Processing..." /> : "Save Assignment"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AssignRoleForm;