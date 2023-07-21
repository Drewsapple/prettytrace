<script lang="ts">
	import { decodeFunctionData, type AbiItem, decodeFunctionResult } from 'viem';
	import type { CallAction, CallResult, ContractsInfo } from './types';

	export let action: CallAction;
	export let result: CallResult;
	export let contractInfo: ContractsInfo;

	let abiItem: AbiItem & { type: 'function' };

	let inputData: { functionName: string; args?: readonly unknown[] };
	let formattedInput: object;
	try {
		inputData = decodeFunctionData({
			abi: contractInfo[action.to].abi,
			data: action.input
		});

		for (const item of contractInfo[action.to].abi) {
			if (
				item.type === 'function' &&
				item.name === inputData.functionName &&
				(item.inputs.length === inputData.args?.length ?? 0)
			) {
				abiItem = item;
				break;
			}
		}
		formattedInput = JSON.parse(
			`{${
				inputData.args
					?.map(
						(arg, index) =>
							`"${abiItem.inputs[index].name}": ${JSON.stringify(
								arg,
								(key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
							)}`
					)
					.join(', ') ?? ''
			}}`
		);
	} catch (e) {
		console.log(e);
		inputData = { functionName: 'unknown' };
		formattedInput = {};
	}

	let outputData: unknown;
	try {
		outputData = decodeFunctionResult({
			abi: contractInfo[action.to].abi,
			data: result.output,
			functionName: inputData.functionName
		});
	} catch (e) {
		console.log(e);
	}
</script>

<pre><code
		>{inputData.functionName}({JSON.stringify(formattedInput, null, 2).slice(4, -2)})
    </code>
</pre>
{#if outputData}
	<p>
		Returned: {outputData}
	</p>
{/if}
