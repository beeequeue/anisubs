import { createJobs } from "@/lib/subtitles"
import { random } from "faker"
import { Cue } from "subtitle"

const randomWords = () => random.words(Math.ceil(Math.random() * 12))

const generateNodes = (arr: Array<[start: number, end: number]>): Cue[] =>
  arr.map(([start, end]) => ({ start, end, text: randomWords() }))

describe("createJobs", () => {
  describe("findMultipleSimultaneous", () => {
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

      const { findMultipleSimultaneous } = createJobs(nodes)

      expect(findMultipleSimultaneous()).toStrictEqual([
        [nodes[1], nodes[2]],
        [nodes[4], nodes[5], nodes[6]],
      ])
    })
  })
})
