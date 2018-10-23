<?php

namespace Fuel\Tasks;

use Fame\Utils;
use Fuel\Core\Cli;
use Fuel\Core\DB;
use Fuel\Core\Str;

class Store {

    /**
     * Remove expired stored data.
     */
    public static function clean() {
        $removed = \Fame\Store::remove([
            [
                'expires',
                '<',
                Utils::timeNow(),
            ],
        ]);
    }

}