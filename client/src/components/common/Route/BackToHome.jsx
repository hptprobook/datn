import { FaHandPointLeft } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const BackToHome = () => {
  return (
    <NavLink to={'/'} className="hover:text-red-600 flex items-center gap-4">
      <FaHandPointLeft />
      Về trang chủ
    </NavLink>
  );
};

BackToHome.propTypes = {};

export default BackToHome;
