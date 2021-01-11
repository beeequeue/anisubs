import { createReadStream } from "fs"

import { parse, Cue } from "subtitle"
import { v4 as uuid } from "uuid"

export type Node = Cue & {
  uuid: string
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

const parseSubtitles = async (filePath: string) =>
  new Promise<Node[]>((resolve) => {
    const nodes: Node[] = []

    createReadStream(filePath)
      .pipe(parse())
      .on("error", (err) => {
        console.error(`Failed to parse subtitles: ${err.toString()}`)
        resolve([])
      })
      .on("data", ({ type, data }) => {
        if (type !== "cue") return

        nodes.push({
          uuid: uuid(),
          ...data,
        })
      })
      .on("finish", () => resolve(nodes))
  })

export const findTimestamps = async (
  filePath: string,
): Promise<string[] | null> => {
  // @ts-ignore
  const nodes = await parseSubtitles(filePath)
  // const timestamps: string[] = []

  return null
}
