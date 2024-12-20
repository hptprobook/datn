import React, { SyntheticEvent, useEffect, useState } from "react";
import AddressForm from "../constants/address-form";
import ButtonFixed from "../components/button-fixed/button-fixed";
import { AddressFormType } from "../models";
import { convertPrice, cx } from "../utils";
import CardStore from "../components/custom-card/card-store";
import { Box, Button, Input, Page, Select, Text } from "zmp-ui";
import { selector, useRecoilValue, useSetRecoilState } from "recoil";
import {
  cartState,
  cartTotalPriceState,
  openProductPickerState,
  productInfoPickedState,
  productState,
  storeState,
} from "../state";
import CardProductOrder from "../components/custom-card/card-product-order";
import { changeStatusBarColor, pay } from "../services";
import useSetHeader from "../hooks/useSetHeader";
import { getConfig } from "../components/config-provider";
import { useLocation } from "react-router-dom";
import axios from "axios";
const { Option } = Select;

const locationVnState = selector({
  key: "locationVn",
  get: () => import("../dummy/location").then((module) => module.default),
});

const FinishOrder = () => {
  const location = useLocation();
  const { cart } = location.state || { cart: { listOrder: [] } };
  const totalPrice = useRecoilValue(cartTotalPriceState);
  const listProducts = useRecoilValue(productState);
  const storeInfo = useRecoilValue(storeState);
  const shippingFee = Number(
    getConfig((config) => config.template.shippingFee)
  );

  const setOpenSheet = useSetRecoilState(openProductPickerState);
  const setProductInfoPicked = useSetRecoilState(productInfoPickedState);
  const setHeader = useSetHeader();
  
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  interface City {
    id: string;
    name: string;
    districts: District[];
  }

  interface District {
    id: string;
    name: string;
    wards: Ward[];
  }

  interface Ward {
    id: string;
    name: string;
  }

  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [currentDistrict, setCurrentDistrict] = useState<District | null>(null);
  const [currentWard, setCurrentWard] = useState<Ward | null>(null);

  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(
    null
  );
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);


  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await fetch('http://localhost:3000/api/address/tinh');
      const data = await response.json();
      setProvinces(data);
      setCurrentCity(data[0]);
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    if (currentCity) {
      const fetchDistricts = async () => {
        const response = await fetch(
          `http://localhost:3000/api/address/huyen/${currentCity.id}`
        );
        const data = await response.json();
        setDistricts(data);
        setCurrentDistrict(data[0]);
        setSelectedDistrictId(data[0].id);
      };

      fetchDistricts();
    }
  }, [currentCity]);

  useEffect(() => {
    if (currentDistrict) {
      const fetchWards = async () => {
        const response = await fetch(
          `http://localhost:3000/api/address/xa/${currentDistrict.id}`
        );
        const data = await response.json();
        setWards(data);
        setCurrentWard(data[0]);
        setSelectedWardId(data[0].id);
      };

      fetchWards();
    }
  }, [currentDistrict]);
  const handlePayMoney = async (e: SyntheticEvent) => {
    e.preventDefault();
    await pay(totalPrice);
  };

  const handleChooseProduct = (productId: string) => {
    setOpenSheet(true);
    setProductInfoPicked({ productId, isUpdate: true });
  };

  const filterSelectionInput = (item: AddressFormType) => {
      const locationVN = useRecoilValue(locationVnState);
      let listOptions: any = locationVN;
      let value: string | undefined;
      let handleOnSelect: (id: string) => void;
    
      switch (item.name) {
        case "city":
          listOptions = locationVN;
          value = currentCity?.id;
          handleOnSelect = (cityId) => {
            const selectedCity = locationVN.find(city => city.id === cityId);
            if (selectedCity) {
              const firstDistrict = selectedCity.districts[0];
              const firstWard = firstDistrict.wards[0];
              setCurrentCity(selectedCity);
              setCurrentDistrict(firstDistrict);
              setSelectedDistrictId(firstDistrict.id);
              setCurrentWard(firstWard);
              setSelectedWardId(firstWard.id);
            }
          };
          break;
        case "district":
          listOptions = currentCity?.districts || [];
          value = selectedDistrictId ?? undefined;
          handleOnSelect = (districtId) => {
            const district = currentCity?.districts.find(
              (currentDistrict) => currentDistrict.id === districtId
            );
            if (district) {
              const firstWard = district.wards[0];
              setCurrentDistrict(district);
              setSelectedDistrictId(districtId);
              setCurrentWard(firstWard);
              setSelectedWardId(firstWard.id);
            }
          };
          break;
        case "ward":
          listOptions = currentDistrict?.wards || [];
          value = selectedWardId ?? undefined;
          handleOnSelect = (wardId) => setSelectedWardId(wardId);
          break;
        default:
          listOptions = locationVN;
          value = undefined;
          handleOnSelect = () => {};
          break;
      }
      return { listOptions, value, handleOnSelect };
    };

  useEffect(() => {
    setHeader({ title: "Đơn đặt hàng", type: "secondary" });
    changeStatusBarColor("secondary");
  }, []);

  return (
    <Page>
      {cart && (
        <div className=" mb-[80px]">
          <Box m={0} p={4} className=" bg-white">
            <CardStore
              store={storeInfo}
              hasRightSide={false}
              hasBorderBottom={false}
              type="order"
            />
          </Box>
          <Box mx={3} mb={2}>
          {cart.listOrder.map((product) => {
        const productInfo = listProducts.find(
          (prod) => prod._id.toString() === product._id
        );
        if (!productInfo) {
          console.error(`Product info not found for product ID: ${product._id}`);
          return null;
        }
        return (
          <CardProductOrder
            pathImg={productInfo.imgProduct}
            nameProduct={productInfo.nameProduct}
            salePrice={productInfo.salePrice}
            quantity={product.order.quantity}
            key={productInfo._id}
            _id={product._id}
            handleOnClick={(productId) => handleChooseProduct(productId.toString())}
          />
        );
      })}
          </Box>
          <Box m={4} flex flexDirection="row" justifyContent="space-between">
            <span className=" text-base font-medium">Đơn hàng</span>
            <span className=" text-base font-medium text-primary">
              {convertPrice(totalPrice)}đ
            </span>
          </Box>
          <Box m={0} px={4} className=" bg-white">
            <Text size="large" bold className=" border-b py-3 mb-0">
              Địa chỉ giao hàng
            </Text>

            {AddressForm.map((item: AddressFormType) => {
              const { listOptions, value, handleOnSelect } =
                filterSelectionInput(item);

              return (
                <div
                  key={item.name}
                  className={cx("py-3", item.name !== "ward" && "border-b")}
                >
                  <Text
                    size="large"
                    bold
                    className="after:content-['_*'] after:text-primary after:align-middle"
                  >
                    {item.label}
                  </Text>
                  <Box className="relative" m={0}>
                    {item.type === "select" ? (
                      <Select
                        // key={value}
                        id={item.name}
                        placeholder={item.placeholder}
                        name={item.name}
                        value={value}
                        onChange={(value) => {
                          handleOnSelect(value as string);
                        }}
                      >
                        {listOptions?.map((option) => (
                          <Option
                            key={option.id}
                            value={option.id}
                            title={option.name}
                          />
                        ))}
                      </Select>
                    ) : (
                      <Input placeholder="Nhập số nhà, tên đường" clearable />
                    )}
                  </Box>

                  <ButtonFixed zIndex={99}>
                    <Button
                      htmlType="submit"
                      fullWidth
                      className=" bg-primary text-white rounded-lg h-12"
                      onClick={handlePayMoney}
                    >
                      Đặt hàng
                    </Button>
                  </ButtonFixed>
                </div>
              );
            })}
          </Box>
          {shippingFee > 0 && (
            <Box m={4} flex flexDirection="row" justifyContent="space-between">
              <span className=" text-base font-medium">Phí ship</span>
              <span className=" text-base font-medium text-primary">
                {convertPrice(shippingFee)}đ
              </span>
            </Box>
          )}

          <Text className="p-4 text-center">
            {`Đặt hàng đồng nghĩa với việc bạn đồng ý quan tâm 
              ${storeInfo.nameStore} 
              để nhận tin tức mới`}
          </Text>
        </div>
      )}
    </Page>
  );
};

export default FinishOrder;
