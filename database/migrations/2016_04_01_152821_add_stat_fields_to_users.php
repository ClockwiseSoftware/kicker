<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddStatFieldsToUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->addColumn('integer', 'count_wins')->nullable()->default(0);
            $table->addColumn('integer', 'count_draws')->nullable()->default(0);
            $table->addColumn('integer', 'count_looses')->nullable()->default(0);
            $table->addColumn('integer', 'rating')->nullable()->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'count_wins', 'count_draws', 'count_looses',
                'rating'
            ]);
        });
    }
}