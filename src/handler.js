const books = require('./books');
const { nanoid } = require('nanoid');

function addBookHandler(request, h) {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished =readPage === pageCount ;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  };
  if (!name){
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400);
  }
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400);
  }
  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess === true) {
    return h.response({
      status: 'success',
      message:  'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    }).code(201);
  }
}

function getBooksHandler(request, h) {
  const { name, reading, finished } = request.query;
  const readingBool = reading === '1'? true : reading === '0'? false : null;
  const finishedBool = finished === '1'? true : finished === '0'? false : null;


  if (name) {
    const filterBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map((book) => ({
      id :  book.id,
      name: book.name,
      publisher: book.publisher
    }));
    console.log('buku by nama', filterBook);
    return h.response({
      status: 'success',
      data: {
        books : filterBook
      }
    }).code(200);
  }

  if (readingBool !== null) {
    const filterBook = filterBookFunction(readingBool, 'reading');
    console.log('book  yang  di reading ', filterBook);
    return h.response({
      status:'success',
      data: {
        books: filterBook
      }
    }).code(200);

  }
  if (finishedBool !== null) {
    const filterBook = filterBookFunction(finishedBool, 'finished');
    console.log('book  yang  selesai ', filterBook);
    return h.response({
      status: 'success',
      data: {
        books: filterBook
      }
    }).code(200);

  }
  if (books.length === 0) {
    return h.response({
      status: 'success',
      data: {
        books : []
      }
    }).code(404);
  }
  const getBooks = books.map((book) => {
    return {
      id :  book.id,
      name: book.name,
      publisher: book.publisher
    };
  });
  console.log('Semua buku', getBooks);
  return h.response({
    status: 'success',
    data: {
      books :getBooks
    }
  }).code(200);
}

function getBookByIdHanlder(request, h){
  const { bookId } = request.params;
  const book = books.filter((book) => book.id == bookId)[0];
  if (book !== undefined){
    return h.response({
      status: 'success',
      data: {
        book: book
      }
    });
  }
  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  }).code(404);
}

function updateBookHandler(request, h){
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();
  const finished = readPage === pageCount;

  const index = books.findIndex((book) => book.id === bookId);
  console.log('bukunya', index);
  if (name === undefined){
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400);
  }
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400);
  }
  if (index === -1){
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    }).code(404);
  }
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
      finished
    };
    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    }).code(200);
  }
  return 'hao';
}

function deleteBookHandler(request, h) {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return h.response({
      status: 'success',
      message:  'Buku berhasil dihapus',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  }).code(404);
}


const filterBookFunction = (valueQuery, properti) => {
  return books.filter((book) => book[properti] === valueQuery).map((book) => ({
    id :  book.id,
    name: book.name,
    publisher: book.publisher
  }));
};

module.exports = { addBookHandler, getBooksHandler, getBookByIdHanlder, updateBookHandler, deleteBookHandler };