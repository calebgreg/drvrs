import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const proposalOptions = [
  {
    name: "One Day",
    price: "$2,500",
    timeline: "Half-day session",
    deliverables: [
      "Positioning statement built around the outcome",
      "Target agency profile with disqualifiers",
      "Outbound sequence ready to send",
      "Revised demo talk track"
    ],
    highlighted: false
  },
  {
    name: "One Initiative",
    price: "$6,000",
    timeline: "60 Days",
    deliverables: [
      "Everything in One Day",
      "10 target agencies identified and contacted",
      "Hands-on onboarding to engineer the outcome",
      "Fan interviews with extracted language",
      "Referral channel map",
      "Ad-ready copy from fan language"
    ],
    highlighted: true
  },
  {
    name: "One Team",
    price: "$32,000",
    timeline: "6 Months",
    deliverables: [
      "A drvr embedded in the team",
      "GTM strategy owned end to end",
      "Weekly working sessions",
      "Outbound built and run until there is someone to hand it to",
      "Conference strategy and event execution",
      "First sales hire made when the system is ready for one",
      "The goal is to leave something behind that works without us"
    ],
    highlighted: false
  }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const rooms = await base44.asServiceRole.entities.EngagementRoom.list();
    
    let updated = 0;
    for (const room of rooms) {
      await base44.asServiceRole.entities.EngagementRoom.update(room.id, {
        proposalOptions: proposalOptions
      });
      updated++;
    }

    return Response.json({ success: true, updated, message: `Updated ${updated} engagement rooms with new proposal options` });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});