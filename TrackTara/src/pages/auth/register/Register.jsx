import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useActions from "../../../hooks/useActions";
import { toast } from "react-toastify";
import GoogleLogin from "../google/GoogleLogin";
import "../login/auth.css";

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { signUpUser } = useActions();

  const [formValues, setFormValues] = useState({
    name: "",
    surname: "",
    patronymic: "",
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
  };

  const validate = () => {
    const newErrors = {};
    if (!formValues.name) newErrors.name = "Обов'язкове поле";
    if (!formValues.surname) newErrors.surname = "Обов'язкове поле";
    if (!formValues.patronymic) newErrors.patronymic = "Обов'язкове поле";
    if (!formValues.email) {
      newErrors.email = "Обов'язкове поле";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Некоректний email";
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
        toast.success("Успішна реєстрація!");
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
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>Реєстрація</h1>
          <p>Створіть свій акаунт</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Ім'я</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={formValues.name}
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Введіть ім'я"
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>
            <div className="form-group">
              <label>Прізвище</label>
              <input
                type="text"
                name="surname"
                onChange={handleChange}
                value={formValues.surname}
                className={`form-control ${errors.surname ? "is-invalid" : ""}`}
                placeholder="Введіть прізвище"
              />
              {errors.surname && (
                <div className="invalid-feedback">{errors.surname}</div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>По батькові</label>
            <input
              type="text"
              name="patronymic"
              onChange={handleChange}
              value={formValues.patronymic}
              className={`form-control ${errors.patronymic ? "is-invalid" : ""}`}
              placeholder="Введіть по батькові"
            />
            {errors.patronymic && (
              <div className="invalid-feedback">{errors.patronymic}</div>
            )}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formValues.email}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Введіть email"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={formValues.password}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Введіть пароль"
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
          <button type="submit" className="auth-button">
            Зареєструватися
          </button>
          <div className="auth-link">
            <Link to="/login">Вже маєте акаунт? Увійти</Link>
          </div>
        </form>
        <div className="google-login-container">
          <div className="divider">
            <span>або</span>
          </div>
          <GoogleLogin />
        </div>
      </div>
    </div>
  );
};

export default Register; 