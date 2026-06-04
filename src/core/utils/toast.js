import Swal from "sweetalert2";

const toastDefaults = {
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  showCloseButton: true,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
};

export const showSuccessToast = (title, text = "") => {
  Swal.fire({
    ...toastDefaults,
    icon: "success",
    title,
    text,
    customClass: {
      popup: "auth-toast auth-toast-success",
      title: "auth-toast-title",
      htmlContainer: "auth-toast-text",
      timerProgressBar: "auth-toast-progress auth-toast-progress-success",
    },
  });
};

export const showErrorToast = (title, text = "") => {
  Swal.fire({
    ...toastDefaults,
    icon: "error",
    title,
    text,
    timer: 5000,
    customClass: {
      popup: "auth-toast auth-toast-error",
      title: "auth-toast-title",
      htmlContainer: "auth-toast-text",
      timerProgressBar: "auth-toast-progress auth-toast-progress-error",
    },
  });
};
