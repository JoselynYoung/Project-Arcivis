<script lang="ts">
	import ContentBody from './ContentBody.svelte';

	export interface ContentBodyDocument {
		type: 'doc';
		content?: unknown[];
	}

	type ContentNode = {
		type?: string;
		text?: string;
		content?: unknown[];
		attrs?: Record<string, unknown>;
		marks?: unknown[];
	};

	let {
		body,
		editorSchemaVersion = 1,
		node = null
	}: {
		body?: unknown;
		editorSchemaVersion?: number;
		node?: ContentNode | null;
	} = $props();

	const fontClasses: Record<string, string> = {
		Arial: 'font-sans',
		Georgia: 'font-serif',
		'Times New Roman': 'font-serif',
		Verdana: 'font-sans'
	};

	const sizeClasses: Record<string, string> = {
		'12px': 'text-xs',
		'14px': 'text-sm',
		'16px': 'text-base',
		'18px': 'text-lg',
		'24px': 'text-2xl',
		'32px': 'text-3xl'
	};

	function asNode(value: unknown): ContentNode | null {
		return value && typeof value === 'object' ? (value as ContentNode) : null;
	}

	function childrenOf(node: ContentNode): unknown[] {
		return Array.isArray(node.content) ? node.content : [];
	}

	function marksOf(node: ContentNode): ContentNode[] {
		return Array.isArray(node.marks)
			? node.marks.map(asNode).filter((mark): mark is ContentNode => mark !== null)
			: [];
	}

	function markClasses(node: ContentNode): string {
		return marksOf(node)
			.map((mark) => {
				if (mark.type === 'bold') return 'font-bold';
				if (mark.type === 'italic') return 'italic';
				if (mark.type === 'underline') return 'underline';
				if (mark.type === 'fontFamily') return fontClasses[String(mark.attrs?.fontFamily)] ?? '';
				if (mark.type === 'fontSize') return sizeClasses[String(mark.attrs?.fontSize)] ?? '';
				return '';
			})
			.filter(Boolean)
			.join(' ');
	}

	function headingLevel(node: ContentNode): 1 | 2 | 3 | null {
		const level = node.attrs?.level;
		return level === 1 || level === 2 || level === 3 ? level : null;
	}

	function isV1Document(value: unknown): value is ContentBodyDocument {
		return editorSchemaVersion === 1 && asNode(value)?.type === 'doc';
	}
</script>

{#if node}
	{#if node.type === 'doc' || node.type === 'listItem'}
		{#each childrenOf(node) as child, index (index)}
			{@const childNode = asNode(child)}
			{#if childNode}<ContentBody node={childNode} {editorSchemaVersion} />{/if}
		{/each}
	{:else if node.type === 'paragraph'}
		<p>
			{#each childrenOf(node) as child, index (index)}
				{@const childNode = asNode(child)}
				{#if childNode}<ContentBody node={childNode} {editorSchemaVersion} />{/if}
			{/each}
		</p>
	{:else if node.type === 'heading' && headingLevel(node)}
		<svelte:element this={`h${headingLevel(node)}`}>
			{#each childrenOf(node) as child, index (index)}
				{@const childNode = asNode(child)}
				{#if childNode}<ContentBody node={childNode} {editorSchemaVersion} />{/if}
			{/each}
		</svelte:element>
	{:else if node.type === 'orderedList' || node.type === 'bulletList'}
		<svelte:element this={node.type === 'orderedList' ? 'ol' : 'ul'}>
			{#each childrenOf(node) as child, index (index)}
				{@const childNode = asNode(child)}
				{#if childNode}<ContentBody node={childNode} {editorSchemaVersion} />{/if}
			{/each}
		</svelte:element>
	{:else if node.type === 'text' && typeof node.text === 'string'}
		<span class={markClasses(node)}>{node.text}</span>
	{:else if node.type === 'math' && typeof node.attrs?.latex === 'string'}
		<span class="font-mono">{node.attrs.latex}</span>
	{:else if node.type === 'image' && typeof node.attrs?.path === 'string'}
		<span class="text-sm text-slate-500">[Gambar materi]</span>
	{/if}
{:else if isV1Document(body)}
	{#each childrenOf(asNode(body) as ContentNode) as child, index (index)}
		{@const childNode = asNode(child)}
		{#if childNode}<ContentBody node={childNode} {editorSchemaVersion} />{/if}
	{/each}
{/if}
