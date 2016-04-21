var app=angular.module("kickerApp",["ngRoute","ui.select","ngSanitize","ui.bootstrap"]).config(["$httpProvider","$routeProvider",function(e,t){t.when("/signup",{templateUrl:"html/views/auth/signup.html",controller:"SignupCtrl"}).when("/signin",{templateUrl:"html/views/auth/signin.html",controller:"SigninCtrl"}).when("/",{templateUrl:"html/views/games/index.html"}).when("/game/create",{templateUrl:"html/views/games/create.html",controller:"CreateGameCtrl"}).when("/game/:id/update",{templateUrl:"html/views/games/update.html",controller:"UpdateGameCtrl"}).when("/game/:id/complainers",{templateUrl:"html/views/games/complainers.html",controller:"ComplainersCtrl"}).when("/chart",{templateUrl:"html/views/chart/index.html"}).when("/_=_",{templateUrl:"html/views/games/index.html"}),$(window).on("popstate",function(){$(".navbar-collapse").collapse("hide")}),$("body").on("click",".navbar-collapse li",function(){$(this).closest(".navbar-collapse").collapse("hide")})}]);app.directive("numberOnly",function(){return{require:"ngModel",link:function(e,t,n,a){a.$parsers.push(function(e){var t=parseInt(e),r=parseInt(n.min),s=parseInt(n.max),i=r;return i=t>s?s:t>=r?t:r,a.$setViewValue(i),a.$render(),i})}}}),app.directive("backImg",function(){return function(e,t,n){n.$observe("backImg",function(e){t.css({"background-image":"url("+e+")","background-size":"cover"})})}}),app.factory("User",["$http",function(e){function t(e){var t=this;return this.setData=function(e){angular.extend(this,e)},this.countGames=function(){return t.count_looses+t.count_wins+t.count_draws},this.avatarUrl=function(){return t.avatar_url?t.avatar_url:"/img/no-avatar.min.png"},e&&this.setData(e),this}return t}]),app.controller("ChartsCtrl",["$scope","$http","User",function(e,t,n){e.orderByField="index",e.reverseSort=!1,e.users=[],e.me=null,e.init=function(){e.loading=!0,t.get("/chart").success(function(t){angular.forEach(t,function(e,t){e.index=t+1;var a=new n(e);a.countGamesPlayed=a.countGames(),this.push(a)},e.users)})},t.get("/user/me").success(function(t){return t?void(e.me=new n(t)):!1}),e.init()}]),app.factory("GameUser",["$http","User",function(e,t){function n(e){var n=this;return this.setData=function(e){angular.extend(this,e),n.user=new t(n.user)},this.getDelta=function(){return n.rating_after-n.rating_before},this.userPointsClass=function(){return n.getDelta()>0?"win":"lose"},e&&this.setData(e),this}return n}]),app.factory("Game",["$http","$filter","$sce","GameUser","User",function(e,t,n,a,r){function s(e){var s=this;return this.complaintsHtml="",this.tooltipIsVisible=!1,this.setData=function(e){angular.extend(this,e);for(var i=0;i<s.games_users_a.length;i++)s.games_users_a[i]=new a(s.games_users_a[i]);for(i=0;i<s.games_users_b.length;i++)s.games_users_b[i]=new a(s.games_users_b[i]);for(i=0;i<s.complaints.length;i++)s.complaints[i].user=new r(s.complaints[i].user);s.played_at=function(e){return t("date")(e,"MM/dd/yyyy HH:mm")}(new Date(s.played_at)),s.complaintsHtml=function(e){var t=5,a="",r=e.length>t?t:e.length;if(e.length<=0)return null;for(var i=0;r>i;i++){var o=s.complaints[i].user;o&&(a+='<span class="complain-user"><img src="'+o.avatarUrl()+'" /></span>')}return a+='<div><a href="#/game/'+s.id+'/complainers" class="see-all-complainers">See all</a></div>',n.trustAsHtml(a)}(s.complaints)},this.gamePointClass=function(e){var t=s.team_a_points,n=s.team_b_points;return"b"===e&&(t=s.team_b_points,n=s.team_a_points),t>n?"win":n>t?"lose":"draw"},e&&this.setData(e),this}return s.prototype.MAX_POINTS=10,s.prototype.MIN_POINTS=0,s}]),app.factory("CreateGameService",["$http","$filter",function(e,t){function n(e){function n(e){return t("date")(e,"MM/dd/yyyy HH:mm")}var a=this;return this.id=null,this.users={a:[],b:[]},this.points={a:0,b:0},this.playedAt=n(new Date),this.teamIds=function(e){var t=this.users[e],n=[];return angular.forEach(t,function(e){this.push(e.id)},n),n},this.getSelectedIds=function(){return this.teamIds("a").concat(this.teamIds("b"))},this.exportUsers=function(e,t){var n=[];return angular.forEach(e["games_users_"+t],function(e){this.push(e.user)},n),n},this.setData=function(e){a.users={a:a.exportUsers(e,"a"),b:a.exportUsers(e,"b")},a.points={a:e.team_a_points,b:e.team_b_points},a.playedAt=n(new Date(e.played_at)),a.id=e.id},this.getFormData=function(){return{games_users_a:a.teamIds("a"),team_a_points:a.points.a,games_users_b:a.teamIds("b"),team_b_points:a.points.b,played_at:a.playedAt}},e&&this.setData(e),this}return n.prototype.MAX_POINTS=10,n.prototype.MIN_POINTS=0,n}]),app.factory("UserSearch",["$http",function(e){function t(){}return t.find=function(t,n){if(n.searchRequestPending||null===n.game)return!1;n.searchRequestPending=!0;var a=n.game.getSelectedIds(),r={};return t=t?t.trim():t,a.length>0&&(r["exceptIds[]"]=a),t&&(r.search=t),e.get("/user/search",{params:r}).then(function(e){0===e.data.length?n.usersSearch=[{name:"No results..."}]:n.usersSearch=e.data,n.searchRequestPending=!1})},t.remove=function(e,t){for(var n=0;n<t.usersSearch.length;n++)if(e.id===t.usersSearch[n].id){t.usersSearch.splice(n,1);break}},t.add=function(e,t){t.usersSearch.unshift(e)},t}]),app.controller("GamesCtrl",["$scope","$http","Game",function(e,t,n){function a(t){angular.forEach(t,function(e){var t=new n(e);this.push(t),s[t.id]=this.length-1},e.games)}function r(){t({url:"/user/role",method:"GET"}).success(function(t){"guest"===t?e.user.isGuest=!0:"user"===t?e.user.isUser=!0:"admin"===t&&(e.user.isAdmin=!0)})}e.loading=!1,e.lastpage=1,e.currentpage=0,e.games=[],e.loading=!1,e.user={isGuest:!1,isUser:!1,isAdmin:!1};var s={};e.userRole=r(),e.init=function(){t({url:"/",method:"GET",params:{page:e.currentpage}}).success(function(t){e.currentpage=t.current_page,e.lastpage=t.last_page,a(t.data)})},e.loadMore=function(){e.loading=!0,t({url:"/",method:"GET",params:{page:e.currentpage+1}}).success(function(t){e.currentpage=t.current_page,e.lastpage=t.last_page,a(t.data),e.loading=!1})},e.complain=function(a){t.get("/game/"+a+"/complain").success(function(r){t.get("/game/"+a).success(function(t){var a=new n(t),r=s[a.id];e.games[r]=a,a.tooltipIsVisible=!0})})},e.init()}]),app.controller("CreateGameCtrl",["$scope","$http","$location","$filter","CreateGameService","UserSearch",function(e,t,n,a,r,s){e.loading=!1,e.game=new r,e.errors={},e.findUsers=function(t){s.find(t,e)},e.onSelectUser=function(t){s.remove(t,e)},e.onRemoveUser=function(t){s.add(t,e)},e.create=function(){e.errors={},e.loading=!0,t.post("/game/create",e.game.getFormData()).error(function(t){e.errors=t}).then(function(){e.loading=!1,n.path("/")},function(){e.loading=!1})};var i=$("#playedAt");i.datetimepicker({format:"MM/DD/YYYY HH:mm",maxDate:new Date}),i.on("dp.change",function(){e.game.playedAt=$(this).val()})}]),app.controller("UpdateGameCtrl",["$scope","$http","$location","$filter","$routeParams","CreateGameService","UserSearch",function(e,t,n,a,r,s,i){e.loading=!1,e.gameId=r.id,e.game=null,t.get("/game/"+e.gameId).then(function(t){e.game=new s(t.data),e.findUsers()}),e.findUsers=function(t){i.find(t,e)},e.onSelectUser=function(t){i.remove(t,e)},e.onRemoveUser=function(t){i.add(t,e)},e.update=function(){e.errors={},e.loading=!0,t.post("/game/"+e.game.id+"/update",e.game.getFormData()).error(function(t){e.loading=!1,e.errors=t}).then(function(){e.loading=!1,n.path("/")})};var o=$("#playedAt");o.datetimepicker({format:"MM/DD/YYYY HH:mm",maxDate:new Date}),o.on("dp.change",function(){e.game.playedAt=$(this).val()})}]),app.controller("ComplainersCtrl",["$scope","$http","$routeParams","Game",function(e,t,n,a){e.loading=!1,e.gameId=n.id,e.game=null,t.get("/game/"+e.gameId).then(function(t){e.game=new a(t.data)})}]),app.factory("AuthUser",["$http",function(e){function t(e){return this.email=null,this.name=null,this.password=null,this.setData=function(e){angular.extend(this,e)},e&&this.setData(e),this}return t}]),app.controller("SignupCtrl",["$scope","$http","$location","$window","AuthUser",function(e,t,n,a,r){e.user=new r,e.errors=[],e.signup=function(n){t({url:"/signup",method:"POST",data:e.user}).success(function(){a.location.href="/"}).error(function(t){e.errors=[];for(var n in t)if(t.hasOwnProperty(n))for(var a=0;a<t[n].length;a++)e.errors.push(t[n][a])})}}]),app.controller("SigninCtrl",["$scope","$http","$location","$window","AuthUser",function(e,t,n,a,r){e.user=new r,e.errors=[],e.signin=function(n){t({url:"/signin",method:"POST",data:e.user}).success(function(e){a.location.href="/"}).error(function(t){e.errors=[];for(var n in t)if(t.hasOwnProperty(n))for(var a=0;a<t[n].length;a++)e.errors.push(t[n][a])})}}]);