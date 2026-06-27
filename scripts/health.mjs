const url = process.env.HEALTH_URL || "http://127.0.0.1:3000/api/health";
const response = await fetch(url);

if (!response.ok) {
  throw new Error(`Health check failed: ${response.status}`);
}

console.log(await response.text());
