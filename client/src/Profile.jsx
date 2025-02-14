import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate()

  useEffect(() => {

    const token = localStorage.getItem("token")
    if(!token){
      navigate('/login')
    }

    const setProfile = async () => {
      const userData = localStorage.getItem("user");
      console.log(userData);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    setProfile();
  }, []);

  return (
    <div className="flex items-center justify-center w-screen h-auto">
      {user.name ? (
        <div className=" p-30 text-start shadow-lg">
          <img
            className="w-32 h-32 rounded-full mx-auto"
            src={user.photo}
            alt={user.name}
          />
          <div className="text-center mt-4">
            <p className="text-2xl font-semibold">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.role}</p>
            <p className="text-gray-600">Ratings: {user.ratings.length}</p>
            <p className="text-gray-600">Reviews: {user.reviews.length}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No user</p>
      )}
    </div>
  );
};

export default Profile;
