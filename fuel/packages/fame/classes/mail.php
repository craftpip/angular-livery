<?php

namespace Fame;

use Email\Email;
use Fuel\Core\Config;

class Mail {

    public $mail;
    public $instance;

    public function __construct() {
        $key = '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';
        $this->instance = new \SendGrid($key);
        $this->mail = new \SendGrid\Mail\Mail();
    }

    public function from($from, $name = null) {
        $this->mail->setFrom($from, $name);

        return $this;
    }

    public function to($to, $name = null) {
        $this->mail->addTo($to, $name);

        return $this;
    }

    public function subject($subject) {
        $this->mail->setSubject($subject);

        return $this;
    }

    public function html_body($body) {
        $this->mail->addContent('text/html', $body);

        return $this;
    }

    public function attach($filePath, $fileName = null) {
        $this->mail->addAttachment($filePath, $fileName);

        return $this;
    }

    public function send() {
        Config::load('email', true);
        $from_email = Config::get('email.defaults.from.email');
        $from_name = Config::get('email.defaults.from.name');
        $this->from($from_email, $from_name);

        return $this->instance->send($this->mail);
    }

}