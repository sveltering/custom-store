<script lang="ts">
	import { browser } from '$app/environment';
	//import { proxyStore } from '$lib/index.js';
	import { proxyStore } from '$lib/index.js';

	let KV = proxyStore<any>({
		array: [],
		key1: { one: 1 }
	});

	setTimeout(() => {
		KV.value.array.push('Start');
	}, 2000);

	setTimeout(() => {
		KV.value.key1.two = { KV: 'test' };
	}, 3000);

	setTimeout(() => {
		KV.value.array.push('Start');
		console.log(KV.value.array.length);
	}, 4000);
	$: console.log($KV);
</script>
