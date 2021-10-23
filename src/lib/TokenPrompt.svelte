<script>
  let pat = "";
  async function submit() {
    const res = await fetch("/api/storetoken", {
      body: JSON.stringify({ pat }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) alert(data.message);
    else {
      // Store the PAT in localStorage
      localStorage.setItem("pat", pat);
      // Reload the page
      window.location.reload();
    }
  }
</script>

<form
  on:submit|preventDefault={submit}
  class="mx-auto min-w-[350px] max-w-[1100px] w-[50%] border border-gray-500 rounded my-4 px-6 py-4"
>
  <h1 class="text-center text-3xl m-4">Enter your PAT</h1>
  <p class="text-center text-xl m-4">
    Please enter your <a
      class="text-blue-500"
      href="https://github.com/settings/tokens">Github PAT</a
    > to use this tracker.
  </p>

  <input
    type="password"
    class="rounded px-4 py-2 border border-gray-300 w-full outline-none"
    placeholder="Github Personal Access Token"
    aria-label="Personal Access Token"
    bind:value={pat}
  />
  <small class="text-sm text-gray-500 mt-2 block">
    <a class="text-blue-500" href="https://github.com/settings/tokens/new"
      >Create a token</a
    > with the repo scope and paste it above.
  </small>

  <button
    class="mt-4 border border-transparent bg-blue-500 text-white rounded px-4 py-2 w-full"
    >Submit</button
  >
</form>
