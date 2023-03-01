import proxy from "./proxy.js";

const signupDetails = {
  firstname: "",
  lastname: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

const loadingContainer = document.createElement("div");
loadingContainer.setAttribute("id", "loadingContainer");
loadingContainer.setAttribute("class", "loadingContainer");

const createBtn = document.getElementById("create-btn");
const loginBtn = document.getElementById("login-btn");

const firstname = document.getElementById("signup-firstname");
const lastname = document.getElementById("signup-lastname");
const username = document.getElementById("signup-username");
const email = document.getElementById("signup-email");
const password = document.getElementById("signup-password");
const confirmPassword = document.getElementById("signup-confirm-password");
const passwordBtn = document.getElementById("password-btn");

username.style.display = "none";
email.style.display = "none";
password.style.display = "none";
confirmPassword.style.display = "none";
passwordBtn.style.display = "none";

firstname.addEventListener("input", (e) => {
  if (firstname.value.length !== 0) {
    firstname.value = (
      firstname.value[0].toUpperCase() + firstname.value.slice(1).toLowerCase()
    ).trim();
    firstname.value = firstname.value.replace(/\s/g, "");
    firstname.value = firstname.value.replace(/[^a-zA-Z]/g, "");
    signupDetails.firstname = firstname.value;
    if (signupDetails.firstname.length >= 2) {
      firstname.style.border = "0px";
    }
  }
});
firstname.addEventListener("keydown", (e) => {
  if (firstname.value.length === 1) {
    if (e.key === "Backspace") {
      signupDetails.firstname = "";
    }
  }
});

lastname.addEventListener("input", (e) => {
  if (lastname.value.length !== 0) {
    lastname.value = (
      lastname.value[0].toUpperCase() + lastname.value.slice(1).toLowerCase()
    ).trim();
    lastname.value = lastname.value.replace(/\s/g, "");
    lastname.value = lastname.value.replace(/[^a-zA-Z]/g, "");

    signupDetails.lastname = lastname.value;
    if (signupDetails.lastname.length >= 2) {
      lastname.style.border = "0px";
    }
  }
});
lastname.addEventListener("keydown", (e) => {
  if (lastname.value.length === 1) {
    if (e.key === "Backspace") {
      signupDetails.lastname = "";
    }
  }
});

username.addEventListener("input", (e) => {
  if (username.value.length !== 0) {
    username.value = username.value.toLowerCase().trim();
    username.value = username.value.replace(/\s/g, "");
    username.value = username.value.replace(/[^a-zA-Z0-9]/g, "");
    signupDetails.username = username.value;
    if (signupDetails.username.length >= 2) {
      username.style.border = "0px";
    }
  }
});
username.addEventListener("keydown", (e) => {
  if (username.value.length === 1) {
    if (e.key === "Backspace") {
      signupDetails.username = "";
    }
  }
});

email.addEventListener("input", (e) => {
  if (email.value.length !== 0) {
    email.value = email.value.toLowerCase().trim();
    email.value = email.value.replace(/\s/g, "");
    signupDetails.email = email.value;
    if (signupDetails.email.length >= 2) {
      email.style.border = "0px";
    }
  }
});
email.addEventListener("keydown", (e) => {
  if (email.value.length === 1) {
    if (e.key === "Backspace") {
      signupDetails.email = "";
    }
  }
});

passwordBtn.addEventListener("click", (e) => {
  if (passwordBtn.classList.contains("fa-eye")) {
    passwordBtn.classList.replace("fa-eye", "fa-eye-slash");
    password.type = "text";
    confirmPassword.type = "text";
  } else {
    passwordBtn.classList.replace("fa-eye-slash", "fa-eye");
    password.type = "password";
    confirmPassword.type = "password";
  }
});

password.addEventListener("input", (e) => {
  if (password.value.trim().length !== 0) {
    passwordBtn.className = "fa-regular fa-eye password-btn";
    password.value = password.value.trim();
    signupDetails.password = password.value;
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

confirmPassword.addEventListener("input", (e) => {
  if (confirmPassword.value.trim().length !== 0) {
    passwordBtn.className = "fa-regular fa-eye password-btn";
    confirmPassword.value = confirmPassword.value.trim();
    signupDetails.confirmPassword = confirmPassword.value;
  }
});
confirmPassword.addEventListener("keydown", (e) => {
  if (confirmPassword.value.length === 1) {
    if (e.key === "Backspace") {
      signupDetails.confirmPassword = "";
      if (signupDetails.password.length === 0) {
        passwordBtn.className = "";
      }
    }
  }
});

createBtn.addEventListener("click", (e) => {
  if (createBtn.dataset.type === "create-btn") {
    if (
      signupDetails.firstname.length >= 2 &&
      signupDetails.lastname.length >= 2 &&
      signupDetails.firstname.length <= 15 &&
      signupDetails.lastname.length <= 15
    ) {
      createBtn.dataset.type = "next-btn";
      createBtn.value = "Next";
      firstname.style.display = "none";
      lastname.style.display = "none";
      username.style.display = "block";
      email.style.display = "block";
      email.classList.remove("hidden");
      loginBtn.value = "Step 2 / 3";
      loginBtn.style.backgroundColor = "rgb(0,0,0,0)";
      loginBtn.parentElement.replaceWith(loginBtn);
      loginBtn.style.cursor = "default";
      firstname.disabled = true;
      lastname.disabled = true;
    } else {
      if (signupDetails.firstname.length < 2) {
        firstname.style.border = "1px red solid";
        firstname.value = "";
        firstname.placeholder = "Invalid First Name";
        firstname.disabled = true;
        setTimeout(() => {
          firstname.placeholder = "First Name";
          firstname.disabled = false;
          firstname.value = signupDetails.firstname;
        }, 1500);
        setTimeout(() => {
          firstname.style.border = "0px";
        }, 5000);
      }
      if (signupDetails.firstname.length > 15) {
        firstname.style.border = "1px red solid";
        firstname.value = "";
        firstname.placeholder = "Invalid First Name";
        firstname.disabled = true;
        setTimeout(() => {
          firstname.placeholder = "First Name";
          firstname.disabled = false;
          firstname.value = signupDetails.firstname;
        }, 1500);
        setTimeout(() => {
          firstname.style.border = "0px";
        }, 5000);
      }
      if (signupDetails.lastname.length < 2) {
        lastname.style.border = "1px red solid";
        lastname.value = "";
        lastname.placeholder = "Invalid Last Name";
        lastname.disabled = true;
        setTimeout(() => {
          lastname.placeholder = "Last Name";
          lastname.disabled = false;
          lastname.value = signupDetails.lastname;
        }, 1500);
        setTimeout(() => {
          lastname.style.border = "0px";
        }, 5000);
      }
      if (signupDetails.lastname.length > 15) {
        lastname.style.border = "1px red solid";
        lastname.value = "";
        lastname.placeholder = "Invalid Last Name";
        lastname.disabled = true;
        setTimeout(() => {
          lastname.placeholder = "Last Name";
          lastname.disabled = false;
          lastname.value = signupDetails.lastname;
        }, 1500);
        setTimeout(() => {
          lastname.style.border = "0px";
        }, 5000);
      }
    }
  } else if (createBtn.dataset.type === "next-btn") {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (
      signupDetails.username.length >= 3 &&
      signupDetails.email.match(emailRegex) &&
      signupDetails.username.length <= 15 &&
      signupDetails.email.length <= 30
    ) {
      email.disabled = true;
      username.disabled = true;
      createBtn.disabled = true;
      createBtn.style.cursor = "wait";
      loginBtn.style.display = "none";
      createBtn.parentNode.insertBefore(
        loadingContainer,
        createBtn.nextSibling
      );
      createBtn.style.backgroundColor = "#ff4747";
      createBtn.style.cursor = "wait";

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
      document.getElementById("loadingContainer").style.display = "flex";
      fetch(`${proxy}/api/signup/step2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: signupDetails.username,
          email: signupDetails.email,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setTimeout(() => {
            loginBtn.value = "Step 2 / 2";
            createBtn.style.cursor = "pointer";
            createBtn.disabled = false;
            loginBtn.style.display = "block";
            document.getElementById("loadingContainer").style.display = "none";
            if (data.data.username === "not available") {
              username.style.border = "1px red solid";
              username.value = "";
              username.placeholder = "Username is already taken";
              username.disabled = true;
              setTimeout(() => {
                username.placeholder = "Username";
                username.disabled = false;
                email.disabled = false;
                username.value = signupDetails.username;
              }, 1300);
              setTimeout(() => {
                username.style.border = "0px";
              }, 5000);
            }
            if (data.data.email === "not available") {
              email.style.border = "1px red solid";
              email.value = "";
              email.placeholder = "Email is already in use";
              email.disabled = true;
              setTimeout(() => {
                email.placeholder = "Email Address";
                email.disabled = false;
                email.value = signupDetails.email;
                username.disabled = false;
              }, 1300);
              setTimeout(() => {
                email.style.border = "0px";
              }, 5000);
            }
            if (
              data.data.username === "available" &&
              data.data.email === "available"
            ) {
              username.style.display = "none";
              email.style.display = "none";
              password.style.display = "block";
              confirmPassword.style.display = "block";
              createBtn.style.marginTop = "25px";
              document.getElementById("loadingContainer").style.display =
                "none";
              loginBtn.style.display = "block";
              loginBtn.value = "Step 3 / 3";
              createBtn.style.cursor = "pointer";
              createBtn.style.backgroundColor = "rgb(255, 54, 54)";
              createBtn.disabled = false;
              createBtn.dataset.type = "join-btn";
              createBtn.value = "Join Now";
              passwordBtn.style.display = "block";
            }
          }, 1800);
        });
    } else {
      if (signupDetails.username.length < 3) {
        username.style.border = "1px red solid";
        username.value = "";
        username.placeholder = "Invalid Username";
        username.disabled = true;
        setTimeout(() => {
          username.placeholder = "Username";
          username.disabled = false;
          username.value = signupDetails.username;
        }, 1500);
        setTimeout(() => {
          username.style.border = "0px";
        }, 5000);
      }
      if (signupDetails.username.length > 15) {
        username.style.border = "1px red solid";
        username.value = "";
        username.placeholder = "Invalid Username";
        username.disabled = true;
        setTimeout(() => {
          username.placeholder = "Username";
          username.disabled = false;
          username.value = signupDetails.username;
        }, 1500);
        setTimeout(() => {
          username.style.border = "0px";
        }, 5000);
      }
      if (!signupDetails.email.match(emailRegex)) {
        email.style.border = "1px red solid";
        email.value = "";
        email.placeholder = "Invalid Email Address";
        email.disabled = true;
        setTimeout(() => {
          email.placeholder = "Email Address";
          email.disabled = false;
          email.value = signupDetails.email;
        }, 1500);
        setTimeout(() => {
          email.style.border = "0px";
        }, 5000);
      } else if (signupDetails.email.length > 30) {
        email.style.border = "1px red solid";
        email.value = "";
        email.placeholder = "Invalid Email Address";
        email.disabled = true;
        setTimeout(() => {
          email.placeholder = "Email Address";
          email.disabled = false;
          email.value = signupDetails.email;
        }, 1500);
        setTimeout(() => {
          email.style.border = "0px";
        }, 5000);
      }
    }
  } else if (createBtn.dataset.type === "join-btn") {
    if (
      signupDetails.password.length > 7 &&
      signupDetails.confirmPassword.length > 7 &&
      signupDetails.password === signupDetails.confirmPassword &&
      signupDetails.password.length <= 50 &&
      signupDetails.confirmPassword.length <= 50
    ) {
      loadingContainer.style.display = "flex";
      loginBtn.style.display = "none";
      createBtn.style.backgroundColor = "#ff4747";
      createBtn.style.cursor = "wait";
      createBtn.disabled = true;
      password.disabled = true;
      confirmPassword.disabled = true;
      passwordBtn.style.opacity = "0%";
      fetch(`${proxy}/api/signup/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: signupDetails.firstname,
          lastname: signupDetails.lastname,
          username: signupDetails.username,
          email: signupDetails.email,
          password: signupDetails.password,
          confirmPassword: signupDetails.confirmPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setTimeout(() => {
            if (data.status === "success") {
              SetCookies("token", data.data.token);
              window.location.replace(`${proxy}/`);
            } else {
              if (
                data.status === "user exists" ||
                data.status === "access denied"
              ) {
                loadingContainer.style.display = "none";
                loginBtn.style.display = "block";
                loginBtn.value = "Something went wrong";
                loginBtn.style.fontWeight = "500";
                loginBtn.style.color = "#fa3e3e";
              }
            }
          }, 1500);
        });
    } else {
      if (signupDetails.password !== signupDetails.confirmPassword) {
        password.style.border = "1px red solid";
        password.value = "";
        password.placeholder = "Passwords Mismatched";
        password.disabled = true;
        confirmPassword.style.border = "1px red solid";
        confirmPassword.value = "";
        confirmPassword.placeholder = "Passwords Mismatched";
        confirmPassword.disabled = true;
        setTimeout(() => {
          password.placeholder = "Enter Password";
          password.disabled = false;
          password.value = signupDetails.password;
          confirmPassword.placeholder = "Confirm Password";
          confirmPassword.disabled = false;
          confirmPassword.value = signupDetails.confirmPassword;
        }, 1500);
        setTimeout(() => {
          password.style.border = "0px";
          confirmPassword.style.border = "0px";
        }, 5000);
      } else if (
        signupDetails.password.length < 8 ||
        signupDetails.password.length < 8
      ) {
        password.style.border = "1px red solid";
        password.value = "";
        password.placeholder = "Password is too short";
        password.disabled = true;
        confirmPassword.style.border = "1px red solid";
        confirmPassword.value = "";
        confirmPassword.placeholder = "Password is too short";
        confirmPassword.disabled = true;
        setTimeout(() => {
          password.placeholder = "Enter Password";
          password.disabled = false;
          password.value = signupDetails.password;
          confirmPassword.placeholder = "Confirm Password";
          confirmPassword.disabled = false;
          confirmPassword.value = signupDetails.confirmPassword;
        }, 1500);
        setTimeout(() => {
          password.style.border = "0px";
          confirmPassword.style.border = "0px";
        }, 5000);
      } else if (
        signupDetails.password.length > 50 ||
        signupDetails.confirmPassword.length > 50
      ) {
        password.style.border = "1px red solid";
        password.value = "";
        password.placeholder = "Password is too long";
        password.disabled = true;
        confirmPassword.style.border = "1px red solid";
        confirmPassword.value = "";
        confirmPassword.placeholder = "Password is too long";
        confirmPassword.disabled = true;
        setTimeout(() => {
          password.placeholder = "Enter Password";
          password.disabled = false;
          password.value = signupDetails.password;
          confirmPassword.placeholder = "Confirm Password";
          confirmPassword.disabled = false;
          confirmPassword.value = signupDetails.confirmPassword;
        }, 1500);
        setTimeout(() => {
          password.style.border = "0px";
          confirmPassword.style.border = "0px";
        }, 5000);
      }
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
