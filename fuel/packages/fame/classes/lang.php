<?php

namespace Fame;

use Fuel\Core\DB;

/**
 * Class Lang
 * @package Fame
 */
class Lang {
    const table = 'lang';

    const languages = [
        'en' => 'English',
        'ar' => 'Arabic',
    ];

    public static function pack($lang = 'en') {
        $lang = self::get([
            'lang' => $lang,
        ], [
            'key',
            'value',
        ]);

        return $lang;
    }

    public static function get_one($where = [], $select = null) {
        $data = self::get($where, $select, false, 0);

        return $data ? $data[0] : false;
    }

    public static function get($where = [], $select = null, $limit = false, $offset = 0) {
        $q = DB::select_array($select)
            ->from(self::table)
            ->where($where);

        $q->order_by('key', 'asc')
            ->order_by('lang', 'asc');
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