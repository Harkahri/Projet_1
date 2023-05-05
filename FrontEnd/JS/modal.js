openModal(); // initalise la fonction openModal
addImage(); // initialise la fonction add

const token = sessionStorage.getItem("userToken");

function openModal() {
  const edit = document.querySelector(".edit");
  const edit2 = document.querySelector(".edit3Btn");

  const overlay = document.querySelector(".modal-overlay");
  const modalPop = document.querySelector(".modal-pop");

  edit.addEventListener("click", function (m) {
    m.preventDefault();
    modalPop.style.display = "flex";
    overlay.style.display = "block";
  });

  edit2.addEventListener("click", function (m) {
    m.preventDefault();
    modalPop.style.display = "flex";
    overlay.style.display = "block";
  });

  const modalAdd = document.querySelector(".modal-add");
  const modalPop2 = document.querySelector(".modal-pop2");

  modalAdd.addEventListener("click", function (m) {
    m.preventDefault();
    modalPop2.style.display = "flex";
  });
  getWorks(); // appelle la fonction getWorks

  // function close

  const close = document.querySelector(".close");

  close.addEventListener("click", function (m) {
    m.preventDefault();
    modalPop.style.display = "none";
    overlay.style.display = "none";
  });

  const close2 = document.querySelector(".close2");

  close2.addEventListener("click", function (m) {
    m.preventDefault();
    modalPop.style.display = "none";
    modalPop2.style.display = "none";
    overlay.style.display = "none";
  });

  overlay.addEventListener("click", function (m) {
    m.preventDefault();
    modalPop.style.display = "none";
    modalPop2.style.display = "none";
    overlay.style.display = "none";
  });

  const back = document.querySelector(".back");

  back.addEventListener("click", function (m) {
    m.preventDefault();
    modalPop2.style.display = "none";
  });

  const done = document.querySelector(".modal-done");

  done.addEventListener("click", function (m) {
    m.preventDefault();
    modalPop2.style.display = "none";

    getWorks();
  });
}

async function getWorks() {
  const gallery = document.querySelector(".modal-gallery");
  const figures = [];

  let cachedData = localStorage.getItem("works"); // récupérer les données depuis le cache

  if (cachedData) {
    // si les données existent dans le cache
    cachedData = JSON.parse(cachedData); // les données sont transformées en objet JS
    for (let w in cachedData) {
      const figure = createFigureElement(cachedData[w]);
      figures.push(figure);
      gallery.append(figure);
    }
  } else {
    // si les données n'existent pas dans le cache
    try {
      const response = await fetch("http://localhost:5678/api/works");
      const works = await response.json();

      for (let w in works) {
        const figure = createFigureElement(works[w]);
        figures.push(figure);
        gallery.append(figure);
      }

      localStorage.setItem("works", JSON.stringify(works)); // stocker les données dans le cache
    } catch (error) {
      console.error("Une erreur est survenue");
    }
  }
  refreshWorks();
}

function createFigureElement(work) {
  const figure = document.createElement("article");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  const supprimer = document.createElement("span");
  const deplacer = document.createElement("span");

  img.setAttribute("src", work.imageUrl);
  img.setAttribute("alt", work.title);

  img.setAttribute("cross-origin", "anonymous");

  figure.setAttribute("data-id", work.categoryId);
  figure.setAttribute("id", work.id);

  figcaption.innerHTML = "<a href=#>éditer</a>";
  supprimer.classList.add("supprimer");
  supprimer.innerHTML = '<i class="fa-regular fa-trash-can iconDelete"></i>';
  deplacer.classList.add("deplacer");
  deplacer.innerHTML =
    '<i class="fa-solid fa-arrows-up-down-left-right iconDeplacer"></i>';

  figure.appendChild(supprimer);
  figure.appendChild(deplacer);
  figure.append(img, figcaption);

  supprimer.addEventListener("click", function (m) {
    m.preventDefault();

    deleteWorks(m);
  });

  return figure;
}

function addImage() {
  const input = document.getElementById("file");

  input.addEventListener("change", (event) => {
    event.preventDefault();

    const image = event.target.files[0];
    const preview = document.createElement("img");

    preview.src = URL.createObjectURL(image);
    preview.width = 129;
    preview.height = 169;

    const previewContainer = document.querySelector(".modal-adding");
    previewContainer.appendChild(preview);

    const label = document.getElementById("buttonAjout");
    const modalAdd = document.getElementById("format-photo");
    const svg = document.getElementById("svg-img");

    modalAdd.style.display = "none";
    label.style.display = "none";
    svg.style.display = "none";
  });
}

const modalDone = document.querySelector(".modal-done");

modalDone.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  // Récupérer les informations du formulaire

  const titre = document.getElementById("titre").value.trim();
  const categorie = document.getElementById("modal-categorie").value.trim();
  const image = document.getElementById("file").files[0];

  // Créer un objet FormData pour envoyer les données
  if (titre === "" || categorie === "" || !image) {
    event.preventDefault(); // Annuler l'envoi du formulaire
    alert("Veuillez remplir tous les champs et ajouter une image.");
  } else {
    const formData = new FormData();
    formData.append("title", titre);
    formData.append("category", categorie);
    formData.append("image", image);

    // Envoyer la requête POST à l'API

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Projet ajouté !");
        console.log(data);

        const figure = document.createElement("figure");
        const figcaption = document.createElement("figcaption");
        const img = document.createElement("img");
        const container = document.querySelector(".gallery");

        figure.setAttribute("data-id", categorie);
        figcaption.textContent = titre;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        container.appendChild(figure);

        refreshWorks();

        // Réinitialiser le formulaire
        document.getElementById("titre").value = "";
        document.getElementById("modal-categorie").value = "";
        document.getElementById("myForm").reset();
        const previewContainer = document.querySelector(".modal-adding");
        previewContainer.innerHTML = "";
      })
      .catch((error) => console.error(error));
  }
});

async function deleteWorks(m) {
  console.log("deleteWorks called");
  m.preventDefault(); // empêche le rechargement de la page
  m.stopPropagation(); // empêche la propagation en dehors de l'event "m"

  let article = m.target.closest("article");
  let projectId = article.getAttribute("id");
  let project = article.querySelector("img").getAttribute("alt");

  // afficher la boîte de confirmation avant de supprimer
  const ok = window.confirm(
    `Vous allez supprimer le projet ${project}. Êtes-vous sur ?`
  );

  if (!ok) {
    return; // annuler la suppression si l'utilisateur n'a pas confirmé
  }

  var element = document.getElementById(projectId); // recuperation de l'id dans le DOM

  console.log("element: ", projectId);

  element.remove();
  article.remove();
  refreshWorks();

  console.log("sending DELETE request");
  fetch(`http://localhost:5678/api/works/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function refreshWorks() {
  const gallery = document.querySelector(".modal-gallery");
  gallery.innerHTML = ""; // effacer tous les éléments de la galerie
  localStorage.removeItem("works"); // effacer les données en cache

  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();

    for (let i in works) {
      const figure = createFigureElement(works[i]);
      gallery.append(figure);
    }

    localStorage.setItem("works", JSON.stringify(works)); // stocker les données dans le cache
  } catch (error) {
    console.error("Une erreur est survenue");
  }
}
