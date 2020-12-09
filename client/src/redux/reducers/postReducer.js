import {
  POST_LOADING_FAILURE,
  POST_LOADING_REQUEST,
  POST_LOADING_SUCCESS,
} from "../types";

const initialState = {
  isAuthenticated: null,
  posts: [],
  postDetail: "",
  //count is for infinity scroll
  postCount: "",
  isLoading: false,
  error: "",
  creatorId: "",
  categoryFindResult: "",
  title: "",
  searchBy: "",
  searchResult: "",
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_LOADING_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case POST_LOADING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        posts: [...state.posts, ...action.payload],
      };
    case POST_LOADING_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};
export default postReducer;
