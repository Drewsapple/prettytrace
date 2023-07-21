import { error } from '@sveltejs/kit';
import type { CompactedTrace, ContractsInfo, Trace } from './types';

export const prerender = false;

const contractInfo: ContractsInfo = {};

const networks = {
	1: 'eth.blockscout.com',
	7777777: 'explorer.zora.energy'
} as const;

export async function load({ fetch, url }) {
	const chainId = parseInt(url.searchParams.get('network') ?? '1') as keyof typeof networks;
	if (!networks[chainId]) {
		throw error(404, 'Invalid network');
	}
	const baseURL = networks[chainId];

	const traceItems: Trace[] = await fetch(
		`https://${baseURL}/api/v2/transactions/${url.searchParams.get('txhash')}/raw-trace`
	).then((res) => res.json());

	if (!traceItems.length) {
		throw error(404, 'Not Found');
	}
	const contractLoads = traceItems.map((item) => {
		if (item.type === 'call') {
			if (!contractInfo[item.action.to]) {
				return fetch(`https://${baseURL}/api/v2/smart-contracts/${item.action.to}`)
					.then((res) => res.json())
					.then((res) => (contractInfo[item.action.to] = res));
			}
		}
	});

	await Promise.allSettled(contractLoads);
	const trace = deepen(traceItems);

	return {
		trace,
		contractInfo
	};
}

function deepen(traces: Trace[]): CompactedTrace {
	const deep: CompactedTrace = { ...traces[0], subtraces: [] };
	traces.sort((a, b) => {
		const depthDiff = a.traceAddress.length - b.traceAddress.length;
		if (depthDiff === 0) {
			return a.traceAddress[-1] - b.traceAddress[-1];
		} else return depthDiff;
	});
	for (const trace of traces) {
		let current = deep;
		for (const index of trace.traceAddress) {
			if (!current.subtraces[index]) {
				current.subtraces[index] = { ...trace, subtraces: [] };
			}
			current = current.subtraces[index];
		}
	}

	return deep;
}
