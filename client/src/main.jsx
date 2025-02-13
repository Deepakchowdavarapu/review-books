import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'
import Home from './Home.jsx'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Login from './Login.jsx'
import Register from './Register.jsx'
import Profile from './Profile.jsx'
import BookPage from './BookPage.jsx'
import Navbar from './Navbar.jsx'
import UserPage from './UserPage.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/book" element={<BookPage/>}/>
      <Route path="/user" element={<UserPage/>}/>
    </Routes>
  </BrowserRouter>
)
