import { Camera } from "@mediapipe/camera_utils";
// import { LandmarkGrid } from "@mediapipe/control_utils_3d";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import {
  Options,
  Results,
  Holistic,
  POSE_CONNECTIONS,
  FACEMESH_TESSELATION,
  HAND_CONNECTIONS,
} from "@mediapipe/holistic";
import { LogService } from "./log.service";

export class HolisticService extends Camera {
  private readonly pipe = new Holistic({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
  });

  constructor(
    public readonly logService: LogService,
    public readonly canvas: HTMLCanvasElement,
    public readonly source: HTMLVideoElement,
    public readonly landmarkContainer: HTMLDivElement,
    // public grid: LandmarkGrid,
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

  public render({
    poseLandmarks,
    faceLandmarks,
    leftHandLandmarks,
    rightHandLandmarks,
    image,
  }: Results): void {
    const { width, height } = this.canvas;
    // this.logService.delay_log(10, "width: %d, height: %d", width, height);
    this.logService.delay_log(10, "poseLandmarks", poseLandmarks);

    this.ctx.save();
    this.ctx.clearRect(0, 0, width, height);
    // this.ctx.drawImage(segmentationMask, 0, 0, width, height);

    // Only overwrite existing pixels.
    this.ctx.globalCompositeOperation = "source-in";
    this.ctx.fillStyle = "#00FF00";
    this.ctx.fillRect(0, 0, width, height);

    // Only overwrite missing pixels.
    this.ctx.globalCompositeOperation = "destination-atop";
    this.ctx.drawImage(image, 0, 0, width, height);

    this.ctx.globalCompositeOperation = "source-over";
    drawConnectors(this.ctx, poseLandmarks, POSE_CONNECTIONS, {
      color: "#00FF00",
      lineWidth: 4,
    });
    drawLandmarks(this.ctx, poseLandmarks, { color: "#FF0000", lineWidth: 2 });

    drawConnectors(this.ctx, faceLandmarks, FACEMESH_TESSELATION, {
      color: "#C0C0C070",
      lineWidth: 1,
    });

    drawConnectors(this.ctx, leftHandLandmarks, HAND_CONNECTIONS, {
      color: "#CC0000",
      lineWidth: 5,
    });
    drawLandmarks(this.ctx, leftHandLandmarks, {
      color: "#00FF00",
      lineWidth: 2,
    });

    drawConnectors(this.ctx, rightHandLandmarks, HAND_CONNECTIONS, {
      color: "#00CC00",
      lineWidth: 5,
    });
    drawLandmarks(this.ctx, rightHandLandmarks, {
      color: "#FF0000",
      lineWidth: 2,
    });

    this.ctx.restore();
  }
}
