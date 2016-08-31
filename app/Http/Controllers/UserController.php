<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Validator;
use Input;
use Image;

class UserController extends Controller
{
    /**
     * @return array
     */
    protected function validationRules($user)
    {
        return [
            'name' => 'filled|max:255',
            'email' => 'filled|email|max:255|unique:users,email,' . $user->id,
            'password' => 'filled|min:1',
            'oldPassword' => 'filled|old_password:' . $user->password,
        ];
    }

    public function search(Request $request)
    {
        $search = $request->get('search');
        $exceptIds = $request->get('exceptIds');

        $query = User::active();

        if ($search) {
            $query = $query->where(function ($query) use ($search) {
                $query = $query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");

                return $query;
            });
        } else {
            $query = $query->orderBy('rating', 'desc');
        }

        if ($exceptIds)
            $query = $query->whereNotIn('id', $exceptIds);

        $users = $query->get();

        return response()
                    ->json($users);
    }

    public function role(Request $request)
    {
        $user = $request->user();
        $role = User::ROLE_GUEST;

        if ($user) {
            $role = $user->isAdmin() ? User::ROLE_ADMIN : User::ROLE_USER;
        }

        return response()->json($role);
    }

    public function one(Request $request)
    {
        $user = User::findMe();

        if ($request->wantsJson()) {
            return response()->json($user);
        }
    }

    public function index(Request $request)
    {
        $users = User::active()->paginate(1000);

        if ($request->wantsJson()) {
            return response()->json($users);
        }
    }

    public function delete(Request $request, $id)
    {
        $user = User::findMe();

        if (!$user) {
	        return response ('User not found',404);
        }

	    if (!$this->canEdit($user, $request)) {
		    return response('Unauthorized', 401);
	    }

        if (!$user->softDelete()) {
	        return response ('User can not be deleted',500);
        }

        return response([]);
    }

    public function restore(Request $request, $id)
    {
        $user = $request->user();
        $user->deleted = false;

        if (!$user->save()) {
	        return response('User can not be restored',500);
        }

        return response($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::where('id', $id)->first();

        if (!$user) {
	        return response('User not found', 404);
        }

	    if (!$this->canEdit($user, $request)) {
	    	return response('Unauthorized', 401);
	    }

        $this->validate($request, $this->validationRules($user));
        $user->fill($request->all());

        if ($request->has('password')) {
            $user->setPassword($request->input('password'));
        }

        $user->save();

        if ($request->wantsJson()) {
            return response()
                        ->json($user);
        }
    }

    public function updateAvatar(Request $request, $id)
    {
        $user = User::where('id', $id)->firstOrFail();

	    if (!$this->canEdit($user, $request)) {
		    return response('Unauthorized', 401);
	    }

        $avatar = $request->file('avatar');
        $rules = [
            'avatar' => 'required|mimes:jpeg,bmp,png'
        ];
        $validator = Validator::make(['avatar' => $avatar], $rules);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response($errors, 402);
        }

        $user->deleteAvatar();

        $destinationPath = public_path() . "/uploads";
        $fileName = $user->id . '.' . $avatar->getClientOriginalExtension();
        Image::make($avatar->getRealPath())
            ->fit(120, 120)
            ->save($avatar->getRealPath());

        if (!$avatar->move($destinationPath, $fileName)) {
            return response([
                'avatar' => ['Error saving the file.']
            ], 500);
        }

        $user->setAvatar($fileName);
        $user->save();

        return response([
            'avatar' => $user->avatar_url
        ]);
    }

    protected function canEdit(User $user, Request $request) {
		return ($request->user()->id == $user->id or $request->user()->isAdmin());
    }
}
