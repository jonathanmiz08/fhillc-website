const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.nav-menu')
const options = document.querySelector('#services-menu')
const service = document.querySelector('#services')

menu.addEventListener('click', function () {
    menu.classList.toggle('is-active')
    menuLinks.classList.toggle('active');
})


service.addEventListener('click', function() {
    options.classList.toggle('active')
    service.classList.toggle('active')
})





let imageData = [];
let categories = ['all'];
function createFilterButtons() {
    const filterButtons = document.getElementById('all-filter-buttons');
    filterButtons.innerHTML = '';

    // First, create buttons for all categories
    const uniqueCategories = ['all', ...new Set(imageData.flatMap(img => img.categories))];

    uniqueCategories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-button';
        // Add active class only to 'all' button initially
        if (category === 'all') {
            button.classList.add('active');
        }
        button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-button').forEach(btn => {
                btn.classList.remove('active');
            });
            // Add active class to clicked button
            button.classList.add('active');
            // Filter the images
            filterImages(category);
        });
        filterButtons.appendChild(button);
    });
}




function createImageGrid() {
    const imageGrid = document.getElementById('image-grid');
    if (!imageGrid) {
        console.error('Image grid element not found');
        return;
    }

    imageGrid.innerHTML = '';

    imageData.forEach(image => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.dataset.categories = JSON.stringify(image.categories);

        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';



        const img = document.createElement('img');
        /*img.dataset.src = image.src;

         */
        img.src = image.src
        img.alt = image.alt;


        img.addEventListener('load', () => {
            img.classList.add('loaded');
            spinner.remove();
        });


        img.addEventListener('error', () => {
            spinner.remove();
            imageItem.innerHTML = `<div class="error-message">Failed to load image: ${image.alt}</div>`;
        });

        imageItem.appendChild(spinner);



        imageItem.appendChild(img);
        imageGrid.appendChild(imageItem);
    });
}

/*
function setupLazyLoading() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target.querySelector('img');
                if (img && img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    });

    document.querySelectorAll('.image-item').forEach(item => {
        observer.observe(item);
    });
}


 */

function filterImages(category) {
    // No need to handle button states here anymore
    document.querySelectorAll('.image-item').forEach(item => {
        const imageCategories = JSON.parse(item.dataset.categories);
        const shouldShow = category === 'all' || imageCategories.includes(category);
        item.classList.toggle('hidden', !shouldShow);
    });

    /*setupLazyLoading();

     */
}


function showError(message) {
    const imageGrid = document.getElementById('image-grid');
    imageGrid.innerHTML = `
                <div class="error-message">
                    ${message}
                </div>
            `;
}

async function loadGallery() {
    try {
        // Adjust this path to match your file structure
        const response = await fetch('./images.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        imageData = await response.json();
        categories = ['all', ...new Set(imageData.flatMap(img => img.categories))];


        createFilterButtons();




        createImageGrid();


        /*setupLazyLoading();

         */



    } catch (error) {
        console.error('Error loading gallery:', error);
        showError(`Failed to load the image gallery: ${error.message}`);
    }
}

// Start when page loads
loadGallery();