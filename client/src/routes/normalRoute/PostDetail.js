import React, { Fragment, useEffect } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Row, Col, Button } from "reactstrap";
import {
  POST_DETAIL_LOADING_REQUEST,
  POST_DELETE_REQUEST,
  USER_LOADING_REQUEST,
} from "../../redux/types";
import { GrowingSpinner } from "../../components/spinner/Spinner";

const PostDetail = (req) => {
  const dispatch = useDispatch();
  const { postDetail, creatorId, title, isLoading } = useSelector(
    (state) => state.post
  );

  const { userName, userId } = useSelector((state) => state.auth);
  console.log(req.match.params.id, "Post Detail Params ID");
  useEffect(() => {
    dispatch({
      type: POST_DETAIL_LOADING_REQUEST,
      payload: req.match.params.id,
    });
    dispatch({
      type: USER_LOADING_REQUEST,
      payload: localStorage.getItem("token"),
    });
  }, [dispatch, req.match.params.id]);

  const onDeleteClick = () => {
    dispatch({
      type: POST_DELETE_REQUEST,
      payload: {
        id: req.match.params.id,
        token: localStorage.getItem("token"),
      },
    });
  };

  const EditButton = (
    <Fragment>
      <Row className="d-flex justify-content-center pb-3">
        <Col className="col-md-3 mr-md-3">
          <Link to="/" className="btn btn-primary btn-block">
            Home
          </Link>
        </Col>
        <Col className="col-md-3 mr-md-3">
          <Link
            to={`post/${req.match.params.id}/edit`}
            className="btn btn-success btn-block"
          >
            Edit Post
          </Link>
        </Col>
        <Col className="col-md-3">
          <Button className="btn btn-danger btn-block" onClick={onDeleteClick}>
            Delete
          </Button>
        </Col>
      </Row>
    </Fragment>
  );

  const HomeButton = (
    <Fragment>
      <Row className="d-flex justify-content-center pb-3">
        <Col className="col-sm-12 com-md-3">
          <Link to="/" className="btn btn-primary btn-block">
            Home
          </Link>
        </Col>
      </Row>
    </Fragment>
  );
  console.log(postDetail, "PostDetail");
  //console.log(creator, "Creator");
  const Body = (
    <>
      {userId === creatorId ? EditButton : HomeButton}
      <Row className="border-bottom border-top border-primary p-3 mb-3 justify-content-between">
        {(() => {
          if (postDetail && postDetail.creator) {
            return (
              <Fragment>
                <div className="font-weight-bold text-big">
                  <span className="mr-3">
                    {postDetail.categories.map((category) => (
                      <Button color="info">{category.categoryName}</Button>
                    ))}
                  </span>
                  {postDetail.title}
                </div>
                <div className="align-self-end">{postDetail.creator.name}</div>
              </Fragment>
            );
          }
        })()}
      </Row>
    </>
  );
  return (
    <div>
      <Helmet title={`Post | ${title}`}></Helmet>
      {isLoading === true ? GrowingSpinner : Body}
    </div>
  );
};

export default PostDetail;
