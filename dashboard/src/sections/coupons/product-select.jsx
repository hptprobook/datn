/* eslint-disable react/prop-types */
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from 'src/redux/slices/productSlice';

export default function ProductAcceptSelect({ value = [], onChange }) {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);

  React.useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Map the value to an array of _id's, filtering out any invalid elements
  const valueIds = value.filter(product => product && product._id).map((product) => product._id);

  return (
    <Autocomplete
      multiple
      limitTags={2}
      value={valueIds}
      onChange={(event, newValue) => {
        const selectedProducts = newValue.map((id) => products.find((product) => product._id === id));
        onChange(event, selectedProducts);
      }}
      id="product-accept-select"
      options={products.map((product) => product._id)} // Use _id's as options
      getOptionLabel={(option) => {
        const product = products.find((p) => p._id === option);
        return product ? product.name : '';
      }}
      renderInput={(params) => (
        <TextField {...params} label="Sản phẩm áp dụng" placeholder="Sản phẩm áp dụng..." />
      )}
      sx={{ width: '100%' }}
    />
  );
}