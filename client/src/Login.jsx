import React, { useState } from "react";
import axios from "axios";
import {useNavigate,Link} from "react-router-dom"
import { useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  useEffect(()=>{
    const token = localStorage.getItem("token")
    if(token){
      navigate('/')
    }
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/user/login", { email, password });
      // console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // Redirect to home page or dashboard
      navigate('/')
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
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
          className="w-full bg-black text-white p-2 rounded"
        >
          Login
        </button>
      </form>
      <div className="text-2xl mt-4">
        Don't have an account? <Link to={'/register'} className="text-red-500">Register</Link>
      </div>
    </div>
  );
};

export default Login;
