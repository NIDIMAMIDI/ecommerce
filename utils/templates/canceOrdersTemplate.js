// templates/cancelOrderTemplate.js
export const cancelOrdersTemplate = (order) => {
  const orderItemsHtml = order.orders
    .map(
      (item) => `
      <tr>
        <td>${item.productId}</td>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${item.price}</td>
      </tr>
    `
    )
    .join('');

  return `
      <h1>Order Cancellation Details</h1>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr>
          <th>Order ID</th>
          <td>${order._id}</td>
        </tr>
        <tr>
          <th>User ID</th>
          <td>${order.userId}</td>
        </tr>
        <tr>
          <th>Final Price</th>
          <td>$${order.finalPrice}</td>
        </tr>
      </table>
      <br/>
      <h2>Order Items</h2>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
        ${orderItemsHtml}
      </table>
      <p>Your order has been successfully canceled and the amount has been refunded.</p>
    `;
};
