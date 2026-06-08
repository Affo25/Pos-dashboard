import React, { useState } from "react";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../../Router/all_routes";
import { registerUser } from "../../../core/api/userApi";
import { showErrorToast, showSuccessToast } from "../../../core/utils/toast";

const RegisterThree = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      showErrorToast("Validation", "Please fill all required fields.");
      return;
    }
    if (form.password !== form.confirm) {
      showErrorToast("Validation", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      if (res.success) {
        showSuccessToast("Registered", "Account created. Please sign in.");
        navigate(route.signinthree);
      } else {
        showErrorToast("Registration Failed", res.message);
      }
    } catch (err) {
      showErrorToast("Registration Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper login-new">
          <div className="login-content user-login">
            <div className="login-logo">
              <ImageWithBasePath src="assets/img/logo.png" alt="img" />
              <Link to={route.dashboard} className="login-logo logo-white">
                <ImageWithBasePath src="assets/img/logo-white.png" alt />
              </Link>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="login-userset">
                <div className="login-userheading">
                  <h3>Register</h3>
                  <h4>Create your Exam Checker account</h4>
                </div>
                <div className="form-login">
                  <label>Name</label>
                  <div className="form-addons">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                    <ImageWithBasePath
                      src="assets/img/icons/user-icon.svg"
                      alt="img"
                    />
                  </div>
                </div>
                <div className="form-login">
                  <label>Email Address</label>
                  <div className="form-addons">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                    <ImageWithBasePath
                      src="assets/img/icons/mail.svg"
                      alt="img"
                    />
                  </div>
                </div>
                <div className="form-login">
                  <label>Password</label>
                  <div className="pass-group">
                    <input
                      type="password"
                      name="password"
                      className="pass-input"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <span className="fas toggle-password fa-eye-slash" />
                  </div>
                </div>
                <div className="form-login">
                  <label>Confirm Password</label>
                  <div className="pass-group">
                    <input
                      type="password"
                      name="confirm"
                      className="pass-inputs"
                      value={form.confirm}
                      onChange={handleChange}
                      required
                    />
                    <span className="fas toggle-passwords fa-eye-slash" />
                  </div>
                </div>
                <div className="form-login">
                  <button
                    type="submit"
                    className="btn btn-login"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Sign Up"}
                  </button>
                </div>
                <div className="signinform">
                  <h4>
                    Already have an account?{" "}
                    <Link to={route.signinthree} className="hover-a">
                      Sign In Instead
                    </Link>
                  </h4>
                </div>
              </div>
            </form>
          </div>
          <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
            <p>Copyright © 2026 Code5Tech. All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterThree;
