import { useState, useEffect } from 'react';
import axios from 'axios';

let i = 0;

export default function Products() {
  const [thumbnail, setThumbnail] = useState();
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [variantsDelete, setVariantsDelete] = useState([]);
  const [formData, setFormData] = useState({
    cat_id: ['66e90a8c71049ba8da1a8066'],
    name: 'Quần Kaki Nam Cotton Trơn Form Slim - 10S23PCA100C',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin efficit…',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin efficit…',
    tags: ['Freeship', 'Bán chạy'],
    brand: '66e3faa15b00a0eaab0b04a0',
    status: true,
    variants: [
      {
        price: 710566,
        marketPrice: 710566,
        capitalPrice: 520000,
        onlinePrice: 710566,
        saleOff: 0,
        stock: 150,
        sellCount: 63,
        sku: '516424',
        color: 'Vàng',
        sizes: [
          {
            size: 'S',
            price: 724077,
            stock: 6,
          },
          {
            size: 'M',
            price: 715661,
            stock: 110,
          },
          {
            size: 'L',
            price: 728444,
            stock: 8,
          },
          {
            size: 'XL',
            price: 726942,
            stock: 8,
          },
          {
            size: 'XXL',
            price: 724627,
            stock: 18,
          },
        ],
      },
      {
        price: 710566,
        marketPrice: 710566,
        capitalPrice: 520000,
        onlinePrice: 710566,
        saleOff: 0,
        stock: 294,
        sellCount: 145,
        sku: '149455',
        color: 'Trắng',
        sizes: [
          {
            size: 'S',
            price: 728925,
            stock: 208,
          },
          {
            size: 'M',
            price: 720811,
            stock: 57,
          },
          {
            size: 'L',
            price: 726459,
            stock: 1,
          },
          {
            size: 'XL',
            price: 718752,
            stock: 5,
          },
          {
            size: 'XXL',
            price: 718775,
            stock: 23,
          },
        ],
      },
    ],
    weight: 9,
    height: 93,
    statusStock: 'stock',
    price: 520000,
    productType: ['Nam', 'Nữ'],
  });
  const [imagesChange, setImagesChange] = useState([]);
  const [imagesDelete, setImagesDelete] = useState([]);
  const [imagesAdd, setImagesAdd] = useState([]);
  const [indexVariants, setIndexVariants] = useState([]);

  const [formDataChange, setFormDataChange] = useState({
    id: '66eba8899e337af99de58347',
    variants: [],
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    const formDatas = new FormData();
    if (formData.cat_id.length > 0) {
      formData.cat_id.forEach((cat) => formDatas.append('cat_id', cat));
    } else {
      formDatas.append('cat_id', formData.cat_id);
    }

    formDatas.append('name', formData.name);
    formDatas.append('description', formData.description);
    formDatas.append('content', formData.content);
    formData.tags.forEach((tag) => formDatas.append('tags', tag));
    formData.productType.forEach((type) =>
      formDatas.append('productType', type)
    );
    formDatas.append('brand', formData.brand);
    formDatas.append('status', formData.status);
    formDatas.append('weight', formData.weight);
    formDatas.append('height', formData.height);
    formDatas.append('statusStock', formData.statusStock);
    formDatas.append('price', formData.price);

    if (thumbnail) {
      formDatas.append('thumbnail', thumbnail);
    }

    if (images.length > 0) {
      images.forEach((image) => {
        formDatas.append('images', image);
      });
    }
    formData.variants.forEach((variant) => {
      formDatas.append('variants', JSON.stringify(variant));
      formDatas.append('imageVariants', variant.image);
    });

    try {
      const response = await axios.post(
        'http://localhost:3000/api/products',
        formDatas,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjZlMjc0MjFhN2U0MzJkODY3YTM4NWExIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoicm9vdCIsImlhdCI6MTcyODEyNzA2MSwiZXhwIjoxNzI4MTQ4NjYxfQ.xCh2D0Dyj6GLVBavQsoinhMwOPAO5INQKWNcJvajpw8`,
          },
        }
      );
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };
  const handleChangeInform = async (e) => {
    e.preventDefault();

    const formDatas = new FormData();
    const catId = [formDataChange.cat_id];
    if (catId > 1) {
      formDataChange.cat_id.forEach((cat) => formDatas.append('cat_id', cat));
    } else {
      formDatas.append('cat_id', formDataChange.cat_id);
    }

    formDatas.append('name', formDataChange.name);
    formDatas.append('description', formDataChange.description);
    formDatas.append('content', formDataChange.content);
    formDataChange.tags.forEach((tag) => formDatas.append('tags', tag));
    formDatas.append('brand', formDataChange.brand);
    formDatas.append('status', formDataChange.status);
    formDatas.append('weight', formDataChange.weight);
    formDatas.append('height', formDataChange.height);
    formDatas.append('statusStock', formDataChange.statusStock);
    formDatas.append('productType', formDataChange.productType);
    formDatas.append('imagesDelete', imagesDelete);
    if (Array.isArray(variantsDelete) && variantsDelete.length > 0) {
      variantsDelete.forEach((v) => {
        formDatas.append('variantsDelete', JSON.stringify(v));
      });
    } else {
      formDatas.append('variantsDelete', variantsDelete);
    }

    if (Array.isArray(indexVariants) && indexVariants.length > 0) {
      indexVariants.forEach((v) => {
        formDatas.append('indexVariants', v);
      });
    } else {
      formDatas.append('indexVariants', indexVariants);
    }
    if (thumbnail) {
      formDatas.append('thumbnail', thumbnail);
    }

    if (imagesAdd.length > 0) {
      imagesAdd.forEach((image) => {
        formDatas.append('images', image);
      });
    }

    formDataChange.variants.forEach((variant) => {
      formDatas.append('variants', JSON.stringify(variant));
      if (variant.imageAdd) {
        formDatas.append('imageVariants', variant.imageAdd);
      }
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

  const handleVariant = (e, index) => {
    const file = e.target.files[0];

    const updatedVariants = [...formData.variants];
    updatedVariants[index].image = file;

    setFormData({
      ...formData,
      variants: updatedVariants,
    });
  };

  const handleVariantChange = (e, index) => {
    const file = e.target.files[0];

    if (index >= formDataChange.variants.length) {
      const updatedVariants = [...variants];

      updatedVariants[index].imageAdd = file;
      indexVariants.push(index);

      setFormDataChange({
        ...formDataChange,
        variants: updatedVariants,
      });
    } else {
      const updatedVariants = [...variants];
      updatedVariants[index].imageAdd = file;
      indexVariants.push(index);

      setFormDataChange({
        ...formDataChange,
        variants: updatedVariants,
      });
    }
  };

  const handleThumbnail = async (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
  };

  const handleImage = async (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };
  const handleImageIn = async (e) => {
    const {files} = e.target;
    const newImageFiles = [];
    for (let i = 0; i < files.length; i++) {
      newImageFiles.push(files[i]);
    }
    setImagesAdd([...imagesAdd, ...newImageFiles]);
  };

  const deleteImg = (e, image) => {
    e.preventDefault();

    const newImgs = imagesChange.filter((img) => img !== image);
    const newImgsDelete = imagesChange.filter((img) => img === image);

    setImagesChange(newImgs);
    setImagesDelete(newImgsDelete);
  };
  const handleAddVariant = () => {
    const newVariant = {
      price: 710566,
      marketPrice: 710566,
      capitalPrice: 520000,
      onlinePrice: 710566,
      saleOff: 0,
      stock: 294,
      sellCount: 145,
      sku: `SKU${i + 1}`,
      color: ['Trắng', 'Đen', 'Xanh'][i % 3],
      sizes: [
        {
          size: 'S',
          price: 728925,
          stock: 208,
        },
        {
          size: 'M',
          price: 720811,
          stock: 57,
        },
        {
          size: 'L',
          price: 726459,
          stock: 1,
        },
        {
          size: 'XL',
          price: 718752,
          stock: 5,
        },
        {
          size: 'XXL',
          price: 718775,
          stock: 23,
        },
      ],
    };
    setVariants([...variants, newVariant]);
    setFormDataChange({
      ...formDataChange,
      variants: [...formDataChange.variants, newVariant],
    });
    i++;
  };

  const deleteVariant = (e, i, v) => {
    e.preventDefault();

    const newVariants = variants.filter((variant) => variant !== v);

    const newIndexVariants = indexVariants.filter((item) => item !== i);
    const deleteVariants = variants.filter((variant) => variant === v);

    setFormDataChange({
      ...formDataChange,
      variants: newVariants,
    });
    setIndexVariants(newIndexVariants);
    setVariants(newVariants);
    setVariantsDelete([...variantsDelete, ...deleteVariants]);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/products/${formDataChange.id}`
      );

      const variantsData = res.data.product.variants;
      setVariants(
        Array.isArray(variantsData) ? variantsData : [variantsData || []]
      ); // Gán đúng cách
      setFormDataChange((prev) => ({
        ...prev,
        ...res.data.product,
        variants: Array.isArray(variantsData)
          ? variantsData
          : [variantsData || []], // Đảm bảo variants là mảng
      }));

      setImagesChange(res.data.product.images);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <main className='z-0 max-w-container mx-auto px-2 lg:px-0'>
        <form className='space-y-4' encType='multipart/form-data'>
          <div>
            <label className='block font-semibold' htmlFor='thumbnail'>
              Thumbnail
            </label>
            <input
              className='mt-1 w-full rounded-md border-2 p-4 py-3'
              type='file'
              id='thumbnail'
              name='thumbnail'
              onChange={handleThumbnail}
            />
          </div>
          <div>
            <label className='block font-semibold' htmlFor='images'>
              Images
            </label>
            <input
              className='mt-1 w-full rounded-md border-2 p-4 py-3'
              type='file'
              id='images'
              name='images'
              multiple
              onChange={handleImage}
            />
          </div>
          {formData.variants.map((variant, index) => (
              <div key={index}>
                <label
                  className='block font-semibold'
                  htmlFor={`variant-${index}`}
                >
                  Image {index + 1}
                </label>
                <input
                  className='mt-1 w-full rounded-md border-2 p-4 py-3'
                  type='file'
                  id={`variant-${index}`}
                  name='imageVariants'
                  onChange={(e) => handleVariant(e, index)}
                />
              </div>
            ))}

          <button
            type='submit'
            onClick={handleAdd}
            className='rounded-md bg-[#121633] text-white p-3 mt-2'
          >
            Submit
          </button>
        </form>
        <form className='space-y-4 mt-8' encType='multipart/form-data'>
          <div>
            <label className='block font-semibold' htmlFor='image'>
              Image Change
            </label>
            <input
              className='mt-1 w-full rounded-md border-2 p-4 py-3'
              type='file'
              id='imageChange'
              name='imageChange'
              multiple
              onChange={handleImageIn}
            />
          </div>
          <div className='space-x-2'>
            {imagesChange &&
              imagesChange.map((image, index) => (
                <button key={index} onClick={(e) => deleteImg(e, image)}>
                  Delete {image}
                </button>
              ))}
          </div>
          <div className='space-x-2'>
            {variants.map((variant, index) => (
                <div key={index}>
                  <label
                    className='block font-semibold'
                    htmlFor={`variant-${index}`}
                  >
                    Variant {index + 1}
                  </label>
                  <input
                    className='mt-1 w-full rounded-md border-2 p-4 py-3'
                    type='file'
                    id={`variant-${index}`}
                    name='imageVariants'
                    onChange={(e) => handleVariantChange(e, index)}
                  />
                  <button onClick={(e) => deleteVariant(e, index, variant)}>
                    Delete variant
                  </button>
                </div>
              ))}
          </div>
          <button
            type='button'
            onClick={handleAddVariant}
            className='rounded-md bg-[#121633] text-white p-3 mt-2'
          >
            Add
          </button>
          <button
            type='submit'
            onClick={handleChangeInform}
            className='rounded-md bg-[#121633] text-white p-3 mt-2'
          >
            Change
          </button>
        </form>
      </main>
  );
}
