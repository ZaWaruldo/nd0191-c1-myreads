import React, { useState, useEffect } from 'react';
import * as BooksAPI from './BooksAPI'; // BooksAPI.js
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Import Router components
import './App.css'; // App.css file

import Header from './components/Header'; // Import Header
import Footer from './components/Footer'; // Import Footer
import BookShelf from "./components/BookShelf"; // Bookshelf component
import SearchBooks from './components/SearchBooks'; // Import SearchBooks component

function App() {
  const [libraryBooks, setLibraryBooks] = useState([]);

  useEffect(() => {
    BooksAPI.getAll().then((books) => {
      setLibraryBooks(books);
    });
  }, []);

  const handleBookMove = (book, newShelf) => {
    BooksAPI.update(book, newShelf).then(() => {
      book.shelf = newShelf;
      setLibraryBooks(libraryBooks.filter(b => b.id !== book.id).concat(book));
    });
  };

  const bookShelves = [
    { title: 'Currently Reading', shelfId: 'currentlyReading' },
    { title: 'Want to Read', shelfId: 'wantToRead' },
    { title: 'Read', shelfId: 'read' }
  ];

  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <div>
                <button className="find-book-btn">
                  <Link to="/search" style={{ color: 'white', textDecoration: 'none' }}>
                    Find a new book
                  </Link>
                </button>
                {bookShelves.map(shelf => (
                  <BookShelf
                    key={shelf.shelfId}
                    shelfLabel={shelf.title}
                    booksOnShelf={libraryBooks.filter(book => book.shelf === shelf.shelfId)}
                    onShelfChange={handleBookMove}
                  />
                ))}
              </div>
            } />
            <Route path="/search" element={<SearchBooks onShelfChange={handleBookMove} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
