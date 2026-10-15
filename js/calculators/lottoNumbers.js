/*
  재미용 무작위 후보 번호입니다.
  운세 계산 및 당첨 예측과 연결하지 않습니다.
*/

export const LOTTO_NUMBER_COUNT = 13;

function randomInteger(limit) {
  const bytes = new Uint32Array(1);

  const ceiling =
    Math.floor(4294967296 / limit) * limit;

  do {
    globalThis.crypto.getRandomValues(bytes);
  } while (bytes[0] >= ceiling);

  return bytes[0] % limit;
}

export function drawLottoNumbers(
  count = LOTTO_NUMBER_COUNT
) {
  if (
    !Number.isInteger(count) ||
    count < 1 ||
    count > 45
  ) {
    throw new RangeError(
      "번호 개수는 1~45 사이의 정수여야 합니다."
    );
  }

  const pool = Array.from(
    { length: 45 },
    (_, index) => index + 1
  );

  for (let index = 0; index < count; index++) {
    const picked =
      index + randomInteger(pool.length - index);

    [pool[index], pool[picked]] = [
      pool[picked],
      pool[index]
    ];
  }

  return pool
    .slice(0, count)
    .sort((a, b) => a - b);
}