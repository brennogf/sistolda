import React from 'react'

import Header from '../Header'
import Aside from '../Aside'
import Footer from '../Footer'
import './styles.css'

export default function PageDefault({ children }) {
  return (
    <>
      <Header />
      <Aside />
      <main>{children}</main>
      <Footer />
    </>
  )
}
