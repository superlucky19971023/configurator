import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

const ColorSelect = (props) => {
  const dispatch = useDispatch()
  const [current, setCurrent] = useState(0)
  const [colorOptions, setColorOption] = useState([])
  const aluminumColor = useSelector((state) => state.model.aluminumColor)

  function rgbToHex(rgbColor) {
    const [redt, greent, bluet] = rgbColor
    const red = parseInt(redt)
    const green = parseInt(greent)
    const blue = parseInt(bluet)
    const hexRed = padToTwo(red.toString(16))
    const hexGreen = padToTwo(green.toString(16))
    const hexBlue = padToTwo(blue.toString(16))
    return `#${hexRed}${hexGreen}${hexBlue}`
  }

  function padToTwo(str) {
    return str.length === 1 ? `0${str}` : str
  }

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('http://tmf.erpestman.com:2000/api/AluminumColorsLists/RalColor', {
        headers: {
          accept: 'text/plain'
        }
      })
      const options = response.data['$values'].map((obj) => {
        const update = { ...obj }
        update['color'] = rgbToHex(update['rgb'].split('-'))
        delete update['rgb']
        return update
      })
      setColorOption(options)
    }
    fetchData()
  }, [])

  const handleSelectColor = (idx) => {
    if (props.flag.includes('glass')) {
      dispatch({ type: 'SET_GLASS_COLOR', payload: colorOptions[idx].color })
    } else {
      dispatch({ type: 'SET_ALUMINUM_COLOR', payload: colorOptions[idx].color })
    }
    setCurrent(idx)
  }

  return (
    <div className="grid grid-cols-2 gap-4 h-auto overflow-auto">
      {colorOptions.map((colorCode, idx) => (
        <div
          key={idx}
          className={`w-full h-[35px] border-[2px] py-1 text-center shadow-sm ${idx == current ? 'border-blue-800' : ''}`}
          style={{ backgroundColor: colorCode.color }}
          onClick={() => handleSelectColor(idx)}>
          <a href="#">{colorCode.colorCode}</a>
        </div>
      ))}
    </div>
  )
}

export default ColorSelect
