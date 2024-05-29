import Swal from 'sweetalert2'
import { IoAlertOutline } from "react-icons/io5";

export const warning = (confirm) => {
  return Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    iconHtml: '!',
    // customClass: {
    //   icon: 'no-border'
    // },
    showCancelButton: true,
    confirmButtonText: confirm,
    customClass: {
      confirmButton: 'cancleButtonAlert  btn bg-second text-light m15-right',
      cancelButton: 'submitButtonAlert btn bg-darkGray text-light'
    },
    buttonsStyling: false
  });
};

export const permissionError = () => {
  return Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "You Do'nt Have Permission!",
  });

};
export const logOut = () => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: "Are you sure?",
      text: "",
      icon: "question",
      showCancelButton: true,
      customClass: {
        confirmButton: "confirmAlert"
      }
    }).then((result) => {
      resolve(result);
    });
  });
};