<amedas-point>
	<div>
		<div class="datetime">{ datetime }</div>

		<div class="current">
			{ current }
		</div>
	
		<div class="dimmer-box">	
			<table class="ui celled table unstackable">
				<thead> 
					<tr> 
						<th>時刻</th> 
						<th>気温<br/><div>℃</div></th> 
						<th>降水<br/><div>mm</div></th> 
						<th>風向</th> 
						<th>風速<br/><div>m/s</div></th> 
						<th>日照<br/><div>min</div></th> 
						<th>積雪<br/><div>cm</div></th> 
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
					<tr class="split border-top">
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

			<div show={ loading } class="ui active inverted dimmer">
    			<div class="ui loader"></div>
  			</div>
		</div>
	</div>

	<script>
		this._id = null;
		this.loading = false;

		fetchAPI (id){
			if (id && this._id == id) return;
			this._id = id;

			var url = "https://ndbnzqw6p3.execute-api.ap-northeast-1.amazonaws.com/dev/point/"
			var self = this;
			this.update({ loading: true });
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
			this.loading = false;

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
			width: 50px;
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
			width: 50px;
			font-size: 13px;
			color: rgba(0,0,0,.7);
		}
		thead, tbody {
			display: block;
		}
		table.ui.table tbody {
			overflow-y: scroll;
			max-height: calc(100vh - 140px);
		}
		tr.split th {
			text-align: center;
			font-weight: 500;
			background: #F9FAFB;
		}
		tr.border-top th {
			border-top: 1px solid rgba(34,36,38,.1);
		}

		.dimmer-box {
			position: relative;
		}
	</style>
</amedas-point>

