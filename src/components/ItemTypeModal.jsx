import { useState } from 'react';
import { Check } from 'lucide-react';
import { alupco } from './alupcoWindow.json'
import { getParentByKey } from './utils';


const ItemTypeModal = () => {
  const [active, setActive] = useState(null);

  const options = getParentByKey(alupco, "name");

  const handleSelect = (e, index) => {
    setActive(index);
    document.getElementById("blyd3d-item-type-active").value = index;
    document.getElementById("blyd3d-item-type-active").setAttribute("data-name", options[index].name)
  };

  return (
    <div className={`blyd3d-left-bloc`}>
      <input type="hidden" name="" id="blyd3d-item-type-active" />
      {options.map((option, index) => (
        <div
          data-name={option.name}
          key={index}
          className={`border-2 rounded blyd3d-item-sub-element p-3 text-xs relative hover:border-blue-800 cursor-pointer ${active === index ? "border-blue-800" : ""}`}
          onClick={e => handleSelect(e, index)}
          style={{ pointerEvents: active === index ? 'none' : 'auto' }}
        >
          {active === index &&
            <div className='absolute top-0 right-0 px-[2px] bg-blue-800 rounded-bl-lg text-white'>
              <Check className='w-4' />
            </div>
          }
          {option.image && <img src={option.image} alt="" className='w-full mb-2' />}
          <p className='mb-2 font-semibold'>{option.name}</p>
          <p>{option.price}$</p>
        </div>
      ))}
    </div>
  );
};

export default ItemTypeModal;
