import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Start from './components/Start';
import Home from './components/Home';
import Room from './components/Room';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/home' element={<Home />} />
        <Route path='/room' element={<Room />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
