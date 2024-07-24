import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

const ColorSelect = (props) => {
  const dispatch = useDispatch()
  const [current, setCurrent] = useState(0)
  const aluminumColor = useSelector((state) => state.model.aluminumColor)
  const colorCodes = props.colorCodes

  useEffect(()=>{
    axios.get('http://tmf.erpestman.com:2000/AluminumColorsLists')
    .then(response => {
      // Handle the successful response
      console.log(response.data);
    })
    .catch(error => {
      // Handle the error
      console.log(error);
    });
  },[])

  const handleSelectColor = (idx) => {
    if(props.flag.includes("glass")){
      dispatch({ type: 'SET_GLASS_COLOR', payload: colorCodes[idx] })
    } else{
      dispatch({ type: 'SET_ALUMINUM_COLOR', payload: colorCodes[idx] })
    }
    setCurrent(idx)
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {colorCodes.map((colorCode, idx) => (
        <div
          className={`w-full h-[30px] border-[2px] shadow-sm ${idx == current ? 'border-blue-800' : ''}`}
          style={{ backgroundColor: colorCode }}
          onClick={() => handleSelectColor(idx)}>Ral Color</div>
      ))}
    </div>
  )
}

export default ColorSelect
