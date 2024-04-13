import React from 'react'
import Products from './components/Products'
import { CartProvider } from './context/cart'

const App = () => {
  return (
    <CartProvider>
      <Products/>
    </CartProvider>
  )
}

export default App