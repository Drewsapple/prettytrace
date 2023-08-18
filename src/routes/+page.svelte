<main class="container mx-auto flex flex-col justify-center min-h-screen">
	<section class="text-center leading-loose mx-auto p-4">
		<h1 class="font-extrabold text-4xl">This is PrettyTrace</h1>
		<p>a tool for understanding debug traces from blockscout</p>
	</section>

	<form action="/trace" method="get" class="flex justify-center">
		<div class="join p-2">
			<input
				type="text"
				name="txhash"
				class="input input-bordered join-item"
				placeholder="txhash: 0x...."
			/>
			<select name="network" class="select input-bordered join-item">
				<option value="1" selected>Ethereum Mainnet</option>
				<option value="10">OP Mainnet</option>
				<option value="7777777">Zora Network</option>
			</select>
			<input type="submit" class="btn join-item" />
		</div>
	</form>
</main>
