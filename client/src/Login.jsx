import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://review-books-two.vercel.app/user/login",
        { email, password }
      );
      // console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // Redirect to home page or dashboard
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center overflow-x-hidden">
      <form className="bg-white shadow-md text-2xl" onSubmit={handleSubmit}>
        <div className="text-3xl align-center flex font-bold justify-center">
          LOGIN
        </div>
        <div className="m-5">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="m-5">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white text-2xl p-2 rounded hover:bg-gray-600 cursor-pointer"
        >
          Login
        </button>
      </form>
      <div className="text-2xl mt-4">
        Don't have an account?{" "}
        <Link to={"/register"} className="text-red-500 hover:text-red-300">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
