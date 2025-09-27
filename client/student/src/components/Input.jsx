import React from 'react';

function Input({ id, label, type, placeholder, value, onChange, options, className }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-white text-sm font-medium mb-2">
        {label}
      </label>
      {type === 'select' && options ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition duration-200 placeholder-white/60 ${className}`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-teal transition duration-200 placeholder-white/60 ${className}`}
        />
      )}
    </div>
  );
}

export default Input;
