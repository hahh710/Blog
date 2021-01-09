import React, { Fragment, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Row, Col, Button, Container } from "reactstrap";
import {
  POST_DETAIL_LOADING_REQUEST,
  POST_DELETE_REQUEST,
  USER_LOADING_REQUEST,
} from "../../redux/types";
import { GrowingSpinner } from "../../components/spinner/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faCommentDots,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import BalloonEditor from "@ckeditor/ckeditor5-editor-balloon/src/ballooneditor";
import { editorConfiguration } from "../../components/editor/EditorConfig";
import Comments from "../../components/comments/comments";

const PostDetail = (req) => {
  const dispatch = useDispatch();
  const { postDetail, creatorId, title, isLoading } = useSelector(
    (state) => state.post
  );

  //for comments
  const { comments } = useSelector((state) => state.comment);
  console.log(comments, "comments");
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
      {
        <Row className="border-top border-primary d-flex p-1 mb-3 justify-content-between">
          <div>
            <Button className="align-self-end" color="info">
              categories
            </Button>
          </div>
        </Row>
      }
      <Row className="border-bottom border-top border-primary d-flex p-3 mb-3 justify-content-between">
        {(() => {
          if (postDetail && postDetail.creator) {
            return (
              <Fragment>
                <div className="font-weight-bold text-big">
                  <span className="mr-3 ">
                    {postDetail.categories.map((category) => (
                      <Button className="align-self-end" color="info">
                        {category.categoryName}
                      </Button>
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
      {postDetail && postDetail.comments ? (
        <Fragment>
          <div className="d-flex justify-content-end align-items-baseline small">
            <FontAwesomeIcon icon={faPencilAlt} />
            &nbsp;
            <span> {postDetail.date}</span>
            &nbsp;&nbsp;
            <FontAwesomeIcon icon={faCommentDots} />
            &nbsp;
            <span>{postDetail.comments.length}</span>
            &nbsp;&nbsp;
            <FontAwesomeIcon icon={faEye} />
            <span>{postDetail.views}</span>
          </div>
          <Row className="mb-3">
            <CKEditor
              editor={BalloonEditor}
              config={editorConfiguration}
              data={postDetail.contents}
              disabled="true"
            />
          </Row>
          <Row>
            <Container className="mb-3 border border-blue rounded">
              {Array.isArray(comments)
                ? comments.map(
                    ({ contents, date, creator, creatorName, _id }) => (
                      <div key={_id}>
                        <Row className="justify-content-between p-2">
                          <div className="font-weight-bold">
                            {creatorName ? creatorName : creator}
                          </div>
                          <div className="text-small">
                            <span className="font-weight-bold">
                              {date.split(" ")[0]}
                            </span>
                            <span className="font-weight-light">
                              {" "}
                              {date.split(" ")[1]}
                            </span>
                          </div>
                        </Row>
                        <Row className="p-2">{contents}</Row>
                        <hr />
                      </div>
                    )
                  )
                : "Creator"}
              <Comments
                id={req.match.params.id}
                userId={userId}
                userName={userName}
              />
            </Container>
          </Row>
        </Fragment>
      ) : (
        <h1>Hi</h1>
      )}
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
