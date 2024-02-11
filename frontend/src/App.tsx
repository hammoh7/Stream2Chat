import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Start from './components/Start';
import Home from './components/Home';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
