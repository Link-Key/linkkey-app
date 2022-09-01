import { createContext, useContext, useReducer } from "react";

const initialState = {
  open: false,
  step: 0,
  loading: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
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
