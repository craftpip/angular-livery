<?php

class Controller_Home extends \Fuel\Core\Controller {
    public function get_index() {
        \Fuel\Core\Response::redirect('./portal'); 
    }
}
