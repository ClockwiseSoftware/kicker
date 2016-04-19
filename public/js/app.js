var app=angular.module("kickerApp",["ngRoute","ui.select","ngSanitize","ui.bootstrap"]).config(["$httpProvider","$interpolateProvider","$routeProvider",function(e,t,r){t.startSymbol("<%"),t.endSymbol("%>"),r.when("/signup",{templateUrl:"html/views/auth/signup.html",controller:"SignupCtrl"}).when("/signin",{templateUrl:"html/views/auth/signin.html",controller:"SigninCtrl"}).when("/",{templateUrl:"html/views/games/index.html"}).when("/game/create",{templateUrl:"html/views/games/create.html",controller:"CreateGameCtrl"}).when("/game/:id/update",{templateUrl:"html/views/games/update.html",controller:"UpdateGameCtrl"}).when("/game/:id/complainers",{templateUrl:"html/views/games/complainers.html",controller:"ComplainersCtrl"}).when("/chart",{templateUrl:"html/views/chart/index.html"}).when("/_=_",{templateUrl:"html/views/games/index.html"})}]);app.factory("User",["$http",function(e){function t(e){var t=this;return this.setData=function(e){angular.extend(this,e)},this.countGames=function(){return t.count_looses+t.count_wins+t.count_draws},this.avatarUrl=function(){return t.avatar_url?t.avatar_url:"/img/no-avatar.min.png"},e&&this.setData(e),this}return t.findUsers=function(t,r){var n={search:t,"exceptIds[]":r.game.getSelectedIds()};return e.get("/user/search",{params:n}).then(function(e){0===e.data.length?r.usersSearch=[{name:"No results..."}]:r.usersSearch=e.data})},t}]),app.controller("ChartsCtrl",["$scope","$http","User",function(e,t,r){e.orderByField="index",e.reverseSort=!1,e.users=[],e.me=null,e.init=function(){e.loading=!0,t.get("/chart").success(function(t){angular.forEach(t,function(e,t){e.index=t+1;var n=new r(e);n.countGamesPlayed=n.countGames(),this.push(n)},e.users)})},t.get("/user/me").success(function(t){return t?void(e.me=new r(t)):!1}),e.init()}]),app.factory("GameUser",["$http","User",function(e,t){function r(e){var r=this;return this.setData=function(e){angular.extend(this,e),r.user=new t(r.user)},this.getDelta=function(){return r.rating_after-r.rating_before},this.userPointsClass=function(){return r.getDelta()>0?"win":"lose"},e&&this.setData(e),this}return r}]),app.factory("Game",["$http","$filter","$sce","GameUser","User",function(e,t,r,n,a){function s(e){var s=this;return this.complaintsHtml="",this.tooltipIsVisible=!1,this.setData=function(e){angular.extend(this,e);for(var i=0;i<s.games_users_a.length;i++)s.games_users_a[i]=new n(s.games_users_a[i]);for(i=0;i<s.games_users_b.length;i++)s.games_users_b[i]=new n(s.games_users_b[i]);for(i=0;i<s.complaints.length;i++)s.complaints[i].user=new a(s.complaints[i].user);s.played_at=function(e){return t("date")(e,"MM/dd/yyyy HH:mm")}(new Date(s.played_at)),s.complaintsHtml=function(e){var t=5,n="",a=e.length>t?t:e.length;if(e.length<=0)return null;for(var i=0;a>i;i++){var o=s.complaints[i].user;o&&(n+='<span class="complain-user"><img src="'+o.avatarUrl()+'" /></span>')}return n+='<div><a href="#/game/'+s.id+'/complainers" class="see-all-complainers">See all</a></div>',r.trustAsHtml(n)}(s.complaints)},this.gamePointClass=function(e){var t=s.team_a_points,r=s.team_b_points;return"b"===e&&(t=s.team_b_points,r=s.team_a_points),t>r?"win":r>t?"lose":"draw"},e&&this.setData(e),this}return s.prototype.MAX_POINTS=10,s.prototype.MIN_POINTS=0,s}]),app.factory("CreateGameService",["$http","$filter",function(e,t){function r(e){var r=this;return this.id=null,this.users={a:[],b:[]},this.points={a:0,b:0},this.playedAt=function(e){return t("date")(e,"MM/dd/yyyy HH:mm")}(new Date),this.teamIds=function(e){var t=this.users[e],r=[];return angular.forEach(t,function(e){this.push(e.id)},r),r},this.getSelectedIds=function(){return this.teamIds("a").concat(this.teamIds("b"))},this.exportUsers=function(e,t){var r=[];return angular.forEach(e["games_users_"+t],function(e){this.push(e.user)},r),r},this.setData=function(e){r.users={a:r.exportUsers(e,"a"),b:r.exportUsers(e,"b")},r.points={a:e.team_a_points,b:e.team_b_points},r.playedAt=e.played_at,r.id=e.id},this.getFormData=function(){return{games_users_a:r.teamIds("a"),team_a_points:r.points.a,games_users_b:r.teamIds("b"),team_b_points:r.points.b,played_at:r.playedAt}},e&&this.setData(e),this}return r.prototype.MAX_POINTS=10,r.prototype.MIN_POINTS=0,r}]),app.controller("GamesCtrl",["$scope","$http","Game",function(e,t,r){function n(t){angular.forEach(t,function(e){var t=new r(e);this.push(t),s[t.id]=this.length-1},e.games)}function a(){t({url:"/user/role",method:"GET"}).success(function(t){"guest"===t?e.user.isGuest=!0:"user"===t?e.user.isUser=!0:"admin"===t&&(e.user.isAdmin=!0)})}e.loading=!1,e.lastpage=1,e.currentpage=0,e.games=[],e.loading=!1,e.user={isGuest:!1,isUser:!1,isAdmin:!1};var s={};e.userRole=a(),e.init=function(){t({url:"/",method:"GET",params:{page:e.currentpage}}).success(function(t){e.currentpage=t.current_page,e.lastpage=t.last_page,n(t.data)})},e.loadMore=function(){e.loading=!0,t({url:"/",method:"GET",params:{page:e.currentpage+1}}).success(function(t){e.currentpage=t.current_page,e.lastpage=t.last_page,n(t.data),e.loading=!1})},e.complain=function(n){t.get("/game/"+n+"/complain").success(function(a){t.get("/game/"+n).success(function(t){var n=new r(t),a=s[n.id];e.games[a]=n,n.tooltipIsVisible=!0})})},e.init()}]),app.controller("CreateGameCtrl",["$scope","$http","$location","$filter","CreateGameService","User",function(e,t,r,n,a,s){e.loading=!1,e.usersSearch=[],e.game=new a,e.errors={},e.findUsers=function(t){s.findUsers(t,e)},e.onSelectUser=function(t,r){for(var n=0;n<e.usersSearch.length;n++)if(t.id===e.usersSearch[n].id){e.usersSearch.splice(n,1);break}},e.create=function(){e.errors={},e.loading=!0,t.post("/game/create",e.game.getFormData()).error(function(t){e.errors=t}).then(function(){e.loading=!1,r.path("/")},function(){e.loading=!1})};var i=$("#playedAt");i.datetimepicker({format:"MM/DD/YYYY HH:mm"}),i.on("dp.change",function(){e.game.playedAt=$(this).val()})}]),app.controller("UpdateGameCtrl",["$scope","$http","$location","$filter","$routeParams","CreateGameService","User",function(e,t,r,n,a,s,i){e.loading=!1,e.gameId=a.id,e.game=null,t.get("/game/"+e.gameId).then(function(t){e.game=new s(t.data),e.findUsers()}),e.findUsers=function(t){return e.game?void i.findUsers(t,e):!1},e.onSelectUser=function(t,r){for(var n=0;n<e.usersSearch.length;n++)if(t.id===e.usersSearch[n].id){e.usersSearch.splice(n,1);break}},e.update=function(){e.errors={},e.loading=!0,t.post("/game/"+e.game.id+"/update",e.game.getFormData()).error(function(t){e.loading=!1,e.errors=t}).then(function(){e.loading=!1,r.path("/")})}}]),app.controller("ComplainersCtrl",["$scope","$http","$routeParams","Game",function(e,t,r,n){e.loading=!1,e.gameId=r.id,e.game=null,t.get("/game/"+e.gameId).then(function(t){e.game=new n(t.data)})}]),app.factory("AuthUser",["$http",function(e){function t(e){return this.email=null,this.name=null,this.password=null,this.setData=function(e){angular.extend(this,e)},e&&this.setData(e),this}return t}]),app.controller("SignupCtrl",["$scope","$http","$location","$window","AuthUser",function(e,t,r,n,a){e.user=new a,e.errors=[],e.signup=function(r){t({url:"/signup",method:"POST",data:e.user}).success(function(){n.location.href="/"}).error(function(t){e.errors=[];for(var r in t)if(t.hasOwnProperty(r))for(var n=0;n<t[r].length;n++)e.errors.push(t[r][n])})}}]),app.controller("SigninCtrl",["$scope","$http","$location","$window","AuthUser",function(e,t,r,n,a){e.user=new a,e.errors=[],e.signin=function(r){t({url:"/signin",method:"POST",data:e.user}).success(function(e){n.location.href="/"}).error(function(t){e.errors=[];for(var r in t)if(t.hasOwnProperty(r))for(var n=0;n<t[r].length;n++)e.errors.push(t[r][n])})}}]);