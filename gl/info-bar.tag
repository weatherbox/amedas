<info-bar>
	<div id="sidebar" class="ui sidebar bottom menu vertical">
		<div class="close"><i class="remove icon grey"></i></div>

		<div class="title">
			<h2>{ title }</h2>
		</div>

		<div class="ui divider" style="margin-bottom:10px"></div>

		<div class="content">
			<amedas-point ref="amedas_point"></amedas-point>
		</div>
	</div>

	<script>
		this._show = false;

		// jquery init
		this.on('mount', function() {
			this.$sidebar = $("#sidebar");
			this.mobile = $(window).width() < 640;
		
			// init pc
			if (!this.mobile){
				this.$sidebar.removeClass("bottom").addClass("right");
				$("#sidebar .close").show();
				var self = this;
				$("#sidebar .close").on("click", function(){
					self.hide();
				});
			}
		});

		show (){
			this._show = true;
			this.$sidebar.css({
				transform: 'translate3d(0,0,0)'
			}).addClass("visible");
		}

		hide (){
			this._show = false;
			this.$sidebar.css({
				transform: 'translate3d(100%,0,0)'
			}).one('transitionend', function (){
				$(this).removeClass("visible");
			});
		}

		showPoint (title, id){
			this.title = title;
			this.update();
			if (!this._show) this.show();
			this.refs.amedas_point.fetchAPI(id);
		}
	</script>

	<style>
		#sidebar {
			width: 375px;
			padding:10px;
			transition: transform .5s ease;
		}
		.close { position:absolute; top:5px; right:5px; display:none; }
		.title h2 { font-size: 1.5rem; font-weight:500; margin-top:8px; margin-left:8px; }
		.content { margin-top:10px; }
	</style>
</info-bar>

