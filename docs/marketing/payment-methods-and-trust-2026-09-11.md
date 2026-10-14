# Payment methods and trust details — September 11, 2026

## Approval and scope

- Acru requested explicit public mentions of Apple Pay, Google Pay, Venmo, PayPal, Pix, SEPA, and buy now, pay later. Klarna and Afterpay were previously requested and remain included.
- Client names were provided and approved in the conversation: Bitunix, Blofin, PackDraw, Leveledup Traders, Roobet, MundPay, Fulfillment Pros, Solstice Marketing Solutions, Crush Research, Betonline.ag, and Cornerstone ATS.
- The carousel now uses sourced artwork for ten approved brands. No invented logos or generic text-only stand-ins are shown. Solstice Marketing Solutions remains absent because no reliable matching logo was found online.
- Acru confirmed the proposed wording “PCI DSS compliant” and “SOC 2 Type II.” Badges use Acru's own understated styling, not a copied issuer seal. No PCI level, Visa registration, or additional certification is claimed.
- These are client-supplied commercial/compliance claims, not an independent audit or evidence that the unfinished Acru payment API is live. No API contract or backend implementation changed.

## References

- https://www.paynote.com/ and https://www.paynote.com/solutions/features/apple-pay-google-pay — reference for clearly naming methods and showcasing integrations. Do not copy partner counts, bank relationships, testimonials, or performance guarantees.
- https://coinflow.cash/ — reference for footer trust placement. Coinflow's PCI Level 1, SOC 2, and 3DS marks are not authority for Acru's certifications.

## Implementation

- Named APM lineup after the product cards, using bundled Simple Icons rather than remote logo requests.
- More specific product, checkout, demo, metadata, and FAQ copy. Navigation and footer link directly to the APM lineup.
- Client marquee directly below the payment-flow film. CSS-only movement, off-screen/background and hover pause, and a static wrapped list for reduced motion. The visible pause button was removed at the user's request.
- Two compliance badges in the shared dark footer, preserving the four social icons and existing legal links.
- Published September 11 to https://acru.com as `acru-preview:116` after the real-logo replacement. Staging remains `acru-preview-staging:2`; only the production web image changed. See `docs/deployments/acru-production-2026-09-11-client-trust.md` for verification and rollback.

## Official logo sources

Original SVG artwork is stored under `public/marketing/clients/v1`. The carousel uses a theme-aware monochrome presentation without changing the underlying logo geometry. The original Crush Research WebP is resized to 512px wide. Leveled Up Traders' square profile mark retains its original white background and blue color, with an adjacent descriptive company label; no replacement wordmark was fabricated. Assets are self-hosted with immutable caching; the duplicate carousel row is hidden from assistive technology.

- Bitunix: https://www.bitunix.com/ — https://www.bitunix.com/web/bitunix-assets/portal/bitunix-dark-logo-6146222c.svg
- BloFin: https://blofin.com/en — https://s2.blofin.com/frontend/_home_website/_next/static/home-public-static/svg/nav/logo.svg
- PackDraw: https://packdraw.com/en-us — exact inline header SVG. The official symbol-and-name lockup uses 24px artwork, 8px gap, and Urbanist 900 at 20px/28px; this lockup is retained. The open-source font is sourced from https://fonts.googleapis.com/css2?family=Urbanist:wght@900&display=swap and its OFL license is included alongside the asset.
- Roobet: https://roobet.com/ — https://roobet.com/assets/r-NQNxh0.svg
- MundPay: https://www.mundpay.com/ — https://www.mundpay.com/assets/6f2f6b5448-912Bk5uKdxMx0IggmgUKAE201Q-DdGsKOBS.svg
- Crush Research: https://crushresearch.com/ — https://crushresearch.com/images/logo.webp (also confirmed in the site's Organization metadata).
- BetOnline: https://www.betonline.ag/home — exact base64-embedded SVG labeled “Bet Online Logo” in the official public response. No access restriction was bypassed.
- Leveled Up Traders: https://www.trustpilot.com/review/leveleduptraders.com — claimed company profile and company replies identify the historical logo; original 149×149 JPEG at https://consumersiteimages.trustpilot.net/business-units/6651034a452e620f5bafeb15-198x149-1x.jpg. The former company site was unavailable; AlphaTrader's post-acquisition logo was not substituted.
- Fulfillment Pros: https://www.fulfillment-pros.com/ — exact inline SVG in the homepage link titled “Fulfillment Pros.” Domain, address and telephone corroborated by https://www.bbb.org/us/wa/lynnwood/profile/social-media-marketing/fulfillment-pros-llc-1296-1000161578. This is the US marketing firm, not the differently spelled China-based fulfilmentpros.com.
- Cornerstone ATS: https://csod.dev/ — original https://csod.dev/img/logo-text.196df383.svg, matching the current Cornerstone corporate footer. The developer portal explicitly calls its recruiting product “Cornerstone ATS”; this supports interpreting the user-supplied name as Cornerstone OnDemand. The client relationship remains user-supplied, not independently established by the asset research.

The existing `public/merchant-brands/bitunix.svg` is not the official wordmark; it was left unchanged and is not used by the carousel.

## Follow-up: muted gray logos (shipped in acru-preview:117)

- All carousel artwork and adjacent brand labels now share 52% opacity for a muted gray treatment. Leveled Up Traders' original blue profile asset is displayed with CSS grayscale, preserving the original file. Desktop, mobile and hover use the same treatment.
- Production build passed; local HTTP/CSS checks confirmed the desaturated badge and shared muted opacity. This follow-up is not part of release `acru-preview:116`.

## Follow-up: remove standalone method lineup (shipped in acru-preview:117)

- Removed “The ways your customers want to pay.”, its supporting paragraph, eight-logo method list and availability note, including the unused component and section-only styles.
- Header/footer alternative-payment links now point to the existing Payment methods product card. The product cards, payment-method mentions elsewhere, FAQ, client carousel and footer badges remain intact.
- Fourteen targeted marketing tests passed and the local page confirmed the removed section and anchor are absent. This change and the gray client-logo treatment shipped in release 117.

## Follow-up: full-width carousel and supplied badges (shipped in acru-preview:117)

- Moved the carousel above the “Acru combines…” paragraph. Its logo viewport and edge fades now span the screen. The final user revision removes the divider borders and centers the trust heading. The paragraph and payment-flow film keep their existing centered widths.
- Tightened consistent logo spacing and made the repeat count responsive to the viewport. The loop moves exactly one measured group so its seam stays continuous; extra copies fill ultrawide screens, and all carousel images are requested when visible.
- Replaced the generated compliance marks with the two user-supplied artworks. The user explicitly confirmed “PCI DSS Validated Level 1 Service Provider” after being asked about the stronger wording on the supplied PCI badge; this is user confirmation, not an independent compliance verification. Existing SOC 2 Type II wording remains user-approved.
- Sources: Downloads/678a6d6fc5825e05c17510b8_678a6d497673e6547fd00d40_aicpa-soc-logo-PNG.png and Downloads/Invoiced-PCI-Badge-3.webp. Proportional 320px WebP copies retain transparency and original artwork, totaling about 56 KiB, lazy-loaded with one-year versioned caching.
- Badges were subsequently reduced to 56px high with 12px spacing. Developers links now open the public documentation route. All 119 marketing tests, TypeScript and the production build passed. Mobile (390px), desktop (1440px) and ultrawide (3440px) checks passed locally and on production, including continuous loop coverage and clicking Developers through to the docs. Deployment details are in `docs/deployments/acru-production-2026-09-12-carousel-footer.md`.

## Remaining client artwork

- Solstice Marketing Solutions: exact-name searches, business/LLC listings, company socials and related domains did not yield a verifiable matching logo. https://www.solsticemarketingsolutions.com/ returns a Wix domain-connection error. The similarly named https://www.solsticemarketingconsultants.com/ identifies itself as Solstice Marketing Consultants in its terms, not Solutions, so its logo was not substituted. Exact-name Singapore recruitment listings do not establish a usable official brand asset. There is no placeholder for this unresolved client.
