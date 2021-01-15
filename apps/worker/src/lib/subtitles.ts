import { createReadStream } from "fs"

import { cleanTimestamp } from "@anisubs/shared"
import { parse, Cue, formatTimestamp } from "subtitle"
import { v4 as uuid } from "uuid"

export type Node = Cue & {
  uuid: string
}

export type Timestamp = {
  node: Node
  timestamp: string
  conditions: {
    op: boolean
    ed: boolean
    amount: number
  }
}

const ONE_MINUTE = 1000 * 60
const THREE_AND_HALF_MINUTES = 1000 * 60 * 3.5

const overlaps = (first: Node | null, second: Node | null) => {
  if (first == null || second == null) return false

  return first.end > second.start
}

export const findSimultaneous = (nodes: Node[]): Node[][] => {
  const multiples: Node[][] = []
  const multipleIndexes = new Set<number>()

  for (let i = 0; i < nodes.length; i++) {
    if (multipleIndexes.has(i)) continue

    const current = nodes[i]
    const overlapping = [current]

    for (let y = i + 1; y < nodes.length; y++) {
      const next = nodes[y]

      if (overlaps(current, next)) {
        overlapping.push(next)

        multipleIndexes.add(i)
        multipleIndexes.add(y)
      } else {
        if (overlapping.length > 1) {
          multiples.push(overlapping)
        }

        break
      }
    }
  }

  return multiples
}

export const findOp = (nodes: Node[]): Node[] => {
  const opNodes: Node[] = []

  for (let i = 0; i < nodes.length; i++) {
    const current = nodes[i]

    if (current.start > THREE_AND_HALF_MINUTES) break

    if (current.start < ONE_MINUTE) continue

    opNodes.push(current)
  }

  return opNodes
}

export const findEd = (nodes: Node[]): Node[] => {
  const edNodes: Node[] = []
  const lastNodeEnd = nodes[nodes.length - 1].end

  for (let i = nodes.length - 1; i > 0; i--) {
    const current = nodes[i]

    if (current.end < lastNodeEnd - THREE_AND_HALF_MINUTES) break

    if (current.end > lastNodeEnd - ONE_MINUTE) continue

    edNodes.push(current)
  }

  return edNodes
}

const inside = (num: number, min: number, max: number) =>
  min <= num && max > num

export const getTimestamp = (nodes: Node[]): Timestamp => {
  const innerTimes = {
    start: nodes[nodes.length - 1].start,
    end: nodes[0].end,
  }

  const duration = innerTimes.start - innerTimes.end
  const middle = innerTimes.start + Math.round(duration / 2)

  // Try to round to closest half second
  const niceMiddle = Math.floor(middle / 500) * 500
  // Use it if it shows all the subtitles
  const middleToUse = inside(niceMiddle, innerTimes.start, innerTimes.end)
    ? niceMiddle
    : middle

  const node = nodes.find(({ start, end }) => inside(middleToUse, start, end))!

  return {
    node,
    timestamp: cleanTimestamp(formatTimestamp(middle, { format: "WebVTT" })),
    conditions: {
      amount: nodes.length,
      ed: false,
      op: false,
    },
  }
}

// const findGoodTimestamps = (nodes: Node[]): Timestamp[] => {
//   const simultaneous = findSimultaneous(nodes)
//   let scoredNodes: Array<Timestamp> = [...simultaneous]
//
//   const op = findOp(nodes)
//   const ed = findEd(nodes)
//
//   for (let node of op) {
//
//   }
// }

const isEqualNode = (one: Node) => (two: Node) =>
  one.text === two.text && one.start === two.start && one.end === two.end

const isBadNode = (node: Node) =>
  /> *([\w]? ?(?:-?\d+\.?)+ ?)+</.test(node.text)

export const parseSubtitles = async (filePath: string) =>
  new Promise<Node[]>((resolve) => {
    const nodes: Node[] = []

    createReadStream(filePath)
      .pipe(parse())
      .on("error", (err) => {
        console.error(`Failed to parse subtitles: ${err.toString()}`)
        resolve([])
      })
      .on("data", ({ type, data }) => {
        if (
          type !== "cue" ||
          nodes.some(isEqualNode(data)) ||
          isBadNode(data)
        ) {
          return
        }

        nodes.push({
          uuid: uuid(),
          ...data,
        })
      })
      .on("finish", () => {
        resolve(nodes)
      })
  })

export const findTimestamps = async (
  filePath: string,
): Promise<string[] | null> => {
  // @ts-ignore
  const nodes = await parseSubtitles(filePath)

  // const timestamps: string[] = []

  return null
}
