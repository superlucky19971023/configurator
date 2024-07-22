import React, { useState, useContext } from 'react'
import { Check } from 'lucide-react'
import { alupco } from './alupcoWindow.json'
import { getParentByKey } from './utils'
import { SelectedItemContext } from './SelectedItemContext'

const DisplayItem = (props) => {
  const [active, setActive] = useState(null)
  const { setSelectedItem } = useContext(SelectedItemContext)
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 8

  const handleSelect = (e, index) => {
    setActive(index)
    setSelectedItem(options[index])
    document.getElementById('blyd3d-item-active').value = index
  }

  const options = getParentByKey(alupco, 'name')

  // Calculate the items to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = options.slice(startIndex, endIndex)

  // Calculate total pages
  const totalPages = Math.ceil(options.length / itemsPerPage)

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum)
  }
  console.log(options)
  return (
    <div className="p-4">
      <div className="text-center text-[24px] font-bold">Product List</div>
      <input type="hidden" name="" id="blyd3d-item-active" />
      <div className='flex flex-col justify-around'>
        <div className="w-full grid gap-4 grid-cols-4 p-4 overflow-auto">
          {currentItems.map((option, index) => (
            <div
              data-name={option.name}
              key={startIndex + index}
              className={`border-2 rounded p-3 text-xs relative hover:border-blue-800 cursor-pointer ${
                active === startIndex + index ? 'border-blue-800' : ''
              }`}
              onClick={(e) => handleSelect(e, startIndex + index)}
              style={{ pointerEvents: active === startIndex + index ? 'none' : 'auto' }}>
              {active === startIndex + index && (
                <div className="absolute top-0 right-0 px-[2px] bg-blue-800 rounded-bl-lg text-white">
                  <Check className="w-4" />
                </div>
              )}
              {option.image && <img src={option.image} alt="" className="w-full mb-2" />}
              <p className="mb-2 font-semibold">{option.name}</p>
              <p>{option.price}$</p>
            </div>
          ))}
        </div>
        <div className="w-1/3 m-auto pagination-controls flex justify-between items-center">
          {/* <button onClick={handlePreviousPage} disabled={currentPage === 1} className="px-4 py-2 bg-blue-800 text-white rounded disabled:opacity-50">
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-800 text-white rounded disabled:opacity-50">
          Next
        </button> */}
          <nav >
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
      <input type='search' placeholder='Search here' className='absolute top-3 right-20 w-72 py-2 px-4 border-[1px] rounded-full shadow-sm' />
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
