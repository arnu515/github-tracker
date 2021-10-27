<script>
  import { onMount } from "svelte";
  import UsernamePrompt from "./lib/UsernamePrompt.svelte";
  import Tracker from "./lib/Tracker.svelte";

  let isLoggedIn = false;
  /** @type PushSubscription */
  let sub;
  onMount(async () => {
    // If there is a username in the localStorage, set isLoggedIn to true
    isLoggedIn = !!localStorage.getItem("username");

    if ("serviceWorker" in navigator) {
      // Service worker supported
      navigator.serviceWorker.register("/service-worker.js");
      const reg = await navigator.serviceWorker.ready;
      sub = await reg.pushManager.getSubscription();
      if (!sub) {
        // Fetch VAPID public key
        const res = await fetch("/api/vapidkeys");
        const data = await res.text();
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: data
        });
      }
    }

    const status = await Notification.requestPermission();
    if (status !== "granted")
      alert("Please allow notifications to make sure that the application works.");
  });

  $: if (sub && isLoggedIn) {
    // Push notifs have been subscribed to, and there's a username in localStorage
    const username = localStorage.getItem("username");
    fetch("/api/storeendpoint", {
      body: JSON.stringify({ username, subscription: sub.toJSON() }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    });
  }
</script>

{#if !isLoggedIn}
  <UsernamePrompt />
{:else}
  <Tracker />
{/if}
