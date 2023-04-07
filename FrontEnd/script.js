getWorks(); // initalise la fonction getWorks

async function getWorks() {
  // fonction asynchrone
  const gallery = document.querySelector(".gallery"); // selection de la balise HTML
  const figures = []; // tableau vide (push le remplit grâce à la boucle FOR)

  const filtres = document.querySelectorAll(".filtres button");
  const tous = document.querySelector(".tous");

  const buttons = document.querySelectorAll("button");

  try {
    // Try ou Catch
    const response = await fetch("http://localhost:5678/api/works"); // connexion à l'API
    const works = await response.json(); // réponse de l'API (await permet d'attendre la rep)

    for (let i in works) {
      // boucle qui parcours les éléments de works
      const figure = document.createElement("article"); // créer l'élement HTML contenant
      const img = document.createElement("img"); // créer l'élement HTML image
      const figcaption = document.createElement("figcaption"); // créer l'élément HTML sous-titre

      img.setAttribute("src", works[i].imageUrl); // ajoute la source photo
      img.setAttribute("alt", works[i].title); // ajoute l'attribut "ALT" à la photo
      img.setAttribute("cross-origin", "anonymous"); // Tout le monde peut charger la page

      figure.setAttribute("data-id", works[i].categoryId); // récupere et assigne categoryId à figure

      figcaption.innerHTML = works[i].title; // ajoute le titre de l'image

      figure.append(img, figcaption); // ajoute img et figcaption à l'élement parent (figure)
      gallery.append(figure); // ajoute figure à gallery
      figures.push(figure); // ajoute figure au tableau vide figures
      console.log(figure);
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
