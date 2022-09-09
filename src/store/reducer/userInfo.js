const initialUserState = {
  friendAuth: false,
  groupAuth: false,
  token: null,
  twitterId: null,
  twitterName: null,
  twitterStatus: false,
};

const UserReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case "USER_INFO":
      return { ...state, ...action.value };
    case "SET_USER_TOKEN":
      return { ...state, token: action.value };
    case "CLEAR_TOKEN":
      return { ...state, token: null };
    default:
      return state;
  }
};

export default UserReducer;
