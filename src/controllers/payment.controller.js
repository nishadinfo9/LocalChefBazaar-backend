import { Meal } from "../models/meal.model.js";
import { Order } from "../models/order.model.js";
import { Payment } from "../models/payment.model.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET);

const createPaymentSession = async (req, res) => {
  try {
    const { mealId } = req.params;

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.status(409).json({ message: "meal not found" });
    }

    const order = await Order.findOne({ foodId: mealId });

    if (!order) {
      return res.status(409).json({ message: "order not found" });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: order.userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: order.mealName,
              images: [order.foodImage],
            },
            unit_amount: Number(order.totalPrice) * 100,
          },
          quantity: order.quantity,
        },
      ],
      metadata: {
        mealId: mealId,

      },
      mode: "payment",
      success_url: `${process.env.DOMAIN}/dashboard/payments-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/dashboard/payments-cancel`,
    });
    return res.status(200).json({
      message: "payment session created successfully",
      url: session.url,
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyPaymentSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(409).json({ message: "payment not paid" });
    }

    const transactionId = session.payment_intent;
    const mealId = session.metadata.mealId;
    const existPayment = await Payment.findOne({ transactionId });

    if (existPayment) {
      return res.status(200).json({
        message: "payment already exist",
        transactionId: existPayment.transactionId,
      });
    }

    const updateOrder = await Order.findOneAndUpdate(
      { foodId: mealId, userEmail: session.customer_email },
      { $set: { paymentStatus: "paid" } },
      { new: true }
    );

    try {
      const payment = await Payment.create({
        mealId,
        mealName: updateOrder.mealName,
        transactionId,
        userEmail: session.customer_email,
        totalPrice: Number((session.amount_total / 100).toFixed(2)),
        currency: session.currency,
        paymentStatus: "paid",
      });

      return res
        .status(201)
        .json({ message: "payment created successfully", payment });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(200).json({
          message: "Payment already exists",
          transactionId: transactionId,
        });
      } else {
        return res.status(400).json({ message: "Payment not completed yet" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMyPayments = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const payments = await Payment.find({ userEmail })
      .sort({ paidAt: -1 })
      .lean();

    if (!payments.length) {
      return res
        .status(200)
        .json({ message: "payment not found", payments: [] });
    }

    return res
      .status(200)
      .json({ message: "payment found successfully", payments });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { createPaymentSession, verifyPaymentSession, getMyPayments };
