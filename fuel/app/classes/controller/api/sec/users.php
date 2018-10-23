<?php

class Controller_Api_Sec_Users extends Controller_Api_Authenticate {
    /**
     * Get list of users.
     */
    public function post_list() {
        try {
            $userInstance = \Fame\Auth\Users::instance();

            $groupFilter = \Fuel\Core\Input::json('filter.group', false);

            $groupFilter = '';
            if ($groupFilter) {
                $groupFilter .= " and (
                    users.group = $groupFilter                
                ) ";
            }

            $q = "
            select 
             users.*,
             users_account_handler.name as account_handler_name
             from users
            left join users as users_account_handler
            on users_account_handler.id = users.account_handler_id
            where users.id is not null 
            $groupFilter
            ";

            $users = \Fuel\Core\DB::query($q)
                ->execute()
                ->as_array();
            $users = $userInstance->parse($users);

            $r = [
                'status' => true,
                'data'   => [
                    'users' => $users,
                ],
            ];
        } catch (Exception $e) {
            $e = \Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }

        $this->response($r);
    }

    public function post_get_by_id() {
        try {

            $userInstance = \Fame\Auth\Users::instance();
            $user_id = Input::json('user_id', '0');
            $q = "
            select 
             users.*,
             users_account_handler.name as account_handler_name
             from users
            left join users as users_account_handler
            on users_account_handler.id = users.account_handler_id
            where users.id = $user_id
            ";

            $users = \Fuel\Core\DB::query($q)
                ->execute()
                ->as_array();
            $users = $userInstance->parse($users);

            $r = [
                'status' => true,
                'data'   => [
                    'users' => (count($users) == 0) ? false : $users[0],
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

    public function post_edit() {
        try {
            $userInstance = \Fame\Auth\Users::instance();

            $fd = Input::json('formData');


            $data = $userInstance->update_user([
                'id' => Input::json('user_id'),
            ], [
                'name'            => Input::json('name'),
                'mobile'          => Input::json('mobile'),
                'mobile_verified' => Input::json('mobile_verified'),
                'email'           => Input::json('email'),
                'email_verified'  => Input::json('email_verify'),
                'updated_at'      => Fame\Utils::timeNow(),
            ]);


            $r = [
                'status'   => true,
                'data'     => $data,
                'formData' => Input::json(),
            ];

        } catch (Exception $e) {
            $e = \Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }
        $this->response($r);
    }
}