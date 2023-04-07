init();

function init() {
  getWorks();
  isUserConnected();
}

// Affichage des travaux

async function getWorks() {
  const gallery = document.querySelector(".gallery");
  const figures = [];

  const filtres = document.querySelectorAll(".filtres button");
  const all = document.querySelector(".all");

  const buttons = document.querySelectorAll("button");

  let Api = "http://localhost:5678/api/works";

  try {
    const response = await fetch(Api);
    const works = await response.json();

    for (let i in works) {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");

      img.setAttribute("src", works[i].imageUrl);
      img.setAttribute("alt", works[i].title);
      img.setAttribute("cross-origin", "anonymous");
      figure.setAttribute("data-id", works[i].categoryId);

      figcaption.innerHTML = works[i].title;

      figure.append(img, figcaption);
      gallery.append(figure);
      figures.push(figure);

      console.log(works);
    }
  } catch (error) {
    console.error(" Attention il y a une erreur");
  }

  // Filtrage des travaux

  for (let button of filtres) {
    button.addEventListener("click", function () {
      for (let figure of figures) {
        if (figure.getAttribute("data-id") === button.getAttribute("data-id")) {
          figure.style.display = "block";
        } else if (button === all) {
          figure.style.display = "block";
        } else {
          figure.style.display = "none";
        }
      }
    });

    // Style des boutons lors du click

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

// Déconnexion utilisateur unique

function isUserConnected() {
  const modifyBtn = document.querySelectorAll(".modale-bloc");
  const filtres = document.querySelector(".filtres");

  if (sessionStorage.userToken) {
    let loginLink = document.getElementById("login-link");
    loginLink.innerHTML = "logout";

    let url = loginLink.getAttribute("href") + "?logout=true";
    loginLink.setAttribute("href", url);

    modifyBtn.forEach((element) => {
      element.classList.remove("display-none");
      filtres.classList.add("hidden");
    });
  }
}

// Bouton retour au top de la page

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("back-to-top").classList.add("show");
  } else {
    document.getElementById("back-to-top").classList.remove("show");
  }
}

// Message envoi du formulaire de contact

const form = document.querySelector("#contact form");
const confirmation = document.querySelector("#confirmation");
const errorContact = document.getElementById("error-contact");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");

  if (
    name.value.trim() === "" ||
    email.value.trim() === "" ||
    message.value.trim() === ""
  ) {
    errorContact.style.opacity = "1";
  } else {
    confirmation.classList.add("show");
    errorContact.style.opacity = "0";
  }
});
