import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className=' m-6'>
        <h1 className=' text-xl font-bold mb-4'>Home</h1>
        <Link className='p-2 rounded bg-blue-600 text-white' to={'/configurator'}>Configurator</Link>
    </div>
  )
}
