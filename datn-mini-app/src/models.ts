import { ReactNode } from "react";

export type OrderStatus = "pending" | "shipping" | "finish";

export type Options = {
  name: string;
  title: string;
  option: {
    value: string;
    label: string;
    checked?: boolean;
  }[];
};

export type CartProduct = {
  _id: string;
  order: {
    quantity: number;
    note: string;
    [key: string]: any;
  };
};

export type Product = {
  _id: string;
  imgProduct: string;
  nameProduct: string;
  salePrice: number | string;
  retailPrice: number | string;
  description: string;
  options: Options[];
};

export type Store = {
  _id: string;
  logoStore: string;
  bannerStore: string;
  nameStore: string;
  followers: number;
  address: string;
  type: "personal" | "business";
  categories: string[];
  listProducts: Product[];
};

export type StoreOrder = {
  status: OrderStatus;
  listOrder: CartProduct[];
  date: Date;
  address?: Address;
};

export type SectionProductsProps = {
  _id?: string;
  title: string;
  watchMore?: boolean;
  pathBanner?: string;
  direction?: "vertical" | "horizontal";
  colPercentage?: number;
  children?: (data: Product | Store) => ReactNode;
  data: any;
  onChoose?: () => void;
};

export type OrderStoreProps = {
  keyStore: number;
  listPickupItems: { keyItem: number; quantity: number }[];
};

export type Address = {
  city: string;
  district: string;
  ward: string;
  detail: string;
};

export type HeaderType = {
  route?: string;
  hasLeftIcon?: boolean;
  title?: string;
  customTitle?: ReactNode;
  type?: "primary" | "secondary";
  rightIcon?: ReactNode;
};

export type AddressFormType = {
  name: "detail" | "city" | "district" | "ward";
  label: string;
  type: "text" | "select";
  placeholder: string;
  isValidate: boolean;
  errorMessage?: string;
};

export type ProductInfoPicked = {
  productId: string;
  isUpdate?: boolean;
};
