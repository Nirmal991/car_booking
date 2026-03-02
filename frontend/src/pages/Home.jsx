import React, { useRef, useState } from 'react'
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';

const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const panelRef = useRef(null)
  const panelCloseRef = useRef(null);


  const submitHandler = (e) => {
    e.preventDefault()
  }
  
  useGSAP(function(){
    if(panelOpen){
    gsap.to(panelRef.current, {
      height: '70&%',
      opacity: 1
    })
    gsap.to(panelCloseRef.current, {
      opacity: 1
    })
  }else{
    gsap.to(panelRef.current, {
      height: '0%',
      opacity: 1
    })
    gsap.to(panelCloseRef.current, {
      opacity: 0
    })
  }
  }, [panelOpen])

  
  return (
    <div className='h-screen relative overflow-hidden'>
      <img className='w-16 absolute left-5 top-5' src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png' alt='' />
      <div className='h-screen w-screen' >
        {/* Live tracking */}
      </div>
      <div className='flex flex-col justify-end h-screen absolute top-0 w-full'>
        <div className='h-[30%] p-6 bg-white relative'>
          <h5 ref={panelCloseRef} onClick={() => {
            setPanelOpen(false)
          }} className='absolute opacity-0 right-6 top-6 text-2xl'>
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className='text-2xl font-semibold'>Find a trip</h4>
          <form className='relative py-3' onSubmit={(e) => {
            submitHandler(e);
          }}>
            <div className='line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full'> </div>
            <input
            onClick={(e) => {
              setPanelOpen(true)
            }}
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value)
              }}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
              type="text"
              placeholder='Add a pick-up location' 
              />
              <input 
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value)
              }}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
              type='text'
              placeholder='Enter your destination'
              />
          </form>
          <button className='bg-black text-white px-4 py-2rounded-lg mt-3 w-full'>
            Find Trip
          </button>
        </div>
        <div ref={panelRef} className= 'bg-white h-0'>
          <LocationSearchPanel />
        </div>
      </div>
      <div className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
        {/* vehicle panel */}
      </div>
      <div className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
        {/* lokking for rider */}
      </div>
      <div className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
        {/* confirm ride */}
      </div>
      <div className='fixed w-full  z-10 bottom-0  bg-white px-3 py-6 pt-12'>
        {/* Wating for driver */}
      </div>
    </div>
  )
}

export default Home;
