<template>
  <div class="g_btn_center"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { GoogleSignInResponse } from "../types/userType";
import { UserService, LogService } from "@/services";

@Component
export default class GoogleOneTap extends Vue {
  public readonly GOOGLE_CLIENT_ID =
    process.env.VUE_APP_GOOGLE_SIGNIN_CLIENT_ID;

  @Prop() private msg!: string;
  get signInState() {
    return this.$store.getters.credential;
  }

  mounted() {
    const googleScript = document.createElement("script");
    googleScript.setAttribute("src", "https://accounts.google.com/gsi/client");
    document.head.appendChild(googleScript);

    googleScript.onload = () => {
      window.google.accounts.id.initialize({
        client_id: this.GOOGLE_CLIENT_ID,
        auto_select: true,
        cancel_on_tap_outside: false,
        context: "signin",
        logo_alignment: "center",
        callback: async (response: object) => {
          LogService.debug_log(response);
          const gsiResponse = response as GoogleSignInResponse;
          if (gsiResponse.credential) {
            this.$toast.open({
              type: "default",
              message: "Now, you are try log in.",
              duration: 3000,
              dismissible: false,
            });
            const clientId = `${this.GOOGLE_CLIENT_ID}.apps.googleusercontent.com`;
            const idToken = gsiResponse.credential;
            try {
              const res = await UserService.loginWithGoogle(clientId, idToken);
              LogService.debug_log("loginWithGoogle", res);
              if (res.result === "OK") {
                // store user credentials
                this.$store.dispatch("login", {
                  credential: gsiResponse.credential,
                });
                this.$toast.open({
                  type: "default",
                  message: "You are logged in.",
                });
              }
            } catch (error: any) {
              LogService.error_log(error);
              this.$toast.error("Error: %s", error.message);
            }
          }
        },
      });

      if (UserService.isAuth() === false) {
        LogService.debug_log(
          "this.$store.state.auth.credential",
          this.$store.getters.credential
        );
        window.google.accounts.id.prompt((notification: any) => {
          LogService.debug_log("notification", notification);
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            LogService.debug_log("isNotDisplayed or isSkippedMoment");
            // try next provider if OneTap is not displayed or skipped
          }
        });
      }
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div.g_btn_center {
  display: inline-flex;
  text-align: center;
}
</style>
