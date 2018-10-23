<!DOCTYPE HTML>
<html>
<head>
    <title>Asset album - Password reset</title>
    <!-- Custom Theme files -->
    <meta http-equiv="Content-Type"
          content="text/html; charset=utf-8"/>
    <meta name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta http-equiv="Content-Type"
          content="text/html; charset=utf-8"/>
    <meta name="keywords"
          content=""/>
    <!--google fonts-->
    <link href='//fonts.googleapis.com/css?family=Roboto:400,100,300,500,700,900'
          rel='stylesheet'
          type='text/css'>

    <script src='//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'></script>
    <?php
    echo \Fuel\Core\Asset::css([
        'bootstrap.min.css',
    ]);
    echo \Fuel\Core\Asset::js([
        'bootstrap.min.js',
    ]);
    ?>

</head>
<body>


<style>
    .bg {
        background: -webkit-linear-gradient(top, #89216B, #DA4453);
        background-size: cover;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        display: block;
    }

    .container {
        width: 100%;
        z-index: 2;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: block;
    }

    .element-main {
        width: 400px;
        background: white;
        border-radius: 4px;
        box-shadow: 0 3px 3px rgba(0, 0, 0, .3);
        margin: 0 auto;
        padding: 25px;
        text-align: center;
        position: relative;
        top: 20%;
    }

    .element-main h1 {
        margin: 0px;
        color: rgba(87, 87, 87, 0.99);
        margin-bottom: 20px;
    }

    .element-main p {
        /*margin: 0px;*/
        color: rgba(87, 87, 87, 0.99);
        margin-bottom: 25px;
    }

    .element-main .form-control {
        margin-bottom: 20px;
    }
</style>
<div class="bg">

</div>
<div class="container"
     style="">
    <!--    <h2>Reset password</h2>-->

    <?php if ($expired) { ?>
        <div class="element-main">
            <h1>
                Forgot password
            </h1>
            <p>
                Sorry, the link token has expired or did not exists.
                <br>
                Please try again
            </p>
        </div>
    <?php } else { ?>
        <div class="element-main">
            <h1>Forgot password</h1>
            <p>
                No worries, please confirm your password.
            </p>

            <div class="alert alert-success"
                 style="display: none">
                Your password has been changed successfully.
            </div>

            <form class="reset-form">
                <input type="password"
                       class="password-enter form-control form-control-lg"
                       placeholder="Enter new password">
                <input type="password"
                       class="password-confirm form-control form-control-lg"
                       placeholder="Repeat new password">

                <div class="alert alert-danger"
                     style="display: none">
                    <a href="#"
                       class="close alert-close"
                       aria-label="close">&times;</a>
                    <span></span>
                </div>

                <button type="submit"
                        class="btn btn-primary btn-lg">
                    Reset my Password
                </button>
            </form>
        </div>
    <?php } ?>

</div>
<script>
    (function($){
        $('.alert-close').on('click', function(){
            $(this).parent().hide();
        });
        $('.reset-form').on('submit', function(e){
            e.preventDefault();
            var pass = $('.password-enter').val();
            var pass2 = $('.password-confirm').val();
            var $alert = $('.alert.alert-danger');
            var $successAlert = $('.alert.alert-success');

            if(!pass){
                $alert.show().children('span').html('Please enter password');
                return false;
            }
            // if(pass.length < 6 || (/[a-z]|[A-Z]|[0-9]/.test(pass) && !/[^A-Za-z0-9]/.test(pass))){
            //     $alert.show().children('span').html('Password should be at least 6 chars long and contain one Uppercase, lowercase, numeric and special character');
            //     return false;
            // }
            if(pass !== pass2){
                $alert.show().children('span').html('The passwords do not match');
                return false;
            }
            $alert.hide();

            $.post('<?php echo \Fuel\Core\Uri::current() ?>', {
                'password': pass
            }).then(function(data){
                var response = JSON.parse(data);
                if(response.status){
                    $successAlert.show();
                    $('.reset-form').hide();
                }else{
                    $alert.show().children('span').html(response.reason);
                }
            }, function(err){
                // $alert.show().children('span').html('');
            });
        })
    })(jQuery);
</script>
<!--<div class="copy-right">-->
<!--    <p>© 2016 Reset Password Form. All rights reserved | Template by <a href="http://w3layouts.com/"-->
<!--                                                                        target="_blank"> W3layouts </a></p>-->
<!--</div>-->
</body>
</html>