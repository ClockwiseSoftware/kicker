<?php

namespace App\Console\Commands;

use App\Models\Game;
use App\Models\GameProcessor;
use App\User;
use Illuminate\Console\Command;

class FlushTestData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'flush:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Flushes test data';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $games = Game::limit(1000000000000)->get();
        foreach ($games as $game) {
            $game->delete();
        }

        $users = User::whereNull('facebook_id')->get();
        foreach ($users as $user) {
            $user->delete();
        }

        $users = User::limit(1000000000000)->get();
        foreach ($users as $user) {
            $user->rating = $user->defaults['rating'];
            $user->count_wins = $user->defaults['count_wins'];
            $user->count_draws = $user->defaults['count_draws'];
            $user->count_looses = $user->defaults['count_looses'];

            $user->save();
        }

        $this->comment(PHP_EOL . 'Test data has been flushed!' . PHP_EOL);
    }
}
