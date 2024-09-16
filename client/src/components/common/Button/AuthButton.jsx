/* eslint-disable indent */
export default function AuthButton({
  text,
  isLoading,
  type = 'button',
  ...rest
}) {
  // eslint-disable-next-line indent
  return (
    <button
      className={`inline-block shrink-0 rounded-md px-12 py-3 text-sm font-medium transition focus:outline-none focus:ring w-full md:w-auto
      ${
        isLoading
          ? 'bg-gray-400 border-gray-400 text-white cursor-not-allowed'
          : 'bg-blue-600 border-blue-600 text-white hover:bg-transparent hover:text-blue-600'
      }
      `}
      type={type}
      {...rest}
      disabled={isLoading}
    >
      {isLoading ? 'Đang xử lý...' : text}
    </button>
  );
}
