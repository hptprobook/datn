export default function ChangeQuantity({ onChange, quantity, setQuantity }) {
  const handleIncrease = () => {
    if (quantity < 99) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onChange(newQuantity);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange(newQuantity);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= 99) {
      setQuantity(value);
      onChange(value);
    }
  };

  return (
    <div className="flex items-center justify-center border border-gray-400 rounded-md">
      <button
        className={`group py-[14px] px-3 w-full border-r border-gray-400 rounded-l-md h-full flex items-center justify-center bg-white shadow-sm shadow-transparent transition-all duration-300 ${
          quantity <= 1
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-gray-50 hover:shadow-gray-300'
        }`}
        onClick={handleDecrease}
        disabled={quantity <= 1}
      >
        <svg
          className="stroke-black group-hover:stroke-black"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.5 11H5.5"
            stroke=""
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M16.5 11H5.5"
            strokeOpacity="0.2"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <input
        type="text"
        className="font-semibold text-gray-900 text-lg py-3 px-2 w-full min-[400px]:min-w-[75px] h-full bg-transparent placeholder:text-gray-900 text-center hover:text-indigo-600 outline-0 hover:placeholder:text-indigo-600"
        placeholder="1"
        value={quantity}
        onChange={handleInputChange}
      />
      <button
        className={`group py-[14px] px-3 w-full border-l border-gray-400 rounded-r-md h-full flex items-center justify-center bg-white shadow-sm shadow-transparent transition-all duration-300 ${
          quantity >= 99
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-gray-50 hover:shadow-gray-300'
        }`}
        onClick={handleIncrease}
        disabled={quantity >= 99}
      >
        <svg
          className="stroke-black group-hover:stroke-black"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 5.5V16.5M16.5 11H5.5"
            stroke="#9CA3AF"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M11 5.5V16.5M16.5 11H5.5"
            stroke="black"
            strokeOpacity="0.2"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
