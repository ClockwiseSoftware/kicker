<?php

use App\User;

class TestCase extends Illuminate\Foundation\Testing\TestCase
{

	protected $response;
	protected $response_json;
	protected $token = false;
	protected $user;

    /**
     * The base URL to use while testing the application.
     *
     * @var string
     */
    protected $baseUrl = 'http://localhost';

    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */
    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

        return $app;
    }

	public function __construct() {
		$this->baseUrl = getenv('APP_URL');
		parent::__construct();
    }

	/**
	 * Make request to API
	 * use saved token for auth request
	 * @param $method string
	 * @param $url string
	 * @param array $params string
	 * @param bool $auth
	 * @return mixed
	 */
	public function request($method, $url, $params = [], $auth = true) {

		$headers = [];

		if ($this->token && $auth) {
			$headers = array_merge(
				$headers,
				[
					'Authorization' => 'Bearer ' . $this->token
				]
			);

		}
		$response = $this->json(
			$method,
			$url,
			$params,
			$headers
		);

		return $response;
	}

	/**
	 * Make auth request, get token and save it
	 */
	public function auth() {
		if (empty($this->user)) {
			$password = str_random(10);
			$this->user = factory(User::class)->create(['password' => bcrypt($password)]);

			$this->token = JWTAuth::attempt([
				'email'    => $this->user->email,
				'password' => $password,
			]);
		}
		return $this->user;
	}

	/**
	 * Create few users
	 * @param $count integer
	 * @return mixed User[]
	 */
	public function create_users($count) {
		return factory(User::class, $count)->create();
	}
}
