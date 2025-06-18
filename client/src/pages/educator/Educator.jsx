import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'
import Sidebar from '../../components/educator/Sidebar'
import Footer from '../../components/educator/Footer'

// const Educator = () => {
//   return (
//     <div className='text-default min-h-screen bg-white'>
//         <Navbar />
//         <div className='flex'>
//           <Sidebar />
//             <div className='flex-1'>
//               {<Outlet />}
//             </div>        
//         </div>
//         <Footer />
//     </div>
//   )
// }

const Educator = () => {
  return (
    <div className='text-default min-h-screen bg-white flex flex-col'>
       <Navbar />
      <div className='flex flex-1 overflow-hidden border-r border-gray-200'>
        <Sidebar />
        <div className='flex-1 overflow-auto pb-8'>
          <Outlet />
        </div>
      </div>
      <div className='border-t border-gray-200'>
        <Footer />
      </div>
    </div>
  )
}

export default Educator