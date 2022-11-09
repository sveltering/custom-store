<script lang="ts">
	import { keyValueStore } from '$lib';

	let kv = new keyValueStore<string>({});

	kv.setKey('hello', 'hi');

	kv.value = {
		hi: 'HELLLOOO'
	};
	console.log(kv.deleteKey('poop'));

	console.log(kv.value);
</script>
