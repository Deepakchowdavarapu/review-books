import React from "react";
import { Link ,useNavigate} from "react-router-dom";


const Navbar = () => {
    const navigate = useNavigate()

    const handleLogout=()=>{
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate('/login')
    }
    return (
        <div className="bg-green-300 flex justify-between items-center p-4 sticky top-0">
            <div
            onClick={handleLogout}
             className="text-2xl">Log-out</div>
            <Link to={'/'}><div className="text-2xl">Bookstore</div></Link>
            <Link to={'/profile'}><div className="text-2xl">Profile</div></Link>
        </div>
    );
};

export default Navbar;
