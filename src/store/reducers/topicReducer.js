import actionTypes from "../actions/actionTypes";

const initialState = {
  topics: [],
};

const topicReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ALLTOPIC_SUCCESS:
      state.topics = action.topics;
      return {
        ...state,
      };
    case actionTypes.USER_LOGIN_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default topicReducer;
