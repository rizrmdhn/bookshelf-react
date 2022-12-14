import { HashRouter, json, Route, Routes } from "react-router-dom";
import React from "react";
import axios from "axios";
import FinishedBookContainer from "./components/FinishedBookContainer";
import BookListContainer from "./components/BookListContainer";
import DisplayHeader from "./components/DisplayHeader";
import "./styles/styles.css";
import BookShelfApp from "./components/BookShelfApp";
import ReadBookContainer from "./components/ReadBookContainer";
import qs from "qs";

const api = "http://localhost:5000/";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      response: "",
    };

    this.onAddBookHandler = this.onAddBookHandler.bind(this);
    this.onDeleteHandler = this.onDeleteHandler.bind(this);
    this.onReadingHandler = this.onReadingHandler.bind(this);
    this.onFinishedHandler = this.onFinishedHandler.bind(this);
    this.getDataFromApi = this.getDataFromApi.bind(this);
  }

  getDataFromApi = async () => {
    axios.get(api + "books").then((res) => {
      const bookdata = res.data.data.books;
      this.setState({
        books: bookdata,
      });
    });
  };

  componentDidMount() {
    this.getDataFromApi();
  }

  onAddBookHandler({
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  }) {
    this.setState((prevState) => {
      return {
        books: [
          ...prevState.books,
          {
            id,
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
          },
        ],
      };
    });
  }

  onReadingHandler = async (id) => {
    const datas = await axios
      .get(api + `books/${id}`)
      .then((res) => res.data.data.book);
    axios.put(api + `books/${id}`, {
      id: datas.id,
      name: datas.name,
      year: datas.year,
      author: datas.author,
      summary: datas.summary,
      publisher: datas.publisher,
      pageCount: datas.pageCount,
      readPage: datas.readPage,
      reading: true,
      finished: false,
    });

    const BookRead = this.state.books.filter((book) => book.id === id);
    const ReadBook =
      (BookRead[0].reading = "true") && (BookRead[0].finished = "false");
    this.setState({ ReadBook });
  };

  onFinishedHandler = async (id) => {
    const datas = await axios
      .get(api + `books/${id}`)
      .then((res) => res.data.data.book);
    axios.put(api + `books/${id}`, {
      id: datas.id,
      name: datas.name,
      year: datas.year,
      author: datas.author,
      summary: datas.summary,
      publisher: datas.publisher,
      pageCount: datas.pageCount,
      readPage: datas.readPage,
      reading: false,
      finished: true,
    });

    const BookRead = this.state.books.filter((book) => book.id === id);
    const FinishedBook =
      (BookRead[0].reading = "false") && (BookRead[0].finished = "true");
    this.setState({ FinishedBook });
  };

  onDeleteHandler = (id) => {
    const data = JSON.stringify({
      id: id,
    });

    axios.delete(api + `books/${id}`, {
      data: data,
      headers: { "Content-type": "application/x-www-form-urlencoded" },
    });

    const books = this.state.books.filter((book) => book.id !== id);
    this.setState({ books });
  };

  render() {
    return (
      <div className="App">
        <HashRouter>
          <DisplayHeader />
          <Routes>
            <Route
              exact
              path="/"
              element={<BookShelfApp addbook={this.onAddBookHandler} />}
            />
            <Route
              exact
              path="/Booklist"
              element={
                <BookListContainer
                  books={this.state.books}
                  onDelete={this.onDeleteHandler}
                  onReading={this.onReadingHandler}
                  onFinished={this.onFinishedHandler}
                />
              }
            />
            <Route
              exact
              path="/Reading"
              element={
                <ReadBookContainer
                  books={this.state.books}
                  onFinished={this.onFinishedHandler}
                  onDelete={this.onDeleteHandler}
                />
              }
            />
            <Route
              exact
              path="/Finished"
              element={
                <FinishedBookContainer
                  books={this.state.books}
                  onReading={this.onReadingHandler}
                />
              }
            />
          </Routes>
        </HashRouter>
      </div>
    );
  }
}
export default App;
