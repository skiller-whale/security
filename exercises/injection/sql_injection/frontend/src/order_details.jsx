export const OrderDetails = ({ order }) => {
  return (
    <>
      {order.error && <div className="error">{order.error}</div>}
      {order.appliedDiscount && (
        <div className="success">Code {order.appliedDiscount.code} applied</div>
      )}
      <table className="orders">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.lineItems.map(li => (
            <tr>
              <td>{li.description}</td>
              <td>{li.quantity}</td>
              <td>${li.total}</td>
            </tr>
          ))}
          <tr>
            <td>
              <strong>Total</strong>
            </td>
            <td />
            <td>
              <strong>${order.total}</strong>
            </td>
          </tr>
          {order.appliedDiscount && (
            <>
              <tr>
                <td>
                  <strong>Discount applied</strong>
                </td>
                <td />
                <td>
                  <strong>-${order.appliedDiscount.discount}</strong>
                </td>
              </tr>
              <tr>
                <td />
                <td />
                <td>
                  <strong>${order.appliedDiscount.total}</strong>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </>
  )
}

export default OrderDetails
