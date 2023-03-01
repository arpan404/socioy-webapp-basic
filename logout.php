<?php
session_start();
session_destroy();
setcookie("token", "", time() - 3600);
header("Location: /login");
exit;
