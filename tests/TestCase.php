<?php

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
	 * Make request
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
}
