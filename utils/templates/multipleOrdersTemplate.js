// export const multipleOrdersTemplate =(order)

export const multipleOrdersTemplate = (order) => {
  const orderItems = order.orders
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  return `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order!</p>
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${orderItems}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2"><strong>Total Price</strong></td>
            <td><strong>$${order.finalPrice.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>
      <p>If you have any questions about your order, please contact us.</p>
    `;
};
