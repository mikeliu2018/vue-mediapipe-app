<template>
  <div class="g_btn_signout">
    <button
      class="g_id_signout"
      v-show="signInState !== ''"
      v-on:click="signout()"
    >
      Sign Out
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { LogService } from "@/services";

@Component
export default class SignoutButton extends Vue {
  get signInState() {
    return this.$store.getters.credential;
  }

  mounted() {
    const googleScript = document.createElement("script");
    googleScript.setAttribute("src", "https://accounts.google.com/gsi/client");
    document.head.appendChild(googleScript);
  }

  public signout() {
    LogService.debug_log("signout...");

    window.google.accounts.id.disableAutoSelect();
    this.$store.dispatch("login", {
      credential: "",
    });

    if (this.$router.currentRoute.name !== "root") {
      this.$router.push({ name: "root" });
    }

    this.$toast.default("You are logged out.");
  }
}
</script>

<style scoped lang="scss">
div.g_btn_signout {
  float: right;
}
</style>
