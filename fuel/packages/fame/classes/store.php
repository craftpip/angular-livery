<?php

namespace Fame;

use Fuel\Core\DB;

/**
 * class Store
 *
 * Store random data or whatever 
 */
class Store {

    const table = 'data_store';

    /**
     * Get one entry for store
     *
     * @param array $where
     * @param null  $select
     *
     * @param bool  $checkExpiry
     *
     * @return bool
     */
    public static function get_one($where = [], $select = null, $checkExpiry = true) {
        $data = self::get($where, $select, $checkExpiry);

        return $data ? $data[0] : false;
    }

    /**
     * @param array $where
     * @param null  $select
     * @param bool  $checkExpiry
     *
     * @return bool
     */
    public static function get($where = [], $select = null, $checkExpiry = true) {
        if ($checkExpiry) {
            $where[] = [
                'expires',
                '>',
                Utils::timeNow(),
            ];
        }

        $q = DB::select_array($select)
            ->from(self::table)
            ->where($where);

        $c = $q->compile();

        $query = Utils::sqlCalcRowInsert($c);

        $res = DB::query($query)
            ->execute()
            ->as_array();

        return count($res) ? $res : false;
    }

    /**
     * @param $set
     *
     * @return mixed
     */
    public static function insert($set) {
        $set['created_at'] = Utils::timeNow();
        $set['updated_at'] = Utils::timeNow();

        list($insert_id, $af) = DB::insert(self::table)
            ->set($set)
            ->execute();

        return $insert_id;
    }

    public static function update(Array $where, $set) {
        $set['updated_at'] = Utils::timeNow();

        $af = DB::update(self::table)
            ->set($set)
            ->where($where)
            ->execute();

        return $af;
    }

    public static function remove(Array $where) {
        $af = DB::delete(self::table)
            ->where($where)
            ->execute();

        return $af;
    }

}
