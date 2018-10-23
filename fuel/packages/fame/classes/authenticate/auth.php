<?php

namespace Fame\Auth;

use Fame\Exception;
use Fame\Utils;
use Fuel\Core\Arr;
use Fuel\Core\Input;
use Fuel\Core\Session;
use Fuel\Core\Str;

/**
 * Class Auth
 * Auth wrapper for the fuel auth wrapper
 *
 * @package Fame
 */
class Auth {

    /**
     * Uses multiple instances for respective users.
     *
     * @var array
     */
    public static $instances = [];
    public $user_instance;
    protected $auth_instance;
    public $user;
    public $profile_fields;

    /**
     * The current logged in user.
     *
     * @var bool|null
     */
    public $user_id = null;


    /**
     * use the Fuel's auth system
     */
    const auth_method_auth = 'AUTH';

    /**
     * use token based auth system
     * for mobile's using jsonp
     */
    const auth_method_token = 'TOKEN';
    private static $login_method = null;

    /**
     * Login method should be set first to use this class.
     *
     * @param $method
     *
     * @throws \Fame\Exception\AppException
     */
    public static function setAuthMethod($method) {
        if (!is_null(self::$login_method)) {
            throw new Exception\AppException('Login method has already been set' . self::$login_method);
        }

        switch ($method) {
            case self::auth_method_auth:
            case self::auth_method_token:
                self::$login_method = $method;
                break;
            default:
                throw new Exception\AppException('Invalid Auth method ' . $method);
        }
    }

    /**
     * IF user's id is not passed, the current logged-in user instance will be created.
     * what if you want to create a instance without a user? set $user_id as 0
     *
     * @param bool $user_id
     *
     * @return \Fame\Auth\Auth
     * @throws Exception\AppException
     */
    public static function instance($user_id = false) {
        $user_id = is_null($user_id) ? self::logged_in_user_id() : $user_id;
        if (!isset(static::$instances[$user_id])) {
            static::$instances[$user_id] = new static($user_id);
        }

        return static::$instances[$user_id];
    }

    /**
     * Auth constructor.
     *
     * @param $user_id
     *
     * @throws Exception\AppException
     */
    protected function __construct($user_id) {
        if (is_null(self::$login_method)) {
            throw new Exception\AppException('Please set Auth method before calling the class.');
        }

        $this->auth_instance = \Auth\Auth::instance();
        $this->user_instance = Users::instance();
        $this->user_id = (is_null($user_id) or !$user_id) ? $this->logged_in_user_id() : $user_id;

        if (!$this->user_id) {
            $this->user = false;
            $this->profile_fields = false;
            $this->user_id = false;
        }
        else {
            $user = $this->user_instance->get([
                'id' => $this->user_id,
            ]);
            $user = $this->user_instance->parse($user);
            $this->user = ($user) ? $user[0] : null;
            if ($this->user)
                $this->profile_fields = $this->user['profile_fields'];
        }
    }

    /**
     * Tells if the current set user is of group
     *
     * @param $group_id
     *
     * @return bool
     */
    public function member($group_id) {
        return ($this->user['group'] == $group_id);
    }

    public function get_one($where = [], $select = null) {
        $a = $this->get($where, $select);

        return (count($a)) ? $a[0] : false;
    }

    /**
     * Alias for
     * Users::instance()->get
     *
     * @param array $where
     * @param null  $select
     * @param bool  $limit
     * @param int   $offset
     *
     * @return bool
     */
    public function get($where = [], $select = null, $limit = false, $offset = 0) {
        return $this->user_instance->get($where, $select, $limit, $offset);
    }

    public function get_session_id() {
        return Session::key('session_id');
    }

    /**
     * Helper method.
     * Get a user by its ID, if id is not given, returns the USER for which the instance was created.
     *
     * @param null $id
     *
     * @return null
     */
    public function get_user($id = null) {
        if (is_null($id)) {
            return $this->user;
        }
        else {
            list($user) = $this->user_instance->get([
                'id' => $id,
            ]);

            return $user;
        }
    }

    /**
     * @return bool
     * @throws Exception\AppException
     */
    public static function logged_in_user_id() {
        $user_id = false;

        if (self::$login_method == self::auth_method_token) {
            $token = Input::param('token', false);
            if (!$token)
                $token = Input::json('token', false);

            $parts = explode('-', $token);
            if (count($parts) != 2)
                return false;

            list($t_user_id, $token_inner) = $parts;

            $user = Users::instance()
                ->get_one([
                    'id' => $t_user_id,
                ], [
                    'profile_fields',
                ]);

            if ($user) {
                $app_token = unserialize($user['profile_fields']);
                $app_token = Arr::get($app_token, 'app_token', false);

                /**
                 * As discused in the log in method to store the crypt version of token in the token string.
                 * later to be decrypt to find if the token is being used in the same browser or not
                 *
                 * OK, if the client uses CORS,
                 * withCredentials should be true,
                 * he has to send cookies.
                 */

                if ($token_inner != md5(Session::key())) {
                    return false;
                }

                if ($app_token == $token) {
                    return $t_user_id;
                }
            }
        }
        elseif (self::$login_method == self::auth_method_auth) {
            $user_id = \Auth\Auth::instance()
                ->get('id');
        }
        else {
            throw new Exception\AppException('Auth method is not set');
        }

        return $user_id;
    }

    /**
     * Set profile attributes to the current set user.
     *
     * @param $attributes
     *
     * @return bool|int
     */
    public function set_profile_fields($attributes) {
        if (!$this->user_id)
            return false;
        $this->profile_fields = array_merge($this->profile_fields, $attributes);

        return $this->user_instance->set_profile_fields($this->user_id, $this->profile_fields, true);
    }

    /**
     * get profile attribute value for a give attribute for the set user.
     *
     * @param      $attribute
     * @param bool $default
     *
     * @return bool
     */
    public function get_profile_fields($attribute, $default = false) {
        return (isset($this->profile_fields[$attribute])) ? $this->profile_fields[$attribute] : $default;
    }

    /**
     * Sets property for a user, which is "column" in the database.
     *
     * @param $set
     *
     * @return bool|int
     */
    public function set_property($set) {
        if (!$this->user_id)
            return false;
        $this->user = array_merge($this->user, $set);

        return $this->user_instance->set_property($this->user_id, $set);
    }

    /**
     * Get property value of the current logged in user.
     *
     * @param $property_name
     *
     * @return bool
     * @throws \Exception
     */
    public function get_property($property_name) {
        if (!$this->user_id)
            throw new Exception\AppException('User id was not set');

        return (isset($this->user[$property_name])) ? $this->user[$property_name] : false;
    }

    /**
     * Set password for the current set user.
     *
     * @param $password
     *
     * @throws Exception\UserException
     */
    public function set_password($password) {
        if (!$this->user_id)
            throw new Exception\UserException('User id was not set');

        $this->user_instance->set_password([
            'id' => $this->user_id,
        ], $password);
    }

    /**
     * Validates if the username,mobile,email are matched by the provided password.
     * returns the user if its validated.
     *
     * @param $username_mobile_email
     * @param $password
     *
     * @return bool
     */
    public function validate($username_mobile_email, $password) {
        $user_table = $this->user_instance->usersTable;
        $pass_hash = $this->user_instance->hash_password($password);
        $user = \DB::query("
            select *
            from $user_table as users
            where 
            (users.mobile = '$username_mobile_email'
            or users.username = '$username_mobile_email'
            or users.email = '$username_mobile_email')
            and users.password = '$pass_hash'
        ")
            ->execute($this->user_instance->db)
            ->as_array();

        return count($user) ? $user[0] : false;
    }

    /**
     * on successful login returns array [user_id, user, session_id]
     *
     * @param $username_mobile_email
     * @param $password
     *
     * @return array [$user, $token]
     * @throws Exception\AppException
     * @throws Exception\UserException
     */
    public function login($username_mobile_email, $password) {
        if ($user = $this->validate($username_mobile_email, $password)) {
            $token = false;

            if ($user['account_active'] == 0)
                throw new Exception\UserException('Your account is not active. please contact support for more information.');

            if (self::$login_method == self::auth_method_auth) {
                $af = $this->auth_instance->login($user['username'], $password);
            }
            else {

                /**
                 * OK, currently we are authenticating the user with the below token
                 * that can be moved from one browser to another.
                 * the hacker can simply get access to the users token and get access to his account
                 * SOLUTION;
                 * the framework assigns a unique session ID to each browser.
                 * generate the token from the session ID.
                 */

                /**
                 * PROBLEM: If the client is not a browser and is a mobile device, and cookies is not stored
                 * the session key will change for each request.
                 * Make sure that the session id is the same! or the user wont be able to login
                 *
                 * UPDATE: session key is not a valid solution it changes every time!
                 * UPDATE2: session key changed because cookies was not sent by the client
                 * if the client uses cors, withCredentials should be true, then only it will send the cookies.
                 */
                $session_id = Session::key();
                // decrypt this, and u should get the session id, if it matches the user is logged in.
                // UPDATE: actually md5 the session id. encoding it will give - in the string,
                $tokenStr = md5($session_id);

                // $tokenStr = Str::random();
                $token = $user['id'] . '-' . $tokenStr;
                Auth::instance($user['id'])
                    ->set_profile_fields([
                        'app_token' => $token,
                    ]);
                Auth::instance($user['id'])
                    ->set_property([
                        'last_login' => Utils::timeNow(),
                    ]);
            }

            return [
                $this->get_one([
                    'id' => $user['id'],
                ]),
                $token,
            ];
        }
        else {
            throw new Exception\UserException('The mobile/e-mail password did not match, please try again.');
        }
    }

    /**
     * on successful login returns array [user, session_id|token]
     *
     * @param null $user_id
     *
     * @return array
     * @throws \Exception
     */
    public function force_login($user_id = null) {
        if (is_null($user_id))
            $user_id = $this->user_id;

        if (!$user_id)
            throw new Exception\AppException('No user to login!');

        if (self::$login_method == self::auth_method_token) {
            $token = $user_id . '-' . Str::random();
            Auth::instance($user_id)
                ->set_profile_fields([
                    'app_token' => $token,
                ]);
            Auth::instance($user_id)
                ->set_property([
                    'last_login' => Utils::timeNow(),
                ]);

            return [
                $this->get_one([
                    'id' => $user_id,
                ]),
                $token,
            ];
        }
        else {
            $this->auth_instance->force_login($user_id);

            return [
                $this->get_one([
                    'id' => $user_id,
                ]),
                false,
            ];
        }
    }

    /**
     * Logout the current logged in user
     *
     * @return bool
     * @throws \Exception
     */
    public function logout() {
        if (!$this->user_id) {
            return false;
        }
        if (self::$login_method == self::auth_method_token) {
            $this->set_profile_fields([
                'app_token' => null,
            ]);
        }
        elseif (self::$login_method == self::auth_method_auth) {
            \Auth::instance()
                ->logout();
        }

        return true;
    }
}