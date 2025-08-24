// WanderLust - Enhanced JavaScript for Responsive Experience

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeSearch();
    initializeFavorites();
    initializeImageHandling();
    initializeFormValidation();
    initializeTooltips();
    initializeLazyLoading();
    initializeInfiniteScroll();
    initializeGeolocation();
    
    // Mobile-specific features
    if (window.innerWidth <= 768) {
        initializeMobileOptimizations();
    }
});

// Navigation Enhancement
function initializeNavigation() {
    // Mobile menu auto-close
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: true
                });
            }
        });
    });
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Enhanced Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const priceFilter = document.getElementById('priceFilter');
    const countryFilter = document.getElementById('countryFilter');
    const listingCards = document.querySelectorAll('.listing-card');
    
    if (!searchInput) return;
    
    // Debounced search
    let searchTimeout;
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedPrice = priceFilter ? priceFilter.value : '';
        const selectedCountry = countryFilter ? countryFilter.value : '';
        
        listingCards.forEach(card => {
            const location = card.dataset.location?.toLowerCase() || '';
            const country = card.dataset.country?.toLowerCase() || '';
            const price = parseInt(card.dataset.price) || 0;
            
            let showCard = true;
            
            // Text search
            if (searchTerm && !location.includes(searchTerm) && !country.includes(searchTerm)) {
                showCard = false;
            }
            
            // Price filter
            if (selectedPrice && showCard) {
                const [minPrice, maxPrice] = selectedPrice.split('-').map(p => 
                    p.includes('+') ? Infinity : parseInt(p)
                );
                
                if (price < minPrice || (maxPrice !== undefined && price > maxPrice)) {
                    showCard = false;
                }
            }
            
            // Country filter
            if (selectedCountry && showCard && country !== selectedCountry.toLowerCase()) {
                showCard = false;
            }
            
            // Show/hide card with animation
            if (showCard) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    if (card.style.opacity === '0') {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        });
        
        // Update results count
        const visibleCards = Array.from(listingCards).filter(card => 
            card.style.display !== 'none'
        ).length;
        
        updateResultsCount(visibleCards);
    }
    
    // Event listeners with debouncing
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });
    
    if (priceFilter) priceFilter.addEventListener('change', performSearch);
    if (countryFilter) countryFilter.addEventListener('change', performSearch);
}

// Results count update
function updateResultsCount(count) {
    let resultElement = document.getElementById('results-count');
    if (!resultElement) {
        resultElement = document.createElement('div');
        resultElement.id = 'results-count';
        resultElement.className = 'text-muted mb-3';
        document.getElementById('listingsContainer')?.parentNode.insertBefore(
            resultElement, 
            document.getElementById('listingsContainer')
        );
    }
    
    resultElement.textContent = `${count} listing${count !== 1 ? 's' : ''} found`;
}

// Favorites System
function initializeFavorites() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const listingId = this.dataset.id;
            const heartIcon = this.querySelector('i');
            
            // Toggle heart icon
            if (heartIcon.classList.contains('far')) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                this.classList.add('active');
                addToFavorites(listingId);
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                this.classList.remove('active');
                removeFromFavorites(listingId);
            }
            
            // Add animation
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // Load existing favorites
    loadFavorites();
}

function addToFavorites(listingId) {
    let favorites = JSON.parse(localStorage.getItem('wanderlust-favorites') || '[]');
    if (!favorites.includes(listingId)) {
        favorites.push(listingId);
        localStorage.setItem('wanderlust-favorites', JSON.stringify(favorites));
        showNotification('Added to favorites!', 'success');
    }
}

function removeFromFavorites(listingId) {
    let favorites = JSON.parse(localStorage.getItem('wanderlust-favorites') || '[]');
    favorites = favorites.filter(id => id !== listingId);
    localStorage.setItem('wanderlust-favorites', JSON.stringify(favorites));
    showNotification('Removed from favorites!', 'info');
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('wanderlust-favorites') || '[]');
    
    favorites.forEach(listingId => {
        const button = document.querySelector(`[data-id="${listingId}"]`);
        if (button) {
            const heartIcon = button.querySelector('i');
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
            button.classList.add('active');
        }
    });
}

// Image Handling
function initializeImageHandling() {
    // Image upload preview
    const imageInput = document.getElementById('image');
    if (imageInput) {
        imageInput.addEventListener('change', handleImagePreview);
        
        // Drag and drop functionality
        const uploadArea = imageInput.closest('.mb-3');
        if (uploadArea) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, preventDefaults, false);
            });
            
            ['dragenter', 'dragover'].forEach(eventName => {
                uploadArea.addEventListener(eventName, highlight, false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, unhighlight, false);
            });
            
            uploadArea.addEventListener('drop', handleDrop, false);
        }
    }
    
    // Image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

function handleImagePreview(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showNotification('Please select a valid image file (JPG, PNG, WebP)', 'error');
        e.target.value = '';
        return;
    }
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size should be less than 5MB', 'error');
        e.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        createImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
}

function createImagePreview(src) {
    let preview = document.getElementById('imagePreview');
    if (!preview) {
        preview = document.createElement('div');
        preview.id = 'imagePreview';
        preview.className = 'mt-3';
        document.getElementById('image').closest('.mb-3').appendChild(preview);
    }
    
    preview.innerHTML = `
        <div class="position-relative d-inline-block">
            <img src="${src}" class="img-fluid rounded shadow-sm" 
                 style="max-width: 300px; max-height: 200px; object-fit: cover;" 
                 alt="Image preview">
            <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle" 
                    onclick="removeImagePreview()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

function removeImagePreview() {
    const preview = document.getElementById('imagePreview');
    const input = document.getElementById('image');
    
    if (preview) preview.remove();
    if (input) input.value = '';
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    e.target.classList.add('dragover');
}

function unhighlight(e) {
    e.target.classList.remove('dragover');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    const input = document.getElementById('image');
    
    if (files.length > 0) {
        input.files = files;
        handleImagePreview({ target: input });
    }
}

// Form Validation Enhancement
function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                
                // Focus on first invalid field
                const firstInvalidField = form.querySelector(':invalid');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                    firstInvalidField.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            }
            
            form.classList.add('was-validated');
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            });
        });
    });
}

// Tooltips and Popovers
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Lazy Loading
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-load');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy-load');
                img.classList.add('fade-in');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Infinite Scroll (for listings page)
function initializeInfiniteScroll() {
    if (!document.getElementById('listingsContainer')) return;
    
    let page = 1;
    let loading = false;
    let hasMore = true;
    
    const loadMoreListings = async () => {
        if (loading || !hasMore) return;
        
        loading = true;
        showLoadingSpinner();
        
        try {
            const response = await fetch(`/api/listings?page=${page + 1}&limit=12`);
            const data = await response.json();
            
            if (data.listings && data.listings.length > 0) {
                appendListings(data.listings);
                page++;
                hasMore = data.hasMore;
            } else {
                hasMore = false;
            }
        } catch (error) {
            console.error('Error loading more listings:', error);
            showNotification('Error loading more listings', 'error');
        }
        
        loading = false;
        hideLoadingSpinner();
    };
    
    // Intersection observer for infinite scroll
    const sentinel = document.createElement('div');
    sentinel.id = 'scroll-sentinel';
    document.getElementById('listingsContainer')?.parentNode.appendChild(sentinel);
    
    const sentinelObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadMoreListings();
        }
    });
    
    sentinelObserver.observe(sentinel);
}

function appendListings(listings) {
    const container = document.getElementById('listingsContainer');
    if (!container) return;
    
    listings.forEach(listing => {
        const listingCard = createListingCard(listing);
        container.appendChild(listingCard);
    });
}

function createListingCard(listing) {
    const div = document.createElement('div');
    div.className = 'col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4 listing-card';
    div.dataset.location = listing.location;
    div.dataset.country = listing.country;
    div.dataset.price = listing.price;
    
    div.innerHTML = `
        <div class="card h-100 shadow-sm border-0 listing-hover">
            <div class="position-relative overflow-hidden">
                <img src="${listing.image.url}" 
                     class="card-img-top listing-image" 
                     alt="${listing.title}"
                     style="height: 250px; object-fit: cover; transition: transform 0.3s;">
                
                <div class="position-absolute top-0 end-0 m-3">
                    <span class="badge bg-dark bg-opacity-75 rounded-pill px-3 py-2">
                        ${listing.price}/night
                    </span>
                </div>
                
                <div class="position-absolute top-0 start-0 m-3">
                    <button class="btn btn-light btn-sm rounded-circle favorite-btn" data-id="${listing._id}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
            
            <div class="card-body d-flex flex-column">
                <h5 class="card-title text-truncate mb-2">${listing.title}</h5>
                <p class="card-text text-muted small mb-2">
                    <i class="fas fa-map-marker-alt me-1"></i>
                    ${listing.location}, ${listing.country}
                </p>
                <p class="card-text flex-grow-1">
                    ${listing.description.length > 100 ? listing.description.substring(0, 100) + "..." : listing.description}
                </p>
                
                <div class="d-flex align-items-center mb-3">
                    <div class="text-warning me-2">
                        ${'<i class="fas fa-star"></i>'.repeat(5)}
                    </div>
                    <small class="text-muted">4.8 (12 reviews)</small>
                </div>
                
                <a href="/listings/${listing._id}" class="btn btn-outline-primary mt-auto">
                    <i class="fas fa-eye me-1"></i>View Details
                </a>
            </div>
        </div>
    `;
    
    return div;
}

// Geolocation
function initializeGeolocation() {
    const locationBtn = document.getElementById('useLocation');
    if (!locationBtn) return;
    
    locationBtn.addEventListener('click', () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    reverseGeocode(latitude, longitude);
                },
                (error) => {
                    showNotification('Unable to get your location', 'error');
                }
            );
        } else {
            showNotification('Geolocation is not supported by this browser', 'error');
        }
    });
}

async function reverseGeocode(lat, lng) {
    try {
        // This would typically use a real geocoding service
        const locationInput = document.getElementById('location');
        if (locationInput) {
            locationInput.value = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
            showNotification('Location detected!', 'success');
        }
    } catch (error) {
        showNotification('Error getting location details', 'error');
    }
}

// Mobile Optimizations
function initializeMobileOptimizations() {
    // Optimize touch events
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    });
    
    function handleSwipeGesture() {
        const swipeThreshold = 100;
        const difference = touchStartX - touchEndX;
        
        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                // Swipe left - could navigate to next page
                console.log('Swipe left detected');
            } else {
                // Swipe right - could navigate to previous page
                console.log('Swipe right detected');
            }
        }
    }
    
    // Optimize scroll performance on mobile
    let ticking = false;
    
    function updateScrollElements() {
        // Update any scroll-dependent elements here
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    });
    
    // Prevent zoom on form focus (iOS)
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const viewport = document.querySelector('meta[name=viewport]');
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
        });
        
        input.addEventListener('blur', () => {
            const viewport = document.querySelector('meta[name=viewport]');
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
        });
    });
}

// Utility Functions
function showLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.className = 'text-center my-4';
    spinner.innerHTML = `
        <div class="loading-spinner mx-auto"></div>
        <p class="text-muted mt-2">Loading more listings...</p>
    `;
    
    document.getElementById('listingsContainer')?.parentNode.appendChild(spinner);
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.remove();
}

function showNotification(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : type} border-0`;
    toast.setAttribute('role', 'alert');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Window resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Re-initialize mobile optimizations if needed
        if (window.innerWidth <= 768 && !window.mobileOptimized) {
            initializeMobileOptimizations();
            window.mobileOptimized = true;
        }
        
        // Update any layout-dependent elements
        updateLayoutElements();
    }, 250);
});

function updateLayoutElements() {
    // Update masonry layouts, recalculate positions, etc.
    const listingCards = document.querySelectorAll('.listing-card');
    listingCards.forEach(card => {
        card.style.transition = 'none';
        // Force reflow
        card.offsetHeight;
        card.style.transition = '';
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // Could send error reports to analytics service
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}