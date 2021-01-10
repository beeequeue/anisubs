import { createReadStream } from "fs"

import { parse, Cue } from "subtitle"

export const createJobs = (nodes: Cue[]) => {
  const overlaps = (first: Cue | null, second: Cue | null) => {
    if (first == null || second == null) return false

    return first.end > second.start
  }

  const findMultipleSimultaneous = () => {
    const multiples: Cue[][] = []
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

  return {
    findMultipleSimultaneous,
  }
}

export const findTimestamps = async (
  filePath: string,
): Promise<string[] | null> => {
  const nodes: Cue[] = []
  // const timestamps: string[] = []

  await new Promise<void>((resolve) =>
    createReadStream(filePath)
      .pipe(parse())
      .on("error", (err) => {
        console.error(`Failed to parse subtitles: ${err.toString()}`)
        resolve()
      })
      .on("data", ({ type, data }) => {
        if (type !== "cue") return

        nodes.push(data)
      })
      .on("finish", () => resolve()),
  )

  const { findMultipleSimultaneous } = createJobs(nodes)
  findMultipleSimultaneous()

  return null
}
