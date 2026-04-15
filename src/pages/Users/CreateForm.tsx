import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { ModalHook } from "@/hooks/useModal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import TextArea from "@/components/form/input/TextArea";
import Radio from "@/components/form/input/Radio";
// import Switch from "@/components/form/switch/Switch";
import { getRoleNames } from "@/api/roleService";
import CustomSelect from "@/components/form/switch/CustomSelect";
import LoadingCircle from "@/components/common/LoadingCircle";



interface FormData {
  id: number;
  name: string;
  username: string;
  email: string;
  // password: string;
  roleId: number;
  // role: RoleItem;
  phone: string;
  gender: string;
  address: string;
  isActive: boolean;
}
interface FormErrors {
  name?: string;
  email?: string;
  // password?: string;
  roleId?: string;
  phone?: string;
  gender?: string;
  address?: string;
  status?: string;
}

interface ModalProps {
  createModal: ModalHook;
  userData?: FormData;
  onSave: (data: FormData) => Promise<void>;
}
const initialFormData: FormData = {
  id: 0,
  name: "",
  username: "",
  email: "",
  roleId: 0,
  phone: "",
  gender: "male",
  address: "",
  isActive: true,
};

function CreateForm({ createModal, onSave }: ModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [roleOptions, setRoleOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (createModal.isOpen) {
      const fetchRoleNames = async () => {
        const res = await getRoleNames();
        console.log("Fetched Role Names:", res);
        setRoleOptions(res.data);
      };
      fetchRoleNames();
    }
  }, [createModal.isOpen]);

//   useEffect(() => {
//   if (userData) setFormData(userData);
// }, [userData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const saveData = async () => {
    const validationErrors = await validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      await onSave(formData);
      setFormData(initialFormData);
      setLoading(false);
      setErrors({});
    } else {
      setLoading(false);
      setErrors(validationErrors);
    }
  };

  const validateForm = async () => {
    const errors: FormErrors = {};
    if (!formData.name) errors.name = "User Name is required";
    if (!formData.email) errors.email = "Email is required";
    // if (!formData.password) errors.password = "Password is required";
    if (!formData.roleId) errors.roleId = "Role is required";
    if (!formData.phone) errors.phone = "Phone Number is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.address) errors.address = "Address is required";
    // if (!formData.status) errors.status = "Status is required";
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
              Create User
            </h4>
          </div>
          <div className="px-2 overflow-y-auto custom-scrollbar max-h-[300px]">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>User Name</Label>
                <Input
                  type="text"
                  value={formData.name}
                  placeholder="Enter User Name"
                  name="name"
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  placeholder="Enter Email"
                  name="email"
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  placeholder="Enter Password"
                  name="password"
                  onChange={handleInputChange}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div> */}

              <div>
                <Label>Role Name</Label>
                <CustomSelect
                  options={roleOptions.filter(role => role.label !== 'admin')}
                  placeholder="--- Select Role Name ---"
                  value={
                    roleOptions.find(
                      (option) => option.value === formData.roleId,
                    ) || null
                  }
                  onChange={(v: unknown) => {
                    const selectedOption = v as { value: number; label: string };
                    if (selectedOption) {
                      setFormData({ ...formData, roleId: selectedOption.value });
                    }
                  }}
                />
                {errors.roleId && (
                  <p className="mt-1 text-sm text-red-600">{errors.roleId}</p>
                )}
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input
                  type="text"
                  value={formData.phone}
                  placeholder="Enter Phone Number"
                  name="phone"
                  onChange={handleInputChange}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label>Address</Label>
                <TextArea
                  value={formData.address}
                  placeholder="Enter Address"
                  name="address"
                  onChange={handleInputChange}
                  className="min-h-[60px] max-h-[150px]"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div className="">
                <div>
                  <Label>Gender</Label>
                  <div className="flex items-center gap-4 mt-1">
                    <Radio
                      label="Male"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={(value) => handleSelectChange("gender", value)}
                    />
                    <Radio
                      label="Female"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={(value) => handleSelectChange("gender", value)}
                    />
                  </div>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>
                {/* <div className="mt-4">
                  <Label>Status</Label>
                  <div className="flex items-center gap-4 mt-1">
                    <Switch
                      label={
                        formData.isActive === true ? "Inactive" : "Active"
                      }
                      defaultChecked={formData.isActive !== false}
                      onChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                  </div>
                  {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
              )} 
                </div> */}
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
              {loading ? <LoadingCircle description="Loading ..." /> : "Save"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CreateForm;
