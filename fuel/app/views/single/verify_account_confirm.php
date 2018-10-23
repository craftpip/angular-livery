<!DOCTYPE HTML>
<html>
<head>
    <title>Asset album - Account verification</title>
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
                Account verification
            </h1>
            <p>
                Sorry, the link token has expired or did not exists.
                <br>
                Please try again
            </p>
        </div>
    <?php } else { ?>
        <div class="element-main">
            <h1>Account verification</h1>
            <div>
                <img style="width: 91px;margin-bottom: 20px;margin-top: 15px;"
                     src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0MjYuNjY3IDQyNi42NjciIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQyNi42NjcgNDI2LjY2NzsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxwYXRoIHN0eWxlPSJmaWxsOiM2QUMyNTk7IiBkPSJNMjEzLjMzMywwQzk1LjUxOCwwLDAsOTUuNTE0LDAsMjEzLjMzM3M5NS41MTgsMjEzLjMzMywyMTMuMzMzLDIxMy4zMzMgIGMxMTcuODI4LDAsMjEzLjMzMy05NS41MTQsMjEzLjMzMy0yMTMuMzMzUzMzMS4xNTcsMCwyMTMuMzMzLDB6IE0xNzQuMTk5LDMyMi45MThsLTkzLjkzNS05My45MzFsMzEuMzA5LTMxLjMwOWw2Mi42MjYsNjIuNjIyICBsMTQwLjg5NC0xNDAuODk4bDMxLjMwOSwzMS4zMDlMMTc0LjE5OSwzMjIuOTE4eiIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K"/>
                <p>
                    Your e-mail id has successfully been verified.
                </p>
            </div>
        </div>
    <?php } ?>

</div>
<script>
</script>
<!--<div class="copy-right">-->
<!--    <p>© 2016 Reset Password Form. All rights reserved | Template by <a href="http://w3layouts.com/"-->
<!--                                                                        target="_blank"> W3layouts </a></p>-->
<!--</div>-->
</body>
</html>