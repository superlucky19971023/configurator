import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';


const CustomSelect = ({ options, onSelect, onClick = null }) => {
  const [active, setActive] = useState(null);

  const handleSelect = (index) => {
    setActive(index);
    onSelect(options[index]);
    if(onClick != null)
      onClick();
  };

  return (
    <div className={`grid gap-2 ${options.length <= 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {options.map((option, index) => (
        <div
          key={index}
          className={`border-2 rounded p-3 text-xs relative hover:border-blue-800 cursor-pointer ${active === index ? "border-blue-800" : ""}`}
          onClick={() => handleSelect(index)}
          style={{ pointerEvents: active === index ? 'none' : 'auto' }}
        >
          {active === index &&
            <div className='absolute top-0 right-0 px-[2px] bg-blue-800 rounded-bl-lg text-white'>
              <Check className='w-4' />
            </div>
          }
          {option.image && <img src={option.image} alt="" className='w-full mb-2' />}
          <p className='mb-2 font-semibold'>{option.name}</p>
          {option.price && <p>{option.price}$</p>}
        </div>
      ))}

    </div>
  );
};

export default CustomSelect;
