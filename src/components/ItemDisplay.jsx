import React, { useState, useContext, useEffect } from 'react'
import { Check } from 'lucide-react'
import { alupco } from './alupcoWindow.json'
import { getParentByKey } from './utils'
import { SelectedItemContext } from './SelectedItemContext'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

const DisplayItem = (props) => {
  const [active, setActive] = useState(null)
  const { setSelectedItem } = useContext(SelectedItemContext)
  const [currentPage, setCurrentPage] = useState(1)
  const [options, setOptions] = useState([])
  const [totalNumber, setTotalNumber] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const response = await axios.get('http://tmf.erpestman.com:2000/api/AluminumItemInsertionTypes?page=1&pageSize=8', {
        headers: {
          accept: 'text/plain'
        }
      })
      setOptions(response.data['$values'])
      const response1 = await axios.get('http://tmf.erpestman.com:2000/api/AluminumItemInsertionTypes/getCount', {
        headers: {
          accept: 'text/plain'
        }
      })
      setTotalNumber(response1.data)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const response = await axios.get(`http://tmf.erpestman.com:2000/api/AluminumItemInsertionTypes?page=${currentPage}&pageSize=8`, {
        headers: {
          accept: 'text/plain'
        }
      })
      setOptions(response.data['$values'])
      setIsLoading(false)
    }
    fetchData()
  }, [currentPage])

  const itemsPerPage = 8

  const handleSelect = (e, index) => {
    dispatch({ type: 'SET_MAIN_URL', payload: options[index].defaultModel3DFilePath })
    setActive(index)
    setSelectedItem(options[index])
    document.getElementById('blyd3d-item-active').value = options[index].defaultModel3DFilePath
  }

  // const options = getParentByKey(alupco, 'name')
  // console.log( getParentByKey(alupco, 'name'))

  // Calculate the items to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = itemsPerPage
  const currentItems = options

  // Calculate total pages
  const totalPages = Math.ceil(totalNumber / itemsPerPage)

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum)
  }
  return (
    <div className="p-4">
      {isLoading ? ( // Show the Loader component if loading state is true
        <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
          <svg
            aria-hidden="true"
            className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <></>
      )}
      <div className="text-center text-[24px] font-bold">Product List</div>
      <input type="hidden" name="" id="blyd3d-item-active" />
      <div className="flex flex-col justify-around">
        <div className="w-full grid gap-4 grid-cols-4 p-4 overflow-auto">
          {currentItems.map((option, index) => (
            <div
              data-name={option.insertionItemName}
              key={index}
              className={`border-2 rounded p-3 text-xs relative hover:border-blue-800 cursor-pointer ${
                active === index ? 'border-blue-800' : ''
              }`}
              onClick={(e) => handleSelect(e, index)}
              style={{ pointerEvents: active === index ? 'none' : 'auto' }}>
              {active === index && (
                <div className="absolute top-0 right-0 px-[2px] bg-blue-800 rounded-bl-lg text-white">
                  <Check className="w-4" />
                </div>
              )}
              {option.defaultModelTextureFilePath && <img src={option.defaultModelTextureFilePath} alt="" className="w-full mb-2" />}
              <p className="mb-2 font-semibold">{option.insertionItemName}</p>
              <p>{option.price}$</p>
            </div>
          ))}
        </div>
        <div className="w-1/3 pagination-controls flex justify-between items-center bottom-4 left-1/2 -translate-x-1/2 absolute">
          <nav>
            <ul className="inline-flex -space-x-px text-base h-10">
              <li>
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => handlePageClick(index + 1)}
                    className={`flex items-center justify-center px-4 h-10 leading-tight border ${
                      currentPage === index + 1
                        ? 'text-blue-600 border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}>
                    {index + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <input
        type="search"
        placeholder="Search here"
        className="absolute top-3 right-20 w-72 py-2 px-4 border-[1px] rounded-full shadow-sm"
      />
      <div className="absolute bottom-6 right-10 flex gap-5">
        <button
          id="blyd3d-cancel-item"
          className="px-4 py-1 rounded-lg border-[1px] border-black "
          onClick={() => {
            props.modalCheck(false)
          }}>
          Cancel
        </button>
        <button
          id="blyd3d-display-item"
          className="px-4 py-1 rounded-lg border-[1px] border-black "
          onClick={() => {
            props.modalCheck(true)
          }}>
          Done
        </button>
      </div>
    </div>
  )
}

export default DisplayItem
