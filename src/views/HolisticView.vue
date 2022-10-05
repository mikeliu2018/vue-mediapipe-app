<template>
  <div class="pose">
    <h1>This is an holistic page</h1>
    <div class="container">
      <video class="input_video" ref="source"></video>
      <canvas
        class="output_canvas"
        width="1280px"
        height="720px"
        ref="canvas"
      ></canvas>
      <div class="landmark-grid-container" ref="landmarkContainer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { HolisticService, LogService } from "../services";
// import { LandmarkGrid } from "@mediapipe/control_utils_3d";

@Component({})
export default class HolisticView extends Vue {
  public logService = new LogService();

  public $refs!: {
    canvas: HTMLCanvasElement;
    source: HTMLVideoElement;
    landmarkContainer: HTMLDivElement;
  };

  // public grid: LandmarkGrid = new LandmarkGrid(this.$refs.landmarkContainer);

  // public grid = new LandmarkGrid(this.$refs.landmarkContainer);

  public async mounted(): Promise<void> {
    if (this.$store.state.auth.credential === "") {
      this.$router.push("/");
    }
    await new HolisticService(
      this.logService,
      this.$refs.canvas,
      this.$refs.source,
      this.$refs.landmarkContainer
      // this.grid
    ).setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
  }
}
</script>
