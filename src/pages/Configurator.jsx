import React, { useState, useContext, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Check, Plus, X } from 'lucide-react'
import CustomSelect from '../components/Customselect'
import StepProgressIndicator from '../components/StepProgressIndicator'
import BLYD3D from '../components/blyd3d'
import FabricCanvas, { undo, redo } from '../components/2dGridBuilder'
import DisplayItem from '../components/ItemDisplay'
import ItemTypeModal from '../components/ItemTypeModal'
import { SelectedItemContext } from '../components/SelectedItemContext'
import { HexColorPicker } from 'react-colorful'
import ColorPicker from 'react-pick-color'
import { useSelector, useDispatch } from 'react-redux'
import CustomCard from '../components/CustomCard'
import ColorSelect from '../components/ColorSelect'
import DimensionSetting from '../components/DimensionSetting'
import ProfileSetting from '../components/ProfileSetting'
import GlazingSelect from '../components/GlazingSelect'
import axios from 'axios'

const image = '/_0004_SLIDING-ROYAL-4-TRACK-4-PANELS-W-FIXED-TOP-W-3-TSEC.PNG.png'

export default function Configurator() {
  // Step Management

  const [displayGrid, setModalGridOpen] = useState(false)
  const [slideDirection, setSlideDirection] = useState(null)
  const { selectedItem } = useContext(SelectedItemContext)
  const { modalFormIsSubmit, checkIfModalFormIsSubmit } = useContext(SelectedItemContext)
  const dispatch = useDispatch()

  const {
    modelWidthSize,
    modelHeightSize,
    mainURL,
    handleURL,
    profile,
    aluminumType,
    openingType,
    glazing,
    glassColor,
    glassOpacity,
    glassRoughness,
    modalFlag,
    currentStep,
    border
  } = useSelector((state) => state.model)

  const colors = [
    '#FF5733', // Vibrant Orange
    '#33FF57', // Lime Green
    '#5733FF', // Deep Purple
    '#33C7FF', // Sky Blue
    '#FF33A1', // Pink
    '#FFD700', // Gold
    '#8A2BE2', // Blue Violet
    '#FF4500', // Orange Red
    '#2E8B57', // Sea Green
    '#FF6347' // Tomato
  ]

  const nextStep = () => {
    setSlideDirection('next')
    setTimeout(() => {
      dispatch({ type: 'SET_CURRENT_STEP', payload: currentStep + 1 })
      setSlideDirection(null)
    }, 200) // Temps de l'animation en millisecondes
  }

  const prevStep = () => {
    setSlideDirection('prev')
    setTimeout(() => {
      dispatch({ type: 'SET_CURRENT_STEP', payload: currentStep - 1 })
      setSlideDirection(null)
    }, 200)
  }

  const displayGridModal = () => {
    setModalGridOpen(true)
    document.querySelector('.blyd3d-modal-panel').classList.remove('blyd3d-hide')
  }

  const displayItemModal = () => {
    document.querySelector('.blyd3d-modal-panel-item').classList.remove('blyd3d-hide')
    checkIfModalFormIsSubmit(true)
  }

  const handleBorderTrue = () => {
    dispatch({ type: 'SET_BORDER', payload: true })
  }

  const handleBorderFalse = () => {
    dispatch({ type: 'SET_BORDER', payload: false })
  }

  const [OpeningTypeOptions, setOpeningTypeOptions] = useState([])

  // Opening Type

  const [selectedOpeningTypeOptions, setSelectedOpeningTypeOptions] = useState(null)

  const handleOpeningType = (option) => {
    setSelectedOpeningTypeOptions(option)
    dispatch({ type: 'SET_OPENING_TYPE', payload: option.name })
  }

  // Internal Lining Ground

  const [selectedInternalLiningGround, setSelectedInternalLiningGround] = useState(null)
  const InternalLiningGroundOptions = [
    { name: 'Harbour Oak Laminate Flooring', image: image, price: 52 },
    { name: 'Harbour Oak Grey Laminate Flooring', image: image, price: 52 },
    { name: 'Whitewashed Oak Laminate Flooring', image: image, price: 52 },
    { name: 'Rift Oak Laminate Flooring', image: image, price: 52 }
  ]
  const handleInternalLiningGround = (option) => {
    setSelectedInternalLiningGround(option)
  }

  // Insulation

  const [selectedInsulation, setSelectedInsulation] = useState(null)
  const InsulationOptions = [
    { name: '50mm RWA45 Rockwool Insulation', image: image, price: 52 },
    { name: '50mm PIR Insulation', image: image, price: 52 }
  ]
  const handleInsulation = (option) => {
    setSelectedInsulation(option)
  }

  // Lighting

  const [selectedLighting, setSelectedLighting] = useState(null)
  const LightingOptions = [
    { name: 'LED Spotlights (4-10)', image: image, price: 52 },
    { name: 'LED Panel Light (1-3)', image: image, price: 52 }
  ]
  const handleLighting = (option) => {
    setSelectedLighting(option)
  }

  // Glazing Type

  const [selectedGlazingType, setSelectedGlazingType] = useState(1)
  const [GlazingTypeOptions, setGlazingTypeOptions] = useState([
    { name: 'Standard Faceplates', image: image, price: 52 },
    { name: 'USB Faceplates', image: image, price: 52 }
  ])
  const handleGlazingType = (option) => {
    setSelectedGlazingType(option.glazingTypeId)
  }

  //Glazing Lists

  const [selectedGlazingList, setSelectedGlazingList] = useState(1)
  const [glazingOptions, setGlazingOptions] = useState([
    { name: 'Standard Faceplates', image: image, price: 52 },
    { name: 'USB Faceplates', image: image, price: 52 }
  ])
  const handleGlazingList = (option) => {
    setSelectedGlazingList(option)
  }

  // Self Assembly

  const [selectedSelfAssembly, setSelectedSelfAssembly] = useState(null)
  const SelfAssemblyOptions = [{ name: 'Save money with Self Assembly', image: image, price: -52 }]
  const handleSelfAssembly = (option) => {
    setSelectedSelfAssembly(option)
  }

  // Modal

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleSelectWindow = (index) => {
    // Sélection de l'option
    setSelectedOption(windowsOption[index])
    // Fermeture du modal
    closeModal()
  }

  //material option
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const MaterialOptions = [
    { name: 'Coating', image: '/materials/coating.png', price: 52 },
    { name: 'Anodized', image: '/materials/silver.png', price: 52 },
    { name: 'Wooden', image: '/materials/wooden.png', price: 52 }
  ]
  const handleSetMaterial = (option) => {
    setSelectedMaterial(option)
    dispatch({ type: 'SET_ALUMINUM_TYPE', payload: option.name })
    console.log('Plug Socket Type', option)
  }

  //handle option
  const [selectedHandle, setSelectedHandle] = useState(null)
  const HandleOptions = [
    { name: 'CASMENT', image: '/handles/CASMENT-GENERIC.jpg', price: 52 },
    { name: 'FLAT-RECESSED', image: '/handles/FLAT-RECESSED-GENERIC.jpg', price: 52 },
    { name: 'HOOK', image: '/handles/HOOK-GENERIC.jpg', price: 52 },
    { name: 'LUG-HANDLE', image: '/handles/LUG-HANDLE-GENERIC.jpg', price: 52 },
    { name: 'SIDESLIDINGKEY', image: '/handles/SIDESLIDINGKEY-GENERIC.jpg', price: 52 },
    { name: 'TUBULAR', image: '/handles/TUBULAR-GENERIC.jpg', price: 52 }
  ]
  const handleSetHandle = (option) => {
    setSelectedHandle(option)
    dispatch({ type: 'SET_HANDLE_URL', payload: option.image.replace('.jpg', '.glb') })
    console.log('handle', option)
  }

  const ColorOptions = [
    { name: 'Shiplap Cladding', image: image, price: 52, color: '#ffffff' },
    { name: 'Feather Edge', image: image, price: 52, color: '#cccccc' }
  ]

  useEffect(() => {
    if (currentStep === 3) {
      async function fetchData() {
        const response = await axios.get('http://tmf.erpestman.com:2000/api/AluminumItemOpeningTypes', {
          headers: {
            accept: 'text/plain'
          }
        })
        const options = response.data['$values'].map((obj) => {
          const update = { ...obj }
          update['name'] = update['aluOpeningTypeDesc']
          update['image'] = update['openingTypeImagePath']
          delete update['aluOpeningTypeDesc']
          delete update['openingTypeImagePath']
          return update
        })
        setOpeningTypeOptions(options)
      }
      fetchData()
    } else if (currentStep === 5) {
      async function fetchData() {
        const response = await axios.get('http://tmf.erpestman.com:2000/api/GlazingTypes', {
          headers: {
            accept: 'text/plain'
          }
        })
        const options = response.data['$values'].map((obj) => {
          const update = { ...obj }
          update['name'] = update['glazingTypeDesc']
          delete update['glazingTypeDesc']
          return update
        })
        setGlazingTypeOptions(options)
      }
      fetchData()
    }
  }, [currentStep])

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`http://tmf.erpestman.com:2000/api/GlazingPriceLists/ByType/${selectedGlazingType}`, {
        headers: {
          accept: 'text/plain'
        }
      })
      const options = response.data['$values'].map((obj) => {
        const update = { ...obj }
        update['name'] = update['glassDescription']
        update['image'] = update['glazing2DfilePath']
        delete update['glassDescription']
        delete update['glazing2DfilePath']
        return update
      })
      setGlazingOptions(options)
    }
    fetchData()
  }, [selectedGlazingType])

  return (
    <div className="lg:flex-row flex flex-col-reverse h-screen">
      <div className="blyd3d-modal-panel-item-type blyd3d-hide">
        <ItemTypeModal />
        <div className="blyd3d-right-bloc">
          <div className="blyd3d-step-btn">
            <button id="blyd3d-cancel-item-type">Cancel</button>
            <button id="blyd3d-display-item-type">Done</button>
          </div>
        </div>
      </div>

      <div className="blyd3d-modal-panel-item blyd3d-hide">
        <DisplayItem modalCheck={checkIfModalFormIsSubmit} />
        {/* <div className="flex h-fit">
          <button
            className="px-4 py-1 rounded-lg border-[1px] text-white bg-red-800  hover:opacity-40 active:opacity-80"
            onClick={() => {
              checkIfModalFormIsSubmit(false)
            }}>
            Cancel
          </button>
          <button
            id="blyd3d-display-item"
            className="px-4 py-1 rounded-lg border-[1px] text-white bg-blue-800 hover:opacity-40 active:opacity-80"
            onClick={() => {
              checkIfModalFormIsSubmit(true)
            }}>
            Done
          </button>
        </div> */}
      </div>

      <div className="blyd3d-modal-panel blyd3d-hide">
        <div className="blyd3d-left-bloc">{displayGrid ? <FabricCanvas /> : ''}</div>
        <div className="blyd3d-right-bloc">
          <div className="blyd3d-first-step">
            <label htmlFor="blyd3d-draw-rect">
              <img height="70px" src="/icons/rectangle-tool-svgrepo-com.svg" alt="Draw rect" title="Draw rect" />
            </label>
            <input
              type="radio"
              name="blyd3d-draw"
              id="blyd3d-draw-rect"
              defaultChecked
              onChange={() => {
                console.log('ddd')
              }}
            />
          </div>

          <div className="blyd3d-second-step blyd3d-hide">
            <label htmlFor="blyd3d-draw-split-vertical">
              <img height="70px" src="/icons/split-vertically-svgrepo-com.svg" alt="Vertical split shape" title="Split vertical shape" />
            </label>
            <input type="radio" value={'vertical'} name="blyd3d-spliter" id="blyd3d-draw-split-vertical" defaultChecked />

            <label htmlFor="blyd3d-draw-split-horizontal">
              <img
                height="70px"
                src="/icons/split-horizontally-svgrepo-com.svg"
                alt="Horizontal split shape"
                title="Split horizontal shape"
              />
            </label>
            <input type="radio" value={'horizontal'} name="blyd3d-spliter" id="blyd3d-draw-split-horizontal" />
          </div>

          <div className="blyd3d-step-btn">
            <button className="blyd3d-stack-action" onClick={undo}>
              Undo
            </button>
            <button className="blyd3d-stack-action" onClick={redo}>
              Redo
            </button>
            <button id="blyd3d-step-reset">Reset</button>
            <button id="blyd3d-step-next" disabled>
              Next
            </button>
            <button id="blyd3d-step-done" data-action={'default'} className="blyd3d-hide">
              Done
            </button>
            <button id="blyd3d-step-prev">Cancel</button>
          </div>
        </div>
      </div>

      <section className="lg:w-[480px] w-full shadow-xl flex flex-col lg:overflow-hidden overflow-auto">
        <div className="flex justify-between items-center pl-16 pr-16 pt-6">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              class="iconify iconify--logos"
              width="31.88"
              height="32"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 256 257">
              <defs>
                <linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%">
                  <stop offset="0%" stop-color="#41D1FF"></stop>
                  <stop offset="100%" stop-color="#BD34FE"></stop>
                </linearGradient>
                <linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%">
                  <stop offset="0%" stop-color="#FFEA83"></stop>
                  <stop offset="8.333%" stop-color="#FFDD35"></stop>
                  <stop offset="100%" stop-color="#FFA800"></stop>
                </linearGradient>
              </defs>
              <path
                fill="url(#IconifyId1813088fe1fbc01fb466)"
                d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path>
              <path
                fill="url(#IconifyId1813088fe1fbc01fb467)"
                d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path>
            </svg>
          </div>
          <h5 className="font-semibold">Total Price</h5>
        </div>
        <div
          className={`h-full bg-white p-5 py-8 overflow-y-auto ${
            slideDirection === 'next' ? 'slide-content-animation-next' : slideDirection === 'prev' ? 'slide-content-animation-prev' : ''
          }`}>
          {currentStep === 1 && (
            <div className="flex flex-col absolute pl-4">
              <div className="w-full p-4 space-y-4">
                <a
                  href="#"
                  className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-black hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="object-cover px-1 w-full rounded-t-lg h-60 md:h-auto md:w-10 md:rounded-none md:rounded-s-lg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                    />
                  </svg>

                  <div className="flex flex-col justify-between p-4 leading-normal hover:text-white" onClick={displayItemModal}>
                    <h5 className="mb-2 text-[20px] font-bold tracking-tight ">Products Library</h5>
                  </div>
                </a>
              </div>
              <div className="p-4 space-y-4">
                <a
                  href="#"
                  className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-black hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                  {/* <img
                    className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-20 md:rounded-none md:rounded-s-lg"
                    src="/materials/wooden.png"
                    alt=""
                  /> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="object-cover px-1 w-full rounded-t-lg h-60 md:h-auto md:w-10 md:rounded-none md:rounded-s-lg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>

                  <div className="flex flex-col justify-between p-4 leading-normal hover:text-white" onClick={displayItemModal}>
                    <h5 className="mb-2 text-[20px] font-bold tracking-tight">My Favourite List</h5>
                  </div>
                </a>
              </div>
              <div className="p-4 space-y-4">
                <a
                  href="#"
                  className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-black hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="object-cover px-1 w-full rounded-t-lg h-60 md:h-auto md:w-10 md:rounded-none md:rounded-s-lg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                    />
                  </svg>

                  <div className="flex flex-col justify-between p-4 leading-normal hover:text-white" onClick={displayGridModal}>
                    <h5 className="mb-2 text-[20px] font-bold tracking-tight">Draw yours</h5>
                  </div>
                </a>
              </div>
              <hr className="border-t-2 border-gray-400 py-3"></hr>
              <div className="rounded-2xl shadow-md border-2 border-gray-500 dark:border-gray-700 p-4">
                <h5 className="py-1">Dimensions :</h5>
                <div className="w-full flex gap-[12px]">
                  <div className="flex items-center p-x-2 gap-1">
                    <div className="h-[45px] w-[30px] bg-gray-600" style={{ position: 'relative' }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ff0000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <line x1="0" y1="0" x2="20" y2="0" />
                        <line x1="17.5" y1="-2.5" x2="20" y2="0" />
                        <line x1="17.5" y1="2.5" x2="20" y2="0" />
                      </svg>
                    </div>
                    <input
                      type="number"
                      className="w-[60px] h-[30px] p-y-4 border-gray-500 rounded-md border-[2px]"
                      defaultValue={modelWidthSize}
                      onChange={(e) => {
                        dispatch({ type: 'SET_MODEL_SIZE_WIDTH', payload: e.target.value })
                      }}
                    />
                    <div>mm</div>
                  </div>
                  <div className="flex items-center p-x-2 gap-1">
                    <div className="h-[45px] w-[30px] bg-gray-600" style={{ position: 'relative' }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ff0000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <line x1="0" y1="0" x2="0" y2="20" />
                        <line x1="-2.5" y1="17.5" x2="0" y2="20" />
                        <line x1="2.5" y1="17.5" x2="0" y2="20" />
                      </svg>
                    </div>
                    <input
                      type="number"
                      className="w-[60px] h-[30px] p-y-4 border-gray-500 rounded-md border-[2px]"
                      defaultValue={modelHeightSize}
                      onChange={(e) => {
                        dispatch({ type: 'SET_MODEL_SIZE_WIDTH', payload: e.target.value })
                      }}
                    />
                    <div>mm</div>
                  </div>
                </div>
              </div>
              <h5 className="py-4 mt-4 font-bold">BorderOption YES/NO</h5>
              <div className="mt-4">
                <a
                  href="#"
                  onClick={handleBorderTrue}
                  className={`bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-semibold me-2 px-8 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400 inline-flex items-center justify-center ${
                    border ? '' : 'line-through'
                  }`}>
                  YES
                </a>
                <a
                  href="#"
                  onClick={handleBorderFalse}
                  className={`bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-semibold me-2 px-8 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400 inline-flex items-center justify-center ${
                    border ? 'line-through' : ''
                  }`}>
                  NO
                </a>
              </div>
              <div className="mt-10 w-full">
                <img className="m-auto w-[200px] h-[200px] rounded-3xl" src="./icons/TRNSBG_0001_SLIDING-ROYAL-4-TRACK-4-PANELS.png" />
              </div>
            </div>
          )}
          {currentStep === 2 && <ProfileSetting />}
          {currentStep === 3 && (
            <div className="p-2 h-full">
              <h1 className=" text-xl font-bold mb-2">Opening Type</h1>
              <div className="mb-3 py-6">
                <CustomSelect options={OpeningTypeOptions} onSelect={handleOpeningType} />
              </div>
              <h5 className="py-4 mt-4 font-bold">Add FlyScreen? Yes/No</h5>
              <div className="mt-4 ml-5">
                <a
                  href="#"
                  onClick={handleBorderTrue}
                  className={`bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-semibold me-2 px-8 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400 inline-flex items-center justify-center ${
                    border ? '' : 'line-through'
                  }`}>
                  YES
                </a>
                <a
                  href="#"
                  onClick={handleBorderFalse}
                  className={`bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-semibold me-2 px-8 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400 inline-flex items-center justify-center ${
                    border ? 'line-through' : ''
                  }`}>
                  NO
                </a>
              </div>
            </div>
          )}
          {currentStep === 4 && (
            <div className="p-2">
              <h1 className=" text-xl font-bold mb-2">Aluminium Colour</h1>
              <div className="mb-3 p-4">
                <h3 className=" font-semibold mb-1">Material</h3>
                <CustomSelect options={MaterialOptions} onSelect={handleSetMaterial} />
              </div>
              <div className="mb-3 p-4">
                <h3 className=" font-semibold mb-1">Select Colour</h3>
                <ColorSelect colorCodes={colors} flag="frame" />
              </div>
            </div>
          )}
          {currentStep === 5 && (
            <div className="p-2">
              <h1 className=" text-xl font-bold mb-2">Glazing</h1>
              <div className=" space-y-4 flex flex-col">
                <div className="border-[2px] p-2 rounded-md">
                  <h3 className=" font-semibold mb-1">Type</h3>
                  <CustomSelect options={GlazingTypeOptions} onSelect={handleGlazingType} />
                </div>
                <div className="border-[2px] p-2 rounded-md m-2">
                  <h3 className=" font-semibold mb-1">Lists</h3>
                  <CustomSelect options={glazingOptions} onSelect={handleGlazingType} />
                </div>
              </div>
            </div>
          )}
          {currentStep === 6 && <div className="p-2"></div>}
          {currentStep === 7 && (
            <div className="p-2">
              <h1 className=" text-xl font-bold mb-2">Accessories and Hardware</h1>
              <div className="mb-3">
                <h3 className=" font-semibold mb-1">Choose Handle</h3>
                <CustomSelect options={HandleOptions} onSelect={handleSetHandle} />
              </div>
            </div>
          )}
          {currentStep === 8 && (
            <div className="p-2">
              <h1 className=" text-xl font-bold mb-2">Confirmation for Cart</h1>
              <div className="p-2 flex flex-col space-y-4">
                <div>
                  <h3 className="font-semibold">1. Window Category</h3>
                  <p className="text-[12px]">{mainURL.split('/')[3].split('.glb')}</p>
                </div>
                <div>
                  <h3 className="font-semibold">2. Window Size</h3>
                  <p className="text-[12px]">width: {modelWidthSize}</p>
                  <p className="text-[12px]">height: {modelHeightSize}</p>
                </div>
                <div>
                  <h3 className="font-semibold">3. Profile Option</h3>
                  <p className="text-[12px]">{profile}</p>
                </div>
                <div>
                  <h3 className="font-semibold">4. Window color</h3>
                  <p className="text-[12px]">material: {aluminumType}</p>
                </div>
                <div>
                  <h3 className="font-semibold">5. Opening Type</h3>
                  <p className="text-[12px]">{openingType}</p>
                </div>
                <div>
                  <h3 className="font-semibold">6. Glazing</h3>
                  <p className="text-[12px]">Glass list : {glazing}</p>
                </div>
                <div>
                  <h3 className="font-semibold">7. Accesory and Hardware</h3>
                  <p className="text-[12px]">{handleURL.split('/')[2].split('.glb')[0]}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="h-16 shadow flex p-2 gap-1 select-none">
          {/* Bouton Back (précédent) */}
          {currentStep !== 1 && (
            <button
              className="bg-gray-200 rounded-full p-2 basis-1/2 text-center text-xs uppercase flex items-center cursor-pointer hover:bg-black hover:text-white"
              onClick={prevStep}>
              <span>
                {' '}
                <ChevronLeft />
              </span>
              <span className="w-full">Back</span>
            </button>
          )}
          {/* Bouton Next (suivant) */}
          <button
            className={`bg-gray-200 rounded-full p-2  ${
              currentStep === 1 ? 'basis-full' : 'basis-1/2'
            } text-center text-xs uppercase flex items-center cursor-pointer hover:bg-black hover:text-white`}
            onClick={nextStep}
            // Désactiver le bouton si nous sommes à la dernière étape
            // disabled={currentStep === 8}
          >
            <span className="w-full">{currentStep === 8 ? 'Cart' : 'Next'}</span>
            <span>
              {' '}
              <ChevronRight />
            </span>
          </button>
        </div>
      </section>
      <section className="w-full flex flex-col">
        <div className=" w-full p-3 shadow">
          <StepProgressIndicator totalSteps={8} currentStep={currentStep} />
        </div>
        <div className="lg:h-full h-[50vh]">
          <div id="blyd3d-canvas-container">
            <BLYD3D selector={'#blyd3d-canvas-container'} />
          </div>
          {/* <Viewer3d/> */}
        </div>
      </section>
      {/* <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-gray-300 rounded-lg shadow-lg w-96 p-6">
          
        </div>
      </div> */}
    </div>
  )
}
