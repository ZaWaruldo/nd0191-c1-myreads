import React, { useState } from 'react';
import * as BooksAPI from '../BooksAPI';
import { Link } from 'react-router-dom';
import '../App.css';

function BookSearch({ onShelfChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      BooksAPI.search(query).then((results) => {
        if (results.error) {
          setSearchResults([]);
        } else {
          setSearchResults(results);
        }
      });
    } else {
      setSearchResults([]);
    }
  };

  const handleBookMove = (book, newShelf) => {
    onShelfChange(book, newShelf);
    book.shelf = newShelf;
  };

  return (
    <div>
      <div className="search-books-bar">
        <Link to="/" className="close-search">
          {/* Back button */}
          <img src="./icons/arrow-back.svg" alt="Back" />
        </Link>
        <div className="search-books-input-wrapper">
          <input
            type="text"
            placeholder="Search by title or author"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {searchResults.map(book => (
            <li key={book.id}>
              <div className="book">
                <div className="book-top">
                  <div
                    className="book-cover"
                    style={{
                      width: 128,
                      height: 193,
                      backgroundImage: `url(${book.imageLinks?.thumbnail})`
                    }}
                  />
                  <div className="book-shelf-changer">
                    <select
                      value={book.shelf || 'none'}
                      onChange={(event) => handleBookMove(book, event.target.value)}
                    >
                      <option value="move" disabled>Move to...</option>
                      <option value="currentlyReading">Currently Reading</option>
                      <option value="wantToRead">Want to Read</option>
                      <option value="read">Read</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
                <div className="book-title">{book.title}</div>
                <div className="book-authors">{book.authors?.join(', ')}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default BookSearch;
