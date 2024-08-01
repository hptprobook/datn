import { useEffect, useState } from 'react';
import Input from './input';
import axios from 'axios';

export default function Products() {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    catId: '6698681738655c29527b979a',
    name: 'Product 3',
    description: {
      short: '1',
      long: '123',
    },
    price: 100,
    brand: 'VN',
    stock: 100,
    tags: ['Đồ 1', 'Đồ 2'],
    slug: 'product-1',
    vars: [
      {
        color: 'white',
        size: 'S',
        stock: 100,
        imageURL: '',
        price: 100,
      },
      {
        color: 'white',
        size: 'M',
        stock: 100,
        imageURL: '',
        price: 100,
      },
      {
        color: 'purple',
        size: 'S',
        stock: 100,
        imageURL: '',
        price: 100,
      },
    ],
  });
  const [imagesChange, setImagesChange] = useState([]);
  const [imagesDelete, setImagesDelete] = useState([]);
  const [imagesAdd, setImagesAdd] = useState([]);
  const [imagesChangeVariantAdd, setImagesChangeVariantAdd] = useState([]);
  const [formDataChange, setFormDataChange] = useState({
    id: '66aa54e947e1de222ec1e57b',
    catId: '6698681738655c29527b979a',
    name: 'Product 1 Edit',
    description: {
      short: '123123',
      long: '213142154512',
    },
    price: 100,
    brand: 'VN',
    stock: 100,
    tags: ['Đồ 1 Edit 2', 'Đồ 2 Edit 2'],
    slug: 'product-1',
    vars: [
      {
        color: 'white',
        size: 'S',
        stock: 100,
        imageURL: '1722438889067-129784979.jpg',
        price: 100,
      },
      {
        color: 'white',
        size: 'M',
        stock: 100,
        imageURL: '1722438889068-638539276.jpg',
        price: 100,
      },
      {
        color: 'purple',
        size: 'S',
        stock: 100,
        imageURL: '1722438889069-365895972.jpg',
        price: 100,
      },
    ],
  });

  const handleChangeVariant = (index, e) => {
    const file = e.target.files[0];
    const newFormData = { ...formData };
    newFormData.vars[index]['imageURL'] = file;
    setFormData(newFormData);
  };
  const handleChangeVariant2 = (index, e) => {
    const file = e.target.files[0];
    setImagesChangeVariantAdd([
      ...imagesChangeVariantAdd,
      {
        image: file,
        index: index,
      },
    ]);
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const formDatas = new FormData();
    formDatas.append('cat_id', formData.catId);
    formDatas.append('name', formData.name);
    formDatas.append('description', JSON.stringify(formData.description));
    images.forEach((image) => {
      formDatas.append('images', image);
    });
    formDatas.append('price', formData.price);
    formDatas.append('brand', formData.brand);
    formDatas.append('stock', formData.stock);
    formData.tags.forEach((tag) => formDatas.append('tags', tag));
    formDatas.append('slug', formData.slug);
    formData.vars.forEach((variant) => {
      formDatas.append('vars', JSON.stringify(variant));
    });
    formData.vars.forEach((variant) => {
      formDatas.append('varsImg', variant.imageURL);
    });
    try {
      const response = await axios.post(
        'http://localhost:3000/api/products/add',
        formDatas
      );
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };
  const handleChangeInform = async (e) => {
    e.preventDefault();
    console.log(imagesDelete);
    const formDatas = new FormData();
    formDatas.append('cat_id', formDataChange.catId);
    formDatas.append('name', formDataChange.name);
    formDatas.append('description', JSON.stringify(formDataChange.description));
    if (imagesDelete.length > 0) {
      imagesDelete.forEach((image) => {
        formDatas.append('imagesDelete', image);
      });
    } else {
      formDatas.append('imagesDelete', imagesDelete);
    }
    imagesAdd.forEach((image) => {
      formDatas.append('imagesAdd', image);
    });
    imagesChangeVariantAdd.forEach((image) => {
      formDatas.append('varsImg', image.image);
    });
    imagesChangeVariantAdd.forEach((image) => {
      formDatas.append('indexVars', image.index);
    });
    formDatas.append('price', formDataChange.price);
    formDatas.append('brand', formDataChange.brand);
    formDatas.append('stock', formDataChange.stock);
    formDataChange.tags.forEach((tag) => formDatas.append('tags', tag));
    formDatas.append('slug', formDataChange.slug);
    formDataChange.vars.forEach((variant) => {
      formDatas.append('vars', JSON.stringify(variant));
    });

    try {
      const response = await axios.put(
        `http://localhost:3000/api/products/${formDataChange.id}`,
        formDatas
      );
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };
  const handleImage = async (e) => {
    const files = e.target.files;
    const newImageFiles = [];
    for (let i = 0; i < files.length; i++) {
      newImageFiles.push(files[i]);
    }
    setImages([...images, ...newImageFiles]);
  };
  const handleImageIn = async (e) => {
    const files = e.target.files;
    const newImageFiles = [];
    for (let i = 0; i < files.length; i++) {
      newImageFiles.push(files[i]);
    }
    setImagesAdd([...imagesAdd, ...newImageFiles]);
  };

  const deleteImg = (e, image) => {
    e.preventDefault();
    const newImgs = imagesChange.filter((img) => img !== image);
    setImagesChange(newImgs);
    setImagesDelete(newImgs);
  };
  const deleteImgVariant = (e, index) => {
    e.preventDefault();
    const newFormData = { ...formDataChange };
    newFormData.vars[index]['imageURL'] = '';
    setFormDataChange(newFormData);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        'http://localhost:3000/api/products/66aa54e947e1de222ec1e57b'
      );
      console.log(formDataChange);
      setImagesChange(res.data.product.imgURLs);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <main className="z-0 max-w-container mx-auto px-2 lg:px-0">
        <form className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block font-semibold" htmlFor="image">
              Image
            </label>
            <input
              className="mt-1 w-full rounded-md border-2 p-4 py-3"
              type="file"
              id="image"
              name="image"
              multiple
              onChange={handleImage}
            />
          </div>
          {formData.vars.map((variant, index) => (
            <div key={index}>
              <label className="block font-semibold" htmlFor={`image-${index}`}>
                Image {index}
              </label>
              <input
                className="mt-1 w-full rounded-md border-2 p-4 py-3"
                type="file"
                id={`image-${index}`}
                name="image"
                onChange={(e) => handleChangeVariant(index, e)}
              />
            </div>
          ))}
          <button
            type="submit"
            onClick={handleAdd}
            className="rounded-md bg-[#121633] text-white p-3 mt-2"
          >
            Submit
          </button>
        </form>
        <form className="space-y-4 mt-8" encType="multipart/form-data">
          <div>
            <label className="block font-semibold" htmlFor="image">
              Image Change
            </label>
            <input
              className="mt-1 w-full rounded-md border-2 p-4 py-3"
              type="file"
              id="imageChange"
              name="imageChange"
              multiple
              onChange={handleImageIn}
            />
          </div>
          <div className="space-x-2">
            {imagesChange &&
              imagesChange.map((image, index) => (
                <button key={index} onClick={(e) => deleteImg(e, image)}>
                  Delete {image}
                </button>
              ))}
          </div>
          {formDataChange.vars.map((variant, index) => (
            <div key={index}>
              <label className="block font-semibold" htmlFor={`image_${index}`}>
                Image {index}
              </label>
              <input
                className="mt-1 w-full rounded-md border-2 p-4 py-3"
                type="file"
                id={`image_${index}`}
                name="image"
                onChange={(e) => handleChangeVariant2(index, e)}
              />
              {variant.imageURL !== '' && (
                <button
                  className="mt-4"
                  onClick={(e) => deleteImgVariant(e, index)}
                >
                  Delete {variant.imageURL}
                </button>
              )}
            </div>
          ))}
          <button
            type="submit"
            onClick={handleChangeInform}
            className="rounded-md bg-[#121633] text-white p-3 mt-2"
          >
            Change
          </button>
        </form>
      </main>
    </>
  );
}
