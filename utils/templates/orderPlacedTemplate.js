export const orderDetailsTemplate = (order) => {
  return `
      <h1>Order Details</h1>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Order ID</th>
          <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${order._id}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Product Name</th>
          <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${order.name}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Quantity</th>
          <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${order.quantity}
          </td>
        </tr>
        <tr>
          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Total Price</th>
          <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">$${order.price}
          </td>
        </tr>
      </table>
    `;
};
