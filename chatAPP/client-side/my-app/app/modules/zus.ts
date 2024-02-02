import { create } from "zustand";

type InputEmail = {
  inputEmail: string;
  addEmail: (getInputEmail: string) => void;
};

type InputPass = {
  inputPass: string;
  addPass: (getInputPass: string) => void;
};


type AllUsersToDisplay = {
  Users: string[];
  addUsers: (getUsers: string[]) => void;
}

export const getEmailInputs = create<InputEmail>((set) => ({
  inputEmail: "",
  addEmail: (getInputEmail: string) =>
    set((state) => ({ ...state, inputEmail: getInputEmail })),
}));

export const getPassInputs = create<InputPass>((set) => ({
  inputPass: "",
  addPass: (getInputPass: string) =>
    set((state) => ({ ...state, inputPass: getInputPass })),
}));

export const getUsersFunc = create<AllUsersToDisplay>((set:any) => ({
  Users: [''],
  // addUsers: (getUsers: any) => set((state) => ({Users: {...state.Users, names: state.Users.names + getUsers}}))
  addUsers: (getUsers: string[]) => set((state: { Users: any; }) => ({...state, Users: [...state.Users, getUsers]}))
}))
