import { useState } from 'react'
import './App.css'
import SignUpCard from './login-page/sign-up'
import LoginCard from './login-page/login'
import Slider from './login-page/slider'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <SignUpCard></SignUpCard>
      </div>
    </>
  )
}

export default App
