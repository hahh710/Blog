import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  COMMENT_LOADING_REQUEST,
  COMMENT_UPLOADING_REQUEST,
  COMMENT_UPLOADING_SUCCESS,
} from "../../redux/types";
import { Form, FormGroup, Row, Input, Button } from "reactstrap";

const Comments = ({ id, userId, userName }) => {
  const dispatch = useDispatch();
  const [form, setValues] = useState({ contents: "" });

  const onSubmit = async (e) => {
    await e.preventDefault();
    const { contents } = form;
    const token = localStorage.getItem("token");
    const body = {
      contents,
      token,
      id,
      userId,
      userName,
    };
    dispatch({
      type: COMMENT_UPLOADING_REQUEST,
      payload: body,
    });
    resetValue.current.value = "";
    setValues("");
  };
  //After submit the comment, reseting the contents
  const resetValue = useRef(null);

  useEffect(() => {
    dispatch({
      type: COMMENT_LOADING_REQUEST,
      payload: id,
    });
  }, [dispatch, id]);

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
        <FormGroup>
          <Row className="p-2">
            <div className="font-weight-bold m-1"> Make a comment</div>
            <div className="my-1"></div>
            <Input
              innerRef={resetValue}
              type="textarea"
              name="contents"
              id="contents"
              onChange={onChange}
              placeholder="Comment"
            />
            <Button
              color="primary"
              block
              className="mt-2 offset-md-10 col-md-2"
            >
              Submit
            </Button>
          </Row>
        </FormGroup>
      </Form>
    </>
  );
};

export default Comments;
