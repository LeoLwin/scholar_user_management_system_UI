import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ModalHook } from "@/hooks/useModal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import LoadingCircle from "@/components/common/LoadingCircle";
import CustomSelect from "@/components/form/switch/CustomSelect";
import { getFeatureNames } from "@/api/featureService";
import { getRoleNames } from "@/api/roleService";

interface FormData {
  id: number;
  name: string;
  featureId: number;
  roleIds: number[];
}

interface FormErrors {
  name?: string;
  featureId?: string;
}

interface nameValuePair {
  value: number;
  label: string;
}

// InitialData အတွက် interface သတ်မှတ်ပေးခြင်း (ဒါဆိုရင် unknown သုံးစရာတောင်မလိုတော့ပါဘူး)
// interface InitialPermissionData {
//   id: number;
//   name: string;
//   featureId: number;
//   roles: { id: number; name: string }[];
// }

interface EditModalProps {
  editModal: ModalHook;
  initialData: unknown; // user တောင်းဆိုချက်အရ unknown သုံးထားပါတယ်
  onUpdate: (data: FormData) => Promise<void>;
}

function EditForm({ editModal, initialData, onUpdate }: EditModalProps) {
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    name: "",
    featureId: 0,
    roleIds: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [featureOptions, setFeatureOptions] = useState<nameValuePair[]>([]);
  const [roleOptions, setRoleOptions] = useState<nameValuePair[]>([]);

  useEffect(() => {
    if (editModal.isOpen && initialData) {
      const data = initialData as { id: number; name: string; featureId: number; roleIds: number[] };
      setFormData({
        id: data.id,
        name: data.name,
        featureId: data.featureId,
        roleIds: Array.isArray(data.roleIds) ? data.roleIds.map(Number) : [],
      });
      setErrors({});
    }
  }, [editModal.isOpen, initialData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuresRes, rolesRes] = await Promise.all([
          getFeatureNames(),
          getRoleNames()
        ]);

        const fOptions = (featuresRes.data as { name: string; value: number }[]).map((f) => ({
          label: f.name,
          value: f.value
        }));

        let rOptions = (rolesRes.data as { label: string; value: number }[]).map((r) => ({
          label: r.label,
          value: r.value
        }));

        const hasSuperAdmin = rOptions.some(opt => Number(opt.value) === 1);

        if (!hasSuperAdmin) {
          rOptions = [
            { label: "Super Admin", value: 1 }, // Manual static option
            ...rOptions
          ];
        }

        setFeatureOptions(fOptions);
        setRoleOptions(rOptions);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    if (editModal.isOpen) fetchData();
  }, [editModal.isOpen]);
  useEffect(() => { console.log("initialData:", initialData) }, [initialData])

  const handleFeatureChange = (v: unknown) => {
    const selected = v as nameValuePair | null;
    setFormData({ ...formData, featureId: selected?.value || 0 });
    if (errors.featureId) setErrors(prev => ({ ...prev, featureId: "" }));
  };

  const handleRoleChange = (v: unknown) => {
    const selected = v as nameValuePair[] | null;
    const ids = selected ? selected.map(opt => opt.value) : [];
    setFormData({ ...formData, roleIds: ids });
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Permission Name is required";
    if (!formData.featureId) newErrors.featureId = "Please select a feature group";
    return newErrors;
  };

  const handleUpdate = async () => {
    const validationErrors = validateForm();
    console.log(" formData:", formData);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        await onUpdate(formData);
        editModal.closeModal();
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <Modal
      isOpen={editModal.isOpen}
      onClose={editModal.closeModal}
      className="max-w-[550px] m-4 overflow-visible"
    >
      <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Permission</h2>

        <div className="mb-5">
          <Label htmlFor="name">Permission Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
          />
          {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}
        </div>

        <div className="mb-5">
          <Label>Feature Group</Label>
          <CustomSelect
            options={featureOptions}
            value={featureOptions.find(opt => opt.value === formData.featureId) || null}
            onChange={handleFeatureChange}
          />
        </div>

        <div className="mb-8">
          <Label>Assigned Roles</Label>
          <CustomSelect
            isMulti={true}
            options={roleOptions}
            placeholder="--- Add/Remove Roles ---"
            // opt.value ရော formData.roleIds ထဲက element ရောကို Number ပြောင်းပြီး စစ်ပါ
            value={roleOptions.filter(opt =>
              formData.roleIds.some(id => Number(id) === Number(opt.value))
            )}
            onChange={handleRoleChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
          <button onClick={editModal.closeModal} className="px-5 py-2 text-sm font-medium text-gray-500">Cancel</button>
          <Button onClick={handleUpdate} disabled={loading} className="px-8 bg-blue-600">
            {loading ? <LoadingCircle description="Updating..." /> : "Save Changes"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default EditForm;