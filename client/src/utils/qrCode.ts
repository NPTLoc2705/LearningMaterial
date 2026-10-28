/**
 * Pure TypeScript ISO/IEC 18004 QR Code matrix generator (Byte mode, ECC Level L, Versions 1–7).
 * Produces a boolean[][] matrix (true = dark module) for clean SVG rendering with zero dependencies.
 */

interface QrVersionSpec {
  version: number;
  totalDataCodewords: number;
  ecCodewordsPerBlock: number;
  numBlocks: number;
  alignmentCenters: number[];
}

const VERSION_SPECS_L: readonly QrVersionSpec[] = [
  { version: 1, totalDataCodewords: 19, ecCodewordsPerBlock: 7, numBlocks: 1, alignmentCenters: [] },
  { version: 2, totalDataCodewords: 34, ecCodewordsPerBlock: 10, numBlocks: 1, alignmentCenters: [6, 18] },
  { version: 3, totalDataCodewords: 55, ecCodewordsPerBlock: 15, numBlocks: 1, alignmentCenters: [6, 22] },
  { version: 4, totalDataCodewords: 80, ecCodewordsPerBlock: 20, numBlocks: 1, alignmentCenters: [6, 26] },
  { version: 5, totalDataCodewords: 108, ecCodewordsPerBlock: 26, numBlocks: 1, alignmentCenters: [6, 30] },
  { version: 6, totalDataCodewords: 136, ecCodewordsPerBlock: 18, numBlocks: 2, alignmentCenters: [6, 34] },
  { version: 7, totalDataCodewords: 156, ecCodewordsPerBlock: 20, numBlocks: 2, alignmentCenters: [6, 22, 38] },
];

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);

(function initGaloisField() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) {
      x ^= 0x11d;
    }
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255];
  }
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function buildGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    const factor = GF_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], factor);
    }
    poly = next;
  }
  return poly;
}

function computeReedSolomon(data: Uint8Array, ecCount: number): Uint8Array {
  const gen = buildGeneratorPoly(ecCount);
  const remainder = new Uint8Array(ecCount);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ remainder[0];
    remainder.copyWithin(0, 1);
    remainder[ecCount - 1] = 0;
    for (let j = 0; j < ecCount; j++) {
      remainder[j] ^= gfMul(gen[j + 1], factor);
    }
  }
  return remainder;
}

function encodeDataCodewords(bytes: Uint8Array, spec: QrVersionSpec): Uint8Array {
  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >>> i) & 1);
    }
  };

  // Byte mode indicator (0100) + 8-bit character count (versions 1–9)
  pushBits(0b0100, 4);
  pushBits(bytes.length, 8);
  for (let i = 0; i < bytes.length; i++) {
    pushBits(bytes[i], 8);
  }

  const maxBits = spec.totalDataCodewords * 8;
  const terminatorLen = Math.min(4, maxBits - bits.length);
  pushBits(0, terminatorLen);

  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  const codewords = new Uint8Array(spec.totalDataCodewords);
  const byteLen = bits.length / 8;
  for (let i = 0; i < byteLen; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bits[i * 8 + j];
    }
    codewords[i] = b;
  }

  const padBytes = [0xec, 0x11];
  for (let i = byteLen; i < spec.totalDataCodewords; i++) {
    codewords[i] = padBytes[(i - byteLen) % 2];
  }

  const blockDataSize = spec.totalDataCodewords / spec.numBlocks;
  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];

  for (let b = 0; b < spec.numBlocks; b++) {
    const block = codewords.slice(b * blockDataSize, (b + 1) * blockDataSize);
    dataBlocks.push(block);
    ecBlocks.push(computeReedSolomon(block, spec.ecCodewordsPerBlock));
  }

  const totalCodewords =
    spec.totalDataCodewords + spec.ecCodewordsPerBlock * spec.numBlocks;
  const interleaved = new Uint8Array(totalCodewords);
  let offset = 0;

  for (let i = 0; i < blockDataSize; i++) {
    for (let b = 0; b < spec.numBlocks; b++) {
      interleaved[offset++] = dataBlocks[b][i];
    }
  }
  for (let i = 0; i < spec.ecCodewordsPerBlock; i++) {
    for (let b = 0; b < spec.numBlocks; b++) {
      interleaved[offset++] = ecBlocks[b][i];
    }
  }

  return interleaved;
}

export function generateQrMatrix(text: string): boolean[][] {
  const bytes = new TextEncoder().encode(text);
  const spec =
    VERSION_SPECS_L.find((s) => bytes.length + 2 <= s.totalDataCodewords) ??
    VERSION_SPECS_L[VERSION_SPECS_L.length - 1];

  const size = 17 + spec.version * 4;
  const modules: boolean[][] = Array.from({ length: size }, () =>
    Array<boolean>(size).fill(false)
  );
  const isFunction: boolean[][] = Array.from({ length: size }, () =>
    Array<boolean>(size).fill(false)
  );

  const setFunctionModule = (r: number, c: number, dark: boolean) => {
    if (r < 0 || r >= size || c < 0 || c >= size) return;
    modules[r][c] = dark;
    isFunction[r][c] = true;
  };

  const drawFinder = (top: number, left: number) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const dist = Math.max(Math.abs(dr - 3), Math.abs(dc - 3));
        const dark = dist !== 2 && dist !== 4;
        setFunctionModule(top + dr, left + dc, dark);
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    setFunctionModule(6, i, i % 2 === 0);
    setFunctionModule(i, 6, i % 2 === 0);
  }

  // Alignment patterns
  const centers = spec.alignmentCenters;
  for (const r of centers) {
    for (const c of centers) {
      if (
        (r === 6 && c === 6) ||
        (r === 6 && c === size - 7) ||
        (r === size - 7 && c === 6)
      ) {
        continue;
      }
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const dist = Math.max(Math.abs(dr), Math.abs(dc));
          setFunctionModule(r + dr, c + dc, dist !== 1);
        }
      }
    }
  }

  // Reserve format info & dark module
  for (let i = 0; i <= 8; i++) {
    if (i !== 6) {
      setFunctionModule(8, i, false);
      setFunctionModule(i, 8, false);
    }
  }
  for (let i = 0; i < 8; i++) {
    setFunctionModule(8, size - 1 - i, false);
    setFunctionModule(size - 1 - i, 8, false);
  }
  setFunctionModule(size - 8, 8, true);

  // Place data bits (zigzag) + Mask 0: (r + c) % 2 === 0
  const codewords = encodeDataCodewords(bytes, spec);
  let bitIdx = 0;
  const totalBits = codewords.length * 8;

  let upward = true;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let v = 0; v < size; v++) {
      const r = upward ? size - 1 - v : v;
      for (let j = 0; j < 2; j++) {
        const c = right - j;
        if (!isFunction[r][c]) {
          let dark = false;
          if (bitIdx < totalBits) {
            dark = ((codewords[bitIdx >>> 3] >>> (7 - (bitIdx & 7))) & 1) === 1;
            bitIdx++;
          }
          if ((r + c) % 2 === 0) {
            dark = !dark;
          }
          modules[r][c] = dark;
        }
      }
    }
    upward = !upward;
  }

  // Format information for ECC Level L (01) + Mask 0 (000) -> 0x77c4 (bit 14 = MSB, bit 0 = LSB)
  const formatBits = 0x77c4;
  const getBitFromMsb = (idxFromMsb: number) =>
    ((formatBits >>> (14 - idxFromMsb)) & 1) === 1;

  for (let i = 0; i <= 5; i++) setFunctionModule(8, i, getBitFromMsb(i));
  setFunctionModule(8, 7, getBitFromMsb(6));
  setFunctionModule(8, 8, getBitFromMsb(7));
  setFunctionModule(7, 8, getBitFromMsb(8));
  for (let i = 9; i < 15; i++) setFunctionModule(14 - i, 8, getBitFromMsb(i));

  for (let i = 0; i < 7; i++) setFunctionModule(size - 1 - i, 8, getBitFromMsb(i));
  for (let i = 7; i < 15; i++) setFunctionModule(8, size - 15 + i, getBitFromMsb(i));
  setFunctionModule(size - 8, 8, true);

  return modules;
}
