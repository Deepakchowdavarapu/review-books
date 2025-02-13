import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Searchbar from "./Search";

function Home() {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const [newName, setNewName] = useState("");
  const [newPhoto, setNewPhoto] = useState("");

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
        const response = await axios.get("http://localhost:5000/books");
        console.log(response.data);
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
      const response = await axios.post("http://localhost:5000/book", { name });
      console.log(response.data);
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
    <div className="text-7xl ">
      {user.name && user.name === "admin" ? (
        <div className="text-3xl">
          Add new Book
          <input
            type="text"
            className="border-black border-2"
            placeholder="title "
            onChange={(e) => setNewName(e.target.value)}
          />
          <input type="file" onChange={(e) => setNewPhoto(e.target.files[0])} />
          <button onClick={AddBook}>Add</button>
        </div>
      ) : (
        <p></p>
      )}

      <Searchbar />
      {books.length ? (
        <ul>
          {books.map((book, id) => (
            <li
              key={id}
              className="bg-green-300"
              onClick={() => handleBookClick(book.name)}
            >
              <img src={book.photo.url} alt="photo" />
              {book.name}
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
