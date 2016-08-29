<?php

use App\User;

class TestCase extends Illuminate\Foundation\Testing\TestCase
{

	protected $response;
	protected $response_json;
	protected $token = false;

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
	 * @return mixed
	 */
	public function request($method, $url, $params = []) {

		$headers =
			[
				'Accept' => 'application/json'
			];

		if ($this->token) {
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

		$this->response_json = $response->decodeResponseJson();

		return $this->response;
	}

	/**
	 * Make auth request, get token and save it
	 */
	public function auth() {
		$this->request(
			'POST',
			'/api/auth',
			[
				'email'    => 'admin@admin.com',
				'password' => 'admin'
			]
		);

		$this->token = $this->response_json['token'];

	}

	/**
	 * Create few users
	 * @param $count integer
	 * @return mixed Users[]
	 */
	public function create_users($count) {
		return factory(User::class, $count)->create();
	}
}
