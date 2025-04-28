// components/BookInputComponent.jsx
import React from 'react'

const BookInputComponent = ({ placeholder, value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  )
}

export default BookInputComponent
