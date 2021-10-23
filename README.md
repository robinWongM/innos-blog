# Innos Blog

Create a blog with Innos Note and Cloudflare Workers.

## Getting started

1. Set up wrangler CLI: `npm install -g @cloudflare/wrangler && wrangler login`
2. Clone the repository: `git clone https://github.com/robinWongM/innos-blog.git`
3. Modify variables in `src/config.ts` to suit your needs.
4. Deploy it! `wrangler publish`
5. Access your blog at `https://innos-blog.<YOUR_CLOUDFLARE_WORKERS_NAMESPACE>.workers.dev`.

> You can also bind a custom domain for your Innos Blog by using [Custom routes](https://developers.cloudflare.com/workers/platform/routes).

## Configuration

See `src/config.ts` for example variables.
