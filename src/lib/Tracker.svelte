<script>
  import { onMount } from "svelte";

  let trackedRepos = [];
  onMount(async () => {
    trackedRepos = await fetchRepos();
  });

  async function fetchRepos() {
    // If there is no username, reload the page and end the function
    if (!localStorage.getItem("username")) return window.location.reload();

    const res = await fetch(
      "/api/listrepos?username=" + localStorage.getItem("username")
    );
    const data = await res.json();
    if (!res.ok) alert(data.message);
    else return data.repositories;
  }

  let repo = "";
  function track() {
    // If there is no username, reload the page and end the function
    if (!localStorage.getItem("username")) return window.location.reload();

    fetch("/api/trackrepo", {
      body: JSON.stringify({ username: localStorage.getItem("username"), repo }),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    })
      .then(async r => {
        // Return the data and the response itself
        return { r, data: await r.json() };
      })
      .then(({ r, data }) => {
        if (!r.ok) alert(data.message);
        else console.log("Repository tracked");
      });
    trackedRepos = [...trackedRepos, repo];
    repo = "";
  }

  function untrack(/** @type string*/ repo) {
    // If there is no username, reload the page and end the function
    if (!localStorage.getItem("username")) return window.location.reload();

    fetch("/api/untrackrepo", {
      body: JSON.stringify({ username: localStorage.getItem("username"), repo }),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    })
      .then(async r => {
        // Return the data and the response itself
        return { r, data: await r.json() };
      })
      .then(({ r, data }) => {
        if (!r.ok) alert(data.message);
        else console.log("Repository untracked");
      });
    trackedRepos = trackedRepos.filter(r => r !== repo);
  }
</script>

<form
  on:submit|preventDefault={track}
  class="mx-auto min-w-[350px] max-w-[1100px] w-[50%] border border-gray-500 rounded my-4 px-6 py-4"
>
  <h1 class="text-center text-3xl m-4">Github tracker</h1>

  <input
    type="text"
    class="rounded px-4 py-2 border border-gray-300 w-full outline-none"
    placeholder="username/repo"
    aria-label="Repository URL"
    bind:value={repo}
  />
  <button
    class="mt-2 border border-transparent bg-blue-500 text-white rounded px-4 py-2 w-full"
    >Track repository</button
  >

  <h2 class="mt-4 text-2xl">Tracked repositories</h2>
  <ul class="m-2 list-decimal">
    {#each trackedRepos as repo}
      <li class="py-1 flex items-center justify-between">
        <a class="text-gray-500 hover:underline" href="https://github.com/{repo}"
          >https://github.com/{repo}</a
        >
        <button class="text-red-500 cursor-pointer" on:click={() => untrack(repo)}
          >Untrack</button
        >
      </li>
    {/each}
  </ul>
</form>
