<script lang="ts">
	import { writableStore } from '$lib/index.js';

	function currentTime(): string {
		return new Date().toTimeString();
	}

	let time = writableStore<string>(currentTime());

	time.$hasSubscriber.subscribe((hasSubscriber) => {
		console.log(hasSubscriber);
		if (hasSubscriber) {
			console.log('We have a sub');
			return;
		}
		console.log('No subs :(');
	});

	let unsub: CallableFunction;

	setTimeout(() => {
		unsub = time.subscribe((value) => {});
	}, 1000);

	setTimeout(() => {
		unsub();
	}, 3000);
</script>
