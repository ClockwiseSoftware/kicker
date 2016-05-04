var app=angular.module("kickerApp",["ngRoute","ui.select","ngSanitize","ui.bootstrap","ngFileUpload","ngResource"]).config(["$httpProvider","$routeProvider",function(e,t){t.when("/signup",{templateUrl:"html/views/auth/signup.html",controller:"SignupCtrl"}).when("/signin",{templateUrl:"html/views/auth/signin.html",controller:"SigninCtrl"}).when("/",{templateUrl:"html/views/games/index.html"}).when("/game/create",{templateUrl:"html/views/games/create.html",controller:"CreateGameCtrl"}).when("/game/:id/update",{templateUrl:"html/views/games/update.html",controller:"UpdateGameCtrl"}).when("/game/:id/complainers",{templateUrl:"html/views/games/complainers.html",controller:"ComplainersCtrl"}).when("/admin/users",{templateUrl:"html/views/admin/users.html",controller:"UsersEditCtrl"}).when("/user/profile",{templateUrl:"html/views/user/profile.html",controller:"UserProfileCtrl"}).when("/chart",{templateUrl:"html/views/chart/index.html"}).when("/_=_",{templateUrl:"html/views/games/index.html"}),$(window).on("popstate",function(){$(".navbar-collapse").collapse("hide")}),$("body").on("click",".navbar-collapse li",function(){$(this).closest(".navbar-collapse").collapse("hide")})}]);Date.parseISO=function(e){var t=new Date(e);if(isNaN(t.getDate())){for(var n=e.split(" "),r=n[0].split("-"),a=n[1].split(":"),i=0;i<r.length;i++)r[i]=parseInt(r[i]);for(i=0;i<a.length;i++)a[i]=parseInt(a[i]);t=new Date(r[0],r[1]-1,r[2],a[0],a[1],a[2])}return t},function(e){e.directive("backImg",function(){return function(e,t,n){n.$observe("backImg",function(e){t.css({"background-image":"url("+e+")","background-size":"cover"})})}})}(angular.module("kickerApp")),function(e){e.directive("numberOnly",function(){return{require:"ngModel",link:function(e,t,n,r){r.$parsers.push(function(e){var t=parseInt(e),a=parseInt(n.min),i=parseInt(n.max),s=a;return s=t>i?i:t>=a?t:a,r.$setViewValue(s),r.$render(),s})}}})}(angular.module("kickerApp")),app.factory("User",["$http",function(e){function t(e){var t=this;return this.editing=!1,this.setData=function(e){angular.extend(this,e)},this.countGames=function(){return t.count_looses+t.count_wins+t.count_draws},this.avatarUrl=function(){return t.avatar_url?t.avatar_url:"/img/no-avatar.min.png"},this.getFormData=function(){var e={name:t.name,email:t.email};return t.password&&(e.password=t.password),e},e&&this.setData(e),this}return t}]),app.controller("ChartsCtrl",["$scope","$http","User",function(e,t,n){e.orderByField="index",e.reverseSort=!1,e.users=[],e.me=null,e.init=function(){e.loading=!0,t.get("/chart").success(function(t){angular.forEach(t,function(e,t){e.index=t+1;var r=new n(e);r.countGamesPlayed=r.countGames(),this.push(r)},e.users)})},t.get("/user/me").success(function(t){return t?void(e.me=new n(t)):!1}),e.init()}]),app.factory("GameUser",["$http","User",function(e,t){function n(e){var n=this;return this.setData=function(e){angular.extend(this,e),n.user=new t(n.user)},this.getDelta=function(){return n.rating_after-n.rating_before},this.userPointsClass=function(){return n.getDelta()>0?"win":"lose"},e&&this.setData(e),this}return n}]),app.factory("Game",["$http","$filter","$sce","GameUser","User",function(e,t,n,r,a){function i(e){var i=this;return this.complaintsHtml="",this.tooltipIsVisible=!1,this.loading=!1,this.setData=function(e){angular.extend(this,e);for(var s=0;s<i.games_users_a.length;s++)i.games_users_a[s]=new r(i.games_users_a[s]);for(s=0;s<i.games_users_b.length;s++)i.games_users_b[s]=new r(i.games_users_b[s]);for(s=0;s<i.complaints.length;s++)i.complaints[s].user=new a(i.complaints[s].user);i.played_at=function(e){return t("date")(e,"MM/dd/yyyy HH:mm")}(Date.parseISO(i.played_at)),i.complaintsHtml=function(e){var t=5,r="",a=e.length>t?t:e.length;if(e.length<=0)return null;for(var s=0;a>s;s++){var o=i.complaints[s].user;o&&(r+='<span class="complain-user"><img src="'+o.avatarUrl()+'" /></span>')}return r+='<div><a href="#/game/'+i.id+'/complainers" class="see-all-complainers">See all</a></div>',n.trustAsHtml(r)}(i.complaints)},this.gamePointClass=function(e){var t=i.team_a_points,n=i.team_b_points;return"b"===e&&(t=i.team_b_points,n=i.team_a_points),t>n?"win":n>t?"lose":"draw"},e&&this.setData(e),this}return i.prototype.MAX_POINTS=10,i.prototype.MIN_POINTS=0,i}]),app.factory("CreateGameService",["$http","$filter",function(e,t){function n(e){function n(e){return t("date")(e,"MM/dd/yyyy HH:mm")}var r=this;return this.id=null,this.users={a:[],b:[]},this.points={a:0,b:0},this.playedAt=n(new Date),this.teamIds=function(e){var t=this.users[e],n=[];return angular.forEach(t,function(e){this.push(e.id)},n),n},this.getSelectedIds=function(){return this.teamIds("a").concat(this.teamIds("b"))},this.exportUsers=function(e,t){var n=[];return angular.forEach(e["games_users_"+t],function(e){this.push(e.user)},n),n},this.setData=function(e){r.users={a:r.exportUsers(e,"a"),b:r.exportUsers(e,"b")},r.points={a:e.team_a_points,b:e.team_b_points},r.playedAt=n(Date.parseISO(e.played_at)),r.id=e.id},this.getFormData=function(){return{games_users_a:r.teamIds("a"),team_a_points:r.points.a,games_users_b:r.teamIds("b"),team_b_points:r.points.b,played_at:r.playedAt}},e&&this.setData(e),this}return n.prototype.MAX_POINTS=10,n.prototype.MIN_POINTS=0,n}]),app.factory("UserSearch",["$http",function(e){function t(){}return t.find=function(t,n){if(n.searchRequestPending||null===n.game)return!1;n.searchRequestPending=!0;var r=n.game.getSelectedIds(),a={};return t=t?t.trim():t,r.length>0&&(a["exceptIds[]"]=r),t&&(a.search=t),e.get("/user/search",{params:a}).then(function(e){0===e.data.length?n.usersSearch=[{name:"No results..."}]:n.usersSearch=e.data,n.searchRequestPending=!1})},t.remove=function(e,t){for(var n=0;n<t.usersSearch.length;n++)if(e.id===t.usersSearch[n].id){t.usersSearch.splice(n,1);break}},t.add=function(e,t){t.usersSearch.unshift(e)},t}]),function(e){e.factory("Player",["$resource",function(e){return e("user/me",{id:"@id"},{get:{method:"GET",isArray:!1},update:{method:"PUT",url:"user/:id"}})}])}(angular.module("kickerApp")),app.factory("GamesRepository",["$http","Game",function(e,t){function n(){this.storage=[],this.loading=!0,this.lastpage=0,this.currentpage=0;var n=this,r={};return this.add=function(e){angular.forEach(e,function(e){var n=new t(e);this.push(n),r[n.id]=this.length-1},n.storage)},this.get=function(e){var t=r[e];return n.storage.hasOwnProperty(t)?n.storage[t]:null},this.update=function(e,r){var a=n.get(e);return angular.copy(new t(r),a),a},this.load=function(t){n.loading=!0,e({url:"/",method:"GET",params:{page:n.currentpage+1}}).success(function(e){e.data.length>0&&(n.currentpage=e.current_page,n.lastpage=e.last_page,n.add(e.data)),n.loading=!1}),t&&t.call()},this}return n}]),app.controller("GamesCtrl",["$scope","$http","Game","GamesRepository",function(e,t,n,r){function a(){t({url:"/user/role",method:"GET"}).success(function(t){"guest"===t?e.user.isGuest=!0:"user"===t?e.user.isUser=!0:"admin"===t&&(e.user.isAdmin=!0)})}e.gamesRepository=new r,e.games=e.gamesRepository.storage,e.gamesRepository.load(),e.user={isGuest:!1,isUser:!1,isAdmin:!1},e.userRole=a(),e.complain=function(n){var r=e.gamesRepository.get(n);r.loading=!0,t.get("/game/"+n+"/complain").success(function(a){t.get("/game/"+n).success(function(t){r.loading=!1,e.gamesRepository.update(t.id,t)})})}}]),app.controller("CreateGameCtrl",["$scope","$http","$location","$filter","CreateGameService","UserSearch",function(e,t,n,r,a,i){e.loading=!1,e.game=new a,e.errors={},e.findUsers=function(t){i.find(t,e)},e.onSelectUser=function(t){i.remove(t,e)},e.onRemoveUser=function(t){i.add(t,e)},e.create=function(){e.errors={},e.loading=!0,t.post("/game/create",e.game.getFormData()).error(function(t){e.errors=t}).then(function(){e.loading=!1,n.path("/")},function(){e.loading=!1})};var s=$("#playedAt");s.datetimepicker({format:"MM/DD/YYYY HH:mm",maxDate:new Date}),s.on("dp.change",function(){e.game.playedAt=$(this).val()})}]),app.controller("UpdateGameCtrl",["$scope","$http","$location","$filter","$routeParams","CreateGameService","UserSearch",function(e,t,n,r,a,i,s){e.loading=!1,e.gameId=a.id,e.game=null,t.get("/game/"+e.gameId).then(function(t){e.game=new i(t.data),e.findUsers()}),e.findUsers=function(t){s.find(t,e)},e.onSelectUser=function(t){s.remove(t,e)},e.onRemoveUser=function(t){s.add(t,e)},e.update=function(){e.errors={},e.loading=!0,t.post("/game/"+e.game.id+"/update",e.game.getFormData()).error(function(t){e.loading=!1,e.errors=t}).then(function(){e.loading=!1,n.path("/")})};var o=$("#playedAt");o.datetimepicker({format:"MM/DD/YYYY HH:mm",maxDate:new Date}),o.on("dp.change",function(){e.game.playedAt=$(this).val()})}]),app.controller("ComplainersCtrl",["$scope","$http","$routeParams","Game",function(e,t,n,r){e.loading=!1,e.gameId=n.id,e.game=null,t.get("/game/"+e.gameId).then(function(t){e.game=new r(t.data)})}]),app.controller("UsersEditCtrl",["$scope","$http","Upload","User",function(e,t,n,r){function a(t,n){for(var r in e.users)if(e.users[r].id===t)return e.users[r]=n,!0;return!1}function i(t){e.errors[t.id]={}}e.users=[],e.inEditing={},e.errors={},e.uploadPic=function(t,r){t.upload=n.upload({url:"/user/"+r.id+"/avatar",method:"POST",data:{avatar:t}}).then(function(t){for(var n in e.users)if(e.users[n].id===r.id)return e.users[n].avatar_url=t.data.avatar_url,!0})["catch"](function(){})},e.init=function(){t({url:"/users",method:"GET"}).success(function(t){angular.forEach(t.data,function(e){this.push(new r(e))},e.users)})},e.edit=function(n){i(n),t({url:"/user/"+n.id,method:"PUT",data:n.getFormData()}).error(function(t){e.errors[n.id]=t}).success(function(t){e.commitEditing(n),a(n.id,new r(t))})},e.beginEditing=function(t){i(t),t.editing=!0,e.inEditing[t.id]=angular.copy(t)},e.rollbackEditing=function(t){return i(t),t=angular.copy(e.inEditing[t.id]),t.editing=!1,delete e.inEditing[t.id],t},e.commitEditing=function(t){return delete e.inEditing[t.id],t.editing=!1,t},e.init()}]),app.controller("UserProfileCtrl",["$scope","$http","Upload","Player",function(e,t,n,r){e.player=null,e.errors={},e.loading=!0,r.get().$promise.then(function(t){e.loading=!1,e.player=t}),e.saveChanges=function(t){e.errors={},e.loading=!0,r.update({id:e.player.id},t).$promise.then(function(t){e.loading=!1})["catch"](function(t){e.loading=!1,e.errors=t.data})}}]),app.factory("AuthUser",["$http",function(e){function t(e){return this.email=null,this.name=null,this.password=null,this.setData=function(e){angular.extend(this,e)},e&&this.setData(e),this}return t}]),app.controller("SignupCtrl",["$scope","$http","$location","$window","AuthUser",function(e,t,n,r,a){e.user=new a,e.errors=[],e.signup=function(n){t({url:"/signup",method:"POST",data:e.user}).success(function(){r.location.href="/"}).error(function(t){e.errors=[];for(var n in t)if(t.hasOwnProperty(n))for(var r=0;r<t[n].length;r++)e.errors.push(t[n][r])})}}]),app.controller("SigninCtrl",["$scope","$http","$location","$window","AuthUser",function(e,t,n,r,a){e.user=new a,e.errors=[],e.signin=function(n){t({url:"/signin",method:"POST",data:e.user}).success(function(e){r.location.href="/"}).error(function(t){e.errors=[];for(var n in t)if(t.hasOwnProperty(n))for(var r=0;r<t[n].length;r++)e.errors.push(t[n][r])})}}]);