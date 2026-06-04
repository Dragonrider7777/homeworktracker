import { Toaster } from "react-hot-toast";

function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "custom-toast",
        duration: 3000
      }}
    />
  );
}

export default ToastProvider;
