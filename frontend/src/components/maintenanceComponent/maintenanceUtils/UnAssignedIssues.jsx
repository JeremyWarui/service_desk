import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, FormControl, Select } from "react-bootstrap";
import ReactPaginate from 'react-paginate';
import { useNavigate } from "react-router-dom";
import moment from "moment";

import "./tablesStyles.css"; // Assuming your custom styles are here

const UnassignedIssues = () => {
  const [issues, setIssues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      const categories = response.data.categories;
      setCategories(categories);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchIssues = async (page) => {
    setIsLoading(true);

    try {
      const response = await axios.get(`/api/open-issues`);
      const { issues: unassignedIssues, page: currentPage, pages, total } = response.data;

      // Fetch category data concurrently
      const promises = unassignedIssues.map((issue) =>
        axios.get(`/api/categories/${issue.category._id}`)
      );
      const categories = await Promise.all(promises);

      const updatedIssues = unassignedIssues.map((issue, index) => ({
        ...issue,
        category: categories[index]?.data?.category?.category_name ?? null,
        technician: "Not yet assigned", // No need for technician data here
      }));

      const filteredIssues = updatedIssues.filter(
        (issue) => !selectedCategory || issue.category === selectedCategory
      );

      setCurrentPage(page);
      setPages(pages);
      setTotal(total);
      setIssues(filteredIssues);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues(currentPage);
    fetchCategories();
  }, [ currentPage,selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    fetchIssues(1); // Fetch first page on category change
  };

  const handlePageChange = (newPage) => {
    fetchIssues(newPage);
  };

  return (
    <>
      <div className="container">
        <h1 className="my-3">Open Assignments</h1>

        <Form className="mb-3">
          <Form.Group controlId="filterCategory">
            <Form.Label>Filter by Category:</Form.Label>
            <Form.Control
              as="select"
              value={selectedCategory || ''}
              onChange={handleCategoryChange}
            >
              <option value="">Select Category</option>
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category.category_name}>
                  {category.category_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>

        <hr />

        {isLoading ? (
          <p>Loading issues...</p>
        ) : (
          <>
          <Table
            striped
            bordered
            hover
            responsive="md"
            className="table table-sm"
          >
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Category</th>
                <th>Message</th>
                <th>Status</th>
                <th>Reported On</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue._id}>
                  <td>{issue.issue_id}</td>
                  <td>{issue.category}</td>
                  <td>{issue.issue_message}</td>
                  <td>{issue.issue_status}</td>
                  <td>{moment(issue.createdAt).format("DD/MM/YYYY")}</td>
                  <td>{issue.technician}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        navigate(
                          `/maintenance-dashboard/assign-issues/${issue._id}`,
                          { state: { issue } }
                        )
                      }
                    >
                      Update
                    </Button>
                  </td>
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
    </>
  );
};

export default UnassignedIssues;
