import actionTypes from "./actionTypes";
import { toast } from "react-toastify";
import { getAllTopics } from "../../services/topicService";

export const fetchAllTopicStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllTopics();
      if (res && res.errCode === 0) {
        dispatch(fetchAllTopicSuccess(res.data));
      } else {
        dispatch(fetchAllTopicFailed());
      }
    } catch (error) {
      dispatch(fetchAllTopicFailed());
    }
  };
};

export const fetchAllTopicSuccess = (data) => ({
  type: actionTypes.FETCH_ALLTOPIC_SUCCESS,
  topics: data,
});

export const fetchAllTopicFailed = () => ({
  type: actionTypes.FETCH_ALLTOPIC_FAILED,
});
