import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate('/login');
    };

    return (
        <div className="bg-black flex justify-between items-center p-4 sticky top-0 shadow-lg" style={{ zIndex: 100 }}>
            <Link to={'/'}>
                <div className="text-4xl text-white font-bold">Bookstore</div>
            </Link>
            <div className="flex justify-center items-center">
                <Link to={'/profile'} className="text-2xl font-bold text-white mx-4">Profile</Link>
                <div className="text-white text-4xl w-5">|</div>
                <div onClick={handleLogout} className="text-2xl text-white font-bold cursor-pointer">Log-out</div>
            </div>
        </div>
    );
};

export default Navbar;
