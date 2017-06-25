class AmedasGL {
	constructor (map){
		this.map = map;

		let self = this;
		this._loadAmedasJSON(function (data){
			var data_url = "//s3-ap-northeast-1.amazonaws.com/amedas/temp/" + data.time + ".json";
			self._loadJSON(data_url);
			//self._showTime(data.time);
		});
	}

	_loadAmedasJSON (callback){
		var url = "//s3-ap-northeast-1.amazonaws.com/amedas/amedas.json";
		this._getJSON(url, function (data){
			callback(data);
		});
	}

	_loadJSON (url){
		this._url = url;
		var self = this;
		this._getJSON(url, function (data){
			console.log(data);
			self.data = data;
			self._init();
		});
	}

	_showTime (time){
		var time_str = time.substr(0, 4) + "/" + time.substr(4, 2) + "/" + time.substr(6, 2) +
			" " + time.substr(8, 2) + ":" + time.substr(10, 2);
		//document.getElementById("time").innerHTML = time_str;	
	}

	// substitute $.getJSON
	_getJSON (url, callback){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if ((xhr.readyState === 4) && (xhr.status === 200)) {
				var data = JSON.parse(xhr.responseText);
				callback(data);
			}
		}
		xhr.open("GET", url, true);
		xhr.send(null);	
	}
	
	_init (){
		var geojson = this._initGeoJSON();
		this.map.addSource('temp-data', {
			type: 'geojson',
			data: geojson
		});

		this.map.addLayer({
			id: 'temp',
			type: 'circle',
			source: 'temp-data',
			paint: {
				'circle-radius': {
					base: 2,
					stops: [[4, 2], [6, 4], [8, 8], [10, 16]]
				},
				'circle-color': {
					property: 'temp',
					stops: [
						[-30, '#002080'],
						[-5,  '#0041FF'],
						[0,   '#0096FF'],
						[5,   '#B9EBFF'],
						[10,  '#FFFFF0'],
						[15,  '#FFFF96'],
						[20,  '#FAF500'],
						[25,  '#FF9900'],
						[30,  '#FF2800'],
						[35,  '#B40068'],
					]
				}
			}
		});
	}

	_initGeoJSON (){
		var geojson = {
			type: 'FeatureCollection',
			features: []
		};

		for (var id in this.data.data){
			var point = this.data.data[id];
			geojson.features.push({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [point.lon, point.lat]
				},
				properties: {
					id: id,
					name: point.name,
					temp: point.temp
				}
			});
		}

		console.log(geojson);
		return geojson;
	}

}

