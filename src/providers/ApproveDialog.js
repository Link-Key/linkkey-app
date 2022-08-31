import { createContext, useContext, useReducer } from "react";

const initialState = {
  open: false,
  title: "",
  content: "",
  btnText: "close",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DIALOG_INFO":
      return { ...action.payload };
    case "SET_VISIBLE":
      return { ...state, open: action.payload };
  }
};

const DialogContext = createContext();

const ApproveDialogProvider = ({ children }) => {
  const [state, dialogDispatch] = useReducer(reducer, initialState);

  return (
    <DialogContext.Provider value={{ state, dialogDispatch }}>
      {children}
    </DialogContext.Provider>
  );
};

const useDialog = () => ({ ...useContext(DialogContext) });

export { useDialog, ApproveDialogProvider };
