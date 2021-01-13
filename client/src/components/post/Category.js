import React from "react";
import { Link } from "react-router-dom";
import { Badge, Button } from "reactstrap";

const Category = ({ posts }) => {
  console.log(posts, "Posts");
  return (
    <>
      {Array.isArray(posts) ? (
        posts.map(({ _id, posts, categoryName }) => (
          <div key={_id} className="mx-1 mt01 my_category">
            <Link
              to={`/post/category/${categoryName}`}
              className="text-dark text-decoration-none"
            >
              <span className="ml-1">
                <Button color="info">
                  {categoryName}
                  &nbsp;
                  <Badge color="light">{posts.length}</Badge>
                </Button>
              </span>
            </Link>
          </div>
        ))
      ) : (
        <div>hi</div>
      )}
    </>
  );
};

export default Category;
