const initialUserState = {
  friendAuth: false,
  groupAuth: false,
  token: null,
  twitterId: null,
  twitterName: null,
  twitterStatus: false,
  clientAddress: null,
};

const UserReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case "USER_INFO":
      return { ...state, ...action.value };
    case "SET_CLIENT_ADD":
      return { ...state, clientAddress: action.value };
    case "SET_USER_TOKEN":
      return { ...state, token: action.value };
    case "CLEAR_USER_INFO":
      return { ...initialUserState };
    default:
      return state;
  }
};

export default UserReducer;
