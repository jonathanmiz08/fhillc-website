const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar_menu')
menu.addEventListener('click', function () {
    menu.classList.toggle('is-active')
    menuLinks.classList.toggle('active');
})




let imageData = [];
let categories = ['all'];
function createFilterButtons() {
    const filterButtons = document.getElementById('filterButtons');
    filterButtons.innerHTML = '';

    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-button' + (category === 'all' ? ' active' : '');
        button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        button.addEventListener('click', () => filterImages(category));
        filterButtons.appendChild(button);
    });
}


function createImageGrid() {
    const imageGrid = document.getElementById('imageGrid');
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
        img.dataset.src = image.src;
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


function filterImages(category) {
    document.querySelectorAll('.filter-button').forEach(button => {
        button.classList.toggle('active', button.textContent.toLowerCase() === category);
    });

    document.querySelectorAll('.image-item').forEach(item => {
        const imageCategories = JSON.parse(item.dataset.categories);
        const shouldShow = category === 'all' || imageCategories.includes(category);
        item.classList.toggle('hidden', !shouldShow);
    });

    setupLazyLoading();
}


function showError(message) {
    const imageGrid = document.getElementById('imageGrid');
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


        setupLazyLoading();



    } catch (error) {
        console.error('Error loading gallery:', error);
        showError(`Failed to load the image gallery: ${error.message}`);
    }
}

// Start when page loads
loadGallery();