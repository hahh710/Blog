import React, { Fragment } from "react";
import {
  Card,
  CardImg,
  Row,
  CardBody,
  CardTitle,
  Badge,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMouse } from "@fortawesome/free-solid-svg-icons";
import emptyImage from "../../assets/Empty-imge.jpg";

const PostCardOne = ({ posts }) => {
  return (
    <Fragment>
      {Array.isArray(posts)
        ? posts.map(({ _id, title, fileUrl, comments, views }) => {
            return (
              <div key={_id} className="col-md-4">
                <Link
                  to={`/post/${_id}`}
                  className="text-dark text-decoration-none"
                >
                  <Card className="mb-3">
                    <CardImg top alt={emptyImage} src={fileUrl} />
                    <CardBody>
                      <CardTitle
                        className="text-truncate d-flex justify-content-between"
                        color="black"
                      >
                        <span className="text-truncate">{title}</span>
                        <span>
                          <FontAwesomeIcon icon={faMouse} />
                          &nbsp; &nbsp;
                          <span>{views}</span>
                        </span>
                      </CardTitle>
                      <Row>
                        <Button className="p-2 btn-block">
                          Detail <Badge color="light">{comments.length}</Badge>
                        </Button>
                      </Row>
                    </CardBody>
                  </Card>
                </Link>
              </div>
            );
          })
        : ""}
    </Fragment>
  );
};

export default PostCardOne;
