export function splitAddress(address, start = 11, end = -4) {
  return (
    (address && address.slice(0, start) + "..." + address.slice(end)) || ""
  );
}
