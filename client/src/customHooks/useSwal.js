import Swal from 'sweetalert2';

const useSwal = Swal.mixin({
  scrollbarPadding: false,
  confirmButtonColor: '#d33',
  customClass: {
    confirmButton: 'px-10',
    cancelButton: 'px-10',
    zIndex: '99999999',
  },
});

const useSwalWithConfirm = Swal.mixin({
  scrollbarPadding: false,
  confirmButtonColor: '#d33',
  cancelButtonColor: '#3085d6',
  showCancelButton: true,
  customClass: {
    confirmButton: 'px-10',
    cancelButton: 'px-10',
    zIndex: '999999999',
  },
  reverseButtons: true,
});

export { useSwal, useSwalWithConfirm };
