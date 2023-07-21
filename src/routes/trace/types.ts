import type { Abi } from 'viem';

export type CallAction = {
	callType: string;
	from: `0x${string}`;
	gas: `0x${string}`;
	input: `0x${string}`;
	to: `0x${string}`;
	value: `0x${string}`;
};

export type CallResult = {
	gasUsed: `0x${string}`;
	output: `0x${string}`;
};

export type CreateAction = {
	from: `0x${string}`;
	gas: `0x${string}`;
	init: `0x${string}`;
	value: `0x${string}`;
};

export type CreateResult = {
	address: `0x${string}`;
	code: `0x${string}`;
	gasUsed: `0x${string}`;
};

export type Action = CallAction | CreateAction;
export type Result = CallResult | CreateResult;

export type Trace = {
	subtraces: number;
	traceAddress: number[];
} & (
	| { type: 'call'; action: CallAction; result: CallResult }
	| { type: 'create'; action: CreateAction; result: CreateResult }
);

export type CompactedTrace = {
	subtraces: CompactedTrace[];
} & (
	| { type: 'call'; action: CallAction; result: CallResult }
	| { type: 'create'; action: CreateAction; result: CreateResult }
);

export type ContractInfo = {
	abi: Abi;
	name: string;
};

export type ContractsInfo = {
	[key: `0x${string}`]: ContractInfo;
};
