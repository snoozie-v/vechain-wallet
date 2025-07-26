export function decodeString(data: string): string {
  const hex = data.slice(2);
  const offset = parseInt(hex.slice(0, 64), 16) * 2;
  const length = parseInt(hex.slice(offset, offset + 64), 16) * 2;
  const stringData = hex.slice(offset + 64, offset + 64 + length);
  let result = '';
  for (let i = 0; i < stringData.length; i += 2) {
    result += String.fromCharCode(parseInt(stringData.slice(i, i + 2), 16));
  }
  return result;
}

export function decodeUint256(data: string): string {
  const hex = data.slice(2);
  return BigInt(`0x${hex.slice(0, 64)}`).toString();
}


