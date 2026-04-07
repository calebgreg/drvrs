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
  const roomUrl = `https://drvrs.io/room/${room.slug}?key=${accessKey}`;

  await base44.asServiceRole.entities.EngagementRoom.update(roomId, {
    accessKey,
    status: 'invited',
    invitedAt: new Date().toISOString(),
  });

  const defaultSubject = `Your drvrs diagnostic — ${room.companyName}`;
  const defaultBody = `Hi ${room.prospectName || room.companyName},\n\nYour personalized drvrs diagnostic engagement room is ready.\n\nAccess it here:\n${roomUrl}\n\nThis link is unique to you. Bookmark it for continued access.\n\n— drvrs`;

  const interpolate = (str) => str
    .replace(/\{\{prospectName\}\}/g, room.prospectName || room.companyName)
    .replace(/\{\{companyName\}\}/g, room.companyName)
    .replace(/\{\{roomUrl\}\}/g, roomUrl);

  const subject = room.emailSubject ? interpolate(room.emailSubject) : defaultSubject;
  const body = room.emailBody ? interpolate(room.emailBody) : defaultBody;

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'noreply@drvrs.io',
      to: room.prospectEmail,
      subject,
      text: body,
    }),
  });

  if (!resendRes.ok) {
    const err = await resendRes.text();
    return Response.json({ error: `Resend error: ${err}` }, { status: 500 });
  }

  return Response.json({ success: true, roomUrl });
});