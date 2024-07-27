import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

const GlazingSelect = (props) => {
  return (
    <div class="relative overflow-x-auto py-8">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-slate-500 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              Designation
            </th>
            <th scope="col" class="px-6 py-3">
              View
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Fixed in Frame
            </th>
            <td class="px-6 py-4">
              <img id="a793" src="./icons/fixed_icon.png" alt="fixed in frame " />
            </td>
          </tr>
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Fixed in Frame
            </th>
            <td class="px-6 py-4">
              <img id="a793" src="./icons/fixed_icon.png" alt="fixed in frame " />
            </td>
          </tr>
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Fixed in Frame
            </th>
            <td class="px-6 py-4">
              <img id="a793" src="./icons/fixed_icon.png" alt="fixed in frame " />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default GlazingSelect
