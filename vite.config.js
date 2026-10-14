import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// Proxy server middleware plugin for real-time video embed benchmarking
// This runs directly in Vite and performs exact server-side HTTP audits (detecting 200 vs 403,
// response payload size, response latency, and X-Frame-Options SAMEORIGIN / DENY iframe blocking)
const benchmarkProxyPlugin = () => ({
  name: 'benchmark-proxy',
  configureServer(server) {
    server.middlewares.use('/api/benchmark', async (req, res) => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const targetUrl = url.searchParams.get('url');

      if (!targetUrl) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing target url parameter' }));
        return;
      }

      const startTime = performance.now();
      try {
        const response = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          },
          redirect: 'follow',
          signal: AbortSignal.timeout(4500)
        });

        const latency = Math.round(performance.now() - startTime);
        const text = await response.text();
        const byteSize = text.length;

        const xFrame = (response.headers.get('x-frame-options') || '').toUpperCase();
        const csp = (response.headers.get('content-security-policy') || '').toLowerCase();
        
        // Check if provider refuses iframe connection
        const iframeBlocked = xFrame.includes('DENY') || xFrame.includes('SAMEORIGIN') || csp.includes("frame-ancestors 'none'");

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          status: response.status,
          latency,
          byteSize,
          iframeBlocked,
          xFrame
        }));
      } catch (err) {
        const latency = Math.round(performance.now() - startTime);
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          status: 0,
          latency: latency >= 4400 ? 4500 : latency,
          byteSize: 0,
          iframeBlocked: false,
          error: err.message
        }));
      }
    });
  }
})

export default defineConfig({
  plugins: [vue(), benchmarkProxyPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5189,
    allowedHosts: true
  },
  preview: {
    host: '0.0.0.0',
    port: 5189,
    allowedHosts: true
  }
})
