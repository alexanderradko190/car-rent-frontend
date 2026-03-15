export const unwrap = (payload) => {
  if (payload && Object.prototype.hasOwnProperty.call(payload, "data")) {
    return payload.data;
  }
  return payload;
};
