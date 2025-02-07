import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useActions from "../../../hooks/useActions";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { signUpUser } = useActions();

  const [formValues, setFormValues] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = React.useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formValues.name) newErrors.name = "Обов'язкове поле";
    if (!formValues.email) {
      newErrors.email = "Обов'язкове поле";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Некоректний емайл";
    }
    if (!formValues.password || formValues.password.length < 8) {
      newErrors.password = "Повинно бути 8 і більше символів";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const response = await signUpUser(formValues);
      if (!response.success) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        navigate("/");
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container align-items-center d-flex flex-column my-4">
      <div className="register-box w-50">
        <form onSubmit={handleSubmit} className="form d-flex flex-column gap-3 text-start align-items-center">
          <h1>Sign Up</h1>
          <div className="form-group w-50">
            <label>Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={formValues.name}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="form-group w-50">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formValues.email}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="form-group w-50">
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={formValues.password}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          <button type="submit" className="btn btn-primary w-25">
            Sign Up
          </button>
          <div className="login-link">
            <Link to="/login">Already have an account? Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
