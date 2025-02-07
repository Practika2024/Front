import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const useMaxPrice = () => {
  const favoriteProducts = useSelector((state) => state.user.favoriteProducts)
  const [maxPrice, setMaxPrice] = useState(50000)

  useEffect(() => {
    if (favoriteProducts.length > 0) {
      const calculatedMaxPrice = Math.max(...favoriteProducts.map((product) => product.price))
      setMaxPrice(calculatedMaxPrice)
    }
  }, [favoriteProducts])

  return maxPrice
}

export default useMaxPrice
