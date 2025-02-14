import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MoveLeft , Underline, X} from "lucide-react";
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

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error) return <p className="text-center text-xl text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <Link className="text-black text-3xl p-4 flex" to={"/"}>
      <MoveLeft size={48} strokeWidth={3} absoluteStrokeWidth />  
      <div className="text-3xl">Home</div>
      </Link>
      {book ? (
        <div className="w-screen items-center flex flex-col">
          <h1 className="text-5xl font-bold mt-4">{book[0].name}</h1>
          <img
            src={book[0].photo.url}
            alt={book[0].name}
            className="w-100 h-100 my-4 shadow-md"
          />
          <p className="text-xl font-semibold">Rating: {book[0].rating}/5</p>
        </div>

          )
          :
          <p>loading</p>
      }


      <div className="text-4xl font-bold text-red-500 my-5">
        reviews
        <hr />
      </div>

          {book ? (
          <ul className="mt-4">
            {book[0].reviews.map((review, index) => (
              <li key={index} className="my-2 p-4 border-b border-gray-300" style={{listStyleType: "decimal"}}>
                <div className="text-2xl flex items-center">
                  {/* <div className="text-2xl">User:</div> */}
                  <p
                  className="font-semibold cursor-pointer text-red-500"
                  onClick={() => navigate(`/user?name=${review.reviewer_name}`)}
                >
                 {review.reviewer_name} ({review.reviewer_email})
                </p>
                </div>
                <div className="text-xl flex items-center">
                  <div className="text-red-500">comment:</div>
                  <p className="mt-1">{review.comment[0]}</p>
                </div>
               <div className="text-xl flex items-center">
                <div className="text-red-500">Rating:</div>
                <p className="mt-1">{review.comment[1]}/5</p>
               </div>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(review.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
      ) : (
        <p className="text-center text-xl">No book details available.</p>
      )}

      {!addComment ? (
        <div
          onClick={() => setAddComment(!addComment)}
          className="text-3xl text-center mt-4 cursor-pointer text-red-500"
        >
          Add Review
        </div>
      ) : (
        <div className="text-3xl mt-4">
          <div className="flex justify-around items-center">
          <p
            onClick={() => setAddComment(!addComment)}
            className="cursor-pointer text-red-500"
          >
            <X size={48} strokeWidth={3} absoluteStrokeWidth />
          </p>
          <p className="mt-2">Add comment</p>
          </div>
          <input
            type="text"
            className="border-2 border-gray-300 p-2 rounded-md w-full mt-2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <StarComponent 
            onChange={(rating) => {
              setRating(rating);
            }}

          />
          <div
            className="text-3xl text-white py-2 px-4 bg-red-500 mt-4 rounded-md cursor-pointer text-center"
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
