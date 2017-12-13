function DataList(dl) {
	this.data = {}; // Data is stored as a "dictionary" of timestep : DataPoint
	this.size = 0;
	let i = 0;
	for (let point of dl){
		this.data[point.timestep] = point;
		this.size++;
		i++;
		if (i == dl.length){
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
}