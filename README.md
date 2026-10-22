# Machdubit Tech Solutions

A cinematic office website for Machdubit Tech Solutions, founded by Mpumelelo Dube. The company develops software for small and medium organisations and its own in-house solutions, including Ride263.

## Run locally

Requires Node.js. Run `node serve.cjs`, then open http://localhost:4317.

The site uses browser JavaScript modules, so serve it over HTTP rather than opening index.html directly. No dependency installation or build step is needed. Any static host can serve index.html, style.css, office.js and assets/.

## Experience

One persistent 3D office connects reception, the founder desk, the studio, systems integration, project delivery, Ride263, support and the final meeting area. Native scrolling controls the camera. Motion preferences respect the operating system by default and retain explicit choices. The office is an imagined brand environment.

Contact: info@machdubit.co.zw

## Assets and licensing

Three.js is bundled locally under its MIT licence; see assets/vendor/THREE-LICENSE.txt. The redesigned Machdubit vector mark and office geometry are included in the source.

The four low-poly character styles are by Quaternius, used under CC0. Sources and processing notes are in assets/people/README.md. Seven office occupants share these four assets, totalling 1,123,044 bytes without external textures. The walker follows scroll progress and respects paused motion. Seated poses include desk hand placement and footrests; procedural figures remain as loading and failure fallbacks.

## Validation

JavaScript syntax checked. Desktop and emulated phone browser checks covered camera framing, chapter navigation, service selection, expandable process and support content, and saved motion controls. Physical device testing has not been performed.

Run `node tests/office-people.mjs` to verify the actual character files, seated hand and foot placement, independent skeletons, reverse and paused walking, and loading fallbacks. Tests are excluded from deployment assets.

## Office polish

The local office includes wood-grain materials, soft contact shadows, warm task lighting, a larger founder workstation, low-poly Quaternius occupants, and a scroll-driven walking figure. Eight named rooms are available in a desktop rail and phone selector. Product previews open in an accessible dialog with full uncropped artwork.

`assets/ride263/*-preview.webp` are existing Ride263 Play Store preview compositions, not raw device screenshots. Example fares and interface content are illustrative. Their full composition is preserved on the office display wall and in the gallery.

`journey.js` contains the eight camera stops and scroll-to-progress mapping, including the deliberate first-30% reading holds. Camera projection frames the subject separately on desktop and phones without resizing the objects. Geometry checks cover chair orientation, seated arm clearance, path continuity and clearance from major office furniture. Browser review uses viewport emulation; physical-device performance remains untested.
