import './App.css'
import Clock from './component/Clock'
import Footer from './component/Footer'

function App() {

  return (
    <div
    className="min-h-screen antialiased bg-green-700 w-full text-gray-800"
  >
    <main className="container mx-auto p-6 min-h-[calc(100vh-5rem)] flex justify-center items-center">
    <Clock />
    </main>
    <Footer />
  </div>
  )
}

export default App
