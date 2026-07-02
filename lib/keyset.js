'use strict';

const crypto = require('crypto');

const ROOT_KEY_ID = 'A5O-ROOT-ANCHOR-DEMO-002';
const ROOT_SPKI_B64 = 'MCowBQYDK2VwAyEARR4YYsCkNe0MIalqsLQdU540eQIcqpkLNYbPRkO8SwU=';
const ROOT_SHA256_HEX = 'e42aed0b32d6877ae3920a606f0a35f74b2c0e566ca0d64a4a423d3899529145';

// Intentionally blank until regenerated over the exact live operational keys[].
// The prior DEMO-001 appointment signature must not be reused.
const APPT_SIG_B64 = '';

const RETIRED_ROOT_SHA256_DENYLIST = new Set([
  '77743fa75ffe5f9b44a3d390c23321c2f61fb9a84304bc8294554276b83fe32a'
]);

// Paste the exact operational keys[] from served-keyset.json here.
// Until these bytes match what APPT_SIG_B64 signed, anchor_status will remain null.
const OPERATIONAL_KEYS = [];

function canonicalize(value) {
  if (value === null) return 'null';

  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(',')}]`;
  }

  const valueType = typeof value;

  if (valueType === 'string') return JSON.stringify(value);
  if (valueType === 'boolean') return value ? 'true' : 'false';
  if (valueType === 'number') {
    if (!Number.isFinite(value)) throw new TypeError('Cannot canonicalize non-finite number');
    return JSON.stringify(value);
  }

  if (valueType === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`)
      .join(',')}}`;
  }

  throw new TypeError(`Cannot canonicalize ${valueType}`);
}

function sha256Hex(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function getKeysCanonicalBytes() {
  return Buffer.from(canonicalize(OPERATIONAL_KEYS), 'utf8');
}

function rootGate() {
  if (RETIRED_ROOT_SHA256_DENYLIST.has(ROOT_SHA256_HEX)) {
    return { ok: false, reason: 'fail-closed: root fingerprint is retired by governance denylist' };
  }

  if (!ROOT_SPKI_B64 || !ROOT_SHA256_HEX) {
    return { ok: false, reason: 'fail-closed: root public material is incomplete' };
  }

  const actualRootHash = sha256Hex(Buffer.from(ROOT_SPKI_B64, 'base64'));
  if (actualRootHash !== ROOT_SHA256_HEX) {
    return { ok: false, reason: 'fail-closed: root SPKI does not match configured SHA-256 pin' };
  }

  if (!APPT_SIG_B64) {
    return { ok: false, reason: 'fail-closed: DEMO-002 appointment signature missing' };
  }

  return { ok: true, reason: null };
}

function getRootPublicKey() {
  return crypto.createPublicKey({
    key: Buffer.from(ROOT_SPKI_B64, 'base64'),
    format: 'der',
    type: 'spki'
  });
}

function verifyAppointment() {
  const gate = rootGate();
  if (!gate.ok) return false;

  const canonicalBytes = getKeysCanonicalBytes();
  const signature = Buffer.from(APPT_SIG_B64, 'base64');

  try {
    return crypto.verify(null, canonicalBytes, getRootPublicKey(), signature);
  } catch (_error) {
    return false;
  }
}

function buildKeyset() {
  const keysCanonicalBytes = getKeysCanonicalBytes();
  const gate = rootGate();
  const appointmentVerified = gate.ok && verifyAppointment();

  return {
    keyset_type: 'A5O-PUBLIC-KEYSET',
    schema: 'A5O-KEYSET-1.0',
    environment: 'demo-preview',
    warning: 'Preview/demo anchor only. Not a production root and not suitable for main or DNS production pinning.',
    canonicalization_rule: 'A5O-CANON-SIGN-1.0',
    root: {
      key_id: ROOT_KEY_ID,
      algorithm: 'Ed25519',
      public_key_der_spki_base64: ROOT_SPKI_B64,
      sha256_hex: ROOT_SHA256_HEX,
      retired_denylist_checked: true
    },
    keys: OPERATIONAL_KEYS,
    appointment: {
      signature_algorithm: 'Ed25519',
      signature_base64: APPT_SIG_B64 || null,
      signed_preimage: 'canon(keys[])',
      canonical_bytes_sha256_hex: sha256Hex(keysCanonicalBytes),
      canonical_bytes_length: keysCanonicalBytes.length,
      verified: appointmentVerified
    },
    anchor: {
      type: 'dns-txt-sha256-pin',
      name: '_a5o.theapertures.app',
      value: `a5o-root-sha256=${ROOT_SHA256_HEX}`,
      anchor_status: appointmentVerified ? 'ANCHORED' : null,
      failure_mode: appointmentVerified ? null : gate.reason || 'fail-closed: root appointment does not verify over the served keys[] bytes'
    }
  };
}

function serializeKeyset(value = buildKeyset()) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

module.exports = {
  ROOT_KEY_ID,
  ROOT_SPKI_B64,
  ROOT_SHA256_HEX,
  APPT_SIG_B64,
  RETIRED_ROOT_SHA256_DENYLIST,
  OPERATIONAL_KEYS,
  canonicalize,
  getKeysCanonicalBytes,
  rootGate,
  verifyAppointment,
  buildKeyset,
  serializeKeyset
};
