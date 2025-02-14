import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate('/');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/user/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate('/');
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <form className="bg-white shadow-md text-2xl" onSubmit={handleSubmit}>
      <div className="text-3xl align-center flex font-bold justify-center font-weight-900">REGISTER</div>
        <div className="m-5">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
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
          className="w-full bg-black text-white text-2xl p-2 rounded cursor-pointer hover:bg-gray-600"
        >
          Register
        </button>
      </form>
      <div className="text-2xl mt-4">
        Already have an account? <Link to={'/login'} className="text-red-500 hover:text-red-300">Login</Link>
      </div>
    </div>
  );
};

export default Register;
