import axios from "axios";
import { all, call, put, takeEvery, fork } from "redux-saga/effects";
import { push } from "connected-react-router";
import {
  POST_LOADING_FAILURE,
  POST_LOADING_REQUEST,
  POST_LOADING_SUCCESS,
  POST_UPLOAD_REQUEST,
  POST_UPLOAD_SUCCESS,
  POST_UPLOAD_FAILURE,
  POST_DETAIL_LOADING_REQUEST,
  POST_DETAIL_LOADING_SUCCESS,
  POST_DETAIL_LOADING_FAILURE,
  POST_DELETE_REQUEST,
  POST_DELETE_SUCCESS,
  POST_DELETE_FAILURE,
  POST_EDIT_LOADING_REQUEST,
  POST_EDIT_LOADING_SUCCESS,
  POST_EDIT_LOADING_FAILURE,
  POST_EDIT_UPLOADING_REQUEST,
  POST_EDIT_UPLOADING_SUCCESS,
  POST_EDIT_UPLOADING_FAILURE,
  CATEGORY_FIND_REQUEST,
  CATEGORY_FIND_SUCCESS,
  CATEGORY_FIND_FAILURE,
} from "../types";

//All Post Load

const loadPostAPI = () => {
  return axios.get("/api/post");
};

function* loadPosts() {
  try {
    const result = yield call(loadPostAPI);
    console.log(result, "LoadPosts");
    yield put({
      type: POST_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: POST_LOADING_FAILURE,
      payload: e,
    });
    yield put(push("/"));
  }
}

function* watchLoadPosts() {
  yield takeEvery(POST_LOADING_REQUEST, loadPosts);
}

//Post Detail
const loadPostDetailAPI = (payload) => {
  console.log(payload, "Payload");
  return axios.get(`/api/post/${payload}`);
};

function* loadPostDetail(action) {
  try {
    const result = yield call(loadPostDetailAPI, action.payload);
    console.log(result, "Post Detail Saga");

    yield put({
      type: POST_DETAIL_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: POST_DETAIL_LOADING_FAILURE,
      payload: e,
    });
    console.log("Load Post Detail Error");
    yield put(push("/"));
  }
}

function* watchloadPostDetail() {
  yield takeEvery(POST_DETAIL_LOADING_REQUEST, loadPostDetail);
}

//Post Upload
const uploadPostAPI = (payload) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const token = payload.token;
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return axios.post("api/post", payload, config);
};

function* uploadPost(action) {
  try {
    const result = yield call(uploadPostAPI, action.payload);
    yield put({
      type: POST_UPLOAD_SUCCESS,
      payload: result.data,
    });
    yield put(push(`/post/${result.data._id}`));
  } catch (e) {
    yield put({
      type: POST_UPLOAD_FAILURE,
      payload: e,
    });
    yield put(push("/"));
  }
}

function* watchuploadPost() {
  yield takeEvery(POST_UPLOAD_REQUEST, uploadPost);
}

//Post Delete
//Only the owner of the post can delete the post.
// Need a token
const deletePostAPI = (payload) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const token = payload.token;

  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return axios.delete(`/api/post/${payload.id}`, config);
};

function* deletePost(action) {
  try {
    const result = yield call(deletePostAPI, action.payload);

    yield put({
      type: POST_DELETE_SUCCESS,
      payload: result.data,
    });

    yield put(push("/"));
  } catch (e) {
    yield put({
      type: POST_DELETE_FAILURE,
      payload: e,
    });
    yield put(push("/"));
  }
}

function* watchDeletePost() {
  yield takeEvery(POST_DELETE_REQUEST, deletePost);
}

//Post Edit
const editPostAPI = (payload) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const token = payload.token;

  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return axios.get(`/api/post/${payload.id}/edit`, config);
};

function* editPost(action) {
  try {
    const result = yield call(editPostAPI, action.payload);

    yield put({
      type: POST_EDIT_LOADING_SUCCESS,
      payload: result.data,
    });

    yield put(push(`/api/post/${action.payload.id}`));
  } catch (e) {
    yield put({
      type: POST_EDIT_LOADING_FAILURE,
      payload: e,
    });
    console.log("Load Post Detail Error");
    yield put(push("/"));
  }
}

function* watchEditPost() {
  yield takeEvery(POST_EDIT_LOADING_REQUEST, editPost);
}

//Post Edit Upload
const editUploadAPI = (payload) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const token = payload.token;

  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return axios.post(`/api/post/${payload.id}/edit`, payload, config);
};

function* editUpload(action) {
  try {
    const result = yield call(editUploadAPI, action.payload);

    yield put({
      type: POST_EDIT_UPLOADING_SUCCESS,
      payload: result.data,
    });

    yield put(push(`/post/${result.data._id}`));
  } catch (e) {
    yield put({
      type: POST_EDIT_UPLOADING_FAILURE,
      payload: e,
    });
    console.log("Load Post Detail Error");
    yield put(push("/"));
  }
}

function* watchEditUpload() {
  yield takeEvery(POST_EDIT_UPLOADING_REQUEST, editUpload);
}

//Category Find Result
const categoryFindAPI = (payload) => {
  //encodeURIComponent is URI의 특정한 문자를 UTF-8로 인코딩해 4개이하 의 연속된 이스케이프 문자로 나타내줍니다.
  //encodeURIComponent is used when other languages are used other than english
  return axios.get(`/api/post/category/${encodeURIComponent(payload)}`);
};

function* categoryFind(action) {
  try {
    const result = yield call(categoryFindAPI, action.payload);

    yield put({
      type: CATEGORY_FIND_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: CATEGORY_FIND_FAILURE,
      payload: e,
    });
    console.log("Category Find result Error");
    yield put(push("/"));
  }
}

function* watchCategoryFind() {
  yield takeEvery(CATEGORY_FIND_REQUEST, categoryFind);
}

export default function* postSaga() {
  yield all([
    fork(watchLoadPosts),
    fork(watchuploadPost),
    fork(watchloadPostDetail),
    fork(watchDeletePost),
    fork(watchEditPost),
    fork(watchEditUpload),
    fork(watchCategoryFind),
  ]);
}
