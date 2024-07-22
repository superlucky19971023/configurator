const ProfileSetting = () => {
  return (
    <div className="p-2 space-y-4">
      <h1 className=" text-xl font-bold mb-2">Windows & Doors</h1>
      <div className="">
        <h3 className="font-semibold mb-1 py-5">Profile Option</h3>
        {/* <p className="text-xs mb-1">SetProfile</p> */}
        {/* <CustomSelect options={ProfileOptions} onSelect={handleProfileOption} /> */}
        <div className="flex flex-col">
          <div className="p-1 border-[2px] cursor-pointer bg-gray-500">Designation</div>
          <div className="p-1 border-[2px] cursor-pointer hover:bg-gray-300 ">Lift and slide door S 9000</div>
          <div className="p-1 border-[2px] cursor-pointer hover:bg-gray-300 ">HST S 9000 all-round frame</div>
          <div className="p-1 border-[2px] cursor-pointer hover:bg-gray-300 ">Lift and slide door S 9000 design</div>
          <div className="p-1 border-[2px] cursor-pointer hover:bg-gray-300 ">HST S 9000 design all-round frame</div>
        </div>
        <div className="flex flex-col space-y-2 mt-8">
          <div className="flex gap-2">
            <div className="text-[12px] font-semibold">Component:</div>
            <div className="text-[12px]">316.Sliding Window ELV</div>
          </div>
          <div className="flex gap-2">
            <div className="text-[12px] font-semibold">Description:</div>
            <div className="text-[12px]">
              Profile: Royal 120 - Sliding Window - 7016 SAHARA-Glass: 24mm Tempered ( 6mm HD+ Grey + 12mm Spacer + 6mm Clear )-Sliding
              Flyscreen-Outside Installation Without Archtrive
            </div>
          </div>
          <div className="flex gap-2">
            <div className="text-[12px] font-semibold">Quantity:</div>
            <div className="text-[12px]">1 pcs</div>
          </div>
          <div className="flex gap-2">
            <div className="text-[12px] font-semibold">Size:</div>
            <div className="text-[12px]">730.0 mm x 3,010.0 mm</div>
          </div>
          <div className="flex gap-2">
            <div className="text-[12px] font-semibold">Glass Surface:</div>
            <div className="text-[12px]">1.712 sqm</div>
          </div>
          <div className="flex gap-2">
            <div className="text-[12px] font-semibold">Surface:</div>
            <div className="text-[12px]">2.197 sqm</div>
          </div>
          <div className="flex gap-2">
            <div className="text-[12px] font-semibold">Opening type:</div>
            <div className="text-[12px]">Fixed</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSetting
