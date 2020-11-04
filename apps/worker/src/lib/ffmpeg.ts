import { spawn } from "child_process"
import { mkdirSync, readdirSync } from "fs"
import { join, relative } from "path"

import {
  DOWNLOADS_PATH,
  ExtractOptions,
  SCREENSHOTS_PATH,
} from "@anisubs/shared"
import FluentFfmpeg, { FfmpegCommand, FfprobeStream } from "fluent-ffmpeg"
import { TorrentFile } from "webtorrent"

export class Ffmpeg {
  private static async getVideoStream(command: FfmpegCommand) {
    return new Promise<FfprobeStream>((resolve, reject) => {
      command.ffprobe((err, data) => {
        if (err) return reject(err)

        resolve(data.streams.find((stream) => stream.codec_type === "video")!)
      })
    })
  }

  private static async getEnglishSubtitleStream(command: FfmpegCommand) {
    return new Promise<FfprobeStream>((resolve, reject) => {
      command.ffprobe((err, data) => {
        if (err) return reject(err)

        const englishSubtitles = data.streams.filter(
          (s) => s.codec_type === "subtitle" && s.tags.language === "eng",
        )

        if (englishSubtitles.length === 1) {
          return resolve(englishSubtitles[0])
        }

        // TODO: Improve logic
        resolve(englishSubtitles[0])
      })
    })
  }

  static async extractScreenshots(job: ExtractOptions, file: TorrentFile) {
    const command = FluentFfmpeg(join(DOWNLOADS_PATH, file.path), {
      logger: console,
    })

    command.on("start", function (commandLine) {
      console.log("Spawned Ffmpeg with command:\n\n" + commandLine + "\n\n")
    })

    const videoInfo = await this.getVideoStream(command)
    // @ts-ignore
    const englishSubtitleStream = await this.getEnglishSubtitleStream(command)

    if (videoInfo.height == null) {
      throw new Error(`Could not get height of video. ${job.source}`)
    }

    const options = {
      timestamps: job.timestamps.slice(0, 1), // TODO
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
            ["-vf", `subtitles='${subtitleFilePath}':si=0`],
            ["-quality", "95"],
            join(
              screenshotFolder,
              `${job.hash}-${timestamp.replace(/[:,.]/g, "_")}.webp`,
            ),
          ].flat(2)

          mkdirSync(screenshotFolder, { recursive: true })

          const process = spawn("ffmpeg", args)

          let error: string | null = null

          process.stderr.on("data", (buffer: Buffer) => error += buffer.toString())
          process.stdout.on("data", (buffer: Buffer) => error += buffer.toString())

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
