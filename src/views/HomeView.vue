<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <h1>{{ `Welcome to Your ${appName}` }}</h1>
    <GoogleSigninButton msg=""></GoogleSigninButton>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import GoogleSigninButton from "../components/GoogleSigninButton.vue"; // @ is an alias to /src

@Component({
  components: {
    GoogleSigninButton,
  },
})
export default class HomeView extends Vue {
  public appName = process.env.VUE_APP_NAME;
  // public signInState = this.$store.state.auth.credential;
  // @Watch("signInState")
  // onPersonChanged(value: string, oldValue: string) {
  //   console.log("value: %s, oldValue: %s", value, oldValue);
  // }
}
</script>
