<?php

namespace Fuel\Tasks;

use Fame\Subscriptions;
use Fame\Utils;
use Fuel\Core\Cli;
use Fuel\Core\DB;
use GuzzleHttp\Client;

class Currency {
    public static function update() {
        $client = new Client();
        Cli::write('Fetching data');

        $response = $client->get('http://www.floatrates.com/daily/usd.json');

        if ($response->getStatusCode() != 200) {
            Cli::write("Status code returned " . $response->getStatusCode());
        }
        else {
            $content = $response->getBody()
                ->getContents();

            $list = json_decode($content, true);
            foreach ($list as $item) {
                $code = $item['code'];
                $rate = $item['rate'];

                $af = \Fame\Currency::update([
                    'code' => $code,
                ], [
                    'rate' => $rate,
                ]);
                if ($af) {
                    Cli::write("Updated $code to rate $rate");
                }
                else {
                    Cli::write("Could not update $code to rate $rate");
                }
            }
        }
    }
}