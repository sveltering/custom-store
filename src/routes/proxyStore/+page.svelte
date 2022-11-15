<script lang="ts">
	import { proxyStore } from '$lib/index.js';

	let KV = proxyStore<any>({
		array: [],
		key1: { one: 1 }
	});

	KV.value.array.push({ chonky: 'chonks' });
	console.log(KV.value);

	function loadem() {
		for (let i = 0; i < 50000; i++) {
			KV.value.array.push({ chonky: 'chonks' });
		}
		console.log(KV.value);
	}
	function clearem() {
		KV.value.array = [];
		console.log(KV.value);
	}
	function clearembig() {
		KV.purge();
		console.log(KV);
	}
</script>

<button on:click={loadem}>Load em up</button><br />
<button on:click={clearem}>Clear em up</button><br />
<button on:click={clearembig}>Clear em up big</button>
