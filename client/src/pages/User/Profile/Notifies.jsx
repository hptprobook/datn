import React, { useEffect, useState } from 'react';
import { getTimeDifference } from '~/utils/formatters';
import NotifyModal from './components/NotifyModal';
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '~/APIs';

const Notifies = () => {
  const [notifications, setNotifications] = useState([]);
  // const [notifications, setNotifications] = useState([
  //   {
  //     _id: 1,
  //     title: 'Đơn hàng',
  //     shortMessage: 'Đơn hàng của bạn đang được giao tới',
  //     message: 'Đơn hàng của bạn đang được giao tới',
  //     createdAt: 1726194535066,
  //     icon: 'https://cdn-icons-png.flaticon.com/128/763/763812.png',
  //     isReaded: false,
  //   },
  //   {
  //     _id: 2,
  //     title: 'Tin nhắn',
  //     shortMessage: 'Bạn có một tin nhắn mới',
  //     message: 'Bạn có một tin nhắn mới',
  //     createdAt: 1721663287824,
  //     icon: 'https://cdn-icons-png.flaticon.com/512/893/893257.png',
  //     isReaded: true,
  //   },
  //   {
  //     _id: 3,
  //     title: 'Hệ thống',
  //     shortMessage:
  //       'Hãy điền đầy đủ thông tin về bệnh COVID-19 trước khi đến lịch hẹn tới',
  //     message:
  //       'Hãy điền đầy đủ thông tin về bệnh COVID-19 trước khi đến lịch hẹn tới',
  //     createdAt: 1726116897398,
  //     icon: 'https://cdn-icons-png.flaticon.com/512/6863/6863272.png',
  //     isReaded: true,
  //   },
  //   {
  //     _id: 4,
  //     title: 'Hệ thống',
  //     shortMessage:
  //       'Chúc mừng bạn đã đăng ký thành công tài khoản tại chúng tôi!',
  //     message: 'Chúc mừng bạn đã đăng ký thành công tài khoản tại chúng tôi!',
  //     createdAt: 1726476852277,
  //     icon: 'https://cdn-icons-png.flaticon.com/128/763/763812.png',
  //     isReaded: false,
  //   },
  // ]);

  const [selectedNotify, setSelectedNotify] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['getCurrentUser'],
    queryFn: getCurrentUser,
  });

  // Xử lý khi người dùng nhấn vào một thông báo
  const handleNotifyClick = async (notify) => {
    const updatedNotifications = notifications.map((n) =>
      n._id === notify._id ? { ...n, isReaded: true } : n
    );
    setNotifications(updatedNotifications);

    setSelectedNotify({ ...notify, isReaded: true });

    if (!notify.isReaded) {
      await axios.post(`http://localhost:3000/api/users/notify/${notify._id}`, {
        ...notify,
        isReaded: true,
      });
    }

    setModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Đánh dấu tất cả thông báo là đã đọc
  const markAllAsRead = async () => {
    const updatedNotifications = notifications.map((notify) => ({
      ...notify,
      isReaded: true,
    }));
    await axios.post('http://localhost:3000/api/users/notifies', {
      updatedNotifications,
    });

    setNotifications(updatedNotifications);
  };

  const notifies = async (user) => {
    try {
      const result = await axios.get(
        `http://localhost:3000/api/users/notifies/${user._id}`
      );

      setNotifications(result.data.notifies);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    notifies(user);
  }, [user]);

  return (
    <div className='text-black bg-white rounded-sm p-10'>
      <div className='w-full rounded-xl mx-auto'>
        <div className='inline-flex items-center justify-between w-full'>
          <h3 className='font-bold text-xl sm:text-2xl text-gray-900'>
            Thông báo
          </h3>
        </div>

        {notifications && notifications.length > 0
          ? notifications.map((notify) => (
              <div
                key={notify._id}
                className={`mt-2 px-6 py-4 cursor-pointer rounded-lg shadow w-full border hover:scale-101 transition-transform duration-300 border-gray-200
            ${!notify.isReaded ? 'bg-red-100 ' : 'bg-white '}`}
                onClick={() => handleNotifyClick(notify)}
              >
                <div className='inline-flex items-center justify-between w-full'>
                  <div className='inline-flex items-center'>
                    <img
                      src='https://cdn-icons-png.flaticon.com/512/6863/6863272.png'
                      className='w-6 h-6 mr-3'
                    />
                    <h3 className='font-bold text-base text-gray-800'>
                      {notify.description}
                    </h3>
                  </div>
                  <p className='text-xs text-gray-500'>
                    {getTimeDifference(notify.createdAt)}
                  </p>
                </div>
                <p className='mt-1 text-sm'>{notify.note}</p>
              </div>
            ))
          : 'Không có thông báo'}

        <button
          onClick={markAllAsRead}
          className='inline-flex text-sm bg-white justify-center px-4 py-2 mt-12 w-full text-red-500 items-center rounded font-medium
           shadow border focus:outline-none transform transition-transform duration-700 hover:bg-red-500
            hover:text-white'
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
