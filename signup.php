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
  <title>Join | Socioy</title>
  <?php
  include "./includes/commonHeader.php";
  ?>
  <script src="./assests/js/signup.js" type="module" defer></script>
  <link rel="stylesheet" href="/assests/css/signup.css" />
</head>

<body>
  <div class="signup-body-container">
    <div>
      <div class="signup-text-container">
        <span class="signup-site-name">Soc<span>ioy</span></span>
        <br />
        <span class="signup-text">
          Socioy is the place to be. Sign up now and join the fun.
        </span>
      </div>
    </div>
    <div class="signup-box-container rounded-10px relative">
      <input type="text" placeholder="First Name" class="h-12 outline-none px-3 py-2 rounded-10px border-none signup-input-field" id="signup-firstname" name="firstname" />
      <input type="text" placeholder="Last Name" class="h-12 outline-none px-3 py-2 rounded-10px border-none signup-input-field" id="signup-lastname" />
      <input type="text" placeholder="Username" id="signup-username" class="h-12 outline-none px-3 py-2 rounded-10px border-none signup-input-field" />
      <input type="text" placeholder="Email Address" id="signup-email" class="h-12 outline-none px-3 py-2 rounded-10px border-none signup-input-field hidden" />
      <input type="password" name="password" id="signup-password" placeholder="Enter Password" class="h-12 outline-none px-3 py-2 rounded-10px border-none signup-input-field password-input-field min-w-full" />
      <div class="w-full">
        <i id="password-btn"></i>
        <input type="password" name="password" id="signup-confirm-password" placeholder="Confirm Password" class="h-12 outline-none px-3 py-2 rounded-10px border-none signup-input-field password-input-field min-w-full" />
      </div>
      <input type="button" value="Create Account Now" class="signup-btn" id="create-btn" data-type="create-btn" />
      <div class="flex justify-center w-full">
        <a href="/login">
          <input type="button" value="Log in Instead" class="login-btn" id="login-btn" />
        </a>
      </div>
    </div>
  </div>
</body>

</html>