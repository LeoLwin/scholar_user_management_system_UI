import Input from "@/components/form/input/InputField";
import Radio from "@/components/form/input/Radio";
import Label from "@/components/form/Label";
import Switch from "@/components/form/switch/Switch";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { ModalHook } from "@/hooks/useModal";
import React, { useEffect, useState } from "react";
import { getRoleNames } from "@/api/roleService";
import TextArea from "@/components/form/input/TextArea";
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
  isActive?: string;
}
interface ModalProps {
  editModal: ModalHook;
  userData: FormData;
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

function EditForm({ editModal, userData, onSave }: ModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [errors, setErrors] = useState<FormErrors>({});
  const [roleOptions, setRoleOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [selectedRole, setSelectedRole] = useState<{ value: number; label: string; }>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (editModal.isOpen) {
      const fetchRoleNames = async () => {
        const res = await getRoleNames();
        setRoleOptions(res.data);
      }
      fetchRoleNames();
    }
  }, [editModal.isOpen]);

  useEffect(() => {
    console.log("Received userData for editing:", userData);
    if(!userData) return;
    setFormData({
      id: userData.id,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      roleId: userData.roleId,
      phone: userData.phone,
      gender: userData.gender,
      address: userData.address,
      isActive: userData.isActive,
    });
  }, [userData]);

  useEffect(() => {
    const selectedRoleData = roleOptions.find(
      (option: { value: number; label: string }) => option.value === userData?.roleId
    ) || roleOptions[0];
    setSelectedRole(selectedRoleData);
  }, [roleOptions])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      setLoading(false);
      setErrors({});
    } else {
      setLoading(false);
      setErrors(validationErrors);
    }
  };

  const validateForm = async () => {
    const errors: FormErrors = {};
    if (!formData.name) errors.name = "User Name is required!";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.roleId) errors.roleId = "Role is required";
    if (!formData.phone) errors.phone = "Phone Number is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.isActive) errors.isActive = "Status is required";
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
          <div className="px-2 pr-14">
            <h4 className="uppercase mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit User
            </h4>
          </div>
          <div className="px-2 overflow-y-auto custom-scrollbar max-h-[300px]">
            {userData && (
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
                <div>
                  <Label>Role Name</Label>
                  <CustomSelect
                    isDisabled={true}
                    placeholder="--- Select Role name ---"
                    options={roleOptions}
                    value={
                      (selectedRole)
                        ? {
                          value: selectedRole.value,
                          label: selectedRole.label,
                        }
                        : null
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
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone}
                    </p>
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
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <div>
                    <Label>Gender</Label>
                    <div className="flex items-center gap-4">
                      <Radio
                        label="Male"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={(value) =>
                          handleSelectChange("gender", value)
                        }
                      />
                      <Radio
                        label="Female"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={(value) =>
                          handleSelectChange("gender", value)
                        }
                      />
                    </div>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.gender}
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <Label>Status</Label>
                    <div className="flex items-center gap-4">
                      <Switch
                        label={
                          formData.isActive === true ? "Active" : "Inactive"
                        }
                        defaultChecked={formData.isActive === true}
                        onChange={(defaultChecked) => {
                          handleSelectChange(
                            "isActive",
                            defaultChecked ? "true" : "false"
                          );
                        }}
                      />
                    </div>
                    {errors.isActive && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.isActive}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={editModal.closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={saveData} disabled={loading}>
              {loading ? <LoadingCircle description="Loading ..." /> : "Update"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default EditForm;
