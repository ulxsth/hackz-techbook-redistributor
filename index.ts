const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    return new Response("Hello World");
  },
});

const url = server.url;
console.log(`Server running at ${url}`);