var app=angular.module("kickerApp",["ngRoute","ui.select","ngSanitize","ui.bootstrap"]).config(["$httpProvider","$interpolateProvider","$routeProvider",function(t,e,a){e.startSymbol("<%"),e.endSymbol("%>"),a.when("/signup",{templateUrl:"html/views/auth/signup.html",controller:"SignupCtrl"}).when("/signin",{templateUrl:"html/views/auth/signin.html",controller:"SigninCtrl"}).when("/",{templateUrl:"html/views/games/index.html"}).when("/game/create",{templateUrl:"html/views/games/create.html",controller:"CreateGameCtrl"}).when("/game/:id/update",{templateUrl:"html/views/games/update.html",controller:"UpdateGameCtrl"}).when("/chart",{templateUrl:"html/views/chart/index.html"}).when("/_=_",{templateUrl:"html/views/games/index.html"})}]);app.factory("User",["$http",function(t){function e(t){var e=this;return this.setData=function(t){angular.extend(this,t)},this.countGames=function(){return e.count_looses+e.count_wins+e.count_draws},this.avatarUrl=function(){return e.avatar_url?e.avatar_url:"/img/no-avatar.min.png"},t&&this.setData(t),this}return e}]),app.controller("ChartsCtrl",["$scope","$http","User",function(t,e,a){t.users=[],t.init=function(){t.loading=!0,e.get("/chart").success(function(e){angular.forEach(e,function(t,e){t.index=e+1;var n=new a(t);this.push(n)},t.users)})},t.init()}]),app.factory("GameUser",["$http","User",function(t,e){function a(t){var a=this;return this.setData=function(t){angular.extend(this,t),a.user=new e(a.user)},this.getDelta=function(){return a.rating_after-a.rating_before},this.userPointsClass=function(){return a.getDelta()>0?"win":"lose"},t&&this.setData(t),this}return a}]),app.factory("Game",["$http","$filter","GameUser","User",function(t,e,a,n){function r(t){var r=this;if(this.complaintsHtml="",this.setData=function(t){angular.extend(this,t);for(var n=0;n<r.games_users_a.length;n++)r.games_users_a[n]=new a(r.games_users_a[n]);for(n=0;n<r.games_users_b.length;n++)r.games_users_b[n]=new a(r.games_users_b[n]);r.played_at=function(t){return e("date")(t,"MM/dd/yyyy HH:mm")}(new Date(r.played_at))},this.gamePointClass=function(t){var e=r.team_a_points,a=r.team_b_points;return"b"===t&&(e=r.team_b_points,a=r.team_a_points),e>a?"win":a>e?"lose":"draw"},t){this.setData(t);for(var s=0;s<r.complaints.length;s++){var i=r.complaints[s].user;i&&(i=new n(r.complaints[s].user),r.complaintsHtml+='<span class="complain-user"><img src="'+i.avatarUrl()+'" /><span class="complain-user-name">'+i.name+"</span></span>")}}return this}return r}]),app.factory("CreateGameService",["$http","$filter",function(t,e){function a(t){var a=this;return this.id=null,this.users={a:[],b:[]},this.points={a:0,b:0},this.playedAt=function(t){return e("date")(t,"MM/dd/yyyy HH:mm")}(new Date),this.teamIds=function(t){var e=this.users[t],a=[];return angular.forEach(e,function(t){this.push(t.id)},a),a},this.getSelectedIds=function(){return this.teamIds("a").concat(this.teamIds("b"))},this.exportUsers=function(t,e){var a=[];return angular.forEach(t["games_users_"+e],function(t){this.push(t.user)},a),a},this.setData=function(t){a.users={a:a.exportUsers(t,"a"),b:a.exportUsers(t,"b")},a.points={a:t.team_a_points,b:t.team_b_points},a.playedAt=t.played_at,a.id=t.id},this.getFormData=function(){return{games_users_a:a.teamIds("a"),team_a_points:a.points.a,games_users_b:a.teamIds("b"),team_b_points:a.points.b,played_at:a.playedAt}},t&&this.setData(t),this}return a}]),app.controller("GamesCtrl",["$scope","$http","Game",function(t,e,a){function n(e){angular.forEach(e,function(t){var e=new a(t);this.push(e),s[e.id]=this.length-1},t.games)}function r(){e({url:"/user/role",method:"GET"}).success(function(e){"guest"===e?t.user.isGuest=!0:"user"===e?t.user.isUser=!0:"admin"===e&&(t.user.isAdmin=!0)})}t.loading=!1,t.lastpage=1,t.currentpage=0,t.games=[],t.loading=!1,t.user={isGuest:!1,isUser:!1,isAdmin:!1};var s={};t.userRole=r(),t.init=function(){e({url:"/",method:"GET",params:{page:t.currentpage}}).success(function(e){t.currentpage=e.current_page,t.lastpage=e.last_page,n(e.data)})},t.loadMore=function(){t.loading=!0,e({url:"/",method:"GET",params:{page:t.currentpage+1}}).success(function(e){t.currentpage=e.current_page,t.lastpage=e.last_page,n(e.data),t.loading=!1})},t.complain=function(n){e.get("/game/"+n+"/complain").success(function(r){e.get("/game/"+n).success(function(e){var n=new a(e),r=s[n.id];t.games[r]=n})})},t.init()}]),app.controller("CreateGameCtrl",["$scope","$http","$location","$filter","CreateGameService",function(t,e,a,n,r){t.loading=!1,t.usersSearch=[],t.game=new r,t.errors={},t.findUsers=function(a){var n={search:a,"exceptIds[]":t.game.getSelectedIds()};return e.get("/user/search",{params:n}).then(function(e){t.usersSearch=e.data})},t.create=function(){t.errors={},t.loading=!0,e.post("/game/create",t.game.getFormData()).error(function(e){t.errors=e}).then(function(){t.loading=!1,a.path("/")},function(){t.loading=!1})};var s=$("#playedAt");s.datetimepicker({format:"MM/DD/YYYY HH:mm"}),s.on("dp.change",function(){t.game.playedAt=$(this).val()})}]),app.controller("UpdateGameCtrl",["$scope","$http","$location","$filter","CreateGameService","$routeParams",function(t,e,a,n,r,s){t.loading=!1,t.gameId=s.id,t.game=null,e.get("/game/"+t.gameId).then(function(e){t.game=new r(e.data)}),t.findUsers=function(a){var n={search:a,"exceptIds[]":t.game?t.game.getSelectedIds():[]};return e.get("/user/search",{params:n}).then(function(e){t.usersSearch=e.data})},t.update=function(){t.errors={},t.loading=!0,e.post("/game/"+t.game.id+"/update",t.game.getFormData()).error(function(e){t.loading=!1,t.errors=e}).then(function(){t.loading=!1,a.path("/")})}}]),app.factory("AuthUser",["$http",function(t){function e(t){return this.email=null,this.name=null,this.password=null,this.setData=function(t){angular.extend(this,t)},t&&this.setData(t),this}return e}]),app.controller("SignupCtrl",["$scope","$http","$location","$window","AuthUser",function(t,e,a,n,r){t.user=new r,t.errors=[],t.signup=function(a){e({url:"/signup",method:"POST",data:t.user}).success(function(){n.location.href="/"}).error(function(e){t.errors=[];for(var a in e)if(e.hasOwnProperty(a))for(var n=0;n<e[a].length;n++)t.errors.push(e[a][n])})}}]),app.controller("SigninCtrl",["$scope","$http","$location","$window","AuthUser",function(t,e,a,n,r){t.user=new r,t.errors=[],t.signin=function(a){e({url:"/signin",method:"POST",data:t.user}).success(function(t){n.location.href="/"}).error(function(e){t.errors=[];for(var a in e)if(e.hasOwnProperty(a))for(var n=0;n<e[a].length;n++)t.errors.push(e[a][n])})}}]);