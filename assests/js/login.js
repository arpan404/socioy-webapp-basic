import proxy from "./proxy.js";

const loginDetails = {
  user: "",
  password: "",
};
const loadingContainer = document.createElement("div");
loadingContainer.setAttribute("id", "loadingContainer");
loadingContainer.setAttribute("class", "loadingContainer");

const password = document.getElementById("password-field");
const user = document.getElementById("user");
const passwordBtn = document.getElementById("password-btn");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");

password.addEventListener("input", (e) => {
  if (password.value.trim().length !== 0) {
    passwordBtn.className = "fa-regular fa-eye password-btn";
    password.value = password.value.trim();
    loginDetails.password = password.value;
  }
});
password.addEventListener("keydown", (e) => {
  if (password.value.length === 1) {
    if (e.key === "Backspace") {
      signupDetails.password = "";
      if (signupDetails.confirmPassword.length === 0) {
        passwordBtn.className = "";
      }
    }
  }
});

user.addEventListener("input", (e) => {
  if (user.value.length !== 0) {
    user.value = user.value.toLowerCase().trim();
    user.value = user.value.replace(/\s/g, "");
    loginDetails.user = user.value;
    if (loginDetails.user.length >= 2) {
      user.style.border = "0px";
    }
  }
});
user.addEventListener("keydown", (e) => {
  if (user.value.length === 1) {
    if (e.key === "Backspace") {
      loginDetails.user = "";
    }
  }
});

passwordBtn.addEventListener("click", (e) => {
  if (passwordBtn.classList.contains("fa-eye")) {
    passwordBtn.classList.replace("fa-eye", "fa-eye-slash");
    password.type = "text";
  } else {
    passwordBtn.classList.replace("fa-eye-slash", "fa-eye");
    password.type = "password";
  }
});

loginBtn.addEventListener("click", (e) => {
  loginBtn.parentNode.insertBefore(loadingContainer, loginBtn.nextSibling);

  document.getElementById("loadingContainer").innerHTML = `
  <div>
  <svg viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#fff">
<circle cx="15" cy="15" r="15">
    <animate attributeName="r" from="15" to="15"
             begin="0s" dur="0.8s"
             values="15;9;15" calcMode="linear"
             repeatCount="indefinite" />
    <animate attributeName="fill-opacity" from="1" to="1"
             begin="0s" dur="0.8s"
             values="1;.5;1" calcMode="linear"
             repeatCount="indefinite" />
</circle>
<circle cx="60" cy="15" r="9" fill-opacity="0.3">
    <animate attributeName="r" from="9" to="9"
             begin="0s" dur="0.8s"
             values="9;15;9" calcMode="linear"
             repeatCount="indefinite" />
    <animate attributeName="fill-opacity" from="0.5" to="0.5"
             begin="0s" dur="0.8s"
             values=".5;1;.5" calcMode="linear"
             repeatCount="indefinite" />
</circle>
<circle cx="105" cy="15" r="15">
    <animate attributeName="r" from="15" to="15"
             begin="0s" dur="0.8s"
             values="15;9;15" calcMode="linear"
             repeatCount="indefinite" />
    <animate attributeName="fill-opacity" from="1" to="1"
             begin="0s" dur="0.8s"
             values="1;.5;1" calcMode="linear"
             repeatCount="indefinite" />
</circle>
</svg>
</div>
`;
  signupBtn.style.display = "none";
  document.getElementById("loadingContainer").style.display = "flex";
  password.disabled = true;
  user.disabled = true;
  passwordBtn.style.opacity = 0;
  if (loginDetails.password.length > 7 && loginDetails.user.length > 2) {
    fetch(`${proxy}/api/login/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: loginDetails.user,
        password: loginDetails.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          SetCookies("token", data.token);
          window.location.replace(`${proxy}/`);
        }
        if (data.status === "failed") {
          if (data.type === "incorrect password") {
            passwordBtn.style.opacity = 0;
            setTimeout(() => {
              signupBtn.style.display = "block";
              document.getElementById("loadingContainer").style.display =
                "none";
              user.disabled = false;
            }, 1500);
            setTimeout(() => {
              password.value = "";
              password.placeholder = "Incorrect Password";
              password.style.border = "1px red solid";
            }, 1000);
            setTimeout(() => {
              password.disabled = false;
              passwordBtn.style.opacity = 100;
              password.placeholder = "Password...";
              password.value = loginDetails.password;
            }, 3000);
            setTimeout(() => {
              password.style.border = "0px";
            }, 5000);
          }
          if (data.type === "user not found") {
            passwordBtn.style.opacity = 0;
            setTimeout(() => {
              signupBtn.style.display = "inline";
              document.getElementById("loadingContainer").style.display =
                "none";
              password.disabled = false;
            }, 1500);
            setTimeout(() => {
              user.value = "";
              user.placeholder = "User not found";
              user.style.border = "1px red solid";
            }, 1000);
            setTimeout(() => {
              user.value = loginDetails.user;
              user.placeholder = "Email or Username...";
              user.disabled = false;
              passwordBtn.style.opacity = 100;
            }, 3000);
            setTimeout(() => {
              user.style.border = "0px";
            }, 5000);
          }
        }
      });
  } else {
    if (loginDetails.password.length < 8) {
      passwordBtn.style.opacity = 0;
      setTimeout(() => {
        signupBtn.style.display = "block";
        document.getElementById("loadingContainer").style.display = "none";
        user.disabled = false;
      }, 1500);
      setTimeout(() => {
        password.value = "";
        password.placeholder = "Incorrect Password";
        password.style.border = "1px red solid";
      }, 1000);
      setTimeout(() => {
        password.disabled = false;
        password.placeholder = "Password...";
        passwordBtn.style.opacity = 100;
        password.value = loginDetails.password;
      }, 3000);
      setTimeout(() => {
        password.style.border = "0px";
      }, 5000);
    }
    if (loginDetails.user.length < 3) {
      passwordBtn.style.opacity = 0;
      setTimeout(() => {
        signupBtn.style.display = "inline";
        document.getElementById("loadingContainer").style.display = "none";
        password.disabled = false;
      }, 1500);
      setTimeout(() => {
        user.value = "";
        user.placeholder = "User not found";
        user.style.border = "1px red solid";
      }, 1000);
      setTimeout(() => {
        user.value = loginDetails.user;
        user.placeholder = "Email or Username...";
        user.disabled = false;
        passwordBtn.style.opacity = 100;
      }, 3000);
      setTimeout(() => {
        user.style.border = "0px";
      }, 5000);
    }
  }
});
function SetCookies(cname, cvalue, exdays = 30) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie =
    cname + "=" + cvalue + ";" + expires + ";path=/" + ";SameSite=Strict";
}
