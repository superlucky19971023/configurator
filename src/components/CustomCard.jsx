import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

const CustomCard = ({ options, onSelect, onClick = null }) => {
  const [active, setActive] = useState(null)

  const handleSelect = (index) => {
    setActive(index)
    onSelect(options[index])
    if (onClick != null) onClick()
  }

  return (
    <div className={'grid gap-2 grid-cols-1'}>
      {options.map((option, index) => (
        <div
          key={index}
          className={`flex flex-col items-center relative bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:border-blue-800 cursor-pointer dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 ${active === index ? "border-blue-800" : ""}`}
          onClick={() => handleSelect(index)}
          style={{ pointerEvents: active === index ? 'none' : 'auto' }}>
          {active === index && (
            <div className="absolute top-0 right-0 px-[2px] bg-blue-800 rounded-bl-lg text-white">
              <Check className="w-4" />
            </div>
          )}
          {option.image && (
            <img
              src={option.image}
              alt=""
              className="object-cover px-1 w-full rounded-xl h-60 md:h-auto md:w-14 md:rounded-xl"
            />
          )}
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-3 font-semibold text-gray-700 dark:text-gray-400">{option.name}</h5>
          </div>
          {/* {option.price && <p>{option.price}$</p>} */}
        </div>
      ))}
    </div>
  )
}

export default CustomCard
