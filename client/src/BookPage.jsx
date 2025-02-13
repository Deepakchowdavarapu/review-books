import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import StarComponent from "./StarComponent";

function BookPage() {
  const [searchParams] = useSearchParams();
  const bookName = searchParams.get("name"); // Get the book name from URL query params
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [addComment, setAddComment] = useState(false);

  useEffect(() => {
    const setProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      }
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    setProfile();
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/book/${bookName}`
        );
        // console.log(response);
        setBook(response.data);
      } catch (err) {
        setError("Book not found or an error occurred.", err);
      } finally {
        setLoading(false);
      }
    };

    if (bookName) {
      fetchBook();
    }
  }, [bookName]);

  const postComment = async () => {
    if (rating === 0 || !comment) {
      return;
    }
    const reviewer_name = user.name;
    const reviewer_email = user.email;
    const commentData = [comment, rating];
    const date = new Date();

    try {
      const response = await axios.post(
        `http://localhost:5000/reviews/${bookName}`,
        {
          reviewer_name,
          reviewer_email,
          comment: commentData,
          date,
        }
      );

      // console.log(response);

      // Update the book state to include the new comment
      setBook((prevBook) => {
        const updatedReviews = [
          ...prevBook[0].reviews,
          { reviewer_name, reviewer_email, comment: commentData, date },
        ];
        return [{ ...prevBook[0], reviews: updatedReviews }];
      });

      // Clear the comment and rating inputs
      setComment("");
      setRating(0);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <Link className="text-black text-2xl" to={"/"}>
        Home
      </Link>
      {book ? (
        <>
          <h1 className="text-3xl font-bold">{book[0].name}</h1>
          <img
            src={book[0].photo.url}
            alt={book[0].name}
            className="w-64 h-auto my-4"
          />
          <p>{book[0].rating}</p>
          <p className="text-lg">{book[0].description}</p>
          <ul>
            {book[0].reviews.map((review, index) => (
              <li key={index} className="my-2">
                <p
                  className="font-semibold cursor-pointer"
                  onClick={() => navigate(`/user?name=${review.reviewer_name}`)}
                >
                  {review.reviewer_name} ({review.reviewer_email})
                </p>
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
        <p>No book details available.</p>
      )}

      {!addComment ? (
        <div onClick={() => setAddComment(!addComment)} className="text-3xl">
          Add comment
        </div>
      ) : (
        <div className="text-3xl">
          <p onClick={() => setAddComment(!addComment)}>X</p>
          <p>Add comment</p>
          <input
            type="text"
            className="border-2 border-gray-300 p-2 rounded-md"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <StarComponent
            onChange={(rating) => {
              setRating(rating);
              // console.log("Selected Rating:", rating);
            }}
          />

          <div
            className="text-3xl text-white py-5 bg-blue-500"
            onClick={postComment}
          >
            POST
          </div>
        </div>
      )}
    </div>
  );
}

export default BookPage;
