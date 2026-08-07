import { Redis } from '@upstash/redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Vercel's Upstash integration injects KV_ prefixed env vars
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const COUNTER_KEY = 'voidslate:thoughts:count';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // Atomically increment and return new value
      const count = await redis.incr(COUNTER_KEY);
      return res.status(200).json({ count });
    }

    // GET — return current count
    const count = (await redis.get<number>(COUNTER_KEY)) ?? 0;
    return res.status(200).json({ count });
  } catch (err) {
    console.error('Counter error:', err);
    return res.status(500).json({ error: 'Counter unavailable' });
  }
}
