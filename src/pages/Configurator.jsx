import React, { useState, useContext } from 'react'
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
// import { ColorPicker } from 'react-colorful';

const fixeDoorLeftHandimage = '/icons/fixe-window-left-hand.png'
const image = '/icons/door-left-hand.png'

export default function Configurator() {
  // Step Management
  const [currentStep, setCurrentStep] = useState(1)
  const [displayGrid, setModalGridOpen] = useState(false)
  const [slideDirection, setSlideDirection] = useState(null)
  const { selectedItem } = useContext(SelectedItemContext)
  const { modalFormIsSubmit, checkIfModalFormIsSubmit } = useContext(SelectedItemContext)
  const dispatch = useDispatch()

  const { modelSize, mainURL, handleURL, profile, aluminumType, openingType, glazing, glassColor, glassOpacity, glassRoughness } =
    useSelector((state) => state.model)

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

  const black = '#000000'

  const nextStep = () => {
    setSlideDirection('next')
    setTimeout(() => {
      setCurrentStep(currentStep + 1)
      setSlideDirection(null)
    }, 200) // Temps de l'animation en millisecondes
  }

  const prevStep = () => {
    setSlideDirection('prev')
    setTimeout(() => {
      setCurrentStep(currentStep - 1)
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

  // Front Layout

  const [selectedFrontLayoutOption, setSelectedFrontLayoutOption] = useState(null)
  let FrontLayoutOptions = []

  if (typeof selectedItem !== 'undefined' && selectedItem != null && typeof selectedItem.TSEC !== 'undefined' && selectedItem.TSEC > 0) {
    FrontLayoutOptions = []
    for (let index = 0; index < selectedItem.TSEC; index++) {
      FrontLayoutOptions.push({ name: (index + 1).toString() + ' connections' })
    }
  }
  const handleFrontLayoutOption = (option) => {
    setSelectedFrontLayoutOption(option)
  }

  // Building Height

  const [selectedBuildingHeight, setSelectedBuildingHeightOption] = useState()
  const BuildingHeightOptions = [{ name: '2.5m Height', image: fixeDoorLeftHandimage, price: 0 }]
  const handleBuildingHeightOption = (option) => {
    setSelectedBuildingHeightOption(option)
  }

  // Ground Screw Base

  const [selectedGroundScrewBase, setSelectedGroundScrewBaseOption] = useState()
  const GroundScrewBaseOptions = [
    { name: 'Base Not Included - Customer to provide FLAT, LEVEL & SMOOTH concrete base', image: image, price: 0 },
    { name: 'Add Ground Screw Base (within 75 miles of CV47)', image: image, price: 52 }
  ]
  const handleGroundScrewBaseOption = (option) => {
    setSelectedGroundScrewBaseOption(option)
    console.log('Ground Screw Base', option)
  }

  // DoorOption

  const [selectedProfileOption, setSelectedProfileOption] = useState(null)
  const ProfileOptions = [
    { name: '17867' },
    { name: '17869' },
    { name: '17871' },
    { name: '17873' },
    { name: '17875' },
    { name: '17877' },
    { name: '17879' },
    { name: '17881' },
    { name: '17883' },
    { name: '17885' },
    { name: '17887' },
    { name: '17889' },
    { name: '17891' },
    { name: '17893' },
    { name: '17895' },
    { name: '17897' },
    { name: '17899' },
    { name: '17901' },
    { name: '17903' },
    { name: '17905' },
    { name: '17907' },
    { name: '17909' }
  ]
  const handleProfileOption = (option) => {
    setSelectedProfileOption(option)
    dispatch({ type: 'SET_PROFILE', payload: option.name })
    console.log('Door Option', option)
  }

  // Glazing

  const [selectedGlazingOption, setSelectedGlazingOption] = useState(null)
  const GlazingOptions = [
    { name: 'Double Glazing', image: image, price: 52 },
    { name: 'Triple Glazing', image: image, price: 52 }
  ]
  const handleGlazingOption = (option) => {
    setSelectedGlazingOption(option)
    console.log('Glazing', option)
  }

  // UPVC Window & Door Colour

  const [selectedUPVCWindowDoor, setSelectedUPVCWindowDoorOption] = useState(null)
  const UPVCWindowDoorOptions = [
    { name: 'Black Outside - White Inside', image: image, price: 52 },
    { name: 'Anthracite Grey Outside - White Inside', image: image, price: 52 },
    { name: 'White Outside - White Inside', image: image, price: 52 },
    { name: 'Cream Outside - White Inside (Not Available on Bi-Fold Door)', image: image, price: 52 },
    { name: 'Chartwell Green Outside - White Inside (Not Available on Bi-Fold Door)', image: image, price: 52 },
    { name: 'Irish Oak Outside - White Inside (Not Available on Bi-Fold Door)', image: image, price: 52 },
    { name: 'Agate Grey - White Inside (Not Available on Bi-Fold Door)', image: image, price: 52 }
  ]
  const handleUPVCWindowDoorOption = (option) => {
    setSelectedUPVCWindowDoorOption(option)
    console.log('UPVC Window & Door Colour', option)
  }

  // Window & Door Handle Colour

  const [selectedWindowDoorHandleColour, setSelectedWindowDoorHandleColour] = useState(null)
  const WindowDoorHandleColourOptions = [
    { name: 'Black', image: image, price: 52 },
    { name: 'Anthracite Grey', image: image, price: 52 },
    { name: 'Gold', image: image, price: 52 },
    { name: 'Chrome', image: image, price: 52 }
  ]
  const handleWindowDoorHandleColour = (option) => {
    setSelectedWindowDoorHandleColour(option)
    console.log('Window & Door Handle Colour', option)
  }

  // Cladding

  const [selectedCladding, setSelectedCladding] = useState(null)
  const CladdingOptions = [
    { name: 'Shiplap Cladding all round', image: image, price: 52, color: '#ffffff' },
    { name: 'Feather Edge to Front & Sides', image: image, price: 52, color: '#ffffff' },
    { name: 'Vertical Cedar Cladding to Front & Sides', image: image, price: 52, color: '#ffffff' },
    { name: 'Horizontal Cedar Cladding to Front & Sides', image: image, price: 52, color: '#ffffff' }
  ]
  const handleCladding = (option) => {
    setSelectedCladding(option)
    console.log('Cladding', option)
  }

  // Metal Box Profile Roof Colour

  const [selectedMetalRoofColour, setSelectedMetalRoofColour] = useState(null)
  const MetalRoofColourOptions = [
    { name: 'Black Metal Roof', image: image, price: 52 },
    { name: 'Grey Metal Roof', image: image, price: 52 }
  ]
  const handleMetalRoofColour = (option) => {
    setSelectedMetalRoofColour(option)
  }

  // Rear Guttering

  const [selectedGuttering, setSelectedGuttering] = useState(null)
  const GutteringOptions = [
    { name: 'Black Rear Guttering', image: image, price: 52 },
    { name: 'Brown Rear Guttering', image: image, price: 52 }
  ]
  const handleGuttering = (option) => {
    setSelectedGuttering(option)
  }

  // Opening Type

  const [selectedOpeningTypeOptions, setSelectedOpeningTypeOptions] = useState(null)
  const OpeningTypeOptions = [
    { name: 'OPEN IN', image: image, price: 52 },
    { name: 'OPEN OUT', image: image, price: 52 },
    { name: 'SLIDER', image: image, price: 52 },
    { name: 'FIXED', image: image, price: 52 },
    { name: 'DOUBLE ACTION-LEFT OPEN', image: image, price: 52 },
    { name: 'DOUBLE ACTION-RIGHT OPEN', image: image, price: 52 },
    { name: 'AWNING-PUSH OUT', image: image, price: 52 },
    { name: 'BI FOLD', image: image, price: 52 }
  ]
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

  // Plug Socket Type

  const [selectedPlugSocketType, setSelectedPlugSocketType] = useState(null)
  const PlugSocketTypeOptions = [
    { name: 'Standard Faceplates', image: image, price: 52 },
    { name: 'USB Faceplates', image: image, price: 52 }
  ]
  const handlePlugSocketType = (option) => {
    setSelectedPlugSocketType(option)
    console.log('Plug Socket Type', option)
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

  const windowsOption = [
    { name: 'Empty Panel', image: image, price: 52 },
    { name: 'Screen Window (600mm)', image: image, price: 52 },
    { name: 'Screen Window (600mm)', image: image, price: 52 },
    { name: 'Screen Window (600mm)', image: image, price: 52 },
    { name: 'Screen Window (600mm)', image: image, price: 52 },
    { name: 'Screen Window (600mm)', image: image, price: 52 },
    { name: 'Screen Window (600mm)', image: image, price: 52 }
  ]

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
        <DisplayItem modelCheck={checkIfModalFormIsSubmit} />
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
        {/* <div className="flex justify-between p-2">
          <h1>Sales Portal Logo</h1>
          <div>
            <h4 className=" text-xs uppercase">Total</h4>
            <h1 className=" font-bold text-xl">0</h1>
          </div>
        </div> */}
        <div
          className={`h-full bg-white p-5 py-8 overflow-y-auto ${
            slideDirection === 'next' ? 'slide-content-animation-next' : slideDirection === 'prev' ? 'slide-content-animation-prev' : ''
          }`}>
          {currentStep === 1 && (
            <div>
              <div className="p-8 space-y-8">
                <a
                  href="#"
                  class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="object-cover px-1 w-full rounded-t-lg h-60 md:h-auto md:w-10 md:rounded-none md:rounded-s-lg">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                    />
                  </svg>

                  <div class="flex flex-col justify-between p-4 leading-normal" onClick={displayItemModal}>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Products Library</h5>
                  </div>
                </a>
              </div>
              <div className="p-8 space-y-8">
                <a
                  href="#"
                  class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                  {/* <img
                    class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-20 md:rounded-none md:rounded-s-lg"
                    src="/materials/wooden.png"
                    alt=""
                  /> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="object-cover px-1 w-full rounded-t-lg h-60 md:h-auto md:w-10 md:rounded-none md:rounded-s-lg">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>

                  <div class="flex flex-col justify-between p-4 leading-normal" onClick={displayItemModal}>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">My Favourite List</h5>
                  </div>
                </a>
              </div>
              <div className="p-8 space-y-8">
                <a
                  href="#"
                  class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="object-cover px-1 w-full rounded-t-lg h-60 md:h-auto md:w-10 md:rounded-none md:rounded-s-lg">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                    />
                  </svg>

                  <div class="flex flex-col justify-between p-4 leading-normal" onClick={displayGridModal}>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Draw yours</h5>
                  </div>
                </a>
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="p-2 space-y-4">
              <h1 className=" text-xl font-bold mb-2">{selectedItem ? selectedItem.name : ''}</h1>
              <div className=" text-[16px] border-[2px] font-bold flex flex-col gap-2 py-4">
                <div className="px-4 py-2">
                  <label for="width">Width : </label>
                  <input
                    className="border-[2px] rounded-md p-1"
                    type="text"
                    id="width"
                    name="width"
                    defaultValue={parseFloat(modelSize.width).toFixed(3) * 1000}
                  />
                </div>
                <div className="px-4 py-2">
                  <label for="width">Height: </label>
                  <input
                    className="border-[2px] rounded-md p-1"
                    type="text"
                    id="width"
                    name="width"
                    defaultValue={parseFloat(modelSize.height).toFixed(3) * 1000}
                  />
                </div>
              </div>
              <div className=" text-[16px] border-[2px] font-bold flex flex-col gap-2 py-4">
                <div className="px-4 py-2">
                  <label for="width">Width : </label>
                  <input
                    className="border-[2px] rounded-md p-1"
                    type="text"
                    id="width"
                    name="width"
                    defaultValue={parseFloat(modelSize.width).toFixed(3) * 1000}
                  />
                </div>
                <div className="px-4 py-2">
                  <label for="width">Height: </label>
                  <input
                    className="border-[2px] rounded-md p-1"
                    type="text"
                    id="width"
                    name="width"
                    defaultValue={parseFloat(modelSize.height).toFixed(3) * 1000}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Etape 2 */}
          {currentStep === 3 && (
            <div className="p-2 space-y-4">
              <h1 className=" text-xl font-bold mb-2">Windows & Doors</h1>
              <div className="">
                <h3 className="font-semibold mb-1 py-5">Profile Option</h3>
                {/* <p className="text-xs mb-1">SetProfile</p> */}
                {/* <CustomSelect options={ProfileOptions} onSelect={handleProfileOption} /> */}
                <div className="flex flex-col space-y-2">
                  <div className="flex gap-2">
                    <div className="text-[12px] font-semibold">Component:</div>
                    <div className="text-[12px]">316.Sliding Window ELV</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-[12px] font-semibold">Description:</div>
                    <div className="text-[12px]">
                      Profile: Royal 120 - Sliding Window - 7016 SAHARA-Glass: 24mm Tempered ( 6mm HD+ Grey + 12mm Spacer + 6mm Clear
                      )-Sliding Flyscreen-Outside Installation Without Archtrive
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
          )}
          {currentStep === 4 && (
            <div className="p-2">
              <h1 className=" text-xl font-bold mb-2">Aluminium Colour</h1>
              <div className="mb-3">
                <h3 className=" font-semibold mb-1">Material</h3>
                <CustomCard options={MaterialOptions} onSelect={handleSetMaterial} />
              </div>
              <div className="mb-3">
                <h3 className=" font-semibold mb-1">Select Colour</h3>
                <ColorSelect colorCodes={colors} flag="frame" />

                {/* <ColorPicker
                  color={selectedCladding?.color}
                  onChange={(color) => {
                    console.log(color)
                    // Update the color property of the selected cladding option
                    dispatch({ type: 'SET_ALUMINUM_COLOR', payload: color.hex })
                    setSelectedCladding((prevOption) => ({
                      ...prevOption,
                      color: color.hex
                    }))
                  }}
                /> */}
              </div>
            </div>
          )}
          {currentStep === 5 && (
            <div className="p-2">
              <h1 className=" text-xl font-bold mb-2">Opening Type</h1>
              <div className="mb-3">
                <h3 className=" font-semibold mb-1">Opening Type</h3>
                <CustomSelect options={OpeningTypeOptions} onSelect={handleOpeningType} />
              </div>
            </div>
          )}
          {currentStep === 6 && (
            <div className="p-2">
              <h1 className=" text-xl font-bold mb-2">Glazing</h1>
              <div className=" space-y-4 flex flex-col">
                <div className="border-[2px] p-2 rounded-md">
                  <h3 className=" font-semibold mb-1">Glass list</h3>
                  <p className=" text-xs mb-1">Choose spacer size in mm</p>
                  <CustomSelect options={PlugSocketTypeOptions} onSelect={handlePlugSocketType} />
                </div>
                <div className="border-[2px] p-2 rounded-md flex flex-col space-y-4">
                  <h3 className=" font-semibold mb-1">Glass Options</h3>
                  {/* <div className="">
                    <p className=" text-xs mb-1">Choose roughness</p>
                    <input
                      className="w-full"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      defaultValue="0.7"
                      onChange={(e) => {
                        dispatch({ type: 'SET_GLASS_ROUGHNESS', payload: e.target.value })
                      }}
                    />
                  </div>
                  <div className="">
                    <p className=" text-xs mb-1">Choose transparency</p>
                    <input
                      className="w-full"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      defaultValue="0.4"
                      onChange={(e) => {
                        dispatch({ type: 'SET_GLASS_OPACITY', payload: e.target.value })
                      }}
                    />
                  </div> */}
                  <div className="">
                    <p className=" text-xs mb-1">Choose color</p>
                    <ColorSelect colorCodes={colors} flag="glass" />
                  </div>
                </div>
              </div>
            </div>
          )}
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
                  <p className="text-[12px]">width: {modelSize.width}</p>
                  <p className="text-[12px]">height: {modelSize.height}</p>
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
    </div>
  )
}