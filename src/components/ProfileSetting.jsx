const ProfileSetting = () => {
  return (
    <div className="p-2 space-y-4">
      <h1 className=" text-xl font-bold mb-2">Profile System</h1>
      <div className="">
        <h3 className="font-semibold mb-1 py-5">System List</h3>
        {/* <p className="text-xs mb-1">SetProfile</p> */}
        {/* <CustomSelect options={ProfileOptions} onSelect={handleProfileOption} /> */}
        <div className="p-1 border-[2px] cursor-pointer bg-gray-500">Designation</div>
        <div className="flex flex-col h-44 overflow-auto">
          <div className="p-1 border-[2px] cursor-pointer hover:bg-gray-300 ">Lift and slide door S 9000</div>
          <div className="p-1 border-[2px] cursor-pointer hover:bg-gray-300 ">HST S 9000 all-round frame</div>
          <div className="p-1 border-[2px] cursor-pointer hover:bg-gray-300 ">Lift and slide door S 9000 design</div>
          <div className="p-1 border-[2px] cursor-pointer hover:bg-gray-300 ">HST S 9000 design all-round frame</div>
          <div className="p-1 border-[2px] cursor-pointer hover:bg-gray-300 ">Lift and slide door S 9000</div>
          <div className="p-1 border-[2px] cursor-pointer hover:bg-gray-300 ">HST S 9000 all-round frame</div>
          <div className="p-1 border-[2px] cursor-pointer hover:bg-gray-300 ">Lift and slide door S 9000 design</div>
          <div className="p-1 border-[2px] cursor-pointer hover:bg-gray-300 ">HST S 9000 design all-round frame</div>
        </div>

        <div className="py-2"></div>

        <h3 className="font-semibold mb-1 py-5">Choose Thinkness</h3>
        {/* <p className="text-xs mb-1">SetProfile</p> */}
        {/* <CustomSelect options={ProfileOptions} onSelect={handleProfileOption} /> */}
        <div className="flex flex-col h-32 overflow-auto">
          <div className="p-1 border-[2px] cursor-pointer hover:bg-gray-300 ">11 MM</div>
          <div className="p-1 border-[2px] cursor-pointer hover:bg-gray-300 ">8 MM</div>
        </div>

        <div className="p-6">
          <img src="http://tcf.erpestman.com:8080/PartsImages/Configurator/AluminumSystemTypes/ALUPCO45SYSTEM.png"></img>
        </div>
      </div>
    </div>
  )
}

export default ProfileSetting
