import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { whoAmI } from '../features/auth/auth.actions'
import { AppDispatch } from './store'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Index from './pages/Index'
import Property from './pages/Property'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    children: [{ path: 'property/:id', element: <Property/> }],
  },
])

const App = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(whoAmI())
  })

  return <RouterProvider router={router} />
}

export default App
