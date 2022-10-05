<template>
  <div class="g_btn_center">
    <div
      id="g_id_onload"
      data-auto_prompt="false"
      v-show="signInState === ''"
    ></div>
    <!-- <div
      id="g_id_onload"
      data-client_id="351037297998-s6kblpg6b6fkunrgc77rg100tl87m5n1"
      data-auto_prompt="false"
      data-skip_prompt_cookie="sid"
      data-native_login_uri="https://your.domain/your_password_login_endpoint"
    ></div> -->
    <!-- <div
      class="g_id_signin"
      data-type="standard"
      data-size="large"
      data-theme="filled_blue"
      data-text="sign_in_with"
      data-shape="rectangular"
      data-logo_alignment="left"
    ></div> -->

    <!-- <div
      class="g-id-signin"
      id="g-id-signin"
      data-client_id="351037297998-s6kblpg6b6fkunrgc77rg100tl87m5n1"
      data-login_uri="https://localhost/api/login-with-google"
      data-native_login_uri="https://your.domain/your_password_login_endpoint"
      v-bind:hidden="signInState !== ''"
    ></div> -->
    <!-- <div class="g-id-signin" id="g-id-signin">Sign in with Google</div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { GoogleSignInResponse } from "../types/userType";
import { UserService, LogService } from "../services";

@Component
export default class GoogleSigninButton extends Vue {
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
        cancel_on_tap_outside: true,
        context: "signin",
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
        const getSigninElement = document.getElementById("g_id_onload");
        if (getSigninElement !== null) {
          // cancel prompt component display
          window.google.accounts.id.cancel();

          const signinElement: HTMLElement = getSigninElement;
          window.google.accounts.id.renderButton(signinElement, {
            theme: "filled_blue",
            size: "large",
            type: "standard",
            text: "signin_with",
            // width: 500,
            shape: "circle",
            logo_alignment: "center",
          });
        }
      }
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div.g_btn_center {
  text-align: center;
  display: inline-flex;
}

div#g_id_onload {
  text-align: right;
  display: inline-flex;
}
</style>
