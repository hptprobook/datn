import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { iconForNotify } from '~/pages/User/Profile/utils/iconForNotify';

const NotifyBar = ({ notifies }) => {
  return (
    <Link
      to={'/nguoi-dung/tai-khoan/thong-bao'}
      className="relative text-2xl text-gray-50 cursor-pointer group z-10"
    >
      <Icon icon="line-md:bell" />
      <div className="absolute w-[400px] top-14 right-0 bg-gray-100 text-black cursor-default py-4 text-xs shadow-md shadow-gray-200 hidden group-hover:block before:absolute before:w-60 before:h-8 before:-top-8 before:right-0 before:bg-transparent">
        <p className="text-gray-700 text-md font-bold py-2 px-4">
          Thông báo mới nhận
        </p>
        <div>
          {notifies && notifies.length > 0 ? (
            notifies
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map((notify) => {
                const notifyIcon = iconForNotify.find(
                  (item) => item.type === notify.type
                );
                return (
                  <div
                    className={`cursor-pointer hover:bg-gray-200 hover:text-red-600 ${
                      !notify.isReaded ? 'bg-red-100' : ''
                    }`}
                    key={notify._id}
                  >
                    <div className="flex items-center py-3 text-sm px-4">
                      <Icon
                        icon={notifyIcon ? notifyIcon.icon : 'line-md:bell'}
                        className={`w-10 h-10 mr-4 ${
                          notifyIcon ? notifyIcon.color : ''
                        }`}
                      />
                      <div>
                        <p className="font-bold text-md">{notify?.title}</p>
                        <p className="text-gray-600 text-sm font-light">
                          {notify?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="flex items-center py-3 text-sm px-4 justify-center">
              <span className="text-wrap">Không có thông báo nào!</span>
            </div>
          )}
        </div>
        <div className="text-gray-700 mt-4 py-2 px-4 text-center hover:text-red-600 cursor-pointer">
          Xem tất cả
        </div>
      </div>
    </Link>
  );
};

NotifyBar.propTypes = {};

export default NotifyBar;
