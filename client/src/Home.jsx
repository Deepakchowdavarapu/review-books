import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Searchbar from "./Search";
import {Star} from 'lucide-react'

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
      const response = await axios.post("http://localhost:5000/book", { name });
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
        <div className="text-3xl mb-4">
          Add new Book
          <input
            type="text"
            className="border-black border-2 p-2 rounded"
            placeholder="title"
            onChange={(e) => setNewName(e.target.value)}
          />
          <input type="file" onChange={(e) => setNewPhoto(e.target.files[0])} />
          <button onClick={AddBook} className="ml-2 bg-blue-500 text-white p-2 rounded">Add</button>
        </div>
      ) : (
        <p></p>
      )}

      <Searchbar />

      {books.length ? (
        <ul className="grid grid-cols-2 gap-4" style={{ zIndex: 10 }}>
          {books.map((book, id) => (
            <li
              key={id}
              className="bg-black p-4 m-2 text-3xl text-white cursor-pointer"
              onClick={() => handleBookClick(book.name)}
            >
              <img src={book.photo.url} alt="photo" className="w-100 h-100 inline-block mr-2 transform transition-transform duration-300 hover:scale-110" style={{ zIndex: -10 }}/>
              <div className="font-bold text-3xl flex items-center justify-between">
              {book.name}
            <div className="text-red-600 flex items-center">
              <Star fill="red"/>
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
