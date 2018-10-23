<?php

namespace Fuel\Tasks;

use Fame\Subscriptions;
use Fame\Utils;
use Fuel\Core\DB;

class Subscription {

    /**
     * Check for expiring subscriptions
     * apply full subscription process
     * @throws \Fame\Exception\UserException
     */
    public static function process() {
        // run for all users that have subscriptions
        $timeNow = Utils::timeNow();

        $q = "
            select subscriptions_mst.user_id from subscriptions_mst
            where subscriptions_mst.subs_ends < $timeNow
            and subscriptions_mst.subs_ends is not null 
            and subscriptions_mst.subs_is_active = '1'
        ";
        $subs_that_ended = DB::query($q)
            ->execute()
            ->as_array();
        if (count($subs_that_ended) == 0) {
            echo 'No subs have ended';
            die;
        }

        foreach ($subs_that_ended as $sub) {
            $user_id = $subs_that_ended['user_id'];
            Subscriptions::process($user_id);
        }
    }
}