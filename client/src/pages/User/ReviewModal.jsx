import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useDropzone } from 'react-dropzone';
import { useUser } from '~/context/UserContext';
import { useMutation } from '@tanstack/react-query';
import { ratingProduct, updateOrderAPI } from '~/APIs';
import { useSwal, useSwalWithConfirm } from '~/customHooks/useSwal';
import MainLoading from '~/components/common/Loading/MainLoading';

const ReviewModal = ({ onClose, products, orderId, refetch }) => {
  const [openProduct, setOpenProduct] = useState(null);
  const [productData, setProductData] = useState(
    products.reduce((acc, product) => {
      const uniqueKey = `${product._id}-${product.variantColor || ''}-${
        product.variantSize || ''
      }`;
      acc[uniqueKey] = {
        rating: 0,
        review: '',
        comment: '',
        images: [],
        errors: {},
      };
      return acc;
    }, {})
  );
  const { user } = useUser();

  const handleToggleProduct = (uniqueKey) => {
    setOpenProduct(openProduct === uniqueKey ? null : uniqueKey);
  };

  const handleReviewChange = (uniqueKey, field, value) => {
    setProductData((prev) => ({
      ...prev,
      [uniqueKey]: {
        ...prev[uniqueKey],
        [field]: value,
        errors: { ...prev[uniqueKey].errors, [field]: '' }, // Xóa lỗi khi người dùng nhập lại
      },
    }));
  };

  const handleRatingChange = (uniqueKey, rating) => {
    setProductData((prev) => ({
      ...prev,
      [uniqueKey]: {
        ...prev[uniqueKey],
        rating,
        errors: { ...prev[uniqueKey].errors, rating: '' }, // Xóa lỗi nếu người dùng đánh giá lại
      },
    }));
  };

  const handleAddImages = (uniqueKey, newImages) => {
    setProductData((prev) => ({
      ...prev,
      [uniqueKey]: {
        ...prev[uniqueKey],
        images: [...prev[uniqueKey].images, ...newImages].slice(0, 5),
        errors: { ...prev[uniqueKey].errors, images: '' }, // Xóa lỗi khi thêm ảnh
      },
    }));
  };

  const handleRemoveImage = (uniqueKey, image) => {
    setProductData((prev) => ({
      ...prev,
      [uniqueKey]: {
        ...prev[uniqueKey],
        images: prev[uniqueKey].images.filter((img) => img !== image),
      },
    }));
    URL.revokeObjectURL(image.preview);
  };

  const validateFields = (data) => {
    const errors = {};
    if (!data.rating) errors.rating = 'Vui lòng chọn số sao.';
    if (!data.comment.trim()) errors.comment = 'Vui lòng nhập bình luận.';
    return errors;
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: ratingProduct,
    onSuccess: () => {
      useSwal
        .fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Đánh giá các sản phẩm thành công!',
          confirmButtonText: 'Xác nhận',
          timer: 1500,
        })
        .then(() => {
          onClose();
        });
    },
    onError: () => {
      useSwal
        .fire({
          icon: 'error',
          title: 'Thất bại!',
          text: 'Đánh giá các sản phẩm thất bại, vui lòng thử lại!',
          confirmButtonText: 'Xác nhận',
          timer: 3000,
        })
        .then(() => {
          onClose();
        });
    },
  });

  const { mutate: updateOrder, isLoading: updateOrderLoading } = useMutation({
    mutationFn: updateOrderAPI,
  });

  const handleSubmit = () => {
    const reviews = Object.entries(productData).reduce((acc, [key, data]) => {
      const { rating, comment, images } = data;

      const product = products.find(
        (prod) =>
          `${prod._id}-${prod.variantColor || ''}-${prod.variantSize || ''}` ===
          key
      );

      if (rating || comment.trim() || images.length > 0) {
        const errors = validateFields(data);

        if (Object.keys(errors).length === 0) {
          acc.push({
            userId: user?._id,
            content: comment,
            orderId: orderId,
            productId: product?._id || '',
            rating: rating,
            variantColor: product?.variantColor || '',
            variantSize: product?.variantSize || '',
            images: images,
          });
        } else {
          setProductData((prev) => ({
            ...prev,
            [key]: { ...prev[key], errors },
          }));
        }
      }
      return acc;
    }, []);

    useSwalWithConfirm
      .fire({
        icon: 'question',
        title: 'Xác nhận đánh giá?',
        text: 'Xác nhận gửi đánh giá cho các sản phẩm?',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Huỷ bỏ',
      })
      .then((result) => {
        if (result.isConfirmed) {
          reviews.forEach((review) => {
            mutate(review);
          });
          updateOrder({
            id: orderId,
            data: {
              isComment: true,
            },
          });
          refetch();
        }
      });
  };

  if (isLoading || updateOrderLoading) return <MainLoading />;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 relative w-[95%] lg:w-[80%] h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <Icon icon="mdi:close" className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Đánh giá sản phẩm</h2>

        <div className="flex-grow overflow-y-auto hide-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => {
              const uniqueKey = `${product._id}-${product.variantColor || ''}-${
                product.variantSize || ''
              }`;
              const { errors } = productData[uniqueKey];

              // Xác định hasErrors: chỉ true nếu có bất kỳ lỗi nào có nội dung không phải rỗng
              const hasErrors = Object.values(errors).some((error) => error);

              // Kiểm tra isComplete khi không có lỗi và các trường cần thiết đã điền
              const isComplete =
                !hasErrors &&
                productData[uniqueKey].rating > 0 &&
                productData[uniqueKey].comment.trim();

              return (
                <div
                  key={uniqueKey}
                  className={`mb-6 p-4 border-2 rounded-lg ${
                    hasErrors
                      ? 'border-red-500'
                      : isComplete
                      ? 'border-green-500'
                      : 'border-gray-200'
                  } ${openProduct === uniqueKey ? 'h-auto' : 'h-[88px]'}`}
                >
                  <button
                    onClick={() => handleToggleProduct(uniqueKey)}
                    className="w-full justify-between font-medium text-lg flex items-center gap-4 sticky top-0 bg-white"
                  >
                    <div className="flex gap-6">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex flex-col items-start">
                        <div className="font-semibold text-gray-800">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.variantColor}
                          {product.variantSize !== 'FREESIZE' &&
                            ` - ${product.variantSize}`}
                        </div>
                      </div>
                    </div>
                    <Icon
                      icon="mdi:chevron-down"
                      className={`w-6 h-6 transition-transform duration-300 ${
                        openProduct === uniqueKey ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {openProduct === uniqueKey && (
                    <div className="mt-4">
                      {/* Star Rating */}
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Đánh giá
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Icon
                              key={star}
                              icon="mdi:star"
                              className={`w-6 h-6 cursor-pointer ${
                                productData[uniqueKey].rating >= star
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              onClick={() =>
                                handleRatingChange(uniqueKey, star)
                              }
                            />
                          ))}
                        </div>
                        {errors.rating && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.rating}
                          </p>
                        )}
                      </div>

                      {/* Bình luận */}
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Bình luận
                        </label>
                        <textarea
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="4"
                          placeholder="Nhập bình luận của bạn..."
                          value={productData[uniqueKey].comment}
                          onChange={(e) =>
                            handleReviewChange(
                              uniqueKey,
                              'comment',
                              e.target.value
                            )
                          }
                        ></textarea>
                        {errors.comment && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.comment}
                          </p>
                        )}
                      </div>

                      {/* Hình ảnh */}
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Hình ảnh (tối đa 5)
                        </label>
                        <DropzoneWithPreview
                          uniqueKey={uniqueKey}
                          images={productData[uniqueKey].images}
                          onAddImages={handleAddImages}
                          onRemoveImage={handleRemoveImage}
                        />
                        {errors.images && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.images}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer chứa nút Xác nhận */}
        <div className="sticky bottom-0 right-0 mt-4 flex justify-end bg-white pt-4">
          <button
            onClick={handleSubmit}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md font-medium"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

const DropzoneWithPreview = ({
  uniqueKey,
  images,
  onAddImages,
  onRemoveImage,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const validImages = acceptedFiles.filter((file) =>
        ['image/jpeg', 'image/png', 'image/jpg', 'image/img'].includes(
          file.type
        )
      );

      if (images.length + validImages.length > 5) {
        validImages.splice(5 - images.length);
      }

      const newImages = validImages.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );

      onAddImages(uniqueKey, newImages);
    },
    multiple: true,
    accept: 'image/jpeg, image/png, image/jpg, image/img',
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-dashed border-2 p-4 rounded-md text-center cursor-pointer text-gray-600"
      >
        <input {...getInputProps()} />
        <p>Kéo và thả hình ảnh vào đây, hoặc nhấp để chọn</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {images.map((file, index) => (
          <div key={index} className="relative">
            <img
              src={file.preview}
              alt="preview"
              className="w-full h-24 object-cover rounded-md"
            />
            <button
              onClick={() => onRemoveImage(uniqueKey, file)}
              className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
            >
              <Icon icon="mdi:close" className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

ReviewModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
};

export default ReviewModal;
