import { Slide, toast } from 'react-toastify';

export const handleToast = (type, mess) => {
  toast[type](mess, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Slide,
  });
};
