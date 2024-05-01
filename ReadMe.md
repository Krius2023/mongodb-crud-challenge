Prerequisties
- Nodejs installed
- Local MongoDB installed

1. Clone the repo
2. Run `npm install`
3. Write codes inside services folder (`dao.service.ts`, `get.author.ts`, `get.book.ts`)
4. Run `tsc`
5. Run the test scripts to validate the solution using the following commands:
    1. `npm run test-author` to run the authors.test.js tests.
    2. `npm run test-book` to run the books.test.js tests.
    3. `npm run fetch-book` to run the fetchBook.test.js tests.
    4. `npm run fetch-author` to run the fetchAuthor.test.js tests.


# Description

### Functions
Create the list of functions

- `createRecord(model, type)`: Creates a new record based on the type (book or author).
- `updateRecord(bookId, updates)`: Updates a book record with the provided updates.
- `deleteRecord(bookId)`: Deletes a book record.
- `getAuthor(authorId)`: Retrieves an author's details, including books count and book information.
- `getBook(bookId)`: Retrieves a book's details, including author information, books count, and other books by the author.

### createRecord

- Input:
    - `model`: The data to be saved.
    - `type`: The type of record to create (book or author).
- Logic:
    - If type is `"book"`:
        - Check if an author record exists with the requested authorId. If not, throw an error `"Author not found"`.
        - Check if a book record already exists with the same title and authorId. If so, throw an error `"Book already exists"`.
        - If no error, save the book record and update the booksCount in the respective author record.
    - If type is `"author"`:
        - Check if an author record already exists with the same name. If so, throw an error `"Author name already exists"`.
        - If no error, save the author record.

### updateRecord

- Input:
    - `bookId`: The ID of the book record to update.
    - An object with fields to update (`title` / `authorId`).
- Logic:
    - If authorId is updated:
        - Check if an author record exists with the updating authorId. If not, throw an error `"Author not found"`.
    - Update the book record and update the `booksCount` in the respective old and new author records.

### deleteRecord

- Input:
    - `bookId`: The ID of the book record to delete.
- Logic:
    - Delete the book record and update the `booksCount` in the respective author records.

### getAuthor

- Input:
    - `authorId`: The ID of the author record to retrieve.
- Response:
    - Object to have authorDetails and booksByAuthor.
    - authorDetails: An object with the `authorId`, `name` and `booksCount`.
    - booksByAuthor: An array of book objects with `_id`, `title`, and `addedOn` date.

### getBook

- Input:
    - `bookId`: The ID of the book record to retrieve.
- Response:
    - Object to have `bookDetails`, `authorDetails`, `otherBooksByAuthor`
    - `bookDetails`: An object with the book's title, authorId, and addedOn date.
    - `authorDetails`: An object with the author's _id, name, and booksCount.
    - `otherBooksByAuthor`: An array of book objects with _id and title.