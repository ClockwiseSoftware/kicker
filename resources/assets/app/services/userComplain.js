app.factory(
	"UserComplain",
	[	"$rootScope",
		"$compile",
		function($rootScope, $compile) {

			var html = document.createElement("div"),
				$scope = $rootScope.$new();
				$scope.selectedOption = 0;
				$scope.reason = "";
				$scope.options = 
					[	{	title: "Incorrect points",
							val: 0
						},
						{	title: "The game was not played",
							val: 1
						},
						{	title: "Other",
							val: 2
						}];

			html.className = "user-complain-backdrop";
			html.innerHTML = 
				"<div "+
					"class='"+
						"user-complain-bdy "+
						"md-whiteframe-z2'>"+
							"<label class='user-complain-label'>"+
								"Select Reason"+
							"</label>"+
							"<md-select "+
								"class='user-complain-select' "+
								"aria-label='select Reason' "+
								"ng-model='selectedOption'>"+
									"<md-option "+
										"ng-repeat='opt in options' "+
										"value='{{opt.val}}'>"+
											"{{opt.title}}"+
									"</md-option>"+
							"</md-select>"+
							"<md-input-container "+
								"ng-show='selectedOption==2' "+
								"class='md-block'>"+
									"<label>"+
										"Your reason"+
									"</label>"+
									"<textarea "+
										"arai-label='reason text' "+
										"md-maxlength='256' "+
										"maxlength='256' "+
										"ng-model='reason'>"+
									"</textarea>"+
							"</md-input-container>"+
							"<div class='user-complain-controls'>"+
								"<md-button ng-click='hide()'>"+
									"Cancel"+
								"</md-button>"+
								"<md-button ng-click='onOk()'>"+
									"Ok"+
								"</md-button>"+
							"</div>"+
				"</div>";

			var style = document.createElement("style"),
				width = 300;
			style.innerHTML = 
				".user-complain-backdrop{"+
					"position: absolute;"+
					"height: 100%;"+
					"width: 100%;"+
					"top: 0;"+
					"} "+
				".user-complain-bdy {"+
					"padding: 24px 24px 0 24px;"+
					"border-radius: 2px;"+
					"position: absolute;"+
					"background: #FEFEFE;"+
					"width: "+width+"px;"+
					"}"+
				".user-complain-label {"+
					"font-size: 12px;"+
					"color: rgba(0,0,0,0.5)"+
					"}"+
				".user-complain-controls {"+
					"text-align: right;"+
					"}"+
				".user-complain-select {"+
					"font-size: 16px"+
					"margin-top: 0;"+
					"}";
			document.head.appendChild(style);

			$compile(html)($scope);

			var bdy = html.getElementsByClassName("user-complain-bdy")[0],
				onClose = null,
				onOk = null,
				show = 
					function(pOpts) {

						if(!pOpts.event)
							return;

						var left = pOpts.event.pageX + pOpts.offsX,
							delta = window.innerWidth - left;

						if(delta < width)
							left -= width - delta;

						if(left < 0)
							left = 0;

						bdy.style.left = left+"px";
						bdy.style.top = 
							(pOpts.event.pageY + pOpts.offsY)+"px";

						document.body.appendChild(html);

						onClose = pOpts.onClose;
						onOk = pOpts.onOk;

						$scope.selectedOption = 0;
						$scope.reason = "";
					},
				hide = 
					function() {

						html.remove();

						if(typeof onClose === "function")
							onClose();

						onClose = null;
						onOk = null;
					};

			$scope.hide = hide;
			$scope.onOk = 
				function() {

					if(	$scope.selectedOption == 2 &&
						$scope.reason.length < 1)
							return;

					if(typeof onOk !== "function")
						return;

					var ret = $scope.reason;

					if($scope.selectedOption != 2)
						for(var i in $scope.options)
							if($scope.options[i].val == $scope.selectedOption) {
								ret = $scope.options[i].title;
								break;
							}

					onOk(ret);
				}

			window.addEventListener("resize", hide);
			html.addEventListener("click", hide);
			bdy.addEventListener(
				"click", 
				function(ev) {
					ev.stopPropagation();
				});

			return {
				show: show,
				hide: hide
			};
		}]);