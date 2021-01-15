import { join } from "path"

import { random } from "faker"
import { v4 as uuid } from "uuid"

import {
  findEd,
  findOp,
  findSimultaneous,
  getTimestamp,
  Node,
  parseSubtitles,
  Timestamp,
} from "@/lib/subtitles"

const ONE_MINUTE = 1000 * 60
const THREE_AND_HALF_MINUTES = 1000 * 60 * 3.5
const TEST_DATA_PATH = join(__dirname, "../..", "test-data")

const randomWords = () => random.words(Math.ceil(Math.random() * 12))

const generateNodes = (arr: Array<[start: number, end: number]>): Node[] =>
  arr.map(([start, end]) => ({ start, end, text: randomWords(), uuid: uuid() }))

describe("extractors", () => {
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

    test("real-life test", async () => {
      const nodes = await parseSubtitles(join(TEST_DATA_PATH, "tonikawa.srt"))

      expect(
        findSimultaneous(nodes).map((innerNodes) =>
          innerNodes.map((node) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: dont care
            delete node.uuid
            return node
          }),
        ),
      ).toMatchSnapshot()
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
        nodes[4],
      ])
    })
  })
})

describe("misc", () => {
  describe("getTimestamp", () => {
    const nodes = [
      generateNodes([
        [1_000, 7_500],
        [5_000, 10_000],
        [7_500, 15_000],
      ]),
      generateNodes([
        [1_000, 7_500],
        [5_000, 10_000],
        [7_500, 15_000],
      ]),
    ]
    const cases: Array<[index: number, nodes: Node[], result: Timestamp]> = [
      [
        1,
        nodes[0],
        {
          timestamp: "00:07.5",
          node: nodes[0][1],
          conditions: {
            op: false,
            ed: false,
            amount: nodes[0].length,
          },
        },
      ],
      [
        2,
        nodes[1],
        {
          timestamp: "00:07.5",
          node: nodes[1][1],
          conditions: {
            op: false,
            ed: false,
            amount: nodes[1].length,
          },
        },
      ],
    ]

    test.each(cases)("gets timestamp from nodes %i", (_i, input, result) => {
      expect(getTimestamp(input)).toStrictEqual(result)
    })
  })
})
