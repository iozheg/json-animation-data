export interface IFramesForm {
  amount: number;
  startOffset: {
    x: number;
    y: number;
  };
  spaceBetween: {
    x: number;
    y: number;
  };
  frameSize: {
    width: number;
    height: number;
  };
  frameName: string;
}

export interface IFrameOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
}

export interface IAnimation {
  name: string;
  frameIndexes: number[];
}