<script lang="ts">
	import { keyValueStore } from '$lib/index.js';

	let KV = keyValueStore<any>();

	KV.value.hi = 'hello';
	KV.value.arr = ['hello'];

	setTimeout(() => {
		KV.value.hello = { hello: 'again' };
	}, 2000);
	setTimeout(() => {
		KV.value.hello.hello = 'now?';
	}, 3000);
</script>

{#each Object.keys($KV) as key, index}
	{#if typeof $KV[key] === 'object'}
		{#each Object.keys($KV[key]) as key2, index}
			{key2} : {$KV[key][key2]}<br />
		{/each}
	{:else}
		{key} : {$KV[key]}<br />
	{/if}
{/each}
