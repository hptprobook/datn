const Input = ({ title, name, placeholder, type, value, onChange }) => {
  return (
    <>
      <div>
        <label className="block font-semibold" htmlFor={name}>
          {title}
        </label>
        <input
          className="mt-1 w-full rounded-md border-2 p-4 py-3"
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default Input;
