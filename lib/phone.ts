// UK geographic (01/02) and mobile (071–075, 077–079) formats.
// 070 personal numbers and 076 pagers are not mobile contact numbers.
const nationalPhonePattern = /^(?:01\d{8,9}|02\d{9}|07[1-5789]\d{8})$/;

export function normalizePhone(value: string): string {
  const input = value.trim();
  if (!input || input.length > 40 || !/^[+\d\s()-]+$/.test(input)) return "";

  const compact = input
    .replace(/^(\+44|0044)\s*\(0\)/, "$1")
    .replace(/[\s()-]/g, "");
  const national = compact.startsWith("+44")
    ? `0${compact.slice(3)}`
    : compact.startsWith("0044")
      ? `0${compact.slice(4)}`
      : compact;

  return nationalPhonePattern.test(national) ? `+44${national.slice(1)}` : "";
}

export function isValidUkPhone(value: string): boolean {
  return normalizePhone(value) !== "";
}
