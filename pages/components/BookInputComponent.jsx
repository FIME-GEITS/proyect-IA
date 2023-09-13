import React from 'react';

const BookInputComponent = ({ placeholder, value, onChange }) => {
  return (
    <input
    type="text"
    name="book"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
  );
};

export default BookInputComponent;
