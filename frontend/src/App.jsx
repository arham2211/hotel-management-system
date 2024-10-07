import { useState } from 'react'
import './App.css'
import SignUpCard from './components/SignUpCard'
import './components/SignUpCard.css'


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
