<template>
  <div class="hands">
    <h1>This is an hands page</h1>
    <div class="container">
      <video class="input_video" ref="source"></video>
      <canvas
        class="output_canvas"
        width="1280px"
        height="720px"
        ref="canvas"
      ></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { HandsService, LogService } from "../services";

@Component({
  data() {
    return {};
  },
})
export default class HandsView extends Vue {
  public logService = new LogService();

  public $refs!: {
    canvas: HTMLCanvasElement;
    source: HTMLVideoElement;
  };

  public async mounted(): Promise<void> {
    await new HandsService(
      this.logService,
      this.$refs.canvas,
      this.$refs.source
    ).setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
  }
}
</script>
