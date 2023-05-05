getWorks(); // initalise la fonction getWorks
UserConnected();

async function getWorks() {
  // fonction asynchrone
  const gallery = document.querySelector(".gallery"); // selection de la balise HTML
  const figures = []; // tableau vide (push le remplit grâce à la boucle FOR)

  const filtres = document.querySelectorAll(".filtres button");
  const tous = document.querySelector("#tous");

  const buttons = document.querySelectorAll(".filter-button");

  try {
    // Try ou Catch
    const response = await fetch("http://localhost:5678/api/works"); // connexion à l'API
    const works = await response.json(); // réponse de l'API (await permet d'attendre la rep)

    for (let w in works) {
      // boucle qui parcours les éléments de works
      const figure = document.createElement("article"); // créer l'élement HTML contenant
      const img = document.createElement("img"); // créer l'élement HTML image
      const figcaption = document.createElement("figcaption"); // créer l'élément HTML sous-titre

      img.setAttribute("src", works[w].imageUrl); // ajoute la source photo
      img.setAttribute("alt", works[w].title); // ajoute l'attribut "ALT" à la photo
      img.setAttribute("cross-origin", "anonymous"); // Tout le monde peut charger la page

      figure.setAttribute("data-id", works[w].categoryId); // récupere et assigne categoryId à figure

      figcaption.innerHTML = works[w].title; // ajoute le titre de l'image

      figure.append(img, figcaption); // ajoute img et figcaption à l'élement parent (figure)
      gallery.append(figure); // ajoute figure à gallery
      figures.push(figure); // ajoute figure au tableau vide figures

      // console.log(figure);
    }
  } catch (error) {
    console.error("Une erreur est survenue");
  }

  for (let button of filtres) {
    button.addEventListener("click", function () {
      for (let figure of figures) {
        if (button.getAttribute("data-id") === figure.getAttribute("data-id")) {
          // si button data-id est égal à figure data-id
          figure.style.display = "block"; //affiche alors les id correspondant
        } else if (button === tous) {
          // sinon si bouton est égal a tous
          figure.style.display = "block"; // affiche tous
        } else {
          // sinon
          figure.style.display = "none"; // sinon supprime les elements =/=
        }
      }
    });

    // changement de couleurs des boutons lors du clique
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((button) => {
          button.style.backgroundColor = "#FFFEF8";
          button.style.color = "#1D6154";
        });

        button.style.backgroundColor = "#1D6154";
        button.style.color = "#FFFEF8";
      });
    });
  }
}

function UserConnected() {
  // declaration des const
  const modal = document.querySelectorAll(".modal-header");
  const filtres = document.querySelector(".filtres");
  const editBtn = document.querySelector(".edit1");
  const editBtn2 = document.querySelector(".edit2");

  // vérifie si  "userToken" est stockée dans l'objet "sessionStorage"
  // Si oui, l'utilisateur est connecté et génère un logout
  if (sessionStorage.userToken) {
    let loginLink = document.getElementById("login");
    loginLink.innerHTML = "Logout";

    let url = loginLink.getAttribute("href") + "?logout=true";
    loginLink.setAttribute("href", url);

    // + ajout de la modale et des bouttons d'edit
    modal.forEach((element) => {
      element.classList.remove("display-none");
      filtres.classList.add("display-none");

      editBtn.style.display = "block";
      editBtn2.style.display = "flex";
    });
  }
}
