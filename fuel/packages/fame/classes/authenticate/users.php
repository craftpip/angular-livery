<?php

namespace Fame\Auth;

use Auth\Auth as Fuel_Auth;
use Fame\Exception;
use Fame\Exception\UserException;
use Fame\Utils;
use Fuel\Core\Validation;

/**
 * Class Users
 * A new version of the Auth class
 *
 * @package Vana
 */
class Users {
    public $usersTable = 'users';
    public $db = 'default';

    public static $superadmin = 100;
    public static $sales = 91;
    public static $manager = 90;
    public static $accountHandler = 80;
    public static $customer = 1;

    public $groups = [
        100 => 'Admin',
        91  => 'Sales',
        90  => 'Manager',
        80  => 'Account handler',
        1   => 'Customer',
    ];

    public static $instance;

    /**
     * @return Users
     */
    public static function instance() {
        if (null === static::$instance) {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function group_name($group_id) {
        return isset($this->groups[$group_id]) ? $this->groups[$group_id] : false;
    }

    /**
     * @param $data
     * Parsing out lineage users will be a huge task, that is why this fucntion is to only be used when explicitly required.
     *
     * @return array|mixed
     */
    public function parseLineage($data) {
        $single = false;
        if (isset($data['id'])) {
            $data = [$data];
            $single = true;
        }

        foreach ($data as $k => $a) {
            if (isset($a['lineage'])) {
                $data[$k]['lineage_names'] = [];
                foreach ($data[$k]['lineage'] as $c => $d) {
                    $user = $this->get(['id' => $d,], ['username',], 1, 0, false);
                    if ($user) {
                        $data[$k]['lineage_names'][] = $user[0]['username'];
                    }
                }
            }
        }

        return $single ? $data[0] : $data;
    }

    public function parse($data) {
        $single = false;
        if (isset($data['id'])) {
            $data = [$data];
            $single = true;
        }

        foreach ($data as $k => $a) {

            if (isset($a['lineage'])) {
                $data[$k]['lineage'] = Utils::_explodeAr($a['lineage']);
            }

            if (isset($a['password']))
                unset($data[$k]['password']);

            if (isset($a['profile_fields']) and gettype($a['profile_fields']) == 'string') {
                $data[$k]['profile_fields'] = unserialize($a['profile_fields']);

                if (isset($data[$k]['profile_fields']['app_token']))
                    unset($data[$k]['profile_fields']['app_token']);
            }
        }

        return $single ? $data[0] : $data;
    }

    public function get_one($where = [], $select = null) {
        $a = $this->get($where, $select);

        return ($a) ? $a[0] : false;
    }

    /**
     * get user data
     *
     * @param array      $where
     * @param array|null $select
     * default ['*']
     * @param bool|false $limit
     * @param int        $offset
     * @param bool|true  $count_total
     * if true get wallet balance & coin balance as 'w_balance' for wallet & 'c_balance' for coin
     *
     * @return bool
     */
    public function get($where = [], $select = [], $limit = false, $offset = 0, $count_total = true) {
        $user_table = $this->usersTable;

        if (empty($select) or is_null($select) or gettype($select) != 'array') {
            $select = ['*'];
        }

        $selectParse = [];
        foreach ($select as $item) {
            $selectParse[] = 'users.' . $item;
        }

        $query = \DB::select_array($selectParse)
            ->from(\DB::expr($user_table . ' as users'));

        $whereParsed = [];
        foreach ($where as $k => $item) {
            if (gettype($item) == 'array' and count($item) == 3) {
                $item[0] = 'users.' . $item[0];
                $whereParsed[] = $item;
            }
            else {
                $whereParsed['users.' . $k] = $item;
            }
        }

        if (count($whereParsed)) {
            foreach ($whereParsed as $k => $item) {
                $k = (string)$k;

                if ($k == 'users.id' && gettype($item) == 'array') { // OR clause
                    $query->and_where_open();
                    foreach ($item as $k2 => $item2) {
                        $query->or_where($k, $item2);
                    }
                    $query->where_close();

                    unset($whereParsed[$k]);
                }
                elseif (gettype($item) == 'string' and $this->has_like_query($item)) {
                    $query->and_where($k, 'like', $item);

                    unset($whereParsed[$k]);
                }
            }
            $query->and_where($whereParsed);
        }

        if ($limit) {
            $query->limit($limit);
            if ($offset) {
                $query->offset($offset);
            }
        }

        $query->order_by('users.id', 'DESC');

        $compile_query = $query->compile($this->db);

        //insert the row count query
        $compile_query = Utils::sqlCalcRowInsert($compile_query);

        $results = \DB::query($compile_query)
            ->execute($this->db)
            ->as_array();

        return count($results) ? $results : false;
    }

    private function has_like_query($query) {
        return preg_match('/%/', $query);
    }

    /**
     * Get the children under this user.
     *
     * @param       $user_id
     * @param array $where
     * @param null  $select
     * @param bool  $limit
     * @param int   $offset
     * @param bool  $count
     *
     * @return array|bool -> array list of children under the user.
     */
    public function get_children($user_id, $where = [], $select = null, $limit = false, $offset = 0, $count = true) {
        $current_user = $this->get(['id' => $user_id,], ['lineage',]);
        if (!$current_user)
            return false;

        $current_user = $current_user[0];
        $lineage = Utils::createLineageToFindChildren($current_user['lineage'], $user_id);

        $where['lineage'] = $lineage;

        return $this->get($where, $select, $limit, $offset, $count);
    }

    /**
     * Get parents above a user. This will return an array list of users above the current user_id.
     * You can add where group to trim the results.
     *
     * @param       $user_id
     * @param array $where
     * @param null  $select
     * @param bool  $limit
     * @param int   $offset
     * @param bool  $count
     *
     * @return array|bool -> this returns an array of parents.
     */
    public function get_parents($user_id, $where = [], $select = null, $limit = false, $offset = 0, $count = true) {
        $current_user = $this->get(['id' => $user_id,], ['lineage',]);
        if (!$current_user)
            return false;

        $current_user = $current_user[0];
        $lineage = Utils::_explodeAr($current_user['lineage']);

        $where['id'] = [];
        $where['id'] = $lineage;

        return $this->get($where, $select, $limit, $offset, $count);
    }

    /**
     * Set profile fields at once.
     *
     * @param      $user_id
     * @param      $profile_fields
     * @param bool $overwrite
     *
     * @return int
     */
    public function set_profile_fields($user_id, Array $profile_fields, $overwrite = false) {
        if (!$overwrite) {
            $fields = $this->get(['id' => $user_id,], ['profile_fields',]);
            $fields = $this->parse($fields);
            $fields = $fields[0]['profile_fields'];
            $profile_fields = array_merge($fields, $profile_fields);
        }

        return $this->update_user(['id' => $user_id], [], $profile_fields);
    }

    public function set_property($user_id, $set) {
        return $this->update_user(['id' => $user_id], $set);
    }

    /**
     * Set users password.
     *
     * @param array  $where
     * @param string $password
     *
     * @return int
     */
    public function set_password($where, $password) {
        $hash = $this->hash_password($password);

        return $this->update_user($where, ['password' => $hash,]);
    }

    public function hash_password($a) {
        return Fuel_Auth::instance()
            ->hash_password($a);
    }

    /**
     * Creates a user.
     *
     * @param      $username
     * @param      $email
     * @param      $mobile
     * @param      $password
     * @param      $group
     * @param      $properties
     * @param      $country
     * @param      $profile_fields
     * @param null $parent_id
     *
     * @return int
     * @throws UserException
     */
    public function create_user($username = null, $email, $mobile, $password, $group, $properties, $country, $profile_fields, $parent_id = null) {
        $insert = [];

        $username = trim($username);

        $email = trim($email);
        if (!is_null($mobile))
            $mobile = trim($mobile);

        $validation = Validation::instance();
        $validation->add_field('email', 'Email', 'required|trim|valid_email');
        $validation_data = [
            'email' => $email,
        ];

        $success = $validation->run($validation_data);
        if (!$success) {
            throw new UserException('The entered email is invalid');
        }

        if (isset($mobile)) {
            //            if (substr($mobile, 0, 1) != '+')
            //                throw new UserException('The mobile should contain the international format, country code is required');

            //            if (substr($mobile, 0, 3) == '+91' and strlen($mobile) != 13)
            //                throw new UserException('The mobile number is invalid for the indian country code');

            if (strlen($mobile) < 8)
                throw new UserException('Invalid mobile number, please enter valid number');
        }

        $username_exists = $this->get(['username' => $username,]);
        if ($username_exists)
            throw new Exception\UserException("The username $username has already been taken.");

        $email_exists = $this->get(['email' => $email,]);
        if ($email_exists)
            throw new Exception\UserException("The e-mail id $email is already registered with us.");

        if (!is_null($mobile)) {
            $mobile_exists = $this->get(['mobile' => $mobile,]);
            if ($mobile_exists)
                throw new Exception\UserException("The mobile $mobile is already registered with us.");
        }

        $insert['username'] = $username;
        $insert['email'] = $email;
        $insert['country'] = $country;
        $insert['mobile'] = $mobile;
        $insert['group'] = $group;
        $insert['password'] = Fuel_Auth::instance()
            ->hash_password($password);

        if (!is_null($parent_id)) {
            $parent = $this->get(['id' => $parent_id,], [
                'id',
                'lineage',
            ]);
            if (!$parent)
                throw new Exception\UserException('Sorry, the parent user does not exist');

            $lineage = Utils::_explodeAr($parent[0]['lineage']);
            $lineage[] = $parent[0]['id'];
            $insert['lineage'] = Utils::_implodeAr($lineage);
            $insert['parent_id'] = $parent_id;
        }

        if (isset($properties['mobile_verified']))
            $insert['mobile_verified'] = $properties['mobile_verified'];

        if (isset($properties['email_verified']))
            $insert['email_verified'] = $properties['email_verified'];

        if (isset($properties['account_active']))
            $insert['account_active'] = $properties['account_active'];

        if (isset($properties['company_name']))
            $insert['company_name'] = $properties['company_name'];

        if (isset($properties['first_setup']))
            $insert['first_setup'] = $properties['first_setup'];

        if (isset($properties['currency']))
            $insert['currency'] = $properties['currency'];

        $insert['created_at'] = Utils::timeNow();
        $properties['account_active'] = isset($properties['account_active']) ? $properties['account_active'] : 0;
        $insert['profile_fields'] = serialize($profile_fields);

        return $this->insert($insert);
    }

    /**
     * Update a user.
     * Please do not update password using this method.
     *
     * @param      $where
     * @param      $properties
     * @param      $attributes
     * @param null $parent_id
     *
     * @return int
     * @throws \Exception
     */
    public function update_user($where, $properties = [], $attributes = [], $parent_id = null) {

        //        if (isset($properties['username'])) throw new Exception\UserException('Updating username is not allowed.');

        $validation = Validation::instance();
        $validation_properties = [];

        if (isset($properties['email'])) {
            $validation_properties['email'] = $properties['email'];
            $validation->add_field('email', 'Email', 'required|trim|valid_email');
        }

        if (isset($properties['mobile'])) {
            if (isset($properties['mobile'])) {
                if (strlen($properties['mobile']) < 8)
                    throw new UserException('Invalid mobile number, please enter a valid number');
            }
        }

        if (count($validation_properties)) {
            $success = $validation->run($validation_properties);
            if (!$success)
                throw new Exception\UserException('The email is invalid');
        }

        if (isset($properties['email'])) {
            $email_exists = $this->get(['email' => $properties['email']]);
            if ($email_exists and isset($where['id']) and $email_exists[0]['id'] != $where['id'])
                throw new Exception\UserException("The e-mail id {$properties['email']} is already registered with us.");
        }

        if (isset($properties['mobile'])) {
            $mobile_exists = $this->get(['mobile' => $properties['mobile'],]);
            if ($mobile_exists and isset($where['id']) and $mobile_exists[0]['id'] != $where['id'])
                throw new Exception\UserException("The mobile {$properties['mobile']} is already registered with us.");
        }

        if (!is_null($parent_id)) {
            $parent = $this->get(['id' => $parent_id,], [
                'id',
                'lineage',
            ]);
            if (!$parent)
                throw new Exception\UserException('Sorry, the parent contact does not exist');

            $lineage = Utils::_explodeAr($parent[0]['lineage']);
            $lineage[] = $parent[0]['id'];
            $properties['lineage'] = Utils::_implodeAr($lineage);
            $properties['parent_id'] = $parent_id;
        }

        $properties['updated_at'] = Utils::timeNow();

        //        if (isset($properties['password']))
        //            $properties['password'] = $this->hash_password($properties['password']);

        // merge attributes with the old attributes.
        $user = $this->get($where, ['profile_fields']);
        if (!$user)
            throw new Exception\UserException("The user does not exists.");

        $profile_fields = unserialize($user[0]['profile_fields']);
        $profile_fields = array_merge($profile_fields, $attributes);

        $properties['profile_fields'] = $profile_fields;

        return $this->update($where, $properties);
    }

    /**
     * @param array $where
     *
     * @return int
     */
    public function remove($where) {
        return \DB::delete($this->usersTable)
            ->where($where)
            ->execute();
    }

    private function insert($set) {
        if (!\Str::is_serialized($set['profile_fields']))
            $set['profile_fields'] = serialize($set['profile_fields']);
        list($id) = \DB::insert($this->usersTable)
            ->set($set)
            ->execute($this->db);

        return $id;
    }

    /**
     * Update user table.
     *
     * @param $where
     * @param $fields
     *
     * @return int
     */
    private function update($where, $fields) {
        if (isset($fields['profile_fields']) && !\Str::is_serialized($fields['profile_fields']))
            $fields['profile_fields'] = serialize($fields['profile_fields']);

        return \DB::update($this->usersTable)
            ->set($fields)
            ->where($where)
            ->execute($this->db);
    }
}