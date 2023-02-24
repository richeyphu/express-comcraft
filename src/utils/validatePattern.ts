export const BASE64_IMAGE_REGEX = /^data:([A-Za-z-+/]+);base64,(.+)$/;
export const OID_REGEX = /^[0-9a-fA-F]{24}$/;
// Thai mobile or telephone no.
export const TEL_REGEX = /^(0[689]{1})+([0-9]{8})$|^(0[12]{1})+([0-9]{7})$/;

export const validatePattern = (pattern: RegExp, value: string): boolean => {
  return pattern.test(value);
};

export const isBase64Image = (base64: string): boolean => {
  return validatePattern(BASE64_IMAGE_REGEX, base64);
};

export const isOid = (oid: string): boolean => {
  return validatePattern(OID_REGEX, oid);
};

export const isTel = (tel: string): boolean => {
  return validatePattern(TEL_REGEX, tel);
};
