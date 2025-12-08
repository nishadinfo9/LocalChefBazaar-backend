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
      customer_email: meal.userEmail,
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
        //tracking id
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

    if (!sessionId) {
      return res.status(404).json({ message: "session id does not exist" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res
        .status(404)
        .json({ message: "verify payment session not found" });
    }

    if (session.payment_status !== "paid") {
      return res.status(409).json({ message: "payment not paid" });
    }

    const mealId = session.metadata.mealId;
    const transactionId = session.payment_intent;

    let payment = await Payment.findOne({ transactionId });

    if (payment) {
      return res
        .status(200)
        .json({ message: "payment already exist", payment });
    }

    const updateOrder = await Order.findOneAndUpdate(
      { foodId: mealId },
      { $set: { paymentStatus: "paid", orderStatus: "confirmed" } },
      { new: true }
    );

    if (!updateOrder) {
      return res.status(404).json({ message: "order not found" });
    }

    const newPayment = {
      mealId: session.metadata.mealId,
      mealName: updateOrder.mealName,
      transactionId: session.payment_intent,
      userEmail: session.customer_email,
      totalPrice: (session.amount_total / 100).toFixed(2),
      currency: session.currency,
    };

    payment = await Payment.create(newPayment);

    return res
      .status(201)
      .json({ message: "payment created successfully", payment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { createPaymentSession, verifyPaymentSession };
