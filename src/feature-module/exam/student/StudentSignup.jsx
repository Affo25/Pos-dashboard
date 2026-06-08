import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { studentSignup } from "../../../core/api/examApi";
import { all_routes } from "../../../Router/all_routes";
import { showErrorToast, showSuccessToast } from "../../../core/utils/toast";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";

const StudentSignup = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await studentSignup(form);
      if (res.success) {
        showSuccessToast("Registered", "Account created. Please sign in.");
        navigate(route.signinthree);
      } else {
        showErrorToast("Signup Failed", res.message);
      }
    } catch (err) {
      showErrorToast("Signup Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper login-new">
          <div className="container">
            <div className="login-content user-login">
              <div className="login-logo">
                <ImageWithBasePath src="assets/img/logo.png" alt="logo" />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="login-userset">
                  <div className="login-userheading">
                    <h3>Student Sign Up</h3>
                    <h4>Create your exam checker account</h4>
                  </div>
                  <div className="form-login">
                    <label>Name</label>
                    <input
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-login">
                    <label>Email</label>
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-login">
                    <label>Password</label>
                    <input
                      className="form-control"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-login">
                    <button type="submit" className="btn btn-login" disabled={loading}>
                      {loading ? "Creating..." : "Sign Up"}
                    </button>
                  </div>
                  <div className="signinform">
                    <h4>
                      Already have an account?
                      <Link to={route.signinthree} className="hover-a">
                        {" "}
                        Sign In
                      </Link>
                    </h4>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
