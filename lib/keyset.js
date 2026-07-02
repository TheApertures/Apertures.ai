'use strict';

// A5O demo-preview root anchor.
// DO NOT use this root on main or in production DNS.
// The demo private key was described as living outside this repository and must remain out of git.

const ROOT_SPKI_B64 = 'MCowBQYDK2VwAyEAyYHBXfGWtRTxIxLylVyrJ161IsDk/LpmR53cpxMPA4I=';
const ROOT_SHA256_HEX = '77743fa75ffe5f9b44a3d390c23321c2f61fb9a84304bc8294554276b83fe32a';
const APPT_SIG_B64 = 'QJC7DCEQOorrGigN74TbR//q3e1NzlLiTOyl1GT+Jo65jj9VR4vrGknkp07PH8mXQrZH7wUpyh8x6GRmFMkIBQ==';

const KEYSET = Object.freeze({
  keyset_type: 'A5O-PUBLIC-KEYSET',
  schema: 'A5O-KEYSET-1.0',
  environment: 'demo-preview',
  warning: 'Preview/demo anchor only. Not a production root and not suitable for main or DNS production pinning.',
  canonicalization_rule: 'A5O-CANON-SIGN-1.0',
  anchor: {
    type: 'dns-txt-sha256-pin',
    name: '_a5o.theapertures.app',
    value: `a5o-root-sha256=${ROOT_SHA256_HEX}`,
    status: 'demo-anchor-only'
  },
  root: {
    key_id: 'A5O-ROOT-DEMO-ED25519-001',
    algorithm: 'Ed25519',
    public_key_der_spki_base64: ROOT_SPKI_B64,
    sha256_hex: ROOT_SHA256_HEX
  },
  appointment: {
    signature_algorithm: 'Ed25519',
    signature_base64: APPT_SIG_B64,
    signed_preimage: 'canon(keys[])',
    note: 'This endpoint scaffold needs the exact served-keyset keys[] bytes from served-keyset.json before it can satisfy an end-to-end live receipt verifier.'
  },
  keys: [],
  incomplete_until: 'Paste the exact served-keyset.json operational keys[] here. Do not substitute inferred or failed-record public keys.'
});

function getKeyset() {
  return KEYSET;
}

function serializeKeyset(value = KEYSET) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

module.exports = {
  ROOT_SPKI_B64,
  ROOT_SHA256_HEX,
  APPT_SIG_B64,
  getKeyset,
  serializeKeyset
};
