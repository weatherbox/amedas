<info-bar>
	<div id="sidebar" class="ui sidebar bottom menu vertical">
		<div class="close"><i class="remove icon grey"></i></div>

		<div class="title">
			<h2>
				{ title }
				<span show={ mobile }>{ subTitle }</span>
			</h2>
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
		
			// init mobile / pc
			if (this.mobile){
				var self = this;
				this.$sidebar.on("touchstart", function(){
					self.showDetail();
				});

			}else{
				this.$sidebar.removeClass("bottom").addClass("right");
				$("#sidebar .close").show();
			}
			
			// close button	
			var self = this;
			$("#sidebar .close").on("click", function(){
				self.hide();
			});
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
				transform: (this.mobile) ?
					'translate3d(0,100%,0)' : // bottom
					'translate3d(100%,0,0)' // right
			}).one('transitionend', function (){
				$(this).removeClass("visible");
			});

			if (this.onclose) this.onclose();
		}
		
		showHeader (){
			this._show = "header";
			this.$sidebar.css({
				transform: 'translate3d(0, calc(100% - 59px), 0)'
			}).addClass("visible");
		}

		showPoint (title, id, value, onclose){
			this.title = title;
			this.subTitle = value;
			this.id = id;
			this.onclose = onclose;
			this.update();

			if (this.mobile){
				$("#sidebar .close").hide();
				this.showHeader();

			}else{
				if (!this._show) this.show();
				this.refs.amedas_point.fetchAPI(id);
			}
		}

		showDetail (){
			if (this._show == "header"){
				this.show();
				$("#sidebar .close").show();
				this.update({ subTitle: null });
				this.refs.amedas_point.fetchAPI(this.id);
			}
		}
	</script>

	<style>
		#sidebar {
			width: 375px;
			padding:10px;
			transition: transform .5s ease;
			height: 100%;
		}
		.close { position:absolute; top:5px; right:5px; display:none; }
		.title h2 { font-size: 1.5rem; font-weight:500; margin-top:8px; margin-left:8px; }
		.title h2 span { font-size: 1rem; font-weight:500; float:right; margin-right:20px; }
		.content { margin-top:10px; }
	</style>
</info-bar>

