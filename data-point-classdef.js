function DataPoint(timestep, nGATC, nMutS, states_array, positions_array){
	this.timestep = Number(timestep);  //Due to JS preferring the String datatype over almost everything, I want to cast to Number to be sure
	this.nGATC = Number(nGATC);
	this.nMutS = Number(nMutS);
	this.nickingStates = Array();
	for (var i = 0; i < states_array.length; i++) {
		this.nickingStates.push(Number(states_array[i]));
	}
	this.positions = [];
	for (var i = 0; i < positions_array.length; i+=2) {
		this.positions.push(new Protein(positions_array[i], positions_array[i+1], i)); // Added i to this as identifier
	}
}

