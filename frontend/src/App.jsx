import { useState } from 'react'
import './App.css'
import LoginCard from './login-page/login-card'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LoginCard></LoginCard>
    </>
  )
}

export default App
