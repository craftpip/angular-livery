<?php

use Fame\Exception\ExceptionInterceptor;

class Controller_Api_Sec_Lang extends Controller_Api_Authenticate {

    /**
     * Remove a language key from database.
     */
    public function post_remove() {
        try {
            $lang_id = \Fuel\Core\Input::json('lang.lang_id', false);
            $af = \Fame\Lang::remove([
                'lang_id' => $lang_id,
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
     * Save new or update a language key in database.
     */
    public function post_save() {
        try {
            $lang_id = \Fuel\Core\Input::json('lang.lang_id', false);
            $lang = \Fuel\Core\Input::json('lang.lang');
            $key = \Fuel\Core\Input::json('lang.key');
            $value = \Fuel\Core\Input::json('lang.value');

            if ($lang_id) {
                \Fame\Lang::update([
                    'lang_id' => $lang_id,
                ], [
                    'lang'  => $lang,
                    'key'   => $key,
                    'value' => $value,
                ]);
            }
            else {
                $lang_id = \Fame\Lang::insert([
                    'lang'  => $lang,
                    'key'   => $key,
                    'value' => $value,
                ]);
            }

            $lang = \Fame\Lang::get_one([
                'lang_id' => $lang_id,
            ]);

            $r = [
                'status' => true,
                'data'   => [
                    'lang' => $lang,
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

    /**
     * List of language keys in database.
     */
    public function post_list() {
        try {
            $list = \Fame\Lang::get([]);
            if (!$list)
                $list = [];

            $r = [
                'status' => true,
                'data'   => [
                    'list' => $list,
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