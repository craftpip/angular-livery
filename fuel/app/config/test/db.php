<?php
/**
 * The test database settings. These get merged with the global settings.
 *
 * This environment is primarily used by unit tests, to run on a controlled environment.
 */

return [
    'default' => [
        'connection' => [
            'dsn'      => 'mysql:host=fameerp.com;dbname=ranjit_kpmg_db',
            'username' => 'ranjit_kpmg_user',
            'password' => 'Fame@2018',
        ],
        'charset'    => 'utf8mb4',
    ],
];