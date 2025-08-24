// Get URL parameters to show filtered results
const urlParams = new URLSearchParams(window.location.search);
const locationParam = urlParams.get('location');
const insurance = urlParams.get('insurance');
const specialty = urlParams.get('specialty');

// Initialize page with URL parameters
function initializePage() {
    console.log('=== INITIALIZING PAGE ===');
    console.log('URL parameters:', { location: locationParam, insurance, specialty });
    
    // Set dropdown values from URL parameters
    if (locationParam) {
        console.log(`Setting location filter to: ${locationParam}`);
        document.getElementById('locationFilter').value = locationParam;
    }
    if (insurance) {
        console.log(`Setting insurance filter to: ${insurance}`);
        document.getElementById('insuranceFilter').value = insurance;
    }
    if (specialty) {
        console.log(`Setting specialty filter to: ${specialty}`);
        document.getElementById('specialtyFilter').value = specialty;
    }
    
    console.log('Dropdown values after setting:');
    console.log('  Location:', document.getElementById('locationFilter').value);
    console.log('  Insurance:', document.getElementById('insuranceFilter').value);
    console.log('  Specialty:', document.getElementById('specialtyFilter').value);
    
    // Apply initial filtering from URL parameters
    console.log('Applying initial filters from URL parameters...');
    filterResults();
}

// Filter functionality
function filterResults() {
    console.log('=== FILTER RESULTS CALLED ===');
    const cards = document.querySelectorAll('.dietitian-card');
    const insuranceFilter = document.getElementById('insuranceFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    const specialtyFilter = document.getElementById('specialtyFilter').value;
    const modalitiesFilter = document.getElementById('modalitiesFilter').value;
    
    console.log('Current filter values:', {
        insurance: insuranceFilter,
        location: locationFilter,
        specialty: specialtyFilter,
        modalities: modalitiesFilter
    });
    
    // Get checked sidebar specialty filters
    const checkedSpecialties = [];
    document.querySelectorAll('#specialtyOptions input[type="checkbox"]:checked').forEach(checkbox => {
        checkedSpecialties.push(checkbox.value);
    });
    
    console.log('Checked specialties:', checkedSpecialties);
    
    let visibleCount = 0;
    
    cards.forEach((card, index) => {
        let show = true;
        const cardName = card.querySelector('.dietitian-name').textContent;
        
        // Get card data attributes
        const cardLocation = card.getAttribute('data-location');
        const cardInsurance = card.getAttribute('data-insurance');
        const cardSpecialties = card.getAttribute('data-specialties');
        const cardModalities = card.getAttribute('data-modalities');
        
        // Location filter - exact match required
        if (locationFilter) {
            const locationMatch = cardLocation === locationFilter;
            if (!locationMatch) {
                show = false;
                console.log(`${cardName} HIDDEN by location filter: "${locationFilter}" !== "${cardLocation}"`);
            }
        }
        
        // Insurance filter
        if (insuranceFilter && show) {
            const insuranceMatch = cardInsurance && cardInsurance.includes(insuranceFilter);
            if (!insuranceMatch) {
                show = false;
                console.log(`${cardName} HIDDEN by insurance filter: "${insuranceFilter}" not in insurance list`);
            }
        }
        
        // Specialty dropdown filter
        if (specialtyFilter && show) {
            const specialtyMatch = cardSpecialties && cardSpecialties.includes(specialtyFilter);
            if (!specialtyMatch) {
                show = false;
                console.log(`${cardName} HIDDEN by specialty filter: "${specialtyFilter}" not in specialties`);
            }
        }
        
        // Sidebar specialty checkboxes filter (must have ALL checked specialties)
        if (checkedSpecialties.length > 0 && show) {
            const hasAllSpecialties = checkedSpecialties.every(specialty => 
                cardSpecialties.includes(specialty)
            );
            if (!hasAllSpecialties) {
                show = false;
                console.log(`${cardName} HIDDEN by sidebar specialties filter: missing some of ${checkedSpecialties}`);
            }
        }
        
        // Modalities filter
        if (modalitiesFilter && show) {
            const modalitiesMatch = cardModalities && cardModalities.includes(modalitiesFilter);
            if (!modalitiesMatch) {
                show = false;
                console.log(`${cardName} HIDDEN by modalities filter: "${modalitiesFilter}" not in modalities`);
            }
        }
        
        if (show) {
            console.log(`${cardName} ✅ VISIBLE`);
        }
        
        card.style.display = show ? 'flex' : 'none';
        if (show) visibleCount++;
    });
    
    document.getElementById('resultsCount').textContent = visibleCount;
    
    // Update location text in results count
    const currentLocationSpan = document.getElementById('currentLocation');
    if (locationFilter) {
        currentLocationSpan.textContent = locationFilter + ', Canada';
    } else {
        currentLocationSpan.textContent = 'Canada';
    }
    
    console.log(`\n=== FILTER RESULTS COMPLETE ===`);
    console.log(`Visible count: ${visibleCount}`);
    console.log(`Location display: ${currentLocationSpan.textContent}`);
}

// Event listeners removed - filtering now only happens when "Apply Filters" is clicked

// Event listeners for checkboxes removed - filtering now only happens when "Apply Filters" is clicked

// Clear filters - NEW FUNCTIONALITY
function clearAllFilters() {
    console.log('=== CLEAR ALL FILTERS CALLED ===');
    
    // Clear all dropdown filters
    document.querySelectorAll('.filter-select').forEach(select => {
        select.value = '';
        console.log(`Cleared ${select.id}: ${select.value}`);
    });
    
    // Clear all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    console.log('Cleared all checkboxes');
    
    // Clear URL parameters (update browser history without reload)
    const url = new URL(window.location);
    url.search = '';
    window.history.pushState({}, '', url);
    console.log('Cleared URL parameters');
    
    // Reset location display
    document.getElementById('currentLocation').textContent = 'Canada';
    console.log('Reset location display to Canada');
    
    // Apply filters (should show all dietitians now)
    console.log('Applying filters after clear...');
    filterResults();
    
    console.log('=== CLEAR FILTERS COMPLETE ===');
}

// Apply Current Filters - NEW FUNCTIONALITY  
function applyCurrentFilters() {
    console.log('=== APPLY CURRENT FILTERS CALLED ===');
    
    // Get current filter values
    const currentFilters = {
        location: document.getElementById('locationFilter').value,
        insurance: document.getElementById('insuranceFilter').value,
        specialty: document.getElementById('specialtyFilter').value,
        modalities: document.getElementById('modalitiesFilter').value,
        sort: document.getElementById('sortFilter').value,
        visitType: document.getElementById('visitTypeFilter').value
    };
    
    // Get checked sidebar specialties
    const checkedSpecialties = [];
    document.querySelectorAll('#specialtyOptions input[type="checkbox"]:checked').forEach(checkbox => {
        checkedSpecialties.push(checkbox.value);
    });
    
    console.log('Current filters to apply:', currentFilters);
    console.log('Checked sidebar specialties:', checkedSpecialties);
    
    // Build URL parameters with current selections
    const params = new URLSearchParams();
    
    // Add non-empty filter values to URL
    Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) {
            params.append(key, value);
        }
    });
    
    // Add checked specialties (if any)
    if (checkedSpecialties.length > 0) {
        params.append('sidebarSpecialties', checkedSpecialties.join(','));
    }
    
    // Update browser URL with new parameters
    const newUrl = params.toString() ? `results.html?${params.toString()}` : 'results.html';
    window.history.pushState({}, '', newUrl);
    console.log('Updated URL to:', newUrl);
    
    // Apply the filtering immediately
    console.log('Applying filters...');
    filterResults();
    
    // Show confirmation message
    const confirmationMessage = `Filters applied! ${document.getElementById('resultsCount').textContent} results found.`;
    console.log(confirmationMessage);
    
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.textContent = confirmationMessage;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    console.log('=== APPLY FILTERS COMPLETE ===');
}

// Booking and profile functions
function bookAppointment(dietitianName) {
    console.log('📋 DEBUG: bookAppointment called for:', dietitianName);
    
    // Show booking confirmation
    const confirmBooking = confirm(`Would you like to request an appointment with ${dietitianName}?\n\nNote: All personal information was already submitted during your search. We will contact you using the details you provided to schedule your appointment.`);
    
    if (confirmBooking) {
        alert(`Thank you! Your booking request for ${dietitianName} has been submitted. We'll contact you within 24 hours using the contact information you provided earlier to confirm your appointment.`);
    }
}


function viewProfile(dietitianName) {
    alert(`Viewing profile for ${dietitianName}. This would show detailed profile information.`);
}

// Access control - check insurance validation before showing results - MANDATORY SCANNING
function checkAccessAuthorization() {
    const accessStatus = sessionStorage.getItem('accessAuthorized');
    const validationStatus = sessionStorage.getItem('insuranceValidated');
    const scannedData = sessionStorage.getItem('scannedInsuranceData');
    
    console.log('=== ACCESS CONTROL CHECK (MANDATORY SCANNING) ===');
    console.log('Access Status:', accessStatus);
    console.log('Validation Status:', validationStatus);
    console.log('Has Scanned Data:', !!scannedData);
    
    // MANDATORY SCANNING - Only allow access with scanned card data
    if ((accessStatus === 'true' || accessStatus === 'partial') && 
        (validationStatus === 'true' || validationStatus === 'partial') && 
        scannedData) {
        console.log('Access granted with scanned data:', accessStatus);
        
        // Show validation status message
        showAccessMessage(accessStatus, validationStatus);
        return true;
    }
    
    // Block access for manual-only entries or missing scanned data
    // console.log('Access denied - scanned insurance card required');
    // blockAccess('mandatory_scan');
    return false;
}

function showAccessMessage(accessStatus, validationStatus) {
    const headerContent = document.querySelector('.header-content');
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 300px;
    `;
    
    if (validationStatus === 'true') {
        messageDiv.textContent = '✅ Insurance verified via card scan';
        messageDiv.style.background = '#ecfdf5';
        messageDiv.style.color = '#065f46';
        messageDiv.style.border = '1px solid #bbf7d0';
    } else if (validationStatus === 'partial') {
        messageDiv.textContent = '📝 Scanned data edited - verification pending';
        messageDiv.style.background = '#fffbeb';
        messageDiv.style.color = '#d97706';
        messageDiv.style.border = '1px solid #fed7aa';
    } else {
        messageDiv.textContent = 'ℹ️ Manual entry - verification pending';
        messageDiv.style.background = '#eff6ff';
        messageDiv.style.color = '#1d4ed8';
        messageDiv.style.border = '1px solid #bfdbfe';
    }
    
    document.body.appendChild(messageDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 5000);
}

function blockAccess(reason = 'default') {
    // Clear the body content
    document.body.innerHTML = `
        <div style="
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        ">
            <div style="
                background: white;
                padding: 48px;
                border-radius: 24px;
                box-shadow: 0 32px 64px rgba(0, 0, 0, 0.12);
                border: 1px solid rgba(0, 0, 0, 0.06);
                max-width: 480px;
                width: 100%;
                margin: 20px;
                text-align: center;
            ">
                <div style="font-size: 64px; margin-bottom: 24px;">🔒</div>
                <h1 style="
                    font-size: 24px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin-bottom: 16px;
                ">Access Restricted</h1>
                <p style="
                    color: #6b7280;
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 32px;
                ">
                    ${reason === 'mandatory_scan' ? 
                        'Insurance card scanning is <strong>required</strong> to view dietitian results. Please scan your physical insurance card to continue.' : 
                        'Insurance verification is required to view dietitian results. Please complete the search form with valid insurance information.'
                    }
                </p>
                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <a href="search.html" style="
                        background: #6366f1;
                        color: white;
                        padding: 12px 24px;
                        border: none;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        text-decoration: none;
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        transition: all 0.2s ease;
                    ">
                        🔍 Complete Search Form
                    </a>
                    <a href="scan-card.html" style="
                        background: #10b981;
                        color: white;
                        padding: 12px 24px;
                        border: none;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        text-decoration: none;
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        transition: all 0.2s ease;
                    ">
                        📷 Scan Insurance Card
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Redirect after 3 seconds if user doesn't click
    setTimeout(() => {
        window.location.href = 'search.html';
    }, 10000);
}

// Run access control check before initializing page
if (checkAccessAuthorization()) {
    // Initialize page and filters on page load only if access is granted
    initializePage();
}
