import { spawn } from "child_process"
import { mkdirSync, readdirSync } from "fs"
import { join, relative } from "path"

import {
  DOWNLOADS_PATH,
  ExtractOptions,
  SCREENSHOTS_PATH,
} from "@anisubs/shared"
import FluentFfmpeg, {
  FfmpegCommand,
  FfprobeData,
  FfprobeStream,
} from "fluent-ffmpeg"
import { TorrentFile } from "webtorrent"

declare module "fluent-ffmpeg" {
  interface FfprobeStream {
    tags: {
      title?: string
      language?: string
    }
  }
}

const anyIncludes = (arr: Array<string | undefined>, checks: string[]) =>
  arr.some(
    (str) =>
      str != null && checks.some((check) => str.toLowerCase().includes(check)),
  )

const modifiers = {
  english: 100,
  forcedSubtitles: 10,
  signsOnly: -100,
}

const scoreSubtitleStream = (
  stream: FfprobeStream,
  _: number,
  allStreams: FfprobeStream[],
) => {
  let score = 0

  if (stream.tags.language === "eng") score += modifiers.english

  if (stream.disposition?.forced === 1) score += modifiers.forcedSubtitles

  if (
    stream.tags.title?.toLowerCase()?.includes("signs") &&
    anyIncludes(
      allStreams.map((s) => s.tags.title?.toLowerCase()),
      ["subs", "subtitles"],
    )
  ) {
    score += modifiers.signsOnly
  }

  return { score, stream }
}

export class Ffmpeg {
  private static async probeCommand(
    command: FfmpegCommand,
  ): Promise<FfprobeData> {
    return new Promise<FfprobeData>((resolve, reject) => {
      command.ffprobe((err, data) => {
        if (err) return reject(err)

        resolve(data)
      })
    })
  }

  private static getVideoStream(data: FfprobeData) {
    return data.streams.find((stream) => stream.codec_type === "video")!
  }

  private static getLastNonSubtitleStreamIndex(data: FfprobeData) {
    let index = 0

    for (const stream of data.streams) {
      if (stream.codec_type === "subtitle") break

      index++
    }

    return index
  }

  private static getBestSubtitleStream(data: FfprobeData) {
    const subtitleStreams = data.streams.filter(
      (s) => s.codec_type === "subtitle",
    )

    if (subtitleStreams.length === 1) {
      return subtitleStreams[0]
    }

    const streamScores = subtitleStreams
      .map(scoreSubtitleStream)
      .sort(({ score: a }, { score: b }) => b - a)

    return streamScores[0].stream
  }

  static async extractScreenshots(job: ExtractOptions, file: TorrentFile) {
    const command = FluentFfmpeg(join(DOWNLOADS_PATH, file.path), {
      logger: console,
    })

    command.on("start", function (commandLine: string) {
      console.log(`Spawned Ffmpeg with command:\n\n${commandLine}\n\n`)
    })

    const probeData = await this.probeCommand(command)
    const videoInfo = this.getVideoStream(probeData)
    const lastNonSubtitleStreamIndex = this.getLastNonSubtitleStreamIndex(probeData)
    const bestSubtitleStream = this.getBestSubtitleStream(probeData)
    const bestSubtitleStreamIndex =
      bestSubtitleStream.index - lastNonSubtitleStreamIndex

    if (videoInfo.height == null) {
      throw new Error(`Could not get height of video. ${job.source}`)
    }

    const options = {
      timestamps: job.timestamps,
      filename: `${job.hash}-%s.webp`,
      folder: join(SCREENSHOTS_PATH, job.hash),
    }

    const promises = job.timestamps.map(
      (timestamp) =>
        new Promise<void>((resolve, reject) => {
          const inputPath = join(DOWNLOADS_PATH, file.path)
          const screenshotFolder = join(SCREENSHOTS_PATH, job.hash)

          // This can't be an absolute path since it would include `X:\` on Windows.
          // This breaks the subtitles options parsing since : is the option delimiter.
          const subtitleFilePath = relative(".", inputPath).replace(
            /\\/g,
            "\\\\\\\\",
          )

          // prettier-ignore
          const args = [
            "-y",
            "-hide_banner",
            ["-loglevel", "warning"],
            "-copyts",
            ["-ss", timestamp],
            ["-i", `${inputPath}`],
            ["-vframes", "1"],
            ["-vf", `subtitles='${subtitleFilePath}':si=${bestSubtitleStreamIndex}`],
            ["-quality", "95"],
            join(
              screenshotFolder,
              `${job.hash}-${timestamp.replace(/[:,.]/g, "_")}.webp`,
            ),
          ].flat(2)

          mkdirSync(screenshotFolder, { recursive: true })

          const process = spawn("ffmpeg", args)

          let error: string | null = null

          process.stderr.on(
            "data",
            (buffer: Buffer) => (error += buffer.toString()),
          )
          process.stdout.on(
            "data",
            (buffer: Buffer) => (error += buffer.toString()),
          )

          process.on("exit", (code) => (code === 0 ? resolve() : reject(error)))
        }),
    )

    await Promise.all(promises)

    const files = readdirSync(options.folder).filter((filename) =>
      filename.endsWith(".webp"),
    )

    return files
  }
}
