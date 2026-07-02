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

This branch is intentionally fail-closed until the exact `served-keyset.json` operational `keys[]` bytes are pasted into `lib/keyset.js`.

The demo root constants are present:

```text
A5O_ROOT_ANCHOR_SPKI_B64=MCowBQYDK2VwAyEAyYHBXfGWtRTxIxLylVyrJ161IsDk/LpmR53cpxMPA4I=
A5O_KEYSET_APPOINTMENT_SIG_B64=QJC7DCEQOorrGigN74TbR//q3e1NzlLiTOyl1GT+Jo65jj9VR4vrGknkp07PH8mXQrZH7wUpyh8x6GRmFMkIBQ==
DNS _a5o-keys TXT=a5o-root-sha256=77743fa75ffe5f9b44a3d390c23321c2f61fb9a84304bc8294554276b83fe32a
```

But `OPERATIONAL_KEYS` is still an empty array. That means the endpoint will emit:

```json
"anchor_status": null
```

until the appointment signature verifies over the exact served `keys[]` canonical bytes.

## Demo preview flow

1. Paste the exact live operational `keys[]` from `served-keyset.json` into `OPERATIONAL_KEYS` in `lib/keyset.js`.
2. Push this branch.
3. Let Vercel build a preview.
4. Fetch the preview endpoint:

```bash
curl -sS "https://<preview-host>/.well-known/a5o-keys.json" | jq .
```

Expected only after the exact keys are inserted:

```json
"verified": true,
"anchor_status": "ANCHORED"
```

## Production root flow

The demo key is not a production root of trust. For production:

1. Insert the final operational `keys[]` in `lib/keyset.js`.
2. Run the ceremony on the machine that will mint the root:

```bash
node ceremony/mint-root-anchor.cjs
```

3. Move the generated private key from `ceremony/out/` to cold storage immediately.
4. Replace the demo `ROOT_SPKI_B64` and `APPT_SIG_B64` in `lib/keyset.js` with the ceremony output.
5. Add the printed DNS TXT value only after custody is correct.

`ceremony/out/` and private-key PEMs are ignored by `.gitignore` and must never be committed.
