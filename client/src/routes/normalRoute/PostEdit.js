import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import { editorConfiguration } from "../../components/editor/EditorConfig";
import {
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Progress,
} from "reactstrap";

import Myinit from "../../components/editor/UploadAdapter";
import dotenv from "dotenv";
import { POST_EDIT_UPLOADING_REQUEST } from "../../redux/types";
dotenv.config();

const PostEdit = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [form, setValues] = useState({ title: "", contents: "", fileUrl: "" });
  const { postDetail } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  //Setting up for input handling
  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    setValues({
      title: postDetail.title,
      contents: postDetail.contents,
      fileUrl: postDetail.fileUrl,
    });
  }, [postDetail.title, postDetail.contents, postDetail.fileUrl]);

  const onSubmit = async (e) => {
    await e.preventDefault();
    const { title, contents, fileUrl, category } = form;
    const token = localStorage.getItem("token");
    const id = postDetail._id;
    const body = { title, contents, fileUrl, category, token, id };

    dispatch({
      type: POST_EDIT_UPLOADING_REQUEST,
      payload: body,
    });
  };

  const getDataFromEditor = (event, editor) => {
    const data = editor.getData();
    console.log(data);
    let whereImgEnd = "";
    let result_url = "";
    const ext_name = ["gif", "jpeg", "jpg", "png"];

    if (data && data.match("<img src=")) {
      const whereImgStart = data.indexOf("<img src=");
      //console.log(whereImgStart, "Start");
      for (let i = 0; i < ext_name.length; i++) {
        if (data.match(ext_name[i])) {
          whereImgEnd = data.indexOf(ext_name[i]);
          //console.log(whereImgEnd, ext_name[i], "IMG end");
          result_url =
            data.substring(whereImgStart + 10, whereImgEnd) + ext_name[i];
        }
      }
      console.log(result_url, "First Picture of URL From the Editor");
      setValues({
        ...form,
        fileUrl: result_url,
        contents: data,
      });
    } else {
      setValues({
        ...form,
        fileUrl: process.env.REACT_APP_EMPTY_IMAGE_URL,
        contents: data,
      });
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <Form onSubmit={onSubmit}>
          <FormGroup className="mb-3">
            <Label for="title">Title</Label>
            <Input
              defaultValue={postDetail.title}
              type="text"
              name="title"
              id="title"
              className="form-control"
              onChange={onChange}
            />
          </FormGroup>

          <FormGroup className="mb-3">
            <Label for="content">Content</Label>
            <CKEditor
              data={postDetail.contents}
              editor={ClassicEditor}
              config={editorConfiguration}
              onReady={Myinit}
              onBlur={getDataFromEditor}
            />
            <Button
              color="success"
              block
              className="mt-3 col-md-2 offset-md-10 mb-3"
            >
              Submit
            </Button>
          </FormGroup>
        </Form>
      ) : (
        <Col width={50} className="p-5 m-5">
          <Progress animated color="info" value={100} />
        </Col>
      )}
    </div>
  );
};

export default PostEdit;
