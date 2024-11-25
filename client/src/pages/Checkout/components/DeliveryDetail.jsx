import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getAllWarehouses } from '~/APIs';
import {
  getAllProvinces,
  getCoordinatesFromAddress,
  getDistrictsByProvinceId,
  getWardsByDistrictId,
} from '~/APIs/address';
import { getShippingFee } from '~/APIs/Shipping';
import MainLoading from '~/components/common/Loading/MainLoading';
import SearchableSelect from '~/components/common/Select/SearchableSelect';
import Input from '~/components/common/TextField/Input';
import { useCheckoutContext } from '~/context/CheckoutContext';
import { useSwal } from '~/customHooks/useSwal';
import { handleToast } from '~/customHooks/useToast';
import { calculateDistance, formatCurrencyVND } from '~/utils/formatters';

const DeliveryDetail = ({ selectedProducts, setShippingFee }) => {
  const { formik } = useCheckoutContext();
  const nearestWarehouse = useRef(null);
  const DEFAULT_FROM_DISTRICT_ID = 1552;

  const { data: provinces } = useQuery({
    queryKey: ['provinces'],
    queryFn: () => getAllProvinces(),
  });

  const { data: warehouses, isLoading: isLoadingWarehouses } = useQuery({
    queryKey: ['warehouses'],
    queryFn: getAllWarehouses,
    keepPreviousData: true,
  });

  const provinceOptions = provinces
    ? provinces.map((province) => ({
        value: province.ProvinceID,
        label: province.ProvinceName,
      }))
    : [];

  const { data: districts, refetch: refetchDistricts } = useQuery({
    queryKey: ['districts', formik.values.province_id],
    queryFn: () => getDistrictsByProvinceId(formik.values.province_id),
    enabled: !!formik.values.province_id && formik.values.province_id != '',
    keepPreviousData: true,
  });

  const districtOptions = districts
    ? districts.map((district) => ({
        value: district.DistrictID,
        label: district.DistrictName,
      }))
    : [];

  const { data: wards, refetch: refetchWards } = useQuery({
    queryKey: ['wards', formik.values.district_id],
    queryFn: () => getWardsByDistrictId(formik.values.district_id),
    enabled: !!formik.values.district_id && formik.values.district_id != '',
    keepPreviousData: true,
  });

  const wardOptions = wards
    ? wards.map((ward) => ({
        value: ward.WardCode,
        label: ward.WardName,
      }))
    : [];

  const totalWeight = selectedProducts.reduce((total, product) => {
    return total + product.weight * product.quantity;
  }, 0);

  const fetchShippingFee = async () => {
    if (
      formik.values.district_id &&
      formik.values.ward_id &&
      nearestWarehouse.current
    ) {
      let data = {
        service_type_id: 2,
        from_district_id: +nearestWarehouse.current.district_id,
        to_district_id: formik.values.district_id,
        to_ward_code: formik.values.ward_id,
        weight: totalWeight || 1,
        items: selectedProducts.map((product) => ({
          name: product.name,
          quantity: product.quantity,
          weight: product.weight,
        })),
      };

      try {
        let response = await getShippingFee(data);

        if (response?.data?.total <= 0) {
          data.service_type_id = 5;
          response = await getShippingFee(data);
        }

        setShippingFee(response?.data?.total);
      } catch (error) {
        useSwal.fire(
          'Lỗi!',
          'Lỗi khi lấy phí vận chuyển, vui lòng chọn một địa chỉ khác',
          'error'
        );
      }
    }
  };

  // query lấy tất cả kho
  useEffect(() => {
    const fetchWarehouses = async () => {
      if (warehouses && formik.values.district_id && formik.values.ward_id) {
        try {
          // Lấy tọa độ từ địa chỉ người dùng
          const userCoordinates = await getCoordinatesFromAddress(
            `${formik.values.address}, ${formik.values.ward_name}, ${formik.values.district_name}, ${formik.values.province_name}`
          );

          const [userLongitude, userLatitude] = userCoordinates;

          let minDistance = Infinity;
          warehouses.forEach((warehouse) => {
            const distance = calculateDistance(
              userLatitude,
              userLongitude,
              warehouse.latitude,
              warehouse.longitude
            );

            if (distance < minDistance) {
              minDistance = distance;
              nearestWarehouse.current = warehouse;
            }
          });

          fetchShippingFee();
        } catch (error) {
          nearestWarehouse.current = {
            district_id: DEFAULT_FROM_DISTRICT_ID,
          };
          fetchShippingFee();
          handleToast(
            'warning',
            'Không thể xác định tọa độ từ địa chỉ của bạn. Sử dụng kho mặc định để tính phí vận chuyển.'
          );
        }
      }
    };

    fetchWarehouses();
  }, [formik.values.ward_id, warehouses]);

  useEffect(() => {
    fetchShippingFee();
  }, [formik.values.ward_id, nearestWarehouse]);

  if (isLoadingWarehouses) {
    return <MainLoading />;
  }

  return (
    <div className="min-w-0 flex-1 space-y-8 text-gray-800">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          ĐỊA CHỈ GIAO HÀNG
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id={'name'}
            label={'Họ và tên'}
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && formik.errors.name}
          />

          <Input
            id={'email'}
            label={'Email'}
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && formik.errors.email}
          />

          <Input
            id={'phone'}
            label={'Số điện thoại'}
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && formik.errors.phone}
          />

          <div></div>

          <div>
            <SearchableSelect
              id="province"
              label="Tỉnh / Thành phố"
              name="province_id"
              options={provinceOptions}
              value={formik.values.province_id}
              defaultValue={'Chọn tỉnh / thành phố'}
              onChange={(option) => {
                formik.setFieldValue('province_id', option.value);
                formik.setFieldValue('province_name', option.label);

                formik.setFieldValue('district_id', '');
                formik.setFieldValue('district_name', '');
                formik.setFieldValue('ward_id', '');
                formik.setFieldValue('ward_name', '');

                refetchDistricts();
              }}
              error={formik.touched.province_id && formik.errors.province_id}
            />
          </div>

          <div>
            <SearchableSelect
              id="district"
              label="Quận / Huyện"
              name="district"
              options={districtOptions}
              value={formik.values.district_id}
              onChange={(option) => {
                formik.setFieldValue('district_id', option.value);
                formik.setFieldValue('district_name', option.label);

                formik.setFieldValue('ward_id', '');
                formik.setFieldValue('ward_name', '');

                refetchWards();
              }}
              error={formik.touched.district_id && formik.errors.district_id}
            />
          </div>

          <div>
            <SearchableSelect
              id="ward"
              label="Xã / Phường"
              name="ward"
              options={wardOptions}
              value={formik.values.ward_id}
              onChange={(option) => {
                formik.setFieldValue('ward_id', option.value.toString());
                formik.setFieldValue('ward_name', option.label);
              }}
              error={formik.touched.ward_id && formik.errors.ward_id}
            />
          </div>

          <Input
            id={'address'}
            label={'Số nhà/ Đường'}
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            error={formik.touched.address && formik.errors.address}
          />

          <div className="sm:col-span-2">
            <div>
              <label
                htmlFor={'note'}
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                {' '}
                {'Ghi chú'}{' '}
              </label>
              <textarea
                rows={3}
                id={'note'}
                className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                placeholder={'Ghi chú'}
                required
                name="note"
                value={formik.values.note}
                onChange={formik.handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div id="payment" className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Phương thức thanh toán
        </h3>

        <label className="flex cursor-pointer gap-2 items-center">
          <input
            type="radio"
            className="radio bg-white"
            name="paymentMethod"
            value="VNPAY"
            checked={formik.values.paymentMethod === 'VNPAY'}
            onChange={formik.handleChange}
          />
          <span>Thanh toán qua VNPAY</span>
        </label>

        <label className="flex cursor-pointer gap-2 items-center">
          <input
            type="radio"
            className="radio bg-white"
            name="paymentMethod"
            value="Tiền mặt"
            checked={formik.values.paymentMethod === 'Tiền mặt'}
            onChange={formik.handleChange}
          />
          <span>Thanh toán khi nhận hàng</span>
        </label>

        {formik.touched.paymentMethod && formik.errors.paymentMethod && (
          <p className="text-sm text-red-600">{formik.errors.paymentMethod}</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900">Giỏ hàng</h3>
        <div className="grid grid-cols-12 mt-8 max-md:hidden pb-6 border-b border-gray-200">
          <div className="col-span-5 md:col-span-5">
            <p className="font-normal text-md leading-8 text-gray-400">
              Sản phẩm
            </p>
          </div>
          <div className="col-span-6 md:col-span-7">
            <div className="grid grid-cols-5">
              <div className="col-span-4">
                <p className="font-normal text-md leading-8 text-gray-400 text-center">
                  Số lượng
                </p>
              </div>
              <div className="col-span-1">
                <p className="font-normal text-md leading-8 text-gray-400 text-right">
                  Tổng tiền
                </p>
              </div>
            </div>
          </div>
        </div>
        {selectedProducts.map((product, index) => (
          <div
            key={index}
            className="flex flex-col min-[500px]:flex-row min-[500px]:items-center gap-5 py-6  border-b border-gray-200 group"
          >
            <Link to={`/san-pham/${product.slug}`}>
              <div className="w-full md:max-w-[126px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="mx-auto object-cover"
                />
              </div>
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-12 w-full">
              <div className="md:col-span-5">
                <div className="flex flex-col max-[500px]:items-center gap-3">
                  <NavLink to={`/san-pham/${product.slug}`}>
                    <h6 className="font-semibold text-base leading-7 text-black hover:text-red-600 cursor-pointer hover:underline">
                      {product.name}
                    </h6>
                  </NavLink>
                  <h6 className="font-normal text-base leading-7 text-gray-500">
                    {product?.variantColor}
                    {product?.variantSize !== 'FREESIZE' &&
                      ` - ${product.variantSize}`}
                  </h6>
                  <h6 className="font-medium text-base leading-7 text-gray-600 transition-all duration-300">
                    {formatCurrencyVND(product.price)}
                  </h6>
                </div>
              </div>
              <div className="flex items-center h-full max-md:mt-3 md:col-span-3 justify-center">
                {product.quantity}
              </div>
              <div className="flex items-center justify-center md:justify-end max-md:mt-3 h-full md:col-span-4">
                <div className="flex items-center flex-col">
                  <p className="flex md:block font-bold text-md leading-8 text-gray-600 text-center transition-all duration-300">
                    <p className="mr-2 md:hidden">Tổng: </p>
                    {formatCurrencyVND(product.price * product.quantity)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

DeliveryDetail.propTypes = {};

export default DeliveryDetail;
