import './App.css'
import { RouterProvider } from 'react-router-dom'
import routes from './routes'
import GlobalLayout from './_lyouts/GloabLayout'

function App() {
  return (
    <GlobalLayout>
      <RouterProvider router={routes}>
      </RouterProvider>
    </GlobalLayout>
  )
}

export default App
