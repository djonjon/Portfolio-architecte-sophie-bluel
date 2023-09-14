// Récupération du token dans le stockage local
const storedToken = localStorage.getItem('token');
    
// Vérifie que le token est stocké 
if (storedToken) {
    // Affiche l'élément HTML pour l'administrateur connecté
  const adminElement = document.getElementById('edit');
  adminElement.style.display = 'flex';
}

// Récupération des données via l'API
async function fetchWork (){
    const r = await fetch("http://localhost:5678/api/works", {
        method: 'GET',
        headers: {
            'accept': 'application/json',
        }
    })
    if (r.ok === true) {
        return r.json();
    }
    throw new Error ('Impossible de contacter le serveur')
}

// création des éléments HTML pour afficher les images et les titres associés dans la galerie
function pictures(dataPicture) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML ='';

    dataPicture.forEach( item => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = item.imageUrl;
        img.alt = item.title;
        figcaption.textContent = item.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
    });
}
// l'affichage gallery par défaut au chargement  
window.addEventListener('load', function() {
    filterPictByCat('Tous');
});

// Ajout de la class .active au bouton sélectionné
function categoryActive(category) {
    const buttons = document.querySelectorAll('.btnCat');
    buttons.forEach( button => {
        if  (button.textContent === category) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function filterPictByCat(category) {
    // obtenir les données des images
    fetchWork()
        .then(data => {
            if (category === 'Tous') {
                pictures(data);
            }else {
                // Filtre les données par categorie 
                const filterData = data.filter(item => item.category.name === category);
                pictures(filterData);
            }

            // Appelle la fonction pour définir la catégorie active
            categoryActive(category);
        })
        .catch(error => {
            console.error("Une erreur s'est produite", error);
        });
}

// Modal
const modal = document.querySelector('.modal')
const modalContent = document.getElementById('modal-content')
const fermerModalBtn = document.getElementById('fermer-modal')
const btnAddPict = document.getElementById('btn-add-pict')
//let focusableElements

function openModal(){
    modal.style.display = 'flex'
    document.body.style.overflow = 'hidden'
    modal.addEventListener('click', clickOutModal)
    //focusableElements = modal.querySelectorAll('button, input, a, select,textarea, figure i')
    //focusableElements[0].focus()

    //modal.addEventListener('keydown', gestionFocusModal)
}

// function gestionFocusModal(e){
//     if (e.key === 'tab') {
//         if (e.shiftKey) {
//             if (document.activeElement === focusableElements[0]) {
//                 e.preventDefault()
//                 focusableElements[focusableElements.lenght - 1].focus
//             }
//         } else {
//             if (document.activeElement === focusableElements[focusableElements.lenght - 1]){
//                 e.preventDefault()
//                 focusableElements[0].focus()
//             }
//         }
//     }

// }

function clickOutModal(e){
    if (e.target === modal) {
        fermerModal();
        modal.removeEventListener('click', clickOutModal)
    }
}

function fermerModal(){
    modal.style.display = 'none'
    document.body.style.overflow = 'auto'
    //modal.removeEventListener('keydown', gestionFocusModal)
}

function modalAddPict() {
    const titleModal = document.getElementById('title-modal')
    titleModal.textContent = 'Ajout photo'
}

document.getElementById('edit').addEventListener('click', openModal);

fermerModalBtn.addEventListener('click', fermerModal)

// fonction pour afficher les photos dans la modal 
function galleryModal(modalData) {
    const galleryModal = document.querySelector('.modal-gallery');
    galleryModal.innerHTML ='';

    modalData.forEach( item => {
        const figure = document.createElement('figure')
        const img = document.createElement('img')
        const poubelle = document.createElement('i')

        img.src = item.imageUrl
        img.alt = item.title
        poubelle.classList.add('fa-solid', 'fa-trash-can')

        // Récupération de l'ID de la photo et attribution de l'ID à la corbeille
        const photoId = item.id
        poubelle.setAttribute('data-photo-id', photoId)

        // Gestionnaire d'événements au clic sur la corbeille 
        poubelle.addEventListener('click', () => {
            const confirmation = window.confirm('Êtes-vous sûr de vouloir cette photo ?')
            if (confirmation) {
                deletePhoto(photoId)
            }
        })
        figure.appendChild(img);
        galleryModal.appendChild(figure)
        figure.appendChild(poubelle)
    });
}

// function suppression photo

async function deletePhoto(photoId) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${photoId}`, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            }

        })

        if (response.ok) {
            // Photo supprimée et mise à jour de la gallery
            picturesModal()
        } else {
            console.error("La suppression de la photo a échoué")
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de la photo", error)
    }
}

// function récupération et affichage des photos dans la modal
function picturesModal(){
    fetchWork()
        .then(modalData => {
            galleryModal(modalData);
            openModal();
        })
        .catch(error => {
            console.error("Erreur Serveur", error)
        });
}

document.getElementById('edit').addEventListener('click', picturesModal);
