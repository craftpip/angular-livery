<?php

use Fuel\Core\Input;

class Controller_Api_Authenticate extends \Fuel\Core\Controller_Rest {

    public $user_id = false;

    /**
     * @var \Fame\Auth\Auth
     */
    public $auth_instance = false;

    public function before() {
        parent::before();

        if (Input::method() == 'OPTIONS') {
            // Say yes! when its options for preflight check
            echo \Fuel\Core\Response::forge('', 200);
            die;
        }

        \Fame\Auth\Auth::setAuthMethod(\Fame\Auth\Auth::auth_method_token);

        try {
            $user_id = \Fame\Auth\Auth::logged_in_user_id();
            if (!$user_id)
                throw new \Fame\Exception\UserException('Your login was expired');

            $this->user_id = $user_id;

        } catch (Exception $e) {
            echo json_encode([
                'status' => false,
                'reason' => 'Your login has expired',
            ]);
            die;
        }

        $this->auth_instance = \Fame\Auth\Auth::instance();

        $this->format = 'json';
    }

}

