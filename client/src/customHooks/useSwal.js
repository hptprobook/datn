import Swal from 'sweetalert2';

const useSwal = Swal.mixin({
  scrollbarPadding: false,
  confirmButtonColor: '#d33',
});

const useSwalWithConfirm = Swal.mixin({
  scrollbarPadding: false,
  confirmButtonColor: '#d33',
  cancelButtonColor: '#3085d6',
  showCancelButton: true,
});

export { useSwal, useSwalWithConfirm };
