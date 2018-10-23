<?php

namespace Fame;

use Fame\Exception\AppException;
use Fame\Exception\UserException;
use Fuel\Core\DB;
use Fuel\Core\File;
use Fuel\Core\Image;
use Fuel\Core\Str;

/**
 * Class Upload
 *
 * Automatically stores uploaded files and adds entry to database,
 * if the uploaded file is a image, it will generate a thumbnail for it.
 *
 * @package Fame
 */
class Upload {
    public static $table = 'uploads';
    public static $db = 'default';

    public static $type_image = 1;
    public static $type_files = 2;

    public static function select($select = null) {
        return DB::select_array($select)
            ->from(self::$table);
    }

    public static function getDateSuffix() {
        $date = getdate();

        return $date['year'] . '/' . $date['mon'] . '/' . $date['mday'];
    }

    /**
     * Only store uploaded files
     *
     * @return array
     * @throws \Fame\Exception\UserException
     */
    public static function onlyStoreUploadedFiles() {
        $targetPath = 'files/';

        if (!Str::ends_with($targetPath, '/'))
            $targetPath .= '/';
        $dateSuffix = self::getDateSuffix();
        $targetPath = $targetPath . $dateSuffix;

        $files = $_FILES;
        if (\Fuel\Core\Upload::is_valid()) {
            \Fuel\Core\Upload::process([
                'path' => $targetPath,
            ]);
            \Fuel\Core\Upload::save();
            $files = \Fuel\Core\Upload::get_files();
        }
        else {
            $f = ini_get('upload_max_filesize');
            $errors = \Fuel\Core\Upload::get_errors();
            throw new UserException('The uploaded files are not valid.');
        }

        foreach ($files as $k => $file) {
            $files[$k]['path'] = $targetPath;
        }

        return $files;
    }


    /**
     * Reads $_FILES, does everything and returns the file id
     *
     * @param $type
     *
     * @return int
     * @throws \Fame\Exception\UserException
     */
    public static function storeUploadedFiles($type) {

        $targetPath = 'assets/img/images/';
        if ($type == self::$type_files)
            $targetPath = 'files/';

        if (!Str::ends_with($targetPath, '/'))
            $targetPath .= '/';
        $dateSuffix = self::getDateSuffix();
        $targetPath = $targetPath . $dateSuffix;

        $files = $_FILES;

        foreach ($files as $file) {
            $ext = strtolower(Utils::getExtension($file['name']));
            if ($type == self::$type_image) {
                if ($ext != 'jpeg' and $ext != 'jpg' and $ext != 'png' and $ext != 'bmp' and $ext != 'gif') {
                    throw new UserException('Invalid file extension, please upload a image with extension jpeg, jpg, gif, png or bmp');
                }
            }
        }

        if (\Fuel\Core\Upload::is_valid()) {
            \Fuel\Core\Upload::process([
                'path'        => $targetPath,
                'create_path' => true,
                'randomize'   => true,
                'normalize'   => true,
            ]);
            \Fuel\Core\Upload::save();
            $files = \Fuel\Core\Upload::get_files();
        }
        else {
            throw new UserException('The uploaded files are not valid.');
        }

        $fileIds = [];
        foreach ($files as $file) {
            if ($type == self::$type_image)
                Image::load($file['saved_to'] . $file['saved_as'])
                    ->resize(300, 300, true)
                    ->save_pa('thumb');

            $fileIds[] = self::insertRaw([
                'path'          => $file['saved_as'],
                'path_thumb'    => $type == self::$type_image ? 'thumb' . $file['saved_as'] : '',
                'dir'           => $targetPath,
                'type'          => $type,
                'original_name' => $file['name'],
            ]);
        }

        return $fileIds;
    }

    public static function getOne(Array $where, $select = null) {
        $r = self::get($where, $select);

        return $r ? $r[0] : false;
    }

    public static function get(Array $where, $select = null, $limit = false, $offset = 0) {
        $q = DB::select_array($select)
            ->from(self::$table)
            ->where($where);

        if ($limit) {
            $q = $q->limit($limit);
            if ($offset)
                $q = $q->offset($offset);
        }

        $q = $q->order_by('upload_id', 'desc')
            ->compile(self::$db);

        $q = Utils::sqlCalcRowInsert($q);

        $data = DB::query($q)
            ->execute(self::$db)
            ->as_array();

        return count($data) ? $data : false;
    }

    public static function update($id, $set) {
        return DB::update(self::$table)
            ->set($set)
            ->where('upload_id', $id)
            ->execute();
    }

    public static function insert($path, $type) {
        $path = str_replace(DOCROOT, '', $path);
        $set = [
            'path' => $path,
            'type' => $type,
        ];

        return self::insertRaw($set);
    }

    private static function insertRaw($set) {
        $set['created_at'] = Utils::timeNow();

        list($id, $af) = DB::insert(self::$table)
            ->set($set)
            ->execute();

        return $id;
    }

    /**
     * @param array $where
     *
     * @return mixed
     * @throws AppException
     */
    public static function remove(Array $where) {
        if (empty($where) or !isset($where['upload_id']))
            throw new AppException('Where is empty');

        $image = self::get([
            'upload_id' => $where['upload_id'],
        ]);

        if ($image) {
            $image = $image[0];

            try {
                File::delete(DOCROOT . $image['dir'] . $image['path_thumb']);
                File::delete(DOCROOT . $image['dir'] . $image['path']);
            } catch (\Exception $e) {
            }
        }

        $af = DB::delete(self::$table)
            ->where($where)
            ->execute();

        return $af;
    }
}