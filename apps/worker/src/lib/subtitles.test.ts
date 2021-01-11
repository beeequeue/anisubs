import { random } from "faker"
import { v4 as uuid } from "uuid"

import { findEd, findSimultaneous, findOp, Node } from "@/lib/subtitles"

const ONE_MINUTE = 1000 * 60
const THREE_AND_HALF_MINUTES = 1000 * 60 * 3.5

const randomWords = () => random.words(Math.ceil(Math.random() * 12))

const generateNodes = (arr: Array<[start: number, end: number]>): Node[] =>
  arr.map(([start, end]) => ({ start, end, text: randomWords(), uuid: uuid() }))

describe("findSimultaneous", () => {
  test("finds simultaneous subtitles", () => {
    const nodes = generateNodes([
      [1_000, 2_000], // 0
      [3_000, 4_000], // 1 Simultaneous
      [3_500, 4_000], // 2 ⬆
      [5_000, 6_000], // 3
      [10_000, 15_000], // 4 Simultaneous
      [10_500, 12_000], // 5 ⬆
      [13_000, 14_500], // 6 ⬆
      [20_000, 21_000], // 7
    ])

    expect(findSimultaneous(nodes)).toStrictEqual([
      [nodes[1], nodes[2]],
      [nodes[4], nodes[5], nodes[6]],
    ])
  })
})

describe("findOp", () => {
  test("finds nodes in beginning of show", () => {
    const nodes = generateNodes([
      [1_000, 2_000], // 0
      [3_000, 4_000], // 1
      [ONE_MINUTE + 1_000, ONE_MINUTE + 2_000], // 2 Inside
      [ONE_MINUTE + 20_000, ONE_MINUTE + 25_000], // 3 Inside
      [ONE_MINUTE + 60_000, ONE_MINUTE + 65_000], // 4 Inside
      [THREE_AND_HALF_MINUTES - 20_000, THREE_AND_HALF_MINUTES - 10_000], // 5 Inside
      [THREE_AND_HALF_MINUTES + 5_000, THREE_AND_HALF_MINUTES + 6_000], // 6
      [THREE_AND_HALF_MINUTES + 10_000, THREE_AND_HALF_MINUTES + 15_000], // 7
      [THREE_AND_HALF_MINUTES + 10_500, THREE_AND_HALF_MINUTES + 12_000], // 8
      [THREE_AND_HALF_MINUTES + 13_000, THREE_AND_HALF_MINUTES + 14_500], // 9
      [THREE_AND_HALF_MINUTES + 20_000, THREE_AND_HALF_MINUTES + 21_000], // 10
    ])

    expect(findOp(nodes)).toStrictEqual([
      nodes[2],
      nodes[3],
      nodes[4],
      nodes[5],
    ])
  })
})

describe("findEd", () => {
  test("finds nodes in end of show", () => {
    const lastMs = 1000 * 60 * 25

    // prettier-ignore
    const nodes = generateNodes([
      [lastMs - THREE_AND_HALF_MINUTES - 20_000, lastMs - THREE_AND_HALF_MINUTES - 21_000], // 0
      [lastMs - THREE_AND_HALF_MINUTES - 13_000, lastMs - THREE_AND_HALF_MINUTES - 14_500], // 1
      [lastMs - THREE_AND_HALF_MINUTES - 10_500, lastMs - THREE_AND_HALF_MINUTES - 12_000], // 2
      [lastMs - THREE_AND_HALF_MINUTES - 10_000, lastMs - THREE_AND_HALF_MINUTES - 15_000], // 3
      [lastMs - THREE_AND_HALF_MINUTES, lastMs - THREE_AND_HALF_MINUTES], // 4
      [lastMs - THREE_AND_HALF_MINUTES + 20_000, lastMs - THREE_AND_HALF_MINUTES + 10_000], // 5
      [lastMs - ONE_MINUTE - 60_000, lastMs - ONE_MINUTE - 65_000], // 6
      [lastMs - ONE_MINUTE - 20_000, lastMs - ONE_MINUTE - 25_000], // 7
      [lastMs - ONE_MINUTE - 1_000, lastMs - ONE_MINUTE - 2_000], // 8
      [lastMs - 3_000, lastMs - 4_000], // 9
      [lastMs - 1_000, lastMs - 2_000], // 10
    ])

    expect(findEd(nodes)).toStrictEqual([
      nodes[8],
      nodes[7],
      nodes[6],
      nodes[5],
    ])
  })
})
