<?php

namespace Fame;

use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;

/**
 * Class Firebase
 * @package Fame
 */
class Firebase {

    public $instance;

    /**
     * Firebase constructor.
     */
    public function __construct() {
        $serviceAccount = ServiceAccount::fromJsonFile(DOCROOT . 'kpmg-firebase.json');

        $firebase = (new Factory())->withServiceAccount($serviceAccount)// The following line is optional if the project id in your credentials file
            // is identical to the subdomain of your Firebase project. If you need it,
            // make sure to replace the URL with the URL of your project.
            ->withDatabaseUri('https://kpmg-a8d99.firebaseio.com')
            ->create();
        $this->instance = $firebase;
    }

    public function database() {
        return $this->instance->getDatabase();
    }
}