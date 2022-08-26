import type { IAnimation, IFrameOptions, IFramesForm, ISpritesheetData } from "./types";

export function buildFrames(
  formData: IFramesForm,
  imageWidth: number,
): IFrameOptions[] {
  const frames: IFrameOptions[] = [];
  const { amount, startOffset, spaceBetween, frameSize, frameName } = formData;
  const framesInRow = Math.floor(imageWidth / (frameSize.width + spaceBetween.x));
  const rows = Math.ceil(amount / framesInRow);

  for(let r = 0; r < rows; r++) {
    for(let i = 0; i < framesInRow && r * framesInRow + i < amount; i++) {
      const frame = {
        x: (i * (frameSize.width + spaceBetween.x) + startOffset.x + i),
        y: (r * (frameSize.height + spaceBetween.y) + startOffset.y + r),
        width: frameSize.width,
        height: frameSize.height,
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
  fileName: string,
) {
  const result: ISpritesheetData = {
    frames: {},
    animations: {},
    meta: {
      image: fileName,
      scale: 1,
    },
  };

  frames.forEach((frame) => {
    result.frames[frame.name] = {
      frame: {
        x: frame.x,
        y: frame.y,
        w: frame.width,
        h: frame.height,
      },
      sourceSize: {
        w: frame.width,
        h: frame.height,
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

  const fileNameParts = fileName.split(".");
  const fileNameWithoutExt = fileNameParts.slice(0, fileNameParts.length - 1).join(".");
  exportJson(fileNameWithoutExt, JSON.stringify(result));
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