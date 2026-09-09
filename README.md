# Tech-Stuff website

Static, accessible, multi-page website served from the root of this repository by GitHub Pages at https://tech-stuff.tech/.

## Editing and validation

Use Node.js 22 or later. Run `npm ci`, `npm run build`, and `npm run dev`. The local preview runs at http://localhost:4321. Run `npm test` while it is running. To check a production deployment, run `node scripts/check.mjs https://tech-stuff.tech`.

The source copy and page templates live in `scripts/build.mjs` and `scripts/services.mjs`. Styles live in `assets/site.css`. Generated HTML is committed alongside the source so the existing GitHub Pages deployment continues to work without a new hosting provider or build service.

The contact form uses the public Google Forms responder URL in `scripts/form-config.mjs`. Form editing and responses remain in the owner's Google account. Never add response data, credentials, or private addresses to this public repository. The form allows anonymous submissions and keeps response summaries private. The site does not treat opening an email client as a successful form submission.

## Deployment and rollback

GitHub Pages publishes the repository's existing main branch. `CNAME` preserves the production domain. Keep HTTPS enforced in Pages settings. The pre-rebuild production commit is `224d26d8135febeefc926cd34a6023d023a335e2`. To roll back, restore the website files from that commit in a new commit; do not rewrite shared history. The `codex/pre-rebuild-2026-09-09` branch is retained as a rollback reference.

All original root image URLs remain available. Existing homepage and `/#contact` URLs are preserved. The new service pages use directory URLs and self-referencing production canonicals. The local preview sends an `X-Robots-Tag: noindex, nofollow` response header. Production pages are indexable except the custom 404 page.

## Business facts and assets

Phone and email came from the original production website and business profile. Daily 9 AM–9 PM hours were confirmed by Josh. Pricing comes from Josh's rebuild brief and the original site. No reviews, credentials, service guarantees, or private addresses are invented. LocalBusiness, Service, WebPage, WebSite, and breadcrumb JSON-LD use those verified details. A physical address is intentionally omitted for this service-area business; full Google LocalBusiness rich-result eligibility is not claimed.

Inter is self-hosted under the SIL Open Font License in `assets/inter-LICENSE.txt`. Original brand images are preserved. The interface wordmark and favicon are simple text-based brand assets. No fake portrait or testimonial is used.
