import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

function UserPage() {
  const [searchParams] = useSearchParams();
  const userName = searchParams.get("name"); // Get the user name from URL query params
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/user/${userName}`
        );
        console.log(response);
        setUser(response.data);
      } catch (err) {
        setError("User not found or an error occurred.", err);
      } finally {
        setLoading(false);
      }
    };

    if (userName) {
      fetchUser();
    }
  }, [userName]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <Link className="text-black text-2xl" to={"/"}>
        Home
      </Link>
      {user ? (
        <>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-lg">{user.email}</p>
          <h2 className="text-2xl font-bold mt-4">Reviews:</h2>
          <ul>
            {user.reviews.map((review, index) => (
              <li key={index} className="my-2">
                <p className="font-semibold">{review.book_name}</p>
                <p>{review.comment[0]}</p>
                <p>Rating: {review.comment[1]}</p>
                <p className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No user details available.</p>
      )}
    </div>
  );
}

export default UserPage;