import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  let event;
  if (webhookSecret && sig) {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } else {
    event = JSON.parse(body);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { signatureRecordId, roomSlug } = session.metadata;

    // Update signature record
    await base44.asServiceRole.entities.SignatureRecord.update(signatureRecordId, {
      paymentStatus: "paid",
    });

    // Get signature record for email details
    const records = await base44.asServiceRole.entities.SignatureRecord.filter({ id: signatureRecordId });
    const record = records[0];

    // Update engagement room status + seed project tracking
    const rooms = await base44.asServiceRole.entities.EngagementRoom.filter({ slug: roomSlug });
    if (rooms.length > 0) {
      const room = rooms[0];
      const selectedOpt = room.proposalOptions?.find(o => o.name === record?.optionName);

      // Seed projectTracking from the selected proposal option's deliverables
      let projectTracking = room.projectTracking;
      if ((!projectTracking || projectTracking.length === 0) && selectedOpt?.deliverables?.length > 0) {
        projectTracking = [{
          id: "phase-1",
          name: selectedOpt.name,
          status: "pending",
          deliverables: selectedOpt.deliverables.map((d, i) => ({
            id: `d-${i}`,
            name: d,
            description: "",
            status: "to_do",
          })),
        }];
      }

      await base44.asServiceRole.entities.EngagementRoom.update(room.id, {
        status: "signed",
        selectedOption: record?.optionName || null,
        projectTracking,
      });
    }

    // Email to you (admin)
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: "caleb@drvrs.co",
      subject: `✅ ${record?.companyName || roomSlug} signed and paid`,
      body: `
        <p><strong>${record?.signedName}</strong> (${record?.prospectEmail}) from <strong>${record?.companyName}</strong> has signed the agreement and completed payment.</p>
        <p><strong>Option:</strong> ${record?.optionName} — ${record?.optionPrice}</p>
        <p><strong>Signed at:</strong> ${record?.signedAt}</p>
        <p><strong>Stripe session:</strong> ${session.id}</p>
      `,
    });

    // Confirmation email to prospect
    if (record?.prospectEmail) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: "Caleb at drvrs",
        to: record.prospectEmail,
        subject: `Your agreement is confirmed — ${record?.optionName}`,
        body: `
          <p>Hi ${record?.signedName},</p>
          <p>Thank you for signing and completing payment. Your agreement for <strong>${record?.optionName}</strong> is confirmed.</p>
          <p>I'll be in touch shortly to get things moving.</p>
          <p>— Caleb</p>
        `,
      });
    }
  }

  return Response.json({ received: true });
});