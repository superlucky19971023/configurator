import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

const ProfileSetting = () => {
  const dispatch = useDispatch()
  const [current, setCurrent] = useState(0)
  const [profileOptions, setProfileOption] = useState([])
  const [thicknessOptions, setThicknessOption] = useState([])
  // const profile = useSelector((state) => state.model.profile)

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('http://tmf.erpestman.com:2000/api/AluminumSystemsMasters', {
        headers: {
          accept: 'text/plain'
        }
      })
      const options = response.data['$values']
      setProfileOption(options)
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        `http://tmf.erpestman.com:2000/api/AluminumSystemsThicknesses/BySystem/${profileOptions[current].aluSystemId}`,
        {
          headers: {
            accept: 'text/plain'
          }
        }
      )
      const options = response.data['$values']
      setThicknessOption(options)
      console.log(options)
    }
    fetchData()
  }, [current,profileOptions])

  const handleProfileOption = (profile) => {
    setCurrent(profile)
  }

  return (
    <div className="p-2 space-y-4">
      <h1 className=" text-xl font-bold mb-2">Profile System</h1>
      <div className="">
        <h3 className="font-semibold mb-1 py-5">System List</h3>
        {/* <p className="text-xs mb-1">SetProfile</p> */}
        {/* <CustomSelect options={ProfileOptions} onSelect={handleProfileOption} /> */}
        <div className="p-1 border-[2px] cursor-pointer bg-gray-500">Designation</div>
        <div className="flex flex-col h-44 overflow-auto">
          {profileOptions.map((profile, idx) => (
            <div key={idx} className="p-1 border-[2px] cursor-pointer hover:bg-gray-300" onClick={() => handleProfileOption(idx)}>
              {profile.systemName}
            </div>
          ))}
        </div>

        <div className="py-2"></div>

        <h3 className="font-semibold mb-1 py-5">Choose Thinkness</h3>
        {/* <p className="text-xs mb-1">SetProfile</p> */}
        {/* <CustomSelect options={ProfileOptions} onSelect={handleProfileOption} /> */}
        <div className="flex flex-col h-32 overflow-auto">
          {thicknessOptions.map((thickness, idx) => (
            <div key={idx} className="p-1 border-[2px] cursor-pointer hover:bg-gray-300 ">{thickness.remarks}</div>
          ))}
        </div>

        <div className="p-6">
          <img src={profileOptions[current] ? profileOptions[current].aluSystem2DfilePath : ''}></img>
        </div>
      </div>
    </div>
  )
}

export default ProfileSetting
