#!/usr/bin/env python3
"""Build the Memories hero reel from the raw carousel videos.

The result is one muted, streamable H.264 MP4. Clips are interleaved by round:
first 3–4 seconds of every destination, then the next 3–4 seconds of every
remaining destination, until all usable footage has been consumed.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import json
import shutil
import subprocess
import tempfile
import unicodedata
from pathlib import Path

SOURCE_DEFINITIONS = (
    ("cusco", "Cusco", ("cusco",)),
    ("laguna_humantay", "Laguna Humantay", ("laguna_humantay",)),
    ("machu_picchu", "Machu Picchu", ("machupicchu", "machu_picchu")),
    (
        "machu_picchu_ciudadela",
        "Ciudadela de Machu Picchu",
        ("machupicchu_ciudadela", "machu_picchu_ciudadela"),
    ),
    ("maras_moray", "Maras y Moray", ("maras_moray",)),
    ("montana_colores", "Montaña de 7 Colores", ("montana_de_colores", "montana_colores")),
    ("paracas", "Paracas", ("paracas",)),
    ("salkantay", "Salkantay", ("salcantay", "salkantay")),
    ("saqsayhuaman", "Saqsayhuamán", ("saqsayhuaman", "sacsayhuaman")),
)


def command_exists(name: str) -> bool:
    return shutil.which(name) is not None


def run(command: list[str]) -> None:
    if command and Path(command[0]).name == "ffmpeg":
        command = [command[0], "-hide_banner", "-loglevel", "error", *command[1:]]
    process = subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
    if process.returncode:
        raise RuntimeError(process.stderr[-6000:])


def normalized_name(value: str) -> str:
    value = value.replace("#U00f1", "n").replace("#u00f1", "n")
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    return "_".join(part for part in "".join(char if char.isalnum() else " " for char in value.lower()).split())


def probe(path: Path) -> tuple[float, int, int]:
    raw = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height:format=duration",
            "-of",
            "json",
            str(path),
        ],
        text=True,
    )
    data = json.loads(raw)
    stream = data["streams"][0]
    return float(data["format"]["duration"]), int(stream["width"]), int(stream["height"])


def clip_schedule(duration: float) -> list[float]:
    """Use as much footage as possible with 3/4-second cuts.

    A sub-second tail is appended to the last clip only when that clip remains
    at or below four seconds; otherwise the tiny tail is intentionally omitted.
    """

    best: tuple[tuple[float, int, int], int, int, float] | None = None
    for four_second_clips in range(20):
        for three_second_clips in range(20):
            if four_second_clips + three_second_clips == 0:
                continue
            used = four_second_clips * 4 + three_second_clips * 3
            if used <= duration + 0.03:
                score = (used, four_second_clips, -(four_second_clips + three_second_clips))
                if best is None or score > best[0]:
                    best = (score, four_second_clips, three_second_clips, used)

    if best is None:
        raise ValueError(f"Video demasiado corto para el mínimo de 3 segundos: {duration:.3f}s")

    _, four_second_clips, three_second_clips, used = best
    clips = [4.0] * four_second_clips + [3.0] * three_second_clips
    remainder = duration - used

    if clips and 0.05 < remainder < 1.0 and clips[-1] + remainder <= 4.01:
        clips[-1] += remainder

    return clips


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Genera el carrusel de video del hero de Memories.")
    parser.add_argument("--input", default="carrusel", help="Carpeta con los MP4 originales.")
    parser.add_argument("--project-root", default=".", help="Raíz del proyecto Astro.")
    parser.add_argument("--workers", type=int, default=4, help="Procesos FFmpeg en paralelo.")
    return parser.parse_args()


def main() -> None:
    args = parse_arguments()
    if not command_exists("ffmpeg") or not command_exists("ffprobe"):
        raise SystemExit("Se requiere FFmpeg (ffmpeg y ffprobe) en el PATH.")

    input_directory = Path(args.input).resolve()
    project_root = Path(args.project_root).resolve()
    public_directory = project_root / "public" / "videos" / "hero"
    manifest_path = project_root / "src" / "data" / "hero_reel_manifest.json"
    public_directory.mkdir(parents=True, exist_ok=True)
    manifest_path.parent.mkdir(parents=True, exist_ok=True)

    available = {
        normalized_name(path.stem): path
        for path in input_directory.rglob("*.mp4")
        if path.is_file()
    }

    resolved_sources: list[dict[str, object]] = []
    for key, label, aliases in SOURCE_DEFINITIONS:
        source_path = next((available.get(alias) for alias in aliases if available.get(alias)), None)
        if source_path is None:
            raise FileNotFoundError(f"No se encontró el video para {label}. Alias esperados: {aliases}")

        duration, width, height = probe(source_path)
        resolved_sources.append(
            {
                "key": key,
                "label": label,
                "path": source_path,
                "width": width,
                "height": height,
                "clips": clip_schedule(duration),
            }
        )

    sequence: list[dict[str, object]] = []
    maximum_rounds = max(len(source["clips"]) for source in resolved_sources)  # type: ignore[arg-type]
    for round_index in range(maximum_rounds):
        for source_index, source in enumerate(resolved_sources):
            clips = source["clips"]  # type: ignore[assignment]
            if round_index >= len(clips):
                continue
            sequence.append(
                {
                    "source_index": source_index,
                    "source_key": source["key"],
                    "label": source["label"],
                    "round": round_index,
                    "source_start": sum(clips[:round_index]),
                    "duration": clips[round_index],
                }
            )

    with tempfile.TemporaryDirectory(prefix="memories_hero_reel_") as temporary_directory:
        temporary_path = Path(temporary_directory)

        def encode_segment(pair: tuple[int, dict[str, object]]) -> Path:
            sequence_index, clip = pair
            source = resolved_sources[int(clip["source_index"])]
            output_path = temporary_path / f"{sequence_index:03d}_{clip['source_key']}.mp4"

            common = [
                "ffmpeg",
                "-y",
                "-ss",
                f"{float(clip['source_start']):.6f}",
                "-t",
                f"{float(clip['duration']):.6f}",
                "-i",
                str(source["path"]),
            ]

            if int(source["height"]) > int(source["width"]):
                filter_value = (
                    "[0:v]split=2[bg][fg];"
                    "[bg]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,"
                    "boxblur=luma_radius=28:luma_power=1,eq=brightness=-0.08:saturation=1.05[blur];"
                    "[fg]scale=1280:720:force_original_aspect_ratio=decrease[front];"
                    "[blur][front]overlay=(W-w)/2:(H-h)/2,eq=contrast=1.03:saturation=1.06,"
                    "fps=24,setsar=1,format=yuv420p[out]"
                )
                common.extend(["-filter_complex", filter_value, "-map", "[out]"])
            else:
                common.extend(
                    [
                        "-vf",
                        "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,"
                        "eq=contrast=1.03:saturation=1.06,fps=24,setsar=1,format=yuv420p",
                    ]
                )

            common.extend(
                [
                    "-an",
                    "-c:v",
                    "libx264",
                    "-preset",
                    "veryfast",
                    "-crf",
                    "24",
                    "-profile:v",
                    "high",
                    "-level",
                    "4.0",
                    "-g",
                    "48",
                    "-keyint_min",
                    "48",
                    "-sc_threshold",
                    "0",
                    "-video_track_timescale",
                    "24000",
                    "-movflags",
                    "+faststart",
                    str(output_path),
                ]
            )
            run(common)
            return output_path

        with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, args.workers)) as executor:
            segment_paths = list(executor.map(encode_segment, enumerate(sequence)))

        concat_file = temporary_path / "concat.txt"
        concat_file.write_text(
            "".join(f"file '{path.as_posix()}'\n" for path in segment_paths),
            encoding="utf-8",
        )

        reel_path = public_directory / "hero_reel.mp4"
        run(
            [
                "ffmpeg",
                "-y",
                "-f",
                "concat",
                "-safe",
                "0",
                "-i",
                str(concat_file),
                "-c",
                "copy",
                "-movflags",
                "+faststart",
                str(reel_path),
            ]
        )

        poster_path = public_directory / "hero_reel_poster.webp"
        run(
            [
                "ffmpeg",
                "-y",
                "-ss",
                "0.5",
                "-i",
                str(reel_path),
                "-frames:v",
                "1",
                "-c:v",
                "libwebp",
                "-quality",
                "84",
                str(poster_path),
            ]
        )

        cursor = 0.0
        occurrences: dict[str, int] = {}
        timeline = []
        for index, (clip, segment_path) in enumerate(zip(sequence, segment_paths, strict=True)):
            actual_duration, _, _ = probe(segment_path)
            source_key = str(clip["source_key"])
            occurrences[source_key] = occurrences.get(source_key, 0) + 1
            timeline.append(
                {
                    "index": index,
                    "source": source_key,
                    "label": clip["label"],
                    "start": round(cursor, 3),
                    "end": round(cursor + actual_duration, 3),
                    "duration": round(actual_duration, 3),
                    "round": occurrences[source_key],
                }
            )
            cursor += actual_duration

    manifest = {
        "version": 1,
        "duration": round(cursor, 3),
        "clipCount": len(timeline),
        "strategy": "interleaved_3_4_second_clips",
        "video": {
            "mp4": "/videos/hero/hero_reel.mp4",
            "poster": "/videos/hero/hero_reel_poster.webp",
        },
        "timeline": timeline,
    }
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"Carrusel generado: {len(timeline)} cortes, {cursor:.3f}s")
    print(f"Video: {public_directory / 'hero_reel.mp4'}")
    print(f"Manifest: {manifest_path}")


if __name__ == "__main__":
    main()
