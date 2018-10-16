import {RECEIVE_CURRENT_USER, RECEIVE_ERRORS} from '.././actions/session_actions';

const sessionErrorsReducer = (state = [], action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      debugger
      return [];
    case RECEIVE_ERRORS:
      // debugger
      return action.errors;
    default:
      return state;
  };
};

export default sessionErrorsReducer;
