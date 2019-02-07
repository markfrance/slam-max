import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';


const network = {
	blockchain: "eos",
	protocol: "http",
	host: "jungle2.cryptolions.io",
	port: 80,
	// chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906" // EOS Main Net
	chainId: "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473" // Jungle
};

class ScatterEOS extends React.Component {
	constructor(contractAccount) {
		super(contractAccount);
		this.contractAccount = contractAccount;

		ScatterJS.plugins( new ScatterEOS() );

		ScatterJS.scatter.connect("SLAM MAX").then(connected => {
		   
		    if(!connected) return false;

		    const scatter = ScatterJS.scatter;

		    window.ScatterJS = null;

		});
	}

}

export default ScatterEOS;