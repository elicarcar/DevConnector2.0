import { PROFILE_SUCCESS, PROFILE_ERROR } from "../actions/types";

const initialState = {
  profile: null,
  isLoading: true,
  profiles: [],
  github: [],
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case PROFILE_SUCCESS:
      return { ...state, isLoading: false, profile: payload };
    case PROFILE_ERROR:
      return { ...state, isLoading: false, error: payload };
    default:
      return state;
  }
}
