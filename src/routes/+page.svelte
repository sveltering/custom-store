<script lang="ts">
	import { arrayStore } from '$lib/index.js';

	let helloWorld = arrayStore<any>([]);

	let i = 0;
	const add = () => {
		helloWorld.value.push('POOOOP ' + ++i);
	};
	add();
	const add5 = () => {
		helloWorld.value.push(1, 2, 3, 4, 5);
	};
	const remove3 = () => {
		helloWorld.value.splice(2, 1);
	};
	const removeLast = () => {
		helloWorld.value.pop();
	};
	const replaceAll = () => {
		helloWorld.value = [10, 9, 8];
	};
</script>

{#each $helloWorld as hi}
	{hi}<br />
{/each}

<button on:click={add}>add</button>
<button on:click={remove3}>remove 3</button>
<button on:click={removeLast}>remove last</button>
<button on:click={replaceAll}>replace all</button>
<button on:click={add5}>add 5</button>

<br />
