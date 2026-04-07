import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { signatureRecordId, roomSlug, optionName, optionPrice, prospectEmail, companyName } = await req.json();

  // Parse price — expect format like "$5,000" or "5000"
  const numericPrice = parseFloat(optionPrice.replace(/[^0-9.]/g, ""));
  if (!numericPrice || isNaN(numericPrice)) {
    return Response.json({ error: "Invalid price format" }, { status: 400 });
  }

  const origin = req.headers.get("origin") || "https://app.base44.com";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: prospectEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(numericPrice * 100),
          product_data: {
            name: optionName,
            description: `Engagement agreement for ${companyName}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      signatureRecordId,
      roomSlug,
    },
    success_url: `${origin}/room/${roomSlug}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/room/${roomSlug}`,
  });

  // Update signature record with session ID
  await base44.asServiceRole.entities.SignatureRecord.update(signatureRecordId, {
    stripeSessionId: session.id,
  });

  return Response.json({ url: session.url });
});