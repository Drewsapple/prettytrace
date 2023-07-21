<script lang="ts">
	import Call from './call.svelte';
	import Trace from './trace.svelte';
	import type { CompactedTrace, ContractsInfo } from './types';
	import { decodeDeployData, formatEther, hexToBigInt } from 'viem';

	export let trace: CompactedTrace;
	export let contractInfo: ContractsInfo;
	let { action, result, subtraces } = trace;

	function getName(address: `0x${string}`) {
		return contractInfo[address]?.name;
	}

	function getId(address: `0x${string}`) {
		const name = getName(address);

		if (name) {
			return `${name} (${address.slice(0, 6)}...${address.slice(-4)})`;
		} else {
			return address;
		}
	}

	let description: string;
	try {
		if (trace.type === 'call') {
		} else if (trace.type === 'create') {
			const data = decodeDeployData({
				abi: contractInfo[trace.result.address].abi,
				bytecode: trace.result.code,
				data: trace.action.init
			}).args?.join(', ');
			description = `new ${getName(trace.result.address)}(${data})`;
		}
	} catch {
		description = 'unknown behavior';
	}
</script>

<div>
	<div class="prose">
		{#if trace.type === 'create'}
			<h4>
				{getId(action.from)} created a contract
			</h4>
			<p>
				{description}
			</p>
		{:else if trace.type === 'call'}
			<h4>
				{getId(action.from)}
				{trace.action.callType} into {getId(trace.action.to)}
			</h4>
			<Call action={trace.action} result={trace.result} {contractInfo} />
		{/if}
		{#if action.value !== '0x0'}
			<p>Value: {formatEther(hexToBigInt(action.value))} Eth</p>
		{/if}

		<p>
			Gas: {hexToBigInt(result.gasUsed)} used / {hexToBigInt(action.gas)} limit
			{#if subtraces.length > 0}
				({hexToBigInt(result.gasUsed) -
					subtraces.reduce((accum, curr) => accum + hexToBigInt(curr.result.gasUsed), 0n)} overhead)
			{/if}
		</p>
	</div>
	{#if subtraces.length > 0}
		<h3 class="font-bold">{subtraces.length} Subtrace{subtraces.length === 1 ? '' : 's'}</h3>
		<div class="flex">
			<div class="divider divider-horizontal" />

			<ul class="">
				{#each subtraces as subtrace}
					<li class="">
						<Trace trace={subtrace} {contractInfo} />
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
