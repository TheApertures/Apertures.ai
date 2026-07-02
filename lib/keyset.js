'use strict';

const crypto = require('crypto');

// A5O demo-preview root anchor.
// DO NOT use this root on main or in production DNS.
// The demo private key was described as living outside this repository and must remain out of git.

const ROOT_SPKI_B64 = 'MCowBQYDK2VwAyEAyYHBXfGWtRTxIxLylVyrJ161IsDk/LpmR53cpxMPA4I=';
const ROOT_SHA256_HEX = '77743fa75ffe5f9b44a3d390c23321c2f61fb9a84304bc8294554276b83fe32a';
const APPT_SIG_B64 = 'QJC7DCEQOorrGigN74TbR//q3e1NzlLiTOyl1GT+Jo65jj9VR4vrGknkp07PH8mXQrZH7wUpyh8x6GRmFMkIBQ==';

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

function getRootPublicKey() {
  return crypto.createPublicKey({
    key: Buffer.from(ROOT_SPKI_B64, 'base64'),
    format: 'der',
    type: 'spki'
  });
}

function verifyAppointment() {
  if (!ROOT_SPKI_B64 || !APPT_SIG_B64) return false;

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
  const appointmentVerified = verifyAppointment();

  return {
    keyset_type: 'A5O-PUBLIC-KEYSET',
    schema: 'A5O-KEYSET-1.0',
    environment: 'demo-preview',
    warning: 'Preview/demo anchor only. Not a production root and not suitable for main or DNS production pinning.',
    canonicalization_rule: 'A5O-CANON-SIGN-1.0',
    root: {
      key_id: 'A5O-ROOT-DEMO-ED25519-001',
      algorithm: 'Ed25519',
      public_key_der_spki_base64: ROOT_SPKI_B64,
      sha256_hex: ROOT_SHA256_HEX
    },
    keys: OPERATIONAL_KEYS,
    appointment: {
      signature_algorithm: 'Ed25519',
      signature_base64: APPT_SIG_B64,
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
      failure_mode: appointmentVerified ? null : 'fail-closed: root appointment does not verify over the served keys[] bytes'
    }
  };
}

function serializeKeyset(value = buildKeyset()) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

module.exports = {
  ROOT_SPKI_B64,
  ROOT_SHA256_HEX,
  APPT_SIG_B64,
  OPERATIONAL_KEYS,
  canonicalize,
  getKeysCanonicalBytes,
  verifyAppointment,
  buildKeyset,
  serializeKeyset
};
