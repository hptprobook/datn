import { Icon } from '@iconify/react';
import { NavLink } from 'react-router-dom';

const NotifyBar = ({ notifies }) => {
  return (
    <div className='relative text-2xl text-gray-50 cursor-pointer group z-50'>
      <Icon icon='line-md:bell' />
      <div className='absolute min-w-64 top-11 right-0 bg-gray-100 text-black cursor-default py-4 text-xs shadow-md shadow-gray-200 hidden group-hover:block before:absolute before:w-8 before:h-5 before:-top-5 before:right-0 before:bg-transparent'>
        <p className='text-gray-700 capitalize py-2 px-4'>Thông báo mới nhận</p>
        <div>
          {notifies && notifies.length > 0 ? (
            notifies.map((notify) => {
              return (
                <div
                  className={`${
                    !notify.isReaded && 'bg-gray-200 text-red-600'
                  }`}
                  key={notify._id}
                >
                  <div className='flex items-center py-3 text-sm px-4'>
                    <img
                      src='https://cdn-icons-png.flaticon.com/512/6863/6863272.png'
                      className='w-6 h-6 mr-3'
                    />
                    <span className='text-wrap'>{notify.description}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className='flex items-center py-3 text-sm px-4 justify-center'>
              <span className='text-wrap'>Không có thông báo nào hết</span>
            </div>
          )}
        </div>
        <NavLink to={'/nguoi-dung/tai-khoan/thong-bao'}>
          <p className='text-gray-700 capitalize py-2 px-4 text-center'>
            Xem tất cả
          </p>
        </NavLink>
      </div>
    </div>
  );
};

NotifyBar.propTypes = {};

export default NotifyBar;
