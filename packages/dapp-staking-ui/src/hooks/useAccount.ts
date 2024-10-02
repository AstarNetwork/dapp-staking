import { useContext } from "react";
import { CurrentAccountContext } from "./AccountProvider";

export const useAccount = () => {
  const context = useContext(CurrentAccountContext);

  if (!context) {
    throw new Error("useAccount must be used within a CurrentAccountProvider");
  }

  return context;
};
