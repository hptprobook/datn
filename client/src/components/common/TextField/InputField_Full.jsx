export default function InputField_Full({
  id,
  label,
  type = 'text',
  name,
  ...rest
}) {
  return (
    <div className="col-span-6">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        className="mt-1 w-full rounded-md border-gray-200 border-2 bg-white text-sm text-gray-700 shadow-sm h-10 px-3 outline-blue-500"
        {...rest}
      />
    </div>
  );
}
