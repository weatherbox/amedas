const s3Bucket = "//s3-ap-northeast-1.amazonaws.com/amedas/";


class AmedasGL {
	constructor (map){
		this.map = map;

		let self = this;
		this._loadAmedasJSON(function (data){
			var data_url = s3Bucket + data.time.substr(0, 8) + '/amedas-' + data.time + ".geojson.gz";
			self._loadGeoJSON(data_url);
			console.log(data.time);
			self._showTime(data.time);
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

                var init = self._getQueryType() || 'wind';
			    self.show(init);
		    });
	}

	_showTime (time){
        var time_str = time.substr(8, 2) + ":" + time.substr(10, 2);
        window.mapTime.set(time_str);
	}

	
	show (type){
        if (type == this._type) return;
        if (this._layer) this._layer.remove();

        switch (type){
            case 'rain':
                this._layer = new AmedasGLRain(this.map, this.data);
                break;
            case 'temp':
                this._layer = new AmedasGLTemp(this.map, this.data);
                break;
            case 'wind':
                this._layer = new AmedasGLWind(this.map, this.data);
                break;
            case 'sun':
                this._layer = new AmedasGLSun(this.map, this.data);
                break;
            case 'snow':
                this._layer = new AmedasGLSnow(this.map, this.data);
                break;
            default:
                this._layer = null;
                return;
        }

        this._type = type;
        this._setQueryType(type);
    }

    _getQueryType (){
        return location.search.slice(1);
    }

    _setQueryType(type){
        history.replaceState(null, null, '?' + type + location.hash);
    }
}

