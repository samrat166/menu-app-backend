const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;
const cors = require("cors");
const menuItems = require("./menuItems.json");

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

let orders = [];
let cart = [];

// Get all menu items
app.get("/menu", (req, res) => {
  res.status(200).json(menuItems);
});

// Add item to cart
app.post("/add-to-cart/:id", (req, res) => {
  const itemId = req.params.id;
  const menuItem = menuItems.find((item) => item.itemId == itemId);
  const alreadyInCart = cart.find((cartItem) => cartItem.item.itemId == itemId);
  if (alreadyInCart) {
    res.status(500).json({ error: "Item already in cart" });
  } else if (menuItem) {
    cart.push({ item: menuItem, count: 1 });
    res.status(201).json({ response: cart });
  } else {
    res.status(500).json({ error: "Item not found" });
  }
});

// Get cart items
app.get("/cart", (req, res) => {
  res.status(200).json({ response: cart });
});

// Update cart item
app.post("/cart", (req, res) => {
  const updatedCartItem = req.body;
  const foundCartItem = cart.find(
    (cartItem) => cartItem.item.itemId === updatedCartItem?.item?.itemId
  );
  if (!foundCartItem) {
    res.status(500).json({ error: "Cart item not found" });
  }
  cart = cart.map((cartItem) =>
    cartItem.item.itemId === updatedCartItem.item.itemId
      ? updatedCartItem
      : cartItem
  );
  res.status(200).json({ response: cart });
});

// Delete item from cart
app.delete("/cart/:id", (req, res) => {
  const itemId = req.params.id;
  cart = cart.filter((cartItem) => cartItem.item.itemId != itemId);
  res.status(200).json({ response: cart });
});

// Place an order
app.post("/order", (req, res) => {
  if (cart.length == 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const order = {
    id: new Date().getTime().toString(),
    items: cart,
    date: new Date(),
  };

  orders.push(order);
  cart = [];
  res.status(201).json({ response: { orders, order, cart } });
});

// Get past orders
app.get("/orders", (req, res) => {
  res.status(200).json({ response: orders });
});

// Delete an order
app.delete("/order/:id", (req, res) => {
  const orderId = req.params.id;
  orders = orders.filter((order) => order.id !== orderId);
  res.status(200).json({ response: orders });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
