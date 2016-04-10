@extends('layouts.master')

@section('title', 'Games')
@section('content')
    <div ng-app="kickerApp" ng-controller="GamesCtrl">
        <div class="row games-container" ng-repeat="game in games">
            <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1 col-sm-12 game-container">
                <div class="game-graphic">
                    <div class="team team-a">
                        <div class="team-user" ng-repeat="gameUser in game.games_users_a">
                            <div class="info">
                                <div class="name"><% gameUser.user.name %></div>
                                <div class="rating-delta <% gameUser.userPointsClass() %>">
                                    <% gameUser.getDelta() %> points
                                </div>
                                <div>
                                    <% gameUser.rating_before %>
                                    <i class="fa fa-long-arrow-right"></i>
                                    <% gameUser.rating_after %>
                                </div>
                            </div>
                            <div class="user-avatar">
                                <img ng-src="<% gameUser.user.avatarUrl() %>" />
                                <div class="stat">
                                    <span class="wins"><%
                                        gameUser.user.count_wins
                                    %></span>/<span class="loses"><%
                                        gameUser.user.count_looses
                                    %></span>/<span class="draws"><%
                                        gameUser.user.count_draws
                                    %></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="result-container">
                        <div class="versus">VS</div>
                        <div class="result">
                            <div class="point <% game.gamePointClass() %>"><% game.team_a_points %></div>
                            <div class="point">:</div>
                            <div class="point <% game.gamePointClass('b') %>"><% game.team_b_points %></div>
                        </div>
                    </div>
                    <div class="team team-b">
                        <div class="team-user" ng-repeat="gameUser in game.games_users_b">
                            <div class="user-avatar">
                                <img ng-src="<% gameUser.user.avatarUrl() %>" />
                                <div class="stat">
                                    <span class="wins"><%
                                        gameUser.user.count_wins
                                    %></span>/<span class="loses"><%
                                        gameUser.user.count_looses
                                    %></span>/<span class="draws"><%
                                        gameUser.user.count_draws
                                    %></span>
                                </div>
                            </div>
                            <div class="info">
                                <div class="name"><% gameUser.user.name %></div>
                                <div class="rating-delta <% gameUser.userPointsClass() %>">
                                    <% gameUser.getDelta() %> points
                                </div>
                                <div>
                                    <% gameUser.rating_before %>
                                    <i class="fa fa-long-arrow-right"></i>
                                    <% gameUser.rating_after %>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="game-information">
                    @if ($user)
                        <div class="controls">
                            @if($user->isAdmin())
                                <a href="#"
                                   class="btn btn-default btn-xs control-button"
                                   ng-href="/game/<% game.id %>/update"
                                ><i class="fa fa-pencil"></i></a>
                                <a href="#"
                                   ng-href="/game/<% game.id %>/delete"
                                   class="btn btn-danger btn-xs control-button"
                                ><i class="fa fa-ban"></i></a>
                            @else
                                <a href="#"
                                   ng-click="complain(game.id)"
                                   onclick="return false"
                                   class="btn btn-danger btn-xs control-button"
                                ><i class="fa fa-flag"></i></a>
                            @endif
                        </div>
                    @endif
                    <div>Played at: <% game.played_at %></div>
                    <div class="additional-info">
                        <div ng-if="game.complaints.length > 0" class="complaints">
                            complaints: <% game.complaints.length %>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop