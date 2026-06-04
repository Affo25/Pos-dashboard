import React from "react";
import { useSelector } from "react-redux";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import {
  getDisplayName,
  getUserRoleLabel,
  splitFullName,
} from "../../core/utils/authHelpers";

const Profile = () => {
  const authUser = useSelector((state) => state.auth_user);
  const displayName = getDisplayName(authUser);
  const userRole = getUserRoleLabel(authUser);
  const { firstName, lastName } = splitFullName(authUser?.name);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Profile</h4>
            <h6>User Profile</h6>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-body">
            <div className="profile-set">
              <div className="profile-head"></div>
              <div className="profile-top">
                <div className="profile-content">
                  <div className="profile-contentimg">
                    <ImageWithBasePath
                      src="assets/img/customer/customer5.jpg"
                      alt="img"
                      id="blah"
                    />
                    <div className="profileupload">
                      <input type="file" id="imgInp" />
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/icons/edit-set.svg"
                          alt="img"
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="profile-contentname">
                    <h2>{displayName}</h2>
                    <h4>
                      {userRole}
                      {authUser?.email ? ` · ${authUser.email}` : ""}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={firstName}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={lastName}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={authUser?.email || ""}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={authUser?.phone || ""}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">User Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={displayName}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    className="form-control"
                    value={userRole}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Plan</label>
                  <input
                    type="text"
                    className="form-control"
                    value={authUser?.plan || ""}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Status</label>
                  <input
                    type="text"
                    className="form-control"
                    value={authUser?.status || ""}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Subscription</label>
                  <input
                    type="text"
                    className="form-control"
                    value={authUser?.subscription_status || ""}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">License Status</label>
                  <input
                    type="text"
                    className="form-control"
                    value={authUser?.license_status || ""}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Password</label>
                  <div className="pass-group">
                    <input
                      type="password"
                      className="pass-input form-control"
                      placeholder="••••••••"
                      readOnly
                    />
                    <span className="fas toggle-password fa-eye-slash" />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <Link to="#" className="btn btn-submit me-2">
                  Submit
                </Link>
                <Link to="#" className="btn btn-cancel">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
    </div>
  );
};

export default Profile;
