<?php


include "./includes/autologin.php";
include "./includes/db.inc.php";

if (!isset($_SESSION['login'])) {
  if (!($_SESSION['login'] === true && isset($_SESSION['firstname']) && isset($_SESSION['login']) && isset($_SESSION['lastname']) && isset($_SESSION['email']) && isset($_SESSION['username']))) {
    header("Location: /login");
    exit;
  }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <title>Socioy</title>
  <?php require_once("./includes/commonHeader.php") ?>
  <link rel="stylesheet" href="./assests/css/navbar.css" />
  <link rel="stylesheet" href="./assests/css/404.css" />
  <script src="./assests/js/navbar.js" defer type="module"></script>
  <script src="./assests/js/search.js" defer type="module"></script>
  <script src="./assests/js/activenow.js" defer type="module"></script>
  <meta name="theme-color" content="#141414" />
</head>

<body class="relative">
  <?php require_once("./includes/navbar.php"); ?>
<div class="main-container-404">
    <div>

    <div class="main-text-container">
      <div class="a-404-text">
        404
      </div>  
      <div class="non-text">
        Page not found
      </div>
    </div>
    <div class="home-btn-404">
        <a href ="./">
            <button>Go to Home</button>
        </a> 
    </div>

    </div>
    
</div>

</body>

</html>