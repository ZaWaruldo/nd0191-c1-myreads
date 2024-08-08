import React from 'react';
import BookItem from './Book';

function BookShelf({ shelfLabel, booksOnShelf, onShelfChange }) {
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{shelfLabel}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {booksOnShelf.map(book => (
            <li key={book.id}>
              <BookItem book={book} onShelfChange={onShelfChange} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default BookShelf;
