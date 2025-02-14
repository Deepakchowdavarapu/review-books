import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Searchbar from "./Search";
import { Star ,X , LucidePlus , PlusSquare} from "lucide-react";


function Home() {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const [newName, setNewName] = useState("");
  const [newPhoto, setNewPhoto] = useState("");
const [AddNewBook , setAddNewBook] = useState(false)


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const getBooks = async () => {
      try {
        const response = await axios.get(
          "https://review-books-two.vercel.app/books"
        );
        // console.log(response.data);
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    getBooks();
  }, []);

  const AddBook = async () => {
    const name = newName;
    const photo = newPhoto;

    try {
      const response = await axios.post(
        "https://review-books-two.vercel.app/book",
        { name }
      );
      // console.log(response.data);
      setBooks((prevBooks) => [...prevBooks, response.data]);
    } catch (error) {
      console.error(
        "Error adding book:",
        error.response?.data || error.message
      );
    }
  };

  const handleBookClick = (name) => {
    navigate(`/book?name=${name}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {user.name && user.name === "admin" ? (
        <div className="text-3xl mb-4 flex flex-col">
          {AddNewBook ? 
            <div className="flex flex-col">
            <div className="flex justify-center">
            <div className="text-red-500">
              Add new Book 
            </div>
            <X  size={36} strokeWidth={3} absoluteStrokeWidth/>
            </div>
            <input
            type="text"
            className="border-black border-2 p-2 rounded"
            placeholder="title"
            onChange={(e) => setNewName(e.target.value)}
          />
          <input type="file" onChange={(e) => setNewPhoto(e.target.files[0])} />
          <button
            onClick={AddBook}
            className="ml-2 bg-red-500 text-white p-2 rounded cursor-pointer"
          >
            Add
          </button>
          </div> 
          
          :
          <div
           className="text-3xl flex cursor-pointer"
           onClick={()=>setAddNewBook(!AddNewBook)}>
            Add New Book <PlusSquare size={36} strokeWidth={3} absoluteStrokeWidth/>
          </div>  
        }
          
        </div>
      ) : (
        <p></p>
      )}

      <Searchbar />

      {books.length ? (
        <ul className="grid grid-cols-2 gap-4">
          {books.map((book, id) => (
            <li
              key={id}
              className="bg-black p-4 m-2 text-3xl text-white cursor-pointer"
              onClick={() => handleBookClick(book.name)}
              style={{ zIndex: 20 }}  
            >
              <img
                src={book.photo.url}
                alt="photo"
                className="w-100 h-100 inline-block mr-2 transform transition-transform duration-300 hover:scale-110"
                style={{ zIndex: 10 }}
              />
              <div className="font-bold text-3xl flex items-center justify-between">
                {book.name}
                <div className="text-red-600 flex items-center">
                  <Star fill="red" />
                  {book.rating}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No books</p>
      )}
    </div>
  );
}

export default Home;
