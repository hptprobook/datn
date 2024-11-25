import { useState } from 'react';
import { getTimeDifference } from '~/utils/formatters';
import NotifyModal from './components/NotifyModal';

import { useUser } from '~/context/UserContext';
import MainLoading from '~/components/common/Loading/MainLoading';
import { readAllNotifiesAPI, updateCurrentUser } from '~/APIs';
import { useMutation } from '@tanstack/react-query';
import { useSwal, useSwalWithConfirm } from '~/customHooks/useSwal';

const Notifies = () => {
  const [selectedNotify, setSelectedNotify] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [filterValue, setFilterValue] = useState(''); // Quản lý giá trị filter
  const { user, refetchUser } = useUser();

  const { mutate: markAsRead, isLoading } = useMutation({
    mutationFn: (notify) => {
      const updateNotify = user.notifies.map((n) =>
        n._id === notify._id ? { ...n, isReaded: true } : n
      );
      return updateCurrentUser({ notifies: updateNotify });
    },
    onSuccess: () => {
      refetchUser();
    },
  });

  const { mutate: readAll } = useMutation({
    mutationFn: readAllNotifiesAPI,
    onSuccess: () => {
      useSwal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Đánh dấu tất cả thông báo của bạn là "Đã đọc"!',
        confirmButtonText: 'Xác nhận',
        timer: 1000,
      });
      refetchUser();
    },
  });

  const handleNotifyClick = (notify) => {
    if (!notify.isReaded) {
      markAsRead(notify);
    }
    setSelectedNotify(notify);

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  const handleReadAll = () => {
    useSwalWithConfirm
      .fire({
        icon: 'question',
        title: 'Đọc tất cả thông báo',
        text: 'Bạn có chắc chắn? Hành động này không thể hoàn tác!',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy bỏ',
      })
      .then((result) => {
        if (result.isConfirmed) {
          readAll();
        }
      });
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filterNotifies = () => {
    if (!filterValue) return user?.notifies;

    const now = new Date();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    const filterOptions = {
      '1 tuần trước': (date) => {
        const differenceInDays = Math.floor(
          (now - new Date(date)) / oneDayInMs
        );
        return differenceInDays === 7;
      },
      '1 tháng trước': (date) => {
        const differenceInDays = Math.floor(
          (now - new Date(date)) / oneDayInMs
        );
        return differenceInDays >= 30 && differenceInDays < 60;
      },
      'Cũ nhất': () => true,
    };

    let filtered = user?.notifies?.filter((notify) =>
      filterOptions[filterValue](notify.createdAt)
    );

    // Nếu chọn "Cũ nhất", sắp xếp theo thời gian tăng dần
    if (filterValue === 'Cũ nhất') {
      filtered = filtered?.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }

    return filtered;
  };

  const filteredNotifies = filterNotifies();

  if (!user || isLoading) return <MainLoading />;

  return (
    <div className="text-black bg-white rounded-sm p-10">
      <div className="w-full rounded-xl mx-auto">
        <div className="inline-flex items-center justify-between w-full">
          <h3 className="font-bold text-xl sm:text-2xl text-gray-900">
            Thông báo
          </h3>

          <select
            className="select select-success rounded-md w-52"
            value={filterValue}
            onChange={handleFilterChange}
          >
            <option value="">Tất cả</option>
            <option value="1 tuần trước">1 tuần trước</option>
            <option value="1 tháng trước">1 tháng trước</option>
            <option value="Cũ nhất">Cũ nhất</option>
          </select>
        </div>

        {filteredNotifies?.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            <p className="text-lg">Không có thông báo nào</p>
          </div>
        )}

        {filteredNotifies?.slice(0, visibleCount).map((notify) => (
          <div
            key={notify?._id}
            className={`mt-2 px-6 py-4 cursor-pointer rounded-lg shadow w-full border hover:scale-101 transition-transform duration-300 border-gray-200
            ${!notify?.isReaded ? 'bg-red-100 ' : 'bg-white '}`}
            onClick={() => handleNotifyClick(notify)}
          >
            <div className="inline-flex items-center justify-between w-full">
              <div className="inline-flex items-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/6863/6863272.png"
                  className="w-6 h-6 mr-3"
                />
                <h3 className="font-bold text-base text-gray-800">
                  {notify?.title}
                </h3>
              </div>
              <p className="text-xs text-gray-500">
                {getTimeDifference(notify?.createdAt)}
              </p>
            </div>
            <p className="mt-1 text-sm">{notify?.description}</p>
          </div>
        ))}

        <div className="text-center">
          {visibleCount < filteredNotifies?.length && (
            <button
              onClick={handleLoadMore}
              className="btn rounded-md btn-primary mt-4"
            >
              Xem thêm
            </button>
          )}
        </div>

        <button
          className="inline-flex text-sm bg-white justify-center px-4 py-2 mt-12 w-full text-red-500 items-center rounded font-medium
           shadow border focus:outline-none transform transition-transform duration-700 hover:bg-red-500
            hover:text-white"
          onClick={handleReadAll}
        >
          Đánh dấu tất cả là đã đọc
        </button>
      </div>

      <NotifyModal
        notify={selectedNotify}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Notifies;
