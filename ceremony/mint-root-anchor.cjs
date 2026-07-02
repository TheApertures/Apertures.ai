#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { canonicalize, OPERATIONAL_KEYS } = require('../lib/keyset');

if (process.env.A5O_ALLOW_CLASSICAL_DEMO !== '1') {
  console.error('Refusing to run: this is a classical-only demo scaffold, not A5O-CEREMONY-1.0 production ceremony.');
  console.error('Set A5O_ALLOW_CLASSICAL_DEMO=1 only for preview rehearsal. Production requires the governed hybrid ceremony.');
  process.exit(1);
}

const outDir = path.join(__dirname, 'out');
fs.mkdirSync(outDir, { recursive: true, mode: 0o700 });

const keysCanonicalBytes = Buffer.from(canonicalize(OPERATIONAL_KEYS), 'utf8');
const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
const publicDer = publicKey.export({ format: 'der', type: 'spki' });
const publicPem = publicKey.export({ format: 'pem', type: 'spki' });
const privatePem = privateKey.export({ format: 'pem', type: 'pkcs8' });
const signature = crypto.sign(null, keysCanonicalBytes, privateKey);
const rootSha256 = crypto.createHash('sha256').update(publicDer).digest('hex');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');

const privatePath = path.join(outDir, `a5o-root-ed25519-${stamp}.private.pk8.pem`);
const publicPath = path.join(outDir, `a5o-root-ed25519-${stamp}.public.spki.pem`);
const jsonPath = path.join(outDir, `a5o-root-anchor-${stamp}.json`);

fs.writeFileSync(privatePath, privatePem, { mode: 0o600 });
fs.writeFileSync(publicPath, publicPem, { mode: 0o644 });
fs.writeFileSync(
  jsonPath,
  `${JSON.stringify(
    {
      ceremony_mode: 'classical-demo-only',
      minted_at: new Date().toISOString(),
      canonicalization_rule: 'A5O-CANON-SIGN-1.0',
      keys_canonical_bytes_length: keysCanonicalBytes.length,
      keys_canonical_sha256_hex: crypto.createHash('sha256').update(keysCanonicalBytes).digest('hex'),
      A5O_ROOT_ANCHOR_SPKI_B64: publicDer.toString('base64'),
      A5O_KEYSET_APPOINTMENT_SIG_B64: signature.toString('base64'),
      DNS_TXT: `a5o-root-sha256=${rootSha256}`,
      private_key_written_to: privatePath,
      public_key_written_to: publicPath
    },
    null,
    2
  )}\n`,
  { mode: 0o644 }
);

console.log('ceremony_mode=classical-demo-only');
console.log(`A5O_ROOT_ANCHOR_SPKI_B64=${publicDer.toString('base64')}`);
console.log(`A5O_KEYSET_APPOINTMENT_SIG_B64=${signature.toString('base64')}`);
console.log(`DNS _a5o-keys TXT=a5o-root-sha256=${rootSha256}`);
console.log(`\nSENSITIVE OUTPUT WRITTEN: ${privatePath}`);
console.log('Move output to offline custody immediately. Do not commit ceremony/out/.');
