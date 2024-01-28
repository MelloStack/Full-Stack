import { create } from "zustand";

type InputEmail = {
  inputEmail: string;
  addEmail: (getInputEmail: string) => void;
};

type InputPass = {
  inputPass: string;
  addPass: (getInputPass: string) => void;
};

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
