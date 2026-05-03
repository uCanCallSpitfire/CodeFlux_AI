import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";
const distDir = resolve("dist");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

if (!existsSync(distDir)) {
  console.error("dist klasörü yok. Önce `npm run build` çalıştır.");
  process.exit(1);
}

createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${host}:${port}`);
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const requestedPath = normalize(join(distDir, decodeURIComponent(pathname)));
  const filePath = requestedPath.startsWith(distDir)
    ? requestedPath
    : join(distDir, "index.html");
  const fallbackPath = join(distDir, "index.html");
  const servedPath = existsSync(filePath) ? filePath : fallbackPath;

  response.setHeader(
    "Content-Type",
    mimeTypes[extname(servedPath)] || "application/octet-stream"
  );

  createReadStream(servedPath).pipe(response);
}).listen(port, host, () => {
  console.log(`Preview: http://${host}:${port}/`);
});
