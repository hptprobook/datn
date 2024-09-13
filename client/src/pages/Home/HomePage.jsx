/* eslint-disable react/no-unescaped-entities */
import { NavLink } from 'react-router-dom';
import { bestCategories } from '~/apis/mock_data';
import BestCategories from '~/components/Home/Container/BestCategories/BestCategories';
import CatSuggest from '~/components/Home/Container/CatSuggest/CatSuggest';
import Offer from '~/components/Home/Container/Offer/Offer';
import Post from '~/components/Home/Container/Post/Post';
import HeaderSlider from '~/components/Home/Slider/HeaderSlider';
import Logo from '~/assets/logo2.png';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchProducts = async () => {
  const response = await axios.get('http://localhost:3000/api/products');
  return response.data;
};

export default function HomePage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  console.log('🚀 ~ HomePage ~ data:', data);
  return (
    <>
      <main className="z-0 max-w-container mx-auto px-2 lg:px-0">
        <HeaderSlider />
        <CatSuggest />
        <Offer />
        {bestCategories.map((item) => (
          <BestCategories key={item.id} item={item} />
        ))}
        <div className="banner mt-24 w-full h-slider">
          <NavLink to="#">
            <img
              src="https://swiperjs.com/demos/images/nature-1.jpg"
              className="w-full h-full object-cover"
              alt=""
            />
          </NavLink>
        </div>
        <Post />
      </main>
      <div className="hidden md:flex h-productItem bg-red-800 mt-12 w-screen flex-col items-center">
        <div>
          <img src={Logo} alt="" />
        </div>
        <div className="2xl:px-102 xl:px-80 lg:px-40 md:px-10 sm:px-3 text-white text-center italic">
          <p className="text-xl font-bold">
            "Cảm ơn quý khách hàng đã tin tưởng và ủng hộ cho w0wStore"
          </p>
          <p className="mt-2 font-light">
            W0wStore là một cửa hàng thời trang nổi bật, mang đến cho khách hàng
            những trải nghiệm mua sắm độc đáo và phong cách. Được thành lập với
            mục tiêu phục vụ nhu cầu thời trang đa dạng, W0wStore tự hào cung
            cấp một bộ sưu tập phong phú, từ trang phục hàng ngày đến các bộ sưu
            tập thời trang cao cấp. Mỗi sản phẩm tại W0wStore đều được chọn lọc
            kỹ càng, đảm bảo chất lượng và xu hướng thời trang mới nhất. Cửa
            hàng bày bán nhiều loại trang phục cho cả nam và nữ, từ áo quần, váy
            đầm, đến giày dép và phụ kiện. Với phương châm "Phong cách của bạn,
            cá tính của bạn", W0wStore luôn nỗ lực mang đến cho khách hàng những
            thiết kế hiện đại, hợp mốt và đầy sáng tạo. Đội ngũ nhân viên tận
            tâm và am hiểu về thời trang luôn sẵn sàng tư vấn, giúp khách hàng
            tìm được những sản phẩm phù hợp nhất.
          </p>
        </div>
      </div>
    </>
  );
}
