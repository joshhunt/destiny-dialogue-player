import { createContext, useContext } from "react";
import { AnyDialogueStructure } from "../../types";

type GoToFn = (node: AnyDialogueStructure, id: string) => void;

const goToContext = createContext<GoToFn | undefined>(undefined);
export const GoToProvider = goToContext.Provider;

export function useGoTo() {
  const value = useContext(goToContext);
  if (!value) {
    throw new Error("GoTo Context value not provided");
  }

  return value;
}
