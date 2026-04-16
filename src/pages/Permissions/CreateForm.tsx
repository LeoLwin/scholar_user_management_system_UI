import {  useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ModalHook } from "@/hooks/useModal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import LoadingCircle from "@/components/common/LoadingCircle";
import CustomSelect from "@/components/form/switch/CustomSelect"; 
import { getFeatureNames } from "@/api/featureService";

interface FormData {
  name: string;
  featureId: number;
}

interface FormErrors {
  name?: string;
  featureId?: string;
}

interface nameValuePair {
  value: number;
  label: string;
}

interface ModalProps {
  createModal: ModalHook;
  onSave: (data: FormData) => Promise<void>;
  // featureOptions: nameValuePair[]; 
}

function CreatePermissionForm({ createModal, onSave }: ModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    featureId: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [featureOptions, setFeatureOptions] = useState<nameValuePair[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Permission Name is required";
    if (!formData.featureId) newErrors.featureId = "Please select a feature group";
    return newErrors;
  };

  const saveData = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        await onSave(formData);
        // Reset Form
        setFormData({ name: "", featureId: 0 });
        setErrors({});
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };


  useEffect(() => {
    if (createModal.isOpen) {
      setFormData({ name: "", featureId: 0 });
      setErrors({});
    }
  }, [createModal.isOpen]);

   
    
    useEffect(()=>{

        const fetchFeatures = async () => {
        try {
          const res = await getFeatureNames();
          const fOptions = res.data.map((item: { name: string; value: number }) => ({
            label: item.name,
            value: item.value,
          }));
          setFeatureOptions(fOptions);
        } catch (error) {
          console.error("Error fetching features:", error);
        }
      }
        fetchFeatures();
    },[])
  

  return (
    <Modal
      isOpen={createModal.isOpen}
      onClose={createModal.closeModal}
      className="max-w-[500px] m-4 overflow-visible"
    >
      <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Create New Permission</h2>
        
        {/* Permission Name */}
        <div className="mb-5">
          <Label htmlFor="name">Permission Name (e.g. CREATE_USER)</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter permission name"
            error={!!errors.name}
          />
          {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
        </div>

        {/* Feature Group Select */}
        <div className="mb-8">
          <Label>Feature Group</Label>
          <CustomSelect
            options={featureOptions}
            placeholder="--- Select Feature ---"
            value={featureOptions.find(opt => opt.value === formData.featureId) || null}
            onChange={(v: unknown ) => {
               const selectedOption = v as nameValuePair;
              setFormData({ ...formData, featureId: selectedOption?.value || 0 });
              if (errors.featureId) setErrors(prev => ({ ...prev, featureId: "" }));
            }}
          />
          {errors.featureId && <span className="text-red-500 text-xs mt-1 block">{errors.featureId}</span>}
        </div>

        <div className="flex justify-end gap-3">
          <button 
            onClick={createModal.closeModal}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Cancel
          </button>
          <Button onClick={saveData} disabled={loading} className="px-6">
            {loading ? (
              <LoadingCircle description="Creating..." />
            ) : (
              "Create Permission"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default CreatePermissionForm;