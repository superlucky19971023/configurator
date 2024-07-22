import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

const ColorSelect = (props) => {
  const dispatch = useDispatch()
  const [current, setCurrent] = useState(0)
  const aluminumColor = useSelector((state) => state.model.aluminumColor)
  const colorCodes = props.colorCodes

  const handleSelectColor = (idx) => {
    if(props.flag.includes("glass")){
      dispatch({ type: 'SET_GLASS_COLOR', payload: colorCodes[idx] })
    } else{
      dispatch({ type: 'SET_ALUMINUM_COLOR', payload: colorCodes[idx] })
    }
    setCurrent(idx)
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {colorCodes.map((colorCode, idx) => (
        <div
          className={`w-[50px] h-[50px] rounded-full border-[4px] shadow-sm ${idx == current ? 'border-blue-800' : ''}`}
          style={{ backgroundColor: colorCode }}
          onClick={() => handleSelectColor(idx)}></div>
      ))}
    </div>
  )
}

export default ColorSelect
