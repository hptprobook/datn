import { Helmet } from 'react-helmet-async';
import { NavLink } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <Helmet>
        <title>BMT Life | Không tìm thấy trang</title>
      </Helmet>
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Không tìm thấy
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Rất tiếc, chúng tôi không tìm thấy trang bạn đang tìm kiếm.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <NavLink
            to={'/'}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Về trang chủ
          </NavLink>
          <a href="#" className="text-sm font-semibold text-gray-900">
            Hỗ trợ <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </main>
  );
};

NotFoundPage.propTypes = {};

export default NotFoundPage;
