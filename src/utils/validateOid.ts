export const isCorrectOid = (oid: string): boolean => {
  return oid.match(/^[0-9a-fA-F]{24}$/) !== null;
};
