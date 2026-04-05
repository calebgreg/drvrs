import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const user = await base44.auth.me();
  if (user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { roomId } = await req.json();

  const room = await base44.asServiceRole.entities.EngagementRoom.get(roomId);
  if (!room) {
    return Response.json({ error: 'Room not found' }, { status: 404 });
  }

  const accessKey = crypto.randomUUID().replace(/-/g, '').slice(0, 24);
  const appUrl = req.headers.get('origin') || 'https://drvrs.io';
  const roomUrl = `${appUrl}/room/${room.slug}?key=${accessKey}`;

  await base44.asServiceRole.entities.EngagementRoom.update(roomId, {
    accessKey,
    status: 'invited',
    invitedAt: new Date().toISOString(),
  });

  await base44.asServiceRole.integrations.Core.SendEmail({
    to: room.prospectEmail,
    subject: `Your drvrs diagnostic — ${room.companyName}`,
    body: `Hi ${room.prospectName || room.companyName},

Your personalized drvrs diagnostic engagement room is ready.

Access it here:
${roomUrl}

This link is unique to you. Bookmark it for continued access.

— drvrs`,
  });

  return Response.json({ success: true, roomUrl });
});