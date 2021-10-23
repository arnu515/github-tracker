<script>
  import { onMount } from "svelte";
  import TokenPrompt from "./lib/TokenPrompt.svelte";
  import Tracker from "./lib/Tracker.svelte";

  let isLoggedIn = false;
  onMount(() => {
    // If there is a PAT in the localStorage, set isLoggedIn to true
    isLoggedIn = !!localStorage.getItem("pat");
  });
</script>

{#if !isLoggedIn}
  <TokenPrompt />
{:else}
  <Tracker />
{/if}
