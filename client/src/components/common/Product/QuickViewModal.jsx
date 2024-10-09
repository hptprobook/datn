import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import ProductDetailInfor from '~/pages/Products/components/ProductDetailInfor';
import { FaTimes } from 'react-icons/fa';
import './style.css';

const QuickViewModal = ({ isOpen, onClose, product, isLoading }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!product) return null;

  const images = [product.thumbnail, ...(product.images || [])];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[1002]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-12 text-left align-middle shadow-xl transition-all">
                <div className="absolute top-4 right-4">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>
                <div className="flex">
                  <div className="w-2/5 pr-4 max-h-[500px] overflow-y-scroll scrollbar-hide">
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-auto object-cover rounded-md mb-4"
                      />
                    ))}
                  </div>
                  <div className="w-3/5">
                    {isLoading ? (
                      <p>Loading...</p>
                    ) : (
                      <ProductDetailInfor
                        product={product}
                        isQuickView={true}
                      />
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default QuickViewModal;
