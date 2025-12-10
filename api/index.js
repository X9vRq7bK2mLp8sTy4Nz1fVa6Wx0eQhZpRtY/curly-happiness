// api/index.js
export default function handler(req, res) {
  // gather useful request info (many proxies set these headers)
  const headers = req.headers || {};
  const forwarded = headers['x-forwarded-for'] || headers['x-real-ip'] || headers['cf-connecting-ip'] || headers['client-ip'];
  const ipCandidates = {
    x_forwarded_for: headers['x-forwarded-for'],
    x_real_ip: headers['x-real-ip'],
    cf_connecting_ip: headers['cf-connecting-ip'],
    via: headers['via'],
    true_client_ip: headers['true-client-ip'],
    forwarded: headers['forwarded'],
    client_ip_header: headers['client-ip']
  };

  // socket / connection info
  const socketInfo = {
    remoteAddress: req.socket && (req.socket.remoteAddress || req.socket.remoteFamily) || null,
    remotePort: req.socket && req.socket.remotePort || null
  };

  // full logging object
  const log = {
    time: new Date().toISOString(),
    method: req.method,
    url: req.url,
    query: req.query || {},
    headers,
    ip_candidates: ipCandidates,
    chosen_ip_guess: forwarded || req.socket?.remoteAddress || null,
    socket: socketInfo
  };

  // print to vercel runtime logs
  console.log('request-log:', JSON.stringify(log));

  // return a raw/plain response containing only: print("hello world")
  res.setHeader('content-type', 'text/plain; charset=utf-8');
  res.statusCode = 200;
  res.end('print("hello world")');
}
