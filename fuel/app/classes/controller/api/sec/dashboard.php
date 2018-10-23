<?php

class Controller_Api_Sec_Dashboard extends Controller_Api_Authenticate {

    /**
     * Get list of tables , for dynamic dashboards demo purpose
     *
     */
    public function post_table() {
        try {
            $tableName = \Fuel\Core\Input::json('table', false);
            if (!$tableName)
                throw new \Fame\Exception\UserException('Missing parameters');

            $data = \Fuel\Core\DB::select()
                ->from($tableName)
                ->execute()
                ->as_array();

            $r = [
                'status' => true,
                'data'   => [
                    'table' => $data,
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

    /**
     * Load the first data for dashboard,
     */
    public function post_init() {
        try {
            $cards = $this->auth_instance->get_profile_fields('cards', false);
            if (!$cards)
                $cards = [];

            $r = [
                'status' => true,
                'data'   => [
                    'cards' => $cards,
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

    /**
     * Save the sequence and data for dashboard for this user.
     */
    public function post_save() {
        try {
            $cards = \Fuel\Core\Input::json('cards', []);

            $this->auth_instance->set_profile_fields([
                'cards' => $cards,
            ]);

            $r = [
                'status' => true,
                'data'   => [],
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

    public function post_get_cols() {
        try {

            $table = \Fuel\Core\Input::json('table', false);
            if (!$table)
                throw new \Fame\Exception\UserException('Missing parameters');

            $cols = \Fuel\Core\DB::list_columns($table);

            $r = [
                'status' => true,
                'data'   => [
                    'cols' => $cols,
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

    /**
     * Get list of tables that can work with sorting and stuff
     */
    public function post_get_tables() {
        try {
            $tables = \Fuel\Core\DB::query("show tables")
                ->execute()
                ->as_array();

            $r = [
                'status' => true,
                'data'   => [
                    'tables' => $tables,
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
}