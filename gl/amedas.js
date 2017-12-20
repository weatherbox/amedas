const s3Bucket = "//s3-ap-northeast-1.amazonaws.com/amedas/";


class AmedasGL {
	constructor (map){
		this.map = map;

		let self = this;
		this._loadAmedasJSON(function (data){
			var data_url = s3Bucket + data.time.substr(0, 8) + '/amedas-' + data.time + ".geojson.gz";
			self._loadGeoJSON(data_url);
			console.log(data.time);
			//self._showTime(data.time);
		});
	}

	_loadAmedasJSON (callback){
		fetch(s3Bucket + "amedas.json")
            .then(function(res){
                return res.json();
            }).then(function(json){
			    callback(json);
            });
	}

	_loadGeoJSON (url){
		this._url = url;
		var self = this;
		fetch(url)
            .then(function(res){
                return res.json();
            }).then(function(json){
                console.log(json);
			    self.data = json;

			    self.show('wind');
		    });
	}

	_showTime (time){
		var time_str = time.substr(0, 4) + "/" + time.substr(4, 2) + "/" + time.substr(6, 2) +
			" " + time.substr(8, 2) + ":" + time.substr(10, 2);
		//document.getElementById("time").innerHTML = time_str;	
	}

	
	show (type){
        if (type == this._type) return;
        if (this._layer) this._layer.remove();

        switch (type){
            case 'temp':
                this._layer = new AmedasGLTemp(this.map, this.data);
                break;
            case 'wind':
                this._layer = new AmedasGLWind(this.map, this.data);
                break;
        }

        this._type = type;
    }
}

