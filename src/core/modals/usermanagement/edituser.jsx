import React, { useEffect, useState } from "react";
import Select from "react-select";
import ImageWithBasePath from "../../img/imagewithbasebath";

const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "superAdmin", label: "Super Admin" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const EditUser = ({ selectedUser, onSubmit, loading = false, allowSuperAdmin = false }) => {
  const roleOptions = allowSuperAdmin
    ? ROLE_OPTIONS
    : ROLE_OPTIONS.filter((option) => option.value !== "superAdmin");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("user");
  const [status, setStatus] = useState("active");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.username || "");
      setPhone(selectedUser.phone || "");
      setEmail(selectedUser.email || "");
      setUserType(selectedUser._raw?.user_type || "user");
      setStatus(selectedUser._raw?.status || "active");
      setAddress(selectedUser._raw?.address || "");
      setPassword("");
      setConfirmPassword("");
    }
  }, [selectedUser]);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser?.id || !name.trim() || !email.trim()) return;
    if (password && password !== confirmPassword) return;

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      user_type: userType,
      status,
    };

    if (password) {
      payload.password = password;
    }

    await onSubmit(selectedUser.id, payload);
  };

  return (
    <div>
      <div className="modal fade" id="edit-units">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Edit User</h4>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="new-employee-field">
                          <span>Avatar</span>
                          <div className="profile-pic-upload edit-pic">
                            <div className="profile-pic">
                              <span>
                                <ImageWithBasePath
                                  src={
                                    selectedUser?.img ||
                                    "assets/img/users/edit-user.jpg"
                                  }
                                  className="user-editer"
                                  alt="User"
                                />
                              </span>
                              <div className="close-img">
                                <i data-feather="x" className="info-img" />
                              </div>
                            </div>
                            <div className="input-blocks mb-0">
                              <div className="image-upload mb-0">
                                <input type="file" />
                                <div className="image-uploads">
                                  <h4>Change Image</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>User Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>Role</label>
                          <Select
                            className="select"
                            options={roleOptions}
                            placeholder="Choose Role"
                            value={
                              roleOptions.find(
                                (item) => item.value === userType
                              ) || null
                            }
                            onChange={(option) =>
                              setUserType(option?.value || "user")
                            }
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>Status</label>
                          <Select
                            className="select"
                            options={STATUS_OPTIONS}
                            placeholder="Choose Status"
                            value={
                              STATUS_OPTIONS.find(
                                (item) => item.value === status
                              ) || null
                            }
                            onChange={(option) =>
                              setStatus(option?.value || "active")
                            }
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>Password</label>
                          <div className="pass-group">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="pass-input form-control"
                              placeholder="Leave blank to keep current"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <span
                              className={`fas toggle-password ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                              onClick={handleTogglePassword}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="input-blocks">
                          <label>Confirm Passworrd</label>
                          <div className="pass-group">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className="pass-input form-control"
                              placeholder="Confirm new password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <span
                              className={`fas toggle-password ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"}`}
                              onClick={handleToggleConfirmPassword}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mb-0 input-blocks">
                          <label className="form-label">Descriptions</label>
                          <textarea
                            className="form-control mb-1"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                          <p>Maximum 600 Characters</p>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-submit"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Submit"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
