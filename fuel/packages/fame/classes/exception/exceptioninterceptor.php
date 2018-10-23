<?php

namespace Fame\Exception;

use Fuel\Core\Fuel;

/**
 * Class ExceptionInterceptor
 *
 * @package Nb
 */
class ExceptionInterceptor {
    protected $code;
    protected $message;

    /**
     * ExceptionInterceptor constructor.
     *
     * @param \Exception $e
     *
     * @return \Exception
     */
    public static function intercept(\Exception $e) {
        $error_message = 'Something is not right, please try again later.';

        if ($e instanceof UserException) {
            return $e;
        }
        else {
            $file = $e->getFile();
            $file = substr($file, strpos($file, 'fuel'));

            if (Fuel::$env != Fuel::PRODUCTION) {
                $message = "Exception " . $e->getCode() . ": " . $e->getMessage() . " file: $file @ " . $e->getLine();

                return new \Exception($message, $e->getCode(), $e);
            }
            else {
                return new \Exception($error_message, $e->getCode(), $e);
            }
        }
    }

}