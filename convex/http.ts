import { httpRouter } from 'convex/server';
import { Webhook } from './../node_modules/svix/src/webhook';
import { api } from './_generated/api';
import { httpAction } from './_generated/server';

const http = httpRouter();

// Create http route to receive webhook from clerk
http.route({
  path: '/clerk-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, req) => {
    // instantiate webhook secret
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    // check if webhook secret is present
    if (!webhookSecret) {
      throw new Error('No webhook secret');
    }

    // check headers are valid
    const svix_id = req.headers.get('svix-id');
    const svix_timestamp = req.headers.get('svix-timestamp');
    const svix_signature = req.headers.get('svix-signature');

    // check if headers are present
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error occured -- no svix headers', {
        status: 400,
      });
    }

    // get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(webhookSecret);
    let evt: any;

    // Check and verify payload with the headers
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as any;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error occured', {
        status: 400,
      });
    }
    // get the event type
    const eventType = evt.type;
    if (eventType === 'user.created') {
      // get user data
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      // Check if email_addresses exists and is an array with at least one element
      if (
        !email_addresses ||
        !Array.isArray(email_addresses) ||
        email_addresses.length === 0
      ) {
        console.error('Error: email_addresses is missing or empty');
        return new Response('Error: Invalid user data format', {
          status: 400,
        });
      }
      // get email from email_address
      const email = email_addresses[0].email_address;
      // trim user fullname
      const fullname = `${first_name || ''} ${last_name || ''}`.trim();

      // run mutation to create user
      try {
        await ctx.runMutation(api.users.createUser, {
          username: email.split('@')[0],
          fullname: fullname,
          email: email,
          image: image_url,
          clerkId: id,
        });
      } catch (error) {
        console.error('Error creating user:', error);
        return new Response('Error creating user', {
          status: 500,
        });
      }
    }

    // Otherwise, return a 200 OK response
    return new Response('Webhook process successfully', {
      status: 200,
    });
  }),
});
export default http;
