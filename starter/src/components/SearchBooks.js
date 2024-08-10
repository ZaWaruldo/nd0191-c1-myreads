import React, { useState } from 'react';
import * as BooksAPI from '../BooksAPI';
import { Link } from 'react-router-dom';
import '../App.css';

let filterTimeout; // global timeout

function BookSearch({ onShelfChange, libraryBooks }) { // Pass libraryBooks
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false); // State to track book query result

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // timeout for debounce
    clearTimeout(filterTimeout)

    //wrap existing search function with timeout debounce
    filterTimeout = setTimeout(() => {
      if (query.trim()) {
        BooksAPI.search(query).then((results) => {
          if (results.error) {
            setSearchResults([]);
            setNoResults(true); // True if there's an error
          } else {
            // Map through search results and check if book is in library
            const updatedResults = results.map((book) => {
              const bookInLibrary = libraryBooks.find(b => b.id === book.id);
              book.shelf = bookInLibrary ? bookInLibrary.shelf : 'none';
              return book;
            });
            setSearchResults(updatedResults);
            setNoResults(updatedResults.length === 0); // Set if results are empty
          }
        });
      } else {
        setSearchResults([]);
        setNoResults(false); // Set if results are empty
      }
    }, 500); // 500ms delay
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
          {noResults && (
            <div className="no-results-message">
              <p>No books were found for "{searchQuery}".<br/>Please try another search term.</p>
            </div>
          )}
          <ol className="books-grid">
            {searchResults.map((book) => (
              <li key={book.id}>
                <div className="book">
                  <div className="book-top">
                    <div
                      className="book-cover"
                      style={{
                        width: 128,
                        height: 193,
                        backgroundImage: `url(${book.imageLinks?.thumbnail})`,
                      }}
                    />
                    <div className="book-shelf-changer">
                      <select
                        value={book.shelf || 'none'}
                        onChange={(event) => handleBookMove(book, event.target.value)}
                      >
                        <option value="move" disabled>
                          Move to...
                        </option>
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
