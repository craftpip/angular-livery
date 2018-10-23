<?php

class Controller_Api_Sec_Upload extends Controller_Api_Authenticate {

    public function post_image() {
        try {
            $upload_id = \Fame\Utils::inputPost('upload_id', false);
            if (!$upload_id)
                throw new \Fame\Exception\UserException('Missing parameters');

            $upload = \Fame\Upload::get([
                'upload_id' => $upload_id,
            ]);

            $r = [
                'status' => true,
                'data'   => $upload,
            ];
        } catch (\Exception $e) {
            $e = \Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }
        $this->response($r);
    }

    public function post_upload_doc() {
        try {
            $id = \Fame\Upload::storeUploadedFiles(\Fame\Upload::$type_files);
            $file = \Fame\Upload::getOne([
                'upload_id' => $id[0],
            ]);
            $filePath = \Fuel\Core\Uri::base() . $file['dir'] . '/' . $file['path'];

            $r = [
                'status' => true,
                'data'   => [
                    'id'   => $id[0],
                    'name' => $file['original_name'],
                ],
                'link'   => $filePath,
                'base'   => \Fuel\Core\Uri::base(),
                'thumb'  => $file['dir'] . '/' . $file['path_thumb'],
                'file'   => $file['dir'] . '/' . $file['path'],
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

    public function post_upload() {
        try {
            $id = \Fame\Upload::storeUploadedFiles(\Fame\Upload::$type_image);
            $file = \Fame\Upload::getOne([
                'upload_id' => $id[0],
            ]);
            $filePath = \Fuel\Core\Uri::base() . $file['dir'] . '/' . $file['path'];

            $r = [
                'status' => true,
                'data'   => [
                    'id' => $id[0],
                ],
                'link'   => $filePath,
                'base'   => \Fuel\Core\Uri::base(),
                'thumb'  => $file['dir'] . '/' . $file['path_thumb'],
                'file'   => $file['dir'] . '/' . $file['path'],
            ];
        } catch (\Exception $e) {
            $e = \Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }
        $this->response($r);
    }

    /**
     * Author: Gaurish Rane
     * WIP
     */
    public function post_csv() {
        try {

            $r = [
                'status' => true,
                'data'   => 'data upload',
            ];
        } catch (\Exception $e) {
            $e = \Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }
        $this->response($r);
    }
}

