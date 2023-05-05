// récupérer les paramètres passés dans le storage/URL
const params = new URLSearchParams(document.location.search);

// vérifie si le paramètre "logout" est présent dans le storage
if (params.get("logout")) {
  // si oui, supprime les informations stockées dans le local
  sessionStorage.removeItem("userToken");
  localStorage.removeItem("deletedFigures");
  window.location.href = "index.html";
} else {
  // si non, ajoute addEventListener sur l'envoi formulaire
  const form = document.getElementById("login");
  const error = document.querySelector(".error");

  form.addEventListener("submit", (event) => {
    // empêche le comportement par défaut(recharger la page)
    event.preventDefault();

    // récuperation des données(sans espaces)
    // value.trim supprime les espaces aux deux extrémités
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    // si oui, une requête POST est envoyée à l'API users/login
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
            // si la réponse est négative msg error
            error.style.opacity = "1";
          } else {
            if (data.token) {
              // Si ok, le token de l'utilisateur est stocké dans la session et l'utilisateur est redirigé vers la page d'accueil
              sessionStorage.setItem("userToken", data.token);
              window.location.href = "index.html";
              // affiche le mode édition
              // const modal = document.querySelector(".modal-header");
              // modal.style.display = "flex";
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
