import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { slug, key, email } = await req.json();

  const rooms = await base44.asServiceRole.entities.EngagementRoom.filter({ slug });
  if (!rooms || rooms.length === 0) {
    return Response.json({ error: 'Room not found' }, { status: 404 });
  }

  const room = rooms[0];

  // If key matches directly, grant access (link-based)
  if (key && room.accessKey === key) {
    await base44.asServiceRole.entities.EngagementRoom.update(room.id, {
      status: 'viewed',
      lastViewedAt: new Date().toISOString(),
    });
    return Response.json({ success: true, room });
  }

  // Email-based verification
  if (email && room.prospectEmail.toLowerCase() === email.toLowerCase()) {
    await base44.asServiceRole.entities.EngagementRoom.update(room.id, {
      status: 'viewed',
      lastViewedAt: new Date().toISOString(),
    });
    return Response.json({ success: true, room, accessKey: room.accessKey });
  }

  return Response.json({ error: 'Access denied' }, { status: 403 });
});