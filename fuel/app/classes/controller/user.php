<?php

use Fuel\Core\Controller;

class Controller_User extends Controller {

    public function get_verify_account($unique_token) {
        $store = \Fame\Store::get_one([
            'key'    => $unique_token,
            'value2' => 'verify-account',
        ], null, true);

        $expired = true;
        if ($store) {
            $expired = false;
            $email = $store['value'];

            \Fame\Auth\Users::instance()
                ->update_user([
                    'email' => $email,
                ], [
                    'email_verified' => 1,
                ]);

            \Fame\Store::remove([
                'store_id' => $store['store_id'],
            ]);
        }

        echo \Fuel\Core\View::forge('single/verify_account_confirm', [
            'expired' => $expired,
        ]);
    }

    /**
     * Password reset page.
     *
     * @param $unique_string
     */
    public function get_reset_password($unique_string) {
        $store = \Fame\Store::get_one([
            'key'    => $unique_string,
            'value2' => 'password-reset-email',
        ], null, true);

        $expired = false;
        if (!$store) {
            $expired = true;
        }

        echo \Fuel\Core\View::forge('single/forgot_password_confirm', [
            'expired' => $expired,
        ]);
    }

    /**
     * Post change to password from form
     *
     * @param $unique_key
     */
    public function post_reset_password($unique_key) {
        try {
            $password = \Fuel\Core\Input::post('password', false);
            if (!$password)
                throw new \Fame\Exception\UserException('Sorry password is required');

            $store = \Fame\Store::get_one([
                'key'    => $unique_key,
                'value2' => 'password-reset-email',
            ]);
            if (!$store)
                throw new \Fame\Exception\UserException('Sorry the session has expired or does not exists, please try again');

            \Fame\Auth\Users::instance()
                ->set_password([
                    'email' => $store['value'],
                ], $password);

            // all done?
            \Fame\Store::remove([
                'store_id' => $store['store_id'],
            ]);

            $r = [
                'status' => true,
                'data'   => true,
            ];
        } catch (Exception $e) {
            $e = Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }

        echo json_encode($r);
    }
}
