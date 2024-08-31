import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/cart.jsx';
import Cart from './Cart.jsx';

export default function Products() {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const { cartItems, addToCart } = useContext(CartContext);

  const toggle = () => {
    setShowModal(!showModal);
  };

  async function getProducts() {
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    setProducts(data.products);
    setFilteredProducts(data.products); // Initialize filtered products
  }

  useEffect(() => {
    getProducts();
  }, []);

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(range);
  };

  useEffect(() => {
    setFilteredProducts(
      products.filter((product) => {
        const matchesSearchTerm =
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.price.toString().includes(searchTerm);

        const matchesCategory =
          selectedCategories.length === 0 || selectedCategories.includes(product.category);

        const matchesPriceRange = !selectedPriceRange || (selectedPriceRange === 'under50' && product.price < 50) ||
          (selectedPriceRange === '50to100' && product.price >= 50 && product.price <= 100) ||
          (selectedPriceRange === 'above100' && product.price > 100);

        return matchesSearchTerm && matchesCategory && matchesPriceRange;
      })
    );
  }, [searchTerm, selectedCategories, selectedPriceRange, products]);

  return (
    <div className='flex flex-col justify-center bg-gray-100'>
      <div className='flex justify-between items-center px-20 py-5'>
        <h1 className='text-2xl uppercase font-bold mt-10 text-center mb-10'>Shop</h1>
        {!showModal && (
          <button
            className='px-4 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700'
            onClick={toggle}
          >
            Cart ({cartItems.length})
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className='px-20 mb-5'>
        <input
          type="text"
          placeholder="Search products by title, description, or price..."
          className="w-full p-3 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Options */}
      <div className='px-20 mb-5 flex justify-between'>
        <div>
          <h3 className='font-bold mb-2'>Filter by Category:</h3>
          <div>
            <label className='mr-4'>
              <input
                type="checkbox"
                value="smartphones"
                onChange={() => handleCategoryChange('smartphones')}
              />
              Smartphones
            </label>
            <label className='mr-4'>
              <input
                type="checkbox"
                value="laptops"
                onChange={() => handleCategoryChange('laptops')}
              />
              Laptops
            </label>
            {/* Add more categories as needed */}
          </div>
        </div>
        <div>
          <h3 className='font-bold mb-2'>Filter by Price Range:</h3>
          <div>
            <label className='mr-4'>
              <input
                type="radio"
                name="priceRange"
                value="under50"
                onChange={() => handlePriceRangeChange('under50')}
              />
              Under $50
            </label>
            <label className='mr-4'>
              <input
                type="radio"
                name="priceRange"
                value="50to100"
                onChange={() => handlePriceRangeChange('50to100')}
              />
              $50 - $100
            </label>
            <label className='mr-4'>
              <input
                type="radio"
                name="priceRange"
                value="above100"
                onChange={() => handlePriceRangeChange('above100')}
              />
              Above $100
            </label>
          </div>
        </div>
      </div>

      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-10'>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className='bg-white shadow-md rounded-lg px-10 py-10'>
              <img src={product.thumbnail} alt={product.title} className='rounded-md h-48' />
              <div className='mt-4'>
                <h1 className='text-lg uppercase font-bold'>{product.title}</h1>
                <p className='mt-2 text-gray-600 text-sm'>{product.description.slice(0, 40)}...</p>
                <p className='mt-2 text-gray-600'>${product.price}</p>
              </div>
              <div className='mt-6 flex justify-between items-center'>
                <button
                  className='px-4 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700'
                  onClick={() => addToCart(product)}
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-600">No products found</p>
        )}
      </div>
      
      <Cart showModal={showModal} toggle={toggle} />
    </div>
  );
}
