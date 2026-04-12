import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useActions from "../../../hooks/useActions";
import { toast } from "react-toastify";
import GoogleLogin from "../google/GoogleLogin";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { signInUser } = useActions();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const email = formValues.email.trim();
    const password = formValues.password.trim();
    const newErrors = {};
    if (!email) {
      newErrors.email = "Обов'язкове поле";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Некоректний email";
    }
    if (!password) {
      newErrors.password = "Обов'язкове поле";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;

    const response = await signInUser({
      email: formValues.email.trim(),
      password: formValues.password.trim(),
    });

    if (!response.success) {
      if (response.message) {
        toast.error(response.message);
      }
      if (response.fieldErrors && Object.keys(response.fieldErrors).length > 0) {
        setErrors(response.fieldErrors);
      }
      return;
    }

    toast.success(response.message || "Успішний вхід!");
    navigate("/");
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container align-items-center d-flex flex-column my-4">
      <div className="login-box w-50">
        <form
          onSubmit={handleSubmit}
          className="form d-flex flex-column gap-3 text-start align-items-center"
        >
          <h1>Вхід</h1>
          <div className="form-group w-50">
            <label>Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formValues.email}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="form-group w-50">
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={formValues.password}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-25">
            Увійти
          </button>
          <div className="register-link">
            <Link to="/register">Ще не маєте акаунта? Зареєструватися</Link>
          </div>
        </form>
      </div>
      <GoogleLogin />
    </div>
  );
};

export default Login;
