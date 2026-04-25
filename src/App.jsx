import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import ShowAllRun from './views/ShowAllRun'
import AddRun from './views/AddRun'
import EditRun from './views/EditRun'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/showallrun" element={<ShowAllRun />} />
          <Route path="/addrun" element={<AddRun />} />
          <Route path="/editrun/:id" element={<EditRun />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}