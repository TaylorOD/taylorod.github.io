# lilgotchi optional dialogue

The original clone has optional AI personality dialogue. Restoring that feature is part of full upstream functionality, even though ordinary pet care must work without it.

## Original behavior

Inventory the pinned source's dialogue triggers, prompt context, personality mapping, busy state, settings and visible response presentation. Preserve their sequence and map Slice and Cyberpunk identities to appropriate personalities without changing care outcomes.

Record the original provider settings from the pinned source before implementation. Provider availability can change independently of the game, so the adapter must not tie the engine to one model name.

## Widget integration

Offer an optional host supplied dialogue callback. The iframe sends a validated request through the shell. The shell invokes the callback and returns plain text. Keep provider code and credentials outside the core game bundle.

The callback receives only the fields needed for the pet's dialogue context. It must not receive browser saves, host page content or other site data. Treat the response as text and enforce a length limit. Closing, changing families or restarting invalidates pending requests so an old reply cannot appear on another pet.

The default install makes no AI requests. A site can add its own server endpoint and provider configuration. Publish a separate example with request validation, timeouts, rate limits and a spending limit. Never embed a site owner's provider secret in the client.

## Settings and failure behavior

Keep the original dialogue enablement flow recognizable, with host configuration replacing the original raw API key field. This settings change is an explicit integration difference. Clearly label when dialogue is unavailable because no adapter is configured.

Network errors show a small retryable state and leave pet care playable. Do not replay requests on every animation frame. Dialogue responses never grant food, happiness or other state changes unless the original source explicitly does so and parity tests confirm it.

## Acceptance

Use a deterministic fake adapter to test every original trigger and visible state. Test delayed replies, timeouts, cancellation, malformed replies and family changes. Run a separately configured provider integration once credentials and hosting exist. Core gameplay must pass with the adapter absent.

Full feature parity remains incomplete until the adapter and original trigger coverage are implemented. Installing the core widget must never require paid dialogue.

## Stage 8 implementation

The pinned source has 14 events: `fed_meal`, `fed_snack`, `played_won`, `played_lost`, `cleaned`, `woke_up`, `going_sleep`, `hungry`, `sad`, `sick`, `evolved`, `discipline`, `idle` and `misbehave`. Evolution includes hatching and the secret adult. Care refusals do not request dialogue. Snack sickness fires before the snack reaction, so the busy gate drops the snack request. Idle checks every five minutes with a 20 percent chance while awake, alive and past egg stage. Offline catch up does not request dialogue.

The source maps all 11 living identities to personality text. The adapter preserves those descriptions and identity keys. Slice and Cyberpunk send their family and displayed name with that personality, so a host can phrase replies as the matching food or robot. It sends event, family, identity, name, personality, hunger, happiness, discipline, age and weight only. It never sends a save, timestamps, page content or storage keys.

Original settings used an optional password input saved as `openai_api_key`, with save and clear controls. The source called OpenAI chat completions using `gpt-4o-mini`, temperature 0.8 and max_tokens 60. Those are historical source settings, not a recommendation or an available integration. The new host callback replaces the key field. The player switches personality dialogue on in settings. That preference persists per widget instance. With no callback the switch is unavailable and no requests are made.

Only one request runs at a time. Busy events are dropped, matching the source. Replies use textContent, a 280 character limit, original 40 ms typing and four second dismissal. Reduced motion shows the whole reply. The bubble keeps original styling but flows below the controls so it can resize the iframe. Thinking and retry states are new. Failures do not expose server details. The host times out at nine seconds and the frame at ten seconds. Close, removal, family change, reset, death and turning dialogue off cancel pending work and hide the bubble. Old replies cannot appear on another pet.

The separate `server-example` folder is not copied into the public build. It contains a provider neutral route core, validation, authenticated user rate limiting, timeout and conservative cost reservations. Its README lists the required deployment controls and durable budget work. No live provider has been configured or tested.

Parent browser review passed the reply bubble, saved opt in, failure and malformed reply retry, successful retry, delayed reply cancellation on family switch and the phone error panel. Desktop and phone screenshots are in `pr-screenshots/dialogue-desktop.jpg` and `pr-screenshots/dialogue-mobile.jpg`. The 63 passing tests include source hook sequence comparisons, minimal context, busy gating, stale replies, timeout, validation and server rate and budget guards. A live provider check still requires separate hosting and credentials.
