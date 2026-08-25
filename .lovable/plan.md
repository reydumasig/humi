## Plan: Apply N-ablly branding to Job Evolution AI

Adopt N-ablly's visual identity across the existing page. No structural changes to the form, results, or role engine — only design tokens, header, and an "Insights by N-ablly" CTA.

### Brand observations (from nablly.com)
- **Background**: deep cool slate (~#1f2933 / oklch dark slate), not purple-navy
- **Accent**: signature warm orange (~#F08C2E) used for headlines, primary buttons, the "-" in the logo, and highlight badges
- **Secondary surface**: glassy dark cards with subtle 1px borders
- **Typography**: clean geometric sans (looks like a Nunito/Quicksand style) for headlines, mono for tiny captions
- **Buttons**: fully rounded pills, solid orange primary, ghost/outline secondary
- **Background texture**: subtle grid + soft orange radial glow top-right
- **Badge style**: orange outlined pill with leading dot (e.g. "● AI EXECUTION LAYER FOR BUSINESS")

### Changes

**1. `src/styles.css` — retune design tokens**
- `--background`: dark slate (oklch ~0.22 0.015 250)
- `--primary`: N-ablly orange (oklch ~0.74 0.17 55) — swap primary from indigo to orange so all existing `bg-primary` / `text-primary` usages instantly rebrand
- `--accent`: keep warm orange variant (deeper) for highlights
- `--ring`, `--chart-1`: orange
- `--gradient-hero`: subtle orange radial glow top-right + slate base (matches nablly hero)
- `--gradient-primary`: orange → deeper orange
- `--shadow-glow`: orange-tinted
- Add `--font-display` stack: Nunito, Quicksand, system geometric sans; update body and h1 stacks
- Add `.grid-bg` utility: faint 1px grid lines for the page background overlay
- Add `.brand-badge` utility: orange-outlined pill with leading dot

**2. `src/routes/__root.tsx` — load Nunito font**
- Add Google Fonts link for Nunito (400/600/700/800) alongside existing font imports

**3. New `src/components/job-evolution/NabllyLogo.tsx`**
- Inline SVG/text logo: white "N", orange "-", white "ablly" — matches site logo

**4. New `src/components/job-evolution/SiteHeader.tsx`**
- Sticky/top header with NabllyLogo on the left and an "Insights by N-ablly" pill button on the right that opens `https://www.nablly.com/` in a new tab
- Mobile-responsive: logo + compact button

**5. `src/routes/index.tsx`**
- Render `<SiteHeader />` above `<Hero />`
- Update footer copy to "Insights by N-ablly · Job Evolution AI" with a small link to nablly.com

**6. `src/components/job-evolution/Hero.tsx`**
- Replace top badge text with N-ablly-style badge: orange dot + "● INSIGHTS BY N-ABLLY" (uppercase, tracked, orange border)
- Add a secondary "Powered by N-ablly →" pill link next to the primary CTA, opening nablly.com in a new tab
- Keep existing copy and animations

**7. `src/components/job-evolution/NeuralBackground.tsx`**
- Adjust the radial glow color from indigo to orange to match the new palette
- Keep the grid lines but tune opacity to match nablly's subtler grid

### Out of scope
- No copy rewrite beyond the badge/footer
- No changes to RoleInputCard, LoadingState, ResultsDashboard structure (they inherit colors via tokens automatically)
- No changes to role-engine.ts

### Result
The app feels like a sibling product of nablly.com — same dark slate canvas, orange accent system, geometric sans, pill buttons, and grid background — with a clear branded header and an "Insights by N-ablly" CTA linking back to the main site.