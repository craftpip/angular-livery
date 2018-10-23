<?php
/**
 * The staging database settings. These get merged with the global settings.
 */

return [
    'default' => [
        'connection' => [
            'dsn'      => 'mysql:host=localhost;dbname=kpmg',
            'username' => 'root',
            'password' => '',
        ],
        'charset'    => 'utf8mb4',
    ],
];