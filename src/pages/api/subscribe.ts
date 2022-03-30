/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { stripe } from "../../service/stripe";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getSession({ req });

    const stripeCustumer = await stripe.customers.create({
      email: session.user.email,
    });

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustumer.id,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: "price_1Kb6TDK9Nomz8xRSsaMyGcln",
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
