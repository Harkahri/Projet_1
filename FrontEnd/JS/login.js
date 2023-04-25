const params = new URLSearchParams(document.location.search);

if (params.get("logout")) {
  sessionStorage.removeItem("userToken");
  localStorage.removeItem("deletedFigures");
  window.location.href = "index.html";
} else {
  const form = document.getElementById("login");
  const error = document.querySelector(".error");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (email.length > 0 && password.length > 0) {
      fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "user not found") {
            error.style.opacity = "1";
          } else {
            if (data.token) {
              sessionStorage.setItem("userToken", data.token);
              window.location.href = "index.html";

              const modal = document.querySelector(".modal-header");
              modal.style.display = "flex";
            } else {
              error.style.opacity = "1";
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      error.style.opacity = "1";
    }
  });
}
