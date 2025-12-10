import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/home/Home'
import TabBar from './components/tabBar/TabBar'
import Documents from './pages/documents/Documents'
import AddDocuments from './pages/addDocuments/AddDocuments'

function App() {
  const [theme, setTheme] = useState('dark');

// darkMode holati
useEffect(() => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
  document.documentElement.setAttribute('data-theme', savedTheme);
}, []);
const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};
  return (
    <>  
  <BrowserRouter>
  <TabBar/>
  <Routes>
    <Route path='/' element={<Home theme={theme} setTheme={setTheme}/>}/>
    <Route path='/documents' element={<Documents/>}/>
    <Route path='/adddocuments' element={<AddDocuments/>}/>
  </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
