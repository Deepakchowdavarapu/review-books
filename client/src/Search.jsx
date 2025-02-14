import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import BookModel from "../../server/Models/BookModel"

const Searchbar = () => {
  const [value, setValue] = useState("");
  const [searchResult, setSearchResult] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const getSearchResults = async () => {
      if (value.length === 0) return;

      try {
        const response = await axios.get(
          `https://review-books-two.vercel.app/book/${value}`
        );
        setSearchResult(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error(
          "Error fetching search results:",
          error.response?.data || error.message
        );
        setSearchResult([]);
      }
    };

    getSearchResults();
  }, [value]);

  const handleBookClick = (name) => {
    navigate(`/book?name=${name}`);
  };

  return (
    <div className="w-full p-4 max-w-4xl mx-auto">
      <input
        type="text"
        className="w-full p-2 text-3xl border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for a book..."
      />

      {value.length > 0 && searchResult ? (
        <ul className="mt-4 space-y-2">
          {searchResult.map((book, id) => (
            <li
              key={id}
              onClick={() => handleBookClick(book.name)}
              className="list-none text-2xl p-2 bg-gray-300 hover:bg-gray-400 shadow-md cursor-pointer"
            >
              {book.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-gray-500"></p>
      )}
    </div>
  );
};

export default Searchbar;
