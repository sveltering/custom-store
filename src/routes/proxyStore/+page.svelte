<script lang="ts">
	import { proxyStore } from '$lib/index.js';

	let KV = proxyStore<any>({
		array: [],
		key1: { one: 1 }
	});

	setTimeout(() => {
		KV.value.array.push({ one: 1 });
		KV.value.array.push({ two: 2 });
		KV.value.array.push({ three: 3 });
		KV.value.array.push({ four: 4 });
		console.log(KV._revokes);
	}, 1000);
	setTimeout(() => {
		KV.value.array[0].one = { one: 'one' };
		KV.value.array[1].two = { two: 'two' };
		KV.value.array[2].three = { three: 'thre' };
		KV.value.array[3].four = { four: 'four' };
		console.log(KV._revokes);
	}, 2000);
	setTimeout(() => {
		delete KV.value.array;
		console.log(KV._revokes);
	}, 3000);
	setTimeout(() => {
		KV.value = 'hi';
		console.log(KV._revokes);
	}, 4000);

	KV.subscribe((value) => {
		console.log(JSON.parse(JSON.stringify(value)));
	});
</script>
