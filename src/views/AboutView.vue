<template>
  <div class="about">
    <h1>This is an about page</h1>
    <GoogleOneTap msg="" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GoogleOneTap from "@/components/GoogleOneTap.vue";
@Component({
  components: {
    GoogleOneTap,
  },
})
export default class AboutView extends Vue {}
</script>
