<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamesUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('games_users', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('game_id');
            $table->unsignedInteger('user_id');
            $table->string('team_index');
            $table->integer('rating_before');
            $table->integer('rating_after');
            $table->timestamps();

            $table->foreign('game_id')
                ->references('id')->on('games')
                ->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('games_users');
    }
}
