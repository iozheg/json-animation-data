import type { IAnimation, IFrameOptions, ISpritesheetData } from "./types";

export function createJson(
  frames: IFrameOptions[],
  animations: IAnimation[],
  scale: number,
  fileName: string,
) {
  const result: ISpritesheetData = {
    frames: {},
    animations: {},
    meta: {
      scale: 1,
    },
  };

  frames.forEach((frame) => {
    result.frames[frame.name] = {
      frame: {
        x: frame.x / scale,
        y: frame.y / scale,
        w: frame.width / scale,
        h: frame.height / scale,
      },
      sourceSize: {
        w: frame.width / scale,
        h: frame.height / scale,
      },
      anchor: {
        x: 0.5,
        y: 0.5,
      },
      trimmed: false,
      rotated: false,
    }
  });

  animations.forEach((animation) => {
    result.animations[animation.name] = animation.frameIndexes.map((index) => frames[index]?.name);
  });

  exportJson(fileName, JSON.stringify(result));
}

export function exportJson(name: string, data: string) {
  download(data, `${name}.json`, 'application/json');
}

function download(content: string, fileName: string, contentType: string) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}