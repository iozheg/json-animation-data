import type { IAnimation, IFrameOptions, IFramesForm, ISpritesheetData } from "./types";

export function buildFrames(formData: IFramesForm, scale: number, imageWidth: number) {
  const frames: IFrameOptions[] = [];
  const { amount, startOffset, spaceBetween, frameSize, frameName } = formData;
  const framesInRow = Math.floor(imageWidth / (frameSize.width + spaceBetween.x));
  const rows = Math.ceil(amount / framesInRow);

  for(let r = 0; r < rows; r++) {
    for(let i = 0; i < framesInRow && r * framesInRow + i < amount; i++) {
      const frame = {
        x: (i * (frameSize.width + spaceBetween.x) + startOffset.x + i) * scale,
        y: (r * (frameSize.height + spaceBetween.y) + startOffset.y + r) * scale,
        width: frameSize.width * scale,
        height: frameSize.height * scale,
        name: `${frameName}_${r * framesInRow + i}`,
      }
      frames.push(frame);
    }
  }

  return frames;
}

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