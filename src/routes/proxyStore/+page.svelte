<script lang="ts">
	import { browser } from '$app/environment';
	import { proxyStore } from '$lib/index.js';

	let KV = proxyStore<any>({
		array: [],
		key1: { one: 1 }
	});

	function loadem() {
		for (let i = 0; i < 1000; i++) {
			KV.value.array.push({ chonky: 'chonks' });
		}
	}
	function clearem() {
		KV.value.array = [];
	}
	function clearembig() {
		KV.purge();
		console.log(KV);
	}

	KV.subscribe((value) => console.log(value));
</script>

<button on:click={loadem}>Load em up</button><br />
<button on:click={clearem}>Clear em up</button><br />
<button on:click={clearembig}>Clear em up big</button>
