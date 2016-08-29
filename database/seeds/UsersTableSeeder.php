<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
	    Model::unguard();

	    DB::table('users')->insert([
		    'name' => 'Admin',
		    'email' => 'admin@admin.com',
		    'password' => bcrypt('admin'),
		    'is_admin' => 1
	    ]);

	    Model::reguard();
    }
}
