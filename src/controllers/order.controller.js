import { Meal } from "../models/meal.model.js";
import { Order } from "../models/order.model.js";

const createOrder = async (req, res) => {
  try {
    const { mealId } = req.params;
    const userEmail = req.user.email;

    const { userAddress, quantity, price, orderStatus, mealName } = req.body;

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.status(400).json({ message: "Meal not found" });
    }

    const existOrder = await Order.findOne({ foodId: mealId, userEmail });

    if (existOrder) {
      const updateOrder = await Order.findByIdAndUpdate(
        existOrder._id,
        {
          $set: {
            quantity: Number(quantity),
            totalPrice: Number(quantity) * Number(price),
          },
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Order updated successfully", order: updateOrder });
    }

    const newOrder = {
      foodId: mealId,
      userEmail,
      foodImage: meal.foodImage,
      totalPrice: Number(price) * Number(quantity),
      userAddress,
      quantity: Number(quantity),
      price: Number(price),
      orderTime: new Date(),
      orderStatus: orderStatus || "pending",
      mealName: mealName || meal.foodName,
      chefId: meal.chefId,
      paymentStatus: "pending",
    };

    const order = await Order.create(newOrder);

    return res
      .status(201)
      .json({ message: "Order created successfully", order });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMyOrder = async (req, res) => {
  try {
    const userEmail = req.user.email;

    const orders = await Order.find({ userEmail })
      .sort({ orderTime: -1 })
      .lean();

    if (!orders.length) {
      return res.status(200).json({ message: "orders not found", orders: [] });
    }

    return res
      .status(200)
      .json({ message: "order found successfully", orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { foodId } = req.params;

    if (!foodId) {
      return res.status(409).json({ message: "food id does not exist" });
    }

    const order = await Order.findOne({ foodId });

    if (!order) {
      return res.status(401).json({ message: "order not found" });
    }

    return res
      .status(200)
      .json({ message: "single order found successfully", order });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const chefAllOrderRequests = async (req, res) => {
  try {
    const chefId = req.user.chefId;
    const orders = await Order.find({ chefId });

    if (!orders.length) {
      return res
        .status(200)
        .json({ message: "chef order not found", orders: [] });
    }

    return res
      .status(200)
      .json({ message: "chef order found successfully", orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateOrderRequest = async (req, res) => {
  const { orderId } = req.params;
  const orderRequestStatus = req.body;

  const order = await Order.findByIdAndUpdate(
    orderId,
    { $set: orderRequestStatus },
    { new: true }
  );

  return res
    .status(200)
    .json({ message: "order request status update successfully", order });
};
export {
  createOrder,
  getMyOrder,
  getOrderById,
  chefAllOrderRequests,
  updateOrderRequest,
};
