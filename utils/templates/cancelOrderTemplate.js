// templates/cancelOrderTemplate.js
export const cancelOrderTemplate = (order) => {
  return `
      <h1>Order Cancellation Details</h1>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr>
          <th>Order ID</th>
          <td>${order._id}</td>
        </tr>
        <tr>
          <th>Product Name</th>
          <td>${order.name}</td>
        </tr>
        <tr>
          <th>Quantity</th>
          <td>${order.quantity}</td>
        </tr>
        <tr>
          <th>Total Price</th>
          <td>$${order.price}</td>
        </tr>
      </table>
      <p>Your order has been successfully canceled.</p>
    `;
};
