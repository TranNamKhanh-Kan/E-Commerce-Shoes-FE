import './App.css'
import { Link } from 'react-router-dom'
function App() {
  return (
    <>
      <h1 className="text-2xl font-bold">Home Page</h1>
      <Link to="/login" className="bg-blue-500 text-white p-2 rounded">Login</Link>
    </>
  )
}

export default App
