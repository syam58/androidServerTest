import { useState,useEffect} from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'

import Home from './pages/Home'
import Chats from './pages/Chats'


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/chats" element={<Chats/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
