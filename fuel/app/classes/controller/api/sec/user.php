<?php

use Fame\Auth\Users;
use Fame\Exception\ExceptionInterceptor;
use Fuel\Core\Input;

class Controller_Api_Sec_User extends Controller_Api_Authenticate {

    public function post_update_lang() {
        try {
            $lang = Input::json('lang', false);

            $af = $this->auth_instance->set_profile_fields([
                'lang' => $lang,
            ]);

            $r = [
                'status' => true,
                'data'   => [],
            ];
        } catch (Exception $e) {
            $e = ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }
        $this->response($r);
    }


    /**
     * returns login data.
     */
    public function post_self() {
        try {
            $user = Users::instance()
                ->get_one([
                    'id' => $this->user_id,
                ]);

            $user = Users::instance()
                ->parse($user);

            $r = [
                'status' => true,
                'data'   => [
                    'id'   => $this->user_id,
                    'user' => $user,
                ],
            ];
        } catch (Exception $e) {
            $e = ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }

        $this->response($r);
    }

    public function post_update_first_setup() {
        try {
            $company_name = Input::json('company_name', false);
            $service_type = Input::json('service_type', false);
            $country = Input::json('country', false);
            $org_strength = Input::json('org_strength', false);
            $pc_name = Input::json('pc_name', false);
            $pc_email = Input::json('pc_email', false);
            $pc_department = Input::json('pc_department', false);
            $pc_mobile = Input::json('pc_mobile', false);
            $address = Input::json('address', false);

            $af = Users::instance()
                ->update_user([
                    'id' => $this->user_id,
                ], [
                    'company_name'         => $company_name,
                    'country'              => $country,
                    'first_setup'          => 1,
                    'account_verification' => 0,
                ], [
                    'address'       => $address,
                    'org_strength'  => $org_strength,
                    'pc_name'       => $pc_name,
                    'pc_email'      => $pc_email,
                    'pc_department' => $pc_department,
                    'pc_mobile'     => $pc_mobile,
                    'service_type'  => $service_type,
                ]);


            $user = Users::instance()
                ->get_one([
                    'id' => $this->user_id,
                ]);

            $user = Users::instance()
                ->parse($user);

            $r = [
                'status' => true,
                'data'   => [
                    'user' => $user,
                ],
            ];
        } catch (Exception $e) {
            $e = ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }

        $this->response($r);
    }

}