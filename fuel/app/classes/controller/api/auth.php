<?php

use Fuel\Core\Input;

class Controller_Api_Auth extends Controller_Api_Notauthenticate {

    public $lang = 'en';

    /**
     * Email sending test.
     * @todo delete me
     */
    public function get_test() {

        $email = 'boniface.pereira@itshastra.com';
        $unique_token = \Fuel\Core\Str::random();
        $name = 'boniface';

        $emailVerificationTemplate = \Fuel\Core\View::forge('mail/welcome', [
            'data' => [
                'link' => \Fuel\Core\Uri::base() . 'user/verify_account/' . $unique_token,
                'name' => $name,
            ],
        ]);

        $mail = new \Fame\Mail();
        $a = $mail->subject('Welcome to Asset album')
            ->html_body($emailVerificationTemplate->render())
            ->to($email, $name)
            ->send();

        print_r($a);
    }

    /**
     *
     */
    public function post_valid() {
        try {
            $user = [];
            if ($this->user_id) {
                $user = \Fame\Auth\Users::instance()
                    ->get_one([
                        'id' => $this->user_id,
                    ]);
                $user = \Fame\Auth\Users::instance()
                    ->parse($user);
            }
            else {
                throw new \Fame\Exception\UserException('User is not logged in');
            }

            $lang = $this->auth_instance->get_profile_fields('lang', 'en');
            $languagePack = \Fame\Lang::pack($lang);

            $r = [
                'status' => true,
                'data'   => [
                    'id'       => $this->user_id,
                    'user'     => $user,
                    'langPack' => $languagePack,
                    'lang'     => $lang,
                ],
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

    public function post_authenticate() {
        try {
            $auth = \Fame\Auth\Auth::instance();

            $username = Input::json('username', false);
            $password = Input::json('password', false);

            list($user, $token) = $auth->login($username, $password);

            $user = \Fame\Auth\Users::instance()
                ->parse($user);

            $user_id = $user['id'];

            $lang = \Fame\Auth\Auth::instance($user_id)
                ->get_profile_fields('lang', 'en');
            $languagePack = \Fame\Lang::pack($lang);

            $r = [
                'status' => true,
                'data'   => [
                    'user'     => $user,
                    'token'    => $token,
                    'langPack' => $languagePack,
                    'lang'     => $lang,
                ],
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
     * Email the user a unique link to reset password
     * link: <domain>/user/reset_password/<unique key>
     *
     */
    public function post_forgot_password() {
        try {
            $username = Fame\Utils::inputPost('username', false);
            $countryCode = \Fame\Utils::inputPost('countryCode', false);

            if (!$username)
                throw new \Fame\Exception\UserException('Please enter e-mail or mobile');

            $is_email = false;

            $user = Fame\Auth\Users::instance()
                ->get_one([
                    'email' => $username,
                ]);


            if ($user) {
                $is_email = true;
            }
            else {
                if (!$countryCode)
                    throw new \Fame\Exception\UserException('Sorry, this email/mobile is not registered with us.');

                $user = \Fame\Auth\Users::instance()
                    ->get_one([
                        'mobile'  => $username,
                        'country' => $countryCode,
                    ]);
                if (!$user)
                    throw new Fame\Exception\UserException("Sorry, this email/mobile is not registered with us.");
            }

            $user = \Fame\Auth\Users::instance()
                ->parse($user);

            $unique_string = \Fuel\Core\Str::random();

            $response = [];

            if ($is_email) {
                $link = \Fuel\Core\Uri::base() . 'user/reset_password/' . $unique_string;

                $store_id = \Fame\Store::insert([
                    'key'     => $unique_string,
                    'value'   => $username,
                    'value2'  => 'password-reset-email',
                    'expires' => Fame\Utils::timeAlter('+1 hour'),
                ]);

                $emailTemplate = \Fuel\Core\View::forge('mail/password_reset', [
                    'data' => [
                        'name' => \Fuel\Core\Arr::get($user, 'profile_fields.name', 'user'),
                        'link' => $link,
                    ],
                ]);

                $email = new \Fame\Mail();
                $email->html_body($emailTemplate->render())
                    ->to($user['email'], \Fuel\Core\Arr::get($user, 'profile_fields.name', null))
                    ->subject('Password reset');

                $af = $email->send();

                //                $email = \Email\Email::forge();
                //                //                $email->html_body($emailTemplate->render());
                //                //                $email->to($user['email']);
                //                //                $email->subject('Password reset');
                //                //                $email->send();

                $response['link'] = $link;
            }
            else {
                // otp here.
                $otp = \Fuel\Core\Str::random('numeric', 4);
                $store_id = \Fame\Store::insert([
                    'key'     => $unique_string,
                    'value'   => $username,
                    'value2'  => 'password-reset-otp',
                    'expires' => \Fame\Utils::timeAlter('+1 hour'),
                    'value3'  => $otp,
                ]);

                $response['key'] = $unique_string;

                $response['otp'] = $otp;
            }

            $response['is_email'] = $is_email;

            $r = [
                'status' => true,
                'data'   => $response,
            ];
        } catch (Exception $e) {
            $e = Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }

        $this->response($r);
    }

    /**
     * Validate otp on registration screen
     * OTP is validated with a unique key.
     */
    public function post_validate_otp() {
        try {
            $key = \Fame\Utils::inputPost('key');
            $otp = \Fame\Utils::inputPost('otp');

            $store = \Fame\Store::get_one([
                'key'   => $key,
                'value' => $otp,
            ]);
            if (!$store) {
                throw new \Fame\Exception\UserException('OTP is not valid or has expired, please try again');
            }
            $userData = json_decode($store['value2'], true);

            $name = $userData['name'];
            $email = $userData['email'];
            $mobile = (string)$userData['mobile'];
            $countryCode = $userData['countryCode'];
            $password = $userData['password'];
            $currency = $userData['currency'];

            $user_id = Fame\Auth\Users::instance()
                ->create_user(\Fuel\Core\Inflector::friendly_title($name, '-', true) . '-' . mt_rand(10, 10000), $email, $mobile, $password, Fame\Auth\Users::$user, [
                    'account_active'  => 1,
                    'mobile_verified' => 1,
                    'currency'        => $currency,
                ], $countryCode, [
                    'name' => $name,
                ]);

            list($user, $token) = \Fame\Auth\Auth::instance()
                ->force_login($user_id);

            $user = \Fame\Auth\Users::instance()
                ->parse($user);

            // get free pack
            $pack = \Fame\SubscriptionPacks::get_one([
                'subs_pack_price' => 0,
            ]);
            if ($pack) {
                \Fame\Subscriptions::insert([
                    'user_id'       => $user_id,
                    'subs_name'     => $pack['subs_pack_name'],
                    'subs_price'    => $pack['subs_pack_price'],
                    'subs_duration' => $pack['subs_pack_duration'],
                ]);
                \Fame\Subscriptions::process($user_id);
            }
            else {
                // free pack not available?
            }

            \Fame\Store::remove([
                'key'   => $key,
                'value' => $otp,
            ]);

            $subs = \Fame\Subscriptions::status($user_id);

            // complete ?
            // send email verification

            $unique_token = \Fuel\Core\Str::random('unique');
            \Fame\Store::insert([
                'key'     => $unique_token,
                'value'   => $email,
                'value2'  => 'verify-account',
                'expires' => \Fame\Utils::timeAlter('+24 hours'),
            ]);

            $emailVerificationTemplate = \Fuel\Core\View::forge('mail/welcome', [
                'data' => [
                    'link' => \Fuel\Core\Uri::base() . 'user/verify_account/' . $unique_token,
                    'name' => $name,
                ],
            ]);

            $mail = new \Fame\Mail();
            $mail->subject('Welcome to Asset album')
                ->html_body($emailVerificationTemplate->render())
                ->to($email, $name)
                ->send();

            $r = [
                'status' => true,
                'data'   => [
                    'user'  => $user,
                    'token' => $token,
                    'sub'   => $subs,
                ],
            ];
        } catch (Exception $e) {
            $e = Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }

        $this->response($r);
    }

    /**
     */
    public function post_registration_data() {
        try {
            /** rate table is the same  */
            //            $currency_codes = \Fame\Currency::get([], null, false, 0, 'asc');
            $currency_codes = DB::select()
                ->from('country_mst')
                ->where('currency_code', '!=', '')
                ->group_by('currency_code')
                ->execute()
                ->as_array();
            $country = DB::select()
                ->from('country_mst')
                ->where('status', '=', '1')
                ->execute()
                ->as_array();

            if (!$currency_codes)
                $currency_codes = [];


            $r = [
                'status' => true,
                'data'   => [
                    'currency_codes' => $currency_codes,
                    'country'        => $country,
                ],
            ];
        } catch (Exception $e) {
            $e = Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }

        $this->response($r);
    }

    public function post_get_currency_code() {
        try {
            /** rate table is the same  */
            $mobile_code = \Fame\Utils::inputPost('mobile_code');

            //            $currency_codes = \Fame\Currency::get([], null, false, 0, 'asc');
            $currency_codes = DB::select()
                ->from('country_mst')
                ->where('mobile_code', '=', $mobile_code)
                ->execute()
                ->as_array();

            $r = [
                'status' => true,
                'data'   => (!$currency_codes) ? [] : $currency_codes[0],
            ];
        } catch (Exception $e) {
            $e = Fame\Exception\ExceptionInterceptor::intercept($e);
            $r = [
                'status' => false,
                'reason' => $e->getMessage(),
            ];
        }

        $this->response($r);

    }

    public function post_create() {
        try {
            $name = Input::json('name');
            $email = Input::json('email');
            $country = Input::json('country');
            $mobile = (string)Input::json('mobile');
            $password = Input::json('password');
            $confirmPassword = Input::json('confirmPassword');
            $username = \Fuel\Core\Str::random('uuid');

            if (!$name or !$email or !$country or !$mobile or !$password or !$confirmPassword) {
                throw new \Fame\Exception\UserException('Invalid parameters');
            }

            if ($password != $confirmPassword) {
                throw new \Fame\Exception\UserException('Confirm password does not match');
            }

            $emailExists = \Fame\Auth\Users::instance()
                ->get_one([
                    'email' => $email,
                ]);
            if ($emailExists)
                throw new \Fame\Exception\UserException('E-mail id is already registered, please try again');

            $mobileExists = \Fame\Auth\Users::instance()
                ->get_one([
                    'mobile' => $mobile,
                ]);
            if ($mobileExists)
                throw new \Fame\Exception\UserException('Mobile is already registered, please try again');


            $user_id = \Fame\Auth\Users::instance()
                ->create_user($username, $email, $mobile, $password, \Fame\Auth\Users::$customer, [
                    'account_active'  => 1,
                    'email_verified'  => 1,
                    'mobile_verified' => 1,
                    'company_name'    => $name,
                ], $country, [
                    'lang' => 'en',
                ]);

            list($user, $token) = $this->auth_instance->force_login($user_id);

            $user = \Fame\Auth\Users::instance()
                ->parse($user);

            $lang = \Fame\Auth\Auth::instance($user_id)
                ->get_profile_fields('lang', 'en');
            $languagePack = \Fame\Lang::pack($lang);

            $r = [
                'status' => true,
                'data'   => [
                    'user'     => $user,
                    'token'    => $token,
                    'langPack' => $languagePack,
                    'lang'     => $lang,
                ],
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

    public function get_logout() {
        try {
            \Fame\Auth\Auth::instance()
                ->logout();
            $r = [
                'status' => true,
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

}
