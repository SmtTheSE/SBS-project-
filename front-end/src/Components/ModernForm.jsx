import React from 'react';

const ModernForm = ({ children, onSubmit, className = '' }) => {
  return (
    <form 
      onSubmit={onSubmit}
      className={`bg-white rounded-xl shadow-md p-6 ${className}`}
    >
      {children}
    </form>
  );
};

const FormGroup = ({ children, className = '' }) => {
  return (
    <div className={`mb-6 ${className}`}>
      {children}
    </div>
  );
};

const FormRow = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {children}
    </div>
  );
};

const FormLabel = ({ children, required = false, htmlFor }) => {
  return (
    <label 
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

const FormInput = ({ 
  type = 'text', 
  id, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error,
  ...props 
}) => {
  return (
    <>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`mt-1 block w-full rounded-lg border ${
          error ? 'border-red-300' : 'border-gray-300'
        } py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </>
  );
};

const FormSelect = ({ 
  id, 
  value, 
  onChange, 
  children, 
  required = false,
  error,
  ...props 
}) => {
  return (
    <>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`mt-1 block w-full rounded-lg border ${
          error ? 'border-red-300' : 'border-gray-300'
        } py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </>
  );
};

const FormButton = ({ 
  type = 'button', 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
  };
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const FormSection = ({ title, children, className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export { 
  ModernForm, 
  FormGroup, 
  FormRow, 
  FormLabel, 
  FormInput, 
  FormSelect, 
  FormButton,
  FormSection
};