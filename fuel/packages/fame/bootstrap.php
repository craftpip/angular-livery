<?php

\Fuel\Core\Autoloader::add_classes([
    'Fame\Auth\Auth'                      => __DIR__ . '/classes/authenticate/auth.php',
    'Fame\Auth\Users'                     => __DIR__ . '/classes/authenticate/users.php',
    'Fame\Exception\AppException'         => __DIR__ . '/classes/exception/appexception.php',
    'Fame\Exception\UserException'        => __DIR__ . '/classes/exception/userexception.php',
    'Fame\Exception\ExceptionInterceptor' => __DIR__ . '/classes/exception/exceptioninterceptor.php',
    'Fame\Utils'                          => __DIR__ . '/classes/utils.php',
    'Fame\Upload'                         => __DIR__ . '/classes/upload.php',
    'Fame\Store'                          => __DIR__ . '/classes/store.php',
    'Fame\Mail'                           => __DIR__ . '/classes/mail.php',
    'Fame\Chat'                           => __DIR__ . '/classes/chat.php',
    'Fame\ChatGroup'                      => __DIR__ . '/classes/chatgroup.php',
    'Fame\Firebase'                       => __DIR__ . '/classes/firebase.php',
    'Fame\Lang'                           => __DIR__ . '/classes/lang.php',
]);
