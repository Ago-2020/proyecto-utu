import React from 'react'

const Tag = ({ children = 'Locales', color = 'red' }) => {
  const colorClasses = {
    red: 'bg-[#A8343433] text-[#A83434]',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    gray: 'bg-gray-100 text-gray-600',
  }

  return (
    <span
      className={`
        inline-block
        px-3 py-1.5
        rounded-full
        text-sm font-medium
        mb-4
        ${colorClasses[color] || colorClasses.red}
      `}
    >
      {children}
    </span>
  )
}

export default Tag
