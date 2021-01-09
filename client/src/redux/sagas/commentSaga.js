import axios from "axios";
import { all, call, put, takeEvery, fork } from "redux-saga/effects";
import { push } from "connected-react-router";
import {
  COMMENT_LOADING_FAILURE,
  COMMENT_LOADING_SUCCESS,
  COMMENT_LOADING_REQUEST,
  COMMENT_UPLOADING_REQUEST,
  COMMENT_UPLOADING_SUCCESS,
  COMMENT_UPLOADING_FAILURE,
} from "../types";

// Comments load
const loadCommentsAPI = (payload) => {
  console.log(payload, "loadCommentsAPI ID");
  return axios.get(`/api/post/${payload}/comments`);
};

function* loadComments(action) {
  try {
    const result = yield call(loadCommentsAPI, action.payload);
    console.log(result);
    yield put({
      type: COMMENT_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: COMMENT_LOADING_FAILURE,
      payload: e,
    });
    yield push("/");
  }
}

function* watchLoadComments() {
  yield takeEvery(COMMENT_LOADING_REQUEST, loadComments);
}

// Comments Upload
const uploadCommentsAPI = (payload) => {
  console.log(payload.id, "uploadCommentsAPI ID");
  return axios.post(`/api/post/${payload.id}/comments`, payload);
};

function* uploadComments(action) {
  try {
    const result = yield call(uploadCommentsAPI, action.payload);
    console.log(result, "uploadComments");
    yield put({
      type: COMMENT_UPLOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: COMMENT_UPLOADING_FAILURE,
      payload: e,
    });
    yield push("/");
  }
}

function* watchUploadComments() {
  yield takeEvery(COMMENT_UPLOADING_REQUEST, uploadComments);
}

export default function* commentSaga() {
  yield all([fork(watchLoadComments), fork(watchUploadComments)]);
}
