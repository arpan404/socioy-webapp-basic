<?php
include "./includes/autologin.php";
if (isset($_SESSION['login'])) {
  if ($_SESSION['login'] === true && isset($_SESSION['firstname']) && isset($_SESSION['login']) && isset($_SESSION['lastname']) && isset($_SESSION['email']) && isset($_SESSION['username'])) {
    header("Location: /");
    exit;
  }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="theme-color" content="#292929" />
  <title>Log In or Sign Up | Socioy</title>
  <?php
  include "./includes/commonHeader.php";
  ?>
  <script src="/assests/js/login.js" defer type="module"></script>
  <link rel="stylesheet" href="/assests/css/login.css" />
</head>

<body>
  <div class="login-body-container">
    <div>
      <div class="login-text-container">
        <span class="login-site-name">Soc<span>ioy</span></span>
        <br />
        <span class="login-text">
          Find your place on Socioy and connect with like-minded individuals.
        </span>
      </div>
    </div>
    <div class="login-box-container rounded-10px relative">
      <input type="text" placeholder="Email or Username..." required class="h-12 outline-none px-3 py-2 rounded-10px border-none login-input-field" id="user" />
      <div class="w-full">
        <i id="password-btn"></i>
        <input type="password" name="password" id="password-field" placeholder="Password..." class="h-12 outline-none px-3 py-2 rounded-10px border-none login-input-field password-input-field min-w-full" />
      </div>
      <input type="submit" value="Log In" class="login-btn" id="login-btn" />
      <div class="flex justify-center w-full">
        <a href="/signup">
          <input type="button" value="Create a new account" class="signup-btn" id="signup-btn" /></a>
      </div>
    </div>
  </div>
</body>

</html>