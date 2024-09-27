import { StoreTypeRef } from "../constants/referrence";
import { Product, Store } from "../models";
import { getRandomInt } from "../utils";
import {
  listAddress,
  listCategories,
  listDescriptions,
  listNameProducts,
  listNameStore,
  listPrices,
  listProductOptions,
  numLogo,
  numProduct,
  numStoreBanner,
} from "./constants";
import axios from 'axios';
declare const importMeta: {
  readonly env: {
    VITE_APP_SERVER: string;
  };
};
const getImgUrl = (filename: string) =>
  `https://stc-zmp.zadn.vn/zmp-ecommerce/img/${filename}.png`;


export const createProductDummy = async ({ _id }: { _id: number }): Promise<Product[]> => {
  const randomPrice = listPrices[getRandomInt(listPrices.length) - 1];
  let apiData: Partial<Product>[] = [];

  try {
    const res = await axios.get(`${import.meta.env.VITE_APP_SERVER}/api/products`);
    const products = res.data.products; // Assuming res.data.products is the array of products
    if (products && products.length > 0) {
      apiData = products; // Use the entire array of products
      // apiData.forEach(product => console.log(product._id));
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  const product: Product[] = apiData.map((apiProduct, index) => ({
    _id: (apiProduct as any)._id || _id + index,
    imgProduct: (apiProduct as any).thumbnail || getImgUrl(`product-large-${getRandomInt(numProduct)}`),
    nameProduct: (apiProduct as any).name || listNameProducts[getRandomInt(listNameProducts.length) - 1],
    salePrice: (apiProduct as any).price || randomPrice.salePrice,
    retailPrice: (apiProduct as any).variants?.[0]?.price || randomPrice.retailPrice,
    description: apiProduct.description || listDescriptions[getRandomInt(listDescriptions.length) - 1],
    options: getRandomInt(1, 0) === 0 ? [] : listProductOptions,
  }));
  return product;
};

export const createDummyProductCategories = async () => {
  const dummyProducts: Product[] = [];
  const num = 150;
  for (let x = 0; x < num; x += 1) {
    const products = await createProductDummy({ _id: dummyProducts.length });
    dummyProducts.push(...products);
  }
  return dummyProducts.map((product, index) => ({
    ...product,
    _id: `${product._id}`, // Ensure unique id by appending index
  }));
};

export const createDummyStore = async (): Promise<Store> => {
  const storeId = `${+new Date()}`; // Ensure unique store id by appending random number
  const listDummyProducts = await createDummyProductCategories();
  const listType = Object.keys(StoreTypeRef) as (keyof typeof StoreTypeRef)[];
  console.log(listType);
  const dummyStore = {
    _id: storeId,
    logoStore: getImgUrl(`logo-${getRandomInt(numLogo)}-new`),
    bannerStore: getImgUrl(`store-banner-${getRandomInt(numStoreBanner)}`),
    nameStore: listNameStore[getRandomInt(listNameStore.length) - 1],
    followers: getRandomInt(9999, 10),
    address: listAddress[getRandomInt(listAddress.length) - 1],
    type: listType[getRandomInt(listType.length) - 1],
    listProducts: listDummyProducts,
    categories: listCategories,
  };
  console.log(dummyStore);
  return dummyStore;
};