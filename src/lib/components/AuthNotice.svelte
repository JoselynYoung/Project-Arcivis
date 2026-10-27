<script lang="ts">
	import { Info } from '@lucide/svelte';

	let { message = 'Bookmark belum tersimpan. Masuk untuk menyimpannya.' }: { message?: string } =
		$props();
</script>

<p class="mb-4 flex items-center gap-1.5 text-xs text-amber-600">
	<Info size={13} />
	{message}
</p>
