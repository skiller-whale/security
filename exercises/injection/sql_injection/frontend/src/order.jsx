import { useEffect, useState } from 'react'
import OrderDetails from './order_details'
const Order = () => {
  const [error, setError] = useState()
  const [order, setOrder] = useState()

  const refreshOrder = async code => {
    let url = '/basket'

    if (code) {
      url = `${url}?${new URLSearchParams({ code }).toString()}`
    }
    const response = await fetch(url)
    if (response.ok) {
      const body = await response.json()
      setOrder(body)
      setError(undefined)
    } else {
      setOrder(undefined)
      setError(`request failed: ${response.status}`)
    }
  }

  const addDiscount = event => {
    const data = new FormData(event.target)
    event.preventDefault()
    refreshOrder(data.get('code'))
  }

  useEffect(() => {
    refreshOrder()
  }, [])

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {order && <OrderDetails order={order} />}
      <form onSubmit={addDiscount} className="discount-form">
        <label>Discount Code:</label>
        <input name="code" />
        <button>Apply Discount</button>
      </form>
    </div>
  )
}

export default Order
