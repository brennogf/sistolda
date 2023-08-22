import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
import Home from './pages/Home'
import Cadastro from './pages/Cadastro'
import Foto from './pages/Foto'
import IdentidadeFrente from './pages/IdentidadeFrente'
import IdentidadeVerso from './pages/IdentidadeVerso'

const router = createHashRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/cadastro/:params?',
    element: <Cadastro />
  },
  {
    path: '/foto/:params?',
    element: <Foto />
  },
  {
    path: '/identidadeFrente/:params?',
    element: <IdentidadeFrente />
  },
  {
    path: '/identidadeVerso/:params?',
    element: <IdentidadeVerso />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<RouterProvider router={router} />)
