import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='border-2 border-black'> TAILWIND CONNECTED.</div>
      <div className='border-4 border-yellow-600'> REACT CONNECTED. </div>
    </>
  )
}

export default App
