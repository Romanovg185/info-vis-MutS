function DataList(dl) {
	this.data = {}; // Data is stored as a "dictionary" of timestep : DataPoint
	this.size = 0;
	let i = 0;
	for (let point of dl){
		this.data[point.timestep] = point;
		this.size++;
		i++;
		if (i == dl.length - 1){
			this.maxNumberOfProteins = point.nMutS;
		}
	}

	// Return a slice of a datalist within a certain time range, most likely useful for the time sliders
	this.timeIntervalSlice = function(start, end){
		let ret = new Array();
		for (let k in this.data){
			if (this.data[k].timestep < start || this.data[k].timestep >= end){
				continue;
			}
			ret.push(this.data[k])
		}
		return new DataList(ret);
	}

	this.stateSlice = function(states){
	    let ret = new DataList([])
	    for (let k in this.data){
	        var currentTimestep = this.data[k].timestep;
            var currentNGATC = this.data[k].nGATC;
	        var currentNMutS = this.data[k].nMutS;
	        var currentNickingStates = this.data[k].nickingStates;
	        var currentPositions = []
	        var newDataPoint = new DataPoint(currentTimestep, currentNGATC, currentNMutS,
                                       currentNickingStates, currentPositions)
            var i = 0;
            for (let protein of this.data[k].positions){
                for(var state of states){
                    if (protein.state == state){
                        newDataPoint.positions.push(protein);
                        i++;
                    }
                }
            newDataPoint.nMutS = i;
            ret.data[currentTimestep] = newDataPoint;
            ret.size++;
            }
        }
        // currentTimestep refers to the last value timestep took on, because var indicates function scope, not lexical scope
        return ret;
	}
}
