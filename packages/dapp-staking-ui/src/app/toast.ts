import toast from "react-hot-toast";

export const errorToast = (message: string) => toast.error(message);

export const successToast = (message: string) => toast.success(message);

export const infoToast = (message: string) => toast(message);

export const validationErrorToast = (message: string) =>
  toast.error(message, { id: "validation-error" });
