# A5O keyset demo preview

This branch exposes a demo-preview A5O public keyset at:

```text
/.well-known/a5o-keys.json
```

The Vercel rewrite maps that conventional path to:

```text
/api/keys
```

## Current branch status

This branch is intentionally fail-closed until **both** of these are true:

1. The exact `served-keyset.json` operational `keys[]` bytes are pasted into `OPERATIONAL_KEYS` in `lib/keyset.js`.
2. The DEMO-002 appointment signature is regenerated over that exact `canon(keys[])` preimage and pasted into `APPT_SIG_B64`.

The active demo root is DEMO-002:

```text
A5O_ROOT_ANCHOR_SPKI_B64=MCowBQYDK2VwAyEARR4YYsCkNe0MIalqsLQdU540eQIcqpkLNYbPRkO8SwU=
DNS _a5o-keys TXT=a5o-root-sha256=e42aed0b32d6877ae3920a606f0a35f74b2c0e566ca0d64a4a423d3899529145
A5O_KEYSET_APPOINTMENT_SIG_B64=<regenerate with DEMO-002 over exact canon(keys[])>
```

The retired DEMO-001 / packet-key fingerprint is deny-listed in code:

```text
77743fa75ffe5f9b44a3d390c23321c2f61fb9a84304bc8294554276b83fe32a
```

With the appointment signature missing, the endpoint must emit:

```json
"anchor_status": null
```

## Demo preview flow

1. Confirm this is the repository that actually deploys the intended Vercel preview for `theapertures.app`. If the production repo is `AgentOBO/apertures-app`, move the patch there before treating any preview as representative.
2. Paste the exact live operational `keys[]` from `served-keyset.json` into `OPERATIONAL_KEYS` in `lib/keyset.js`.
3. Regenerate `APPT_SIG_B64` using DEMO-002 over the exact canonical `keys[]` bytes.
4. Push this branch.
5. Let Vercel build a preview.
6. Fetch the preview endpoint:

```bash
curl -sS "https://<preview-host>/.well-known/a5o-keys.json" | jq .
```

Expected only after the exact keys and DEMO-002 appointment signature are inserted:

```json
"verified": true,
"anchor_status": "ANCHORED"
```

## Production root flow

The demo key is not a production root of trust. For production:

1. Insert the final operational `keys[]` in `lib/keyset.js`.
2. Replace the classical-only ceremony scaffold with the governed hybrid ceremony required by `A5O-CEREMONY-1.0` before Stage 2.
3. Run the production ceremony on the machine that will mint the root.
4. Move generated secret material to cold storage immediately.
5. Replace the demo `ROOT_SPKI_B64` and `APPT_SIG_B64` in `lib/keyset.js` with the ceremony output.
6. Add the printed DNS TXT value only after custody is correct.

`ceremony/out/` and secret-key PEMs are ignored by `.gitignore` and must never be committed.
