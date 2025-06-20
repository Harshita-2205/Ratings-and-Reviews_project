import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "../style.scss";
import axios from "axios";
import { render } from "../../host";
import loginBG from "../../assets/loginBG.jpg";

const AdminLogin = () => {
  const [userData, setUserData] = useState({
    password: "",
    email: "",
  });

  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    closeOnClick: true,
  };

  const handleValidation = () => {
    const { email, password } = userData;
    if (!email || !password) {
      toast.error("Email and Password are required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = userData;

    if (handleValidation()) {
      const host = `${render}/api/auth/admin/login`;

      try {
        const { data } = await axios.post(host, {
          email,
          password,
        });

        if (data?.status) {
          localStorage.setItem("user", JSON.stringify(data.adminData));
          Cookie.set("adminJwtToken", data.jwtToken, { expires: 9 });
          setUserData({ password: "", email: "" });
          navigate("/admin");
        } else {
          toast.error(data.msg, toastOptions);
        }
      } catch (error) {
        toast.error("Login failed. Please try again.", toastOptions);
        console.error("Login Error:", error);
      }
    }
  };

  const onShowPass = () => {
    setShowPass((prev) => !prev);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${loginBG})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 1,
      }}
    >
      <div className="loginContainer">
        <form onSubmit={handleSubmit} className="formContainer">
          <h1>
            <span>i</span>Movies
          </h1>
          <p className="loginTitle">Admin Login</p>

          <div className="inputContainer">
            <label htmlFor="email" className="name">Email</label>
            <input
              name="email"
              id="email"
              type="email"
              placeholder="Enter your email"
              className="input"
              value={userData.email}
              onChange={onChange}
            />
          </div>

          <div className="inputContainer">
            <label htmlFor="pass" className="name">Password</label>
            <input
              name="password"
              id="pass"
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              className="input"
              value={userData.password}
              onChange={onChange}
            />
          </div>

          <div className="checkbox">
            <input
              checked={showPass}
              onChange={onShowPass}
              id="check"
              type="checkbox"
            />
            <label htmlFor="check">Show Password</label>
          </div>

          <button type="submit">Submit</button>

          <p>
            Create an account
            <Link style={{ textDecoration: "none" }} to={"/admin/register"}>
              <span>Register</span>
            </Link>
          </p>
          <p>
            Login as a
            <Link style={{ textDecoration: "none" }} to={"/login"}>
              <span>User</span>
            </Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminLogin;
