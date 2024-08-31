
import Products from './components/Products'
import Test from './components/Test'
import { CartProvider } from './context/cart'

const App = () => {

  return (
    <CartProvider>
      {/* <Products/> */}
      <Test />
    </CartProvider>
  )
}

export default App