<amedas-point>
	<div>
		<div class="datetime">{ datetime }</div>

		<div class="current">
			{ current }
		</div>
		
		<table class="ui celled table">
			<thead> 
				<tr> 
					<th>時刻</th> 
					<th>気温 <div>℃</div></th> 
					<th>降水 <div>mm</div></th> 
					<th>風向</th> 
					<th>風速 <div>m/s</div></th> 
					<th>日照 <div>min</div></th> 
					<th>積雪 <div>cm</div></th> 
				</tr> 
			</thead>
			<tbody>
				<tr class="split">
					<th colspan="7">10分ごと</th>
				</tr>
				<tr each={ d in data10 }>
					<td>{ d[0] }</td>
					<td>{ d[1] || '--' }</td>
					<td>{ d[2] || '--' }</td>
					<td>{ d[3] || '--' }</td>
					<td>{ d[4] || '--' }</td>
					<td>{ d[5] || '--' }</td>
					<td>{ d[6] || '--' }</td>
				</tr>
			</tbody>
			<tbody>
				<tr class="split">
					<th colspan="7">1時間ごと</th>
				</tr>
				<tr each={ d in data60 }>
					<td>{ d[0] }</td>
					<td>{ d[1] || '--' }</td>
					<td>{ d[2] || '--' }</td>
					<td>{ d[3] || '--' }</td>
					<td>{ d[4] || '--' }</td>
					<td>{ d[5] || '--' }</td>
					<td>{ d[6] || '--' }</td>
				</tr>
			</tbody>
		</table>
	</div>

	<script>
		this._id = null;

		fetchAPI (id){
			if (id && this._id == id) return;
			this._id = id;

			var url = "https://ndbnzqw6p3.execute-api.ap-northeast-1.amazonaws.com/dev/point/"
			var self = this;
			fetch(url + id)
				.then(function(res){
					return res.json();
				}).then(function(json){
					console.log(json);
					self.data = json;
					self.setContent();
				});	
		}

		setContent (){
			//var date = new Date(this.data.datetime);
			//this.datetime = date.toString();

			//var lastdata = this.data['10min'][0];
			//this.current = lastdata.join("/");

			this.data10  = this.data['10min'];
			this.data60  = this.data['1hour'].slice(1);

			this.update();
		}
	</script>
	
	<style>
		table.ui.table thead th {
			padding: 4px 2px;
			width: 40px;
			text-align: center;
			font-weight: 500;
		}
		table.ui.table thead th div {
			font-size: 11px;
			display: inline-block;
			height: 13px;
		}
		table.ui.table tbody td {
			padding: 2px;
			text-align: center;
		}
		tr.split th {
			text-align: center;
			font-weight: 500;
			background: #F9FAFB;
		}
	</style>
</amedas-point>

