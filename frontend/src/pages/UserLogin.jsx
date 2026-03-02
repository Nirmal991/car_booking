import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';

const UserLogin = () => {

  const navigate = useNavigate();
    const { user, setUser } = useContext(UserDataContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userData, setUserData] = useState({})

    const submitHandler = async(e) => {
        e.preventDefault()
        const userData = ({
            email: email,
            password: password
        })

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, userData)
        if(response.status === 200){
          const data = response.data.data
          setUser(data.user);
          localStorage.setItem('token', data.token)
          navigate('/home')
        }

        console.log(userData);
        
        setEmail('')
        setPassword('')
    }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
        <div>
      <form onSubmit={(e) => {
        submitHandler(e)
      }}>
        <h3 className='text-lg font-medium mb-2'>What's your email</h3>
        <input 
        required 
        value={email}
        onChange={(e) => {setEmail(e.target.value)}}
        type='text'
        placeholder='email@example.com'
        className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
        />
        <h3 className='text-lg font-medium mb-2'>Enter Pasword</h3>
        <input 
        required 
        value={password}
        onChange={(e) => {setPassword(e.target.value)}}
        type="password" 
        placeholder='password'
         className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
         />
        <button 
        className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'>Login
        </button>
      </form>
      <p className='text-center'>New here? <Link to='/signup' className='text-blue-600'>Create new Account</Link></p>
    </div>
    <div>
        <Link
          to='/captain-login'
          className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
        >Sign in as Captain</Link>
    </div>
    </div>
    
  )
}

export default UserLogin
