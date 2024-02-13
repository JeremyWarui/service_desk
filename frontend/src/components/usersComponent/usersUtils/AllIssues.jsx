import React, { useState, useEffect } from "react";
import { Table, Button, Spinner, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import axios from "axios";
import moment from "moment";
import "./tablesStyles.css";

const AllIssues = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availableCategories, setAvailableCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/categories")
      .then((response) => setAvailableCategories(response.data.categories))
      .catch((error) => console.error(error));
    fetchIssues(currentPage, selectedCategory);
  }, [currentPage, selectedCategory]);

  const fetchIssues = async (page, category) => {
    const categoryId = category;
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/issues?page=${page}`);
      const { issues, page: currentPage, pages, total } = response.data;
      const filteredIssues = categoryId
        ? issues.filter((issue) => issue.category._id === categoryId)
        : issues;
      setIssues(filteredIssues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setCurrentPage(page);
      setPages(pages);
      setTotal(total);
      setError(null);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (data) => {
    const newPage = data.selected + 1;
    setCurrentPage(newPage);
    fetchIssues(newPage, selectedCategory);
  }

  return (
    <div>
      <h1 className="my-4">All Issues</h1>
      <hr />
      {isLoading && <Spinner animation="border" />}
      {error && <div>{error}</div>}
      {!isLoading && !error && (
        <>
          <Form.Group className="mb-4" controlId="categoryFilter">
            <Form.Label>Filter by Category:</Form.Label>
            <Form.Select
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {availableCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Table className="table" striped bordered hover responsive>
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Issue</th>
                <th>Category</th>
                <th>Reported By</th>
                <th>Status</th>
                <th>Date Reported</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue._id}>
                  <td>{issue.issue_id}</td>
                  <td>{issue.issue_message}</td>
                  <td>{issue.category.category_name}</td>
                  <td>{issue.user.user_name}</td>
                  <td>{issue.issue_status}</td>
                  <td>{moment(issue.createdAt).format("DD/MM/YYYY")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={<a href="">...</a>}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            pageCount={pages} // Use the `pages` state
            // initialPage={currentPage - 1} // Use the `currentPage` state
            forcePage={currentPage - 1} // Force the current page to be highlighted
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            activeClassName={"active"}
            previousClassName={"page-item"}
            nextClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextLinkClassName={"page-link"}
            disabledClassName={"disabled"}
            size={"sm"}
            shape={"circle"}
          />
        </>
      )}
    </div>
  );
};

export default AllIssues;
