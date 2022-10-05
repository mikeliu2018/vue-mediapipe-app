import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Options, Results, Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { LogService } from "./log.service";

export class HandsService extends Camera {
  private readonly pipe = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  private HAND_CONNECTIONS = HAND_CONNECTIONS;
  // private HAND_CONNECTIONS: [number, number][] = [
  //   [0, 1],
  //   [1, 2],
  //   [2, 3],
  //   [3, 4],
  //   [0, 5],
  //   [5, 6],
  //   [6, 7],
  //   [7, 8],
  //   [5, 9],
  //   [9, 10],
  //   [10, 11],
  //   [11, 12],
  //   [9, 13],
  //   [13, 14],
  //   [14, 15],
  //   [15, 16],
  //   [13, 17],
  //   [0, 17],
  //   [17, 18],
  //   [18, 19],
  //   [19, 20],
  // ];

  constructor(
    public readonly logService: LogService,
    public readonly canvas: HTMLCanvasElement,
    public readonly source: HTMLVideoElement,
    public readonly ctx = canvas.getContext("2d") as CanvasRenderingContext2D
  ) {
    super(source, {
      onFrame: async () => await this.pipe.send({ image: source }),
      width: 1280,
      height: 720,
    });

    source.addEventListener("loadedmetadata", () => {
      this.canvas.height = source.videoHeight;
      this.canvas.width = source.videoWidth;
    });
  }

  /**
   *
   * @param options {@link https://google.github.io/mediapipe/solutions/pose.html#javascript-solution-api|Mediapipe}
   */
  public setOptions(options: Options): Promise<void> {
    this.pipe.onResults((results) => this.render(results));
    this.pipe.setOptions(options);
    return this.start();
  }

  public render({ multiHandLandmarks, image }: Results): void {
    this.ctx.save();
    const { width, height } = this.canvas;
    this.logService.delay_log(10, "width: %d, height: %d", width, height);

    this.ctx.clearRect(0, 0, width, height);
    this.ctx.drawImage(image, 0, 0, width, height);

    if (multiHandLandmarks) {
      for (const landmarks of multiHandLandmarks) {
        // 畫線
        drawConnectors(this.ctx, landmarks, this.HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });
        // 描點
        drawLandmarks(this.ctx, landmarks, {
          color: "#FF0000",
          lineWidth: 2,
        });
      }
    }

    this.ctx.restore();
  }
}
