// Zero-dependency ping - tests if ANY serverless function runs at all
export default function handler(req, res) {
  res.status(200).json({ ok: true, ts: new Date().toISOString() });
}
