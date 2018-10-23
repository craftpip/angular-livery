<?php

namespace Fame;

use Fuel\Core\DB;

/**
 * Class ChatGroup
 * @package Fame
 */
class ChatGroup {
    const table = 'chat_group';

    public static function get_one($where = [], $select = null) {
        $data = self::get($where, $select, false, 0);

        return $data ? $data[0] : false;
    }

    public static function get($where = [], $select = null, $limit = false, $offset = 0) {
        $q = DB::select_array($select)
            ->from(self::table)
            ->where($where);

        if ($limit) {
            $q->limit($limit);
            if ($offset)
                $q->offset($offset);
        }

        $c = $q->compile();

        $query = Utils::sqlCalcRowInsert($c);

        $res = DB::query($query)
            ->execute()
            ->as_array();

        return count($res) ? $res : false;
    }

    public static function parse($data) {
        foreach ($data as $k => $datum) {

        }

        return $data;
    }

    /**
     * @param $set
     *
     * @return mixed
     */
    public static function insert($set) {
        $set['created_at'] = Utils::timeNow();

        $set['group_participants'] = isset($set['group_participants']) ? Utils::_implodeAr($set['group_participants']) : Utils::_implodeAr([]);

        list($insert_id, $af) = DB::insert(self::table)
            ->set($set)
            ->execute();

        return $insert_id;
    }

    public static function update(Array $where, $set) {
        if (isset($set['group_participants']))
            $set['group_participants'] = Utils::_implodeAr($set['group_participants']);

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