import axios from 'axios';
import { useState } from 'react';

export default function Inventories() {
  const [formData, setFormData] = useState({
    productId: '669bb95902b3201abc75dad6',
    userId: '669bdbf2aa7f88f69cdcd238',
    supplierId: '66928b91d8681663f21e9c32',
    vars: {
      color: 'blue',
      size: 'S',
    },
    type: 'stock',
    quantity: 100,
  });
  const [formDataChange, setFormDataChange] = useState({
    id: '669be3f7e1012ef50be1c141',
    productId: '669bb95902b3201abc75dad6',
    userId: '669bdbf2aa7f88f69cdcd238',
    supplierId: '66928b91d8681663f21e9c32',
    vars: {
      color: 'red',
      size: 'S',
    },
    type: 'stock',
    quantity: 100,
  });
  const handleAdd = async (e) => {
    e.preventDefault();

    const formDatas = new FormData();
    formDatas.append('productId', formData.productId);
    formDatas.append('userId', formData.userId);
    formDatas.append('supplierId', formData.supplierId);
    formDatas.append('vars', JSON.stringify(formData.vars));
    formDatas.append('type', formData.type);
    formDatas.append('quantity', formData.quantity);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/inventories/add',
        formDatas
      );
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };
  const handleChangeInform = async (e) => {
    e.preventDefault();
    const formDatas = new FormData();
    formDatas.append('productId', formDataChange.productId);
    formDatas.append('userId', formDataChange.userId);
    formDatas.append('supplierId', formDataChange.supplierId);
    formDatas.append('vars', JSON.stringify(formDataChange.vars));
    formDatas.append('type', formDataChange.type);
    formDatas.append('quantity', formDataChange.quantity);

    try {
      const response = await axios.put(
        `http://localhost:3000/api/inventories/${formDataChange.id}`,
        formDatas
      );
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <main className="z-0 max-w-container mx-auto px-2 lg:px-0">
      <form className="space-y-4" encType="multipart/form-data">
        <button
          type="submit"
          onClick={handleAdd}
          className="rounded-md bg-[#121633] text-white p-3 mt-2"
        >
          Submit
        </button>
      </form>
      <form className="space-y-4 mt-8" encType="multipart/form-data">
        <button
          type="submit"
          onClick={handleChangeInform}
          className="rounded-md bg-[#121633] text-white p-3 mt-2"
        >
          Change
        </button>
      </form>
    </main>
  );
}
