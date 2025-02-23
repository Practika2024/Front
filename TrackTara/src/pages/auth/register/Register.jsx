import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useActions from "../../../hooks/useActions";
import { toast } from "react-toastify";
import GoogleLogin from "../google/GoogleLogin";

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
    <div className="container align-items-center d-flex flex-column my-4">
      <div className="register-box w-50">
        <form
          onSubmit={handleSubmit}
          className="form d-flex flex-column gap-3 text-start align-items-center"
        >
          <h1>Реєстрація</h1>
          {Object.entries({
            name: "Ім'я",
            surname: "Прізвище",
            patronymic: "По батькові",
            email: "Email",
            password: "Пароль",
          }).map(([field, label]) => (
            <div className="form-group w-50" key={field}>
              <label>{label}</label>
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                onChange={handleChange}
                value={formValues[field]}
                className={`form-control ${errors[field] ? "is-invalid" : ""}`}
              />
              {errors[field] && (
                <div className="invalid-feedback">{errors[field]}</div>
              )}
            </div>
          ))}
          <button type="submit" className="btn btn-primary w-25">
            Зареєструватися
          </button>
          <div className="login-link">
            <Link to="/login">Вже маєте акаунт? Увійти</Link>
          </div>
        </form>
      </div>
      <GoogleLogin />
    </div>
  );
};

export default Register;
