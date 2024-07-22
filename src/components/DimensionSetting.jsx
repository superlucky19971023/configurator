import { useState } from "react"

const DimensionSetting = (props) => {
  const [borderCheck, setBorderCheck] = useState(false)

    const handleCheckChange = (e) => {
        console.log(e.target.value)
    }

  return (
    <div className="p-2 space-y-4">
      <h1 className=" text-xl font-bold mb-2">{props.selectedItem ? props.selectedItem.name : ''}</h1>
      <div className=" text-[16px] border-[2px] font-bold flex flex-col gap-2 py-4">
        <div className="px-4 py-2">
          <label for="width">Width(mm) : </label>
          <input
            className="border-[2px] rounded-md p-1"
            type="text"
            id="width"
            name="width"
            defaultValue={parseFloat(props.modelSize.width).toFixed(3) * 1000}
          />
        </div>
        <div className="px-4 py-2">
          <label for="width">Height(mm) : </label>
          <input
            className="border-[2px] rounded-md p-1"
            type="text"
            id="width"
            name="width"
            defaultValue={parseFloat(props.modelSize.height).toFixed(3) * 1000}
          />
        </div>
        <div className="px-4 py-2 flex items-center gap-2">
          <label for="borderCheck">Use border : </label>
          <input onChange={handleCheckChange} className="border-[2px] rounded-md w-5 h-5" type="checkbox" id="borderCheck" name="borderCheck" defaultValue={false} />
        </div>
      </div>
      {borderCheck && (
        <div className=" text-[16px] border-[2px] font-bold grid grid-cols-2 gap-2 p-4">
          <div className="p-x-4 p-y-[12px] text-center border-[2px] border-black cursor-pointer bg-blue-800 text-white shadow-sm hover:shadow-lg active:shadow-sm">
            LEFT
          </div>
          <div className="p-x-4 p-y-[12px] text-center border-[2px] border-black cursor-pointer shadow-sm hover:shadow-lg active:shadow-sm">
            RIGHT
          </div>
          <div className="p-x-4 p-y-[12px] text-center border-[2px] border-black cursor-pointer shadow-sm hover:shadow-lg active:shadow-sm">
            BOTTOM
          </div>
        </div>
      )}
    </div>
  )
}

export default DimensionSetting
