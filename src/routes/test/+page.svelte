<script lang="ts">
	import { proxyStore } from '$lib/index.js';

	//keyValue store uses Proxy, but will only react to changes directly to the root object.
	//To react to any changes to any object/array in the store use proxyStore
	let numbers = proxyStore<string>({
		one: 'ONE',
		two: 'TWO',
		three: 'THREE'
	});

	setTimeout(() => {
		numbers.value.four = 'FOUR';
	}, 1000);
	setTimeout(() => {
		numbers.value.five = 'FIVE';
	}, 2000);
	setTimeout(() => {
		numbers.value.six = 'SIX';
	}, 3000);

	$: console.log($numbers);
</script>

{#each Object.keys($numbers) as key}
	{key} : {$numbers[key]} <br />
{/each}
