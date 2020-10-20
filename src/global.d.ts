declare var h: typeof import("preact").h;

declare module "potpack" {
  interface Box {
    x: number,
    y: number,
    w: number,
    h: number,
  }

  interface Result {
    w: number,
    h: number,
    fill: number,
  }

  let pack: (boxes: Box[]) => Result;

  export default pack;
}
