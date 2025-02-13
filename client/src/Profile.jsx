import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const setProfile = async () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    setProfile();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      {user.name ? (
        <>
          <img className="w-24 h-24 rounded-full mx-auto" src={user.photo} alt={user.name} />
          <div className="text-center">
            <p className="text-xl font-semibold">{user.name}</p>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-gray-500">{user.role}</p>
            <p className="text-gray-500">Ratings: {user.ratings.length}</p>
            <p className="text-gray-500">Reviews: {user.reviews.length}</p>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No user</p>
      )}
    </div>
  );
};

export default Profile;
