<?php

namespace App\Http\Requests\GameRequests;

use App\Http\Requests\Request;

class DeleteGameRequest extends Request
{
    /**
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->isAdmin();
    }

    /**
     * @return array
     */
    public function rules()
    {
        return [ 'id' => 'required|int|exists:games,id' ];
    }

    /**
     * @return array
     */
    public function all()
    {
        $all = parent::all();
        return array_replace_recursive($all, $this->route()->parameters());
    }

    public function get($key, $default = null)
    {
        if ($this !== $result = $this->attributes->get($key, $this)) {
            return $result;
        }

        if ($this !== $result = $this->query->get($key, $this)) {
            return $result;
        }

        if ($this !== $result = $this->request->get($key, $this)) {
            return $result;
        }

        $params = $this->route()->parameters();
        if (array_has($params, $key)) {
            return $params[$key];
        }

        return $default;
    }
}
