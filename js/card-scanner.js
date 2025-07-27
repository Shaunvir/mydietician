class InsuranceCardScanner {
    constructor() {
        this.OCR_API_KEY = 'K83328912888957';
        this.OCR_API_URL = 'https://api.ocr.space/parse/image';
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.extractedData = null;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('startCamera').addEventListener('click', () => this.startCamera());
        document.getElementById('captureBtn').addEventListener('click', () => this.captureImage());
        document.getElementById('retakeBtn').addEventListener('click', () => this.retakePhoto());
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileUpload(e));
        document.getElementById('useDataBtn').addEventListener('click', () => this.useExtractedData());
        document.getElementById('editDataBtn').addEventListener('click', () => this.editAndContinue());
    }

    async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            this.video.srcObject = stream;
            this.video.style.display = 'block';
            document.getElementById('cameraPlaceholder').style.display = 'none';
            document.getElementById('captureBtn').disabled = false;
            document.getElementById('startCamera').textContent = '📹 Camera Active';
            document.getElementById('startCamera').disabled = true;

        } catch (error) {
            this.showError('Camera access denied or not available. Please use the file upload option instead.');
            console.error('Camera access error:', error);
        }
    }

    captureImage() {
        if (!this.video.srcObject) {
            this.showError('Camera not active. Please start camera first.');
            return;
        }

        // Set canvas dimensions to match video
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;

        // Capture current frame
        this.context.drawImage(this.video, 0, 0);

        // Convert to blob and process
        this.canvas.toBlob(async (blob) => {
            // Create a file-like object with proper name and type
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            await this.processImage(file);
        }, 'image/jpeg', 0.8);

        // Show retake button
        document.getElementById('retakeBtn').style.display = 'inline-flex';
        document.getElementById('captureBtn').style.display = 'none';
    }

    retakePhoto() {
        document.getElementById('retakeBtn').style.display = 'none';
        document.getElementById('captureBtn').style.display = 'inline-flex';
        this.hideError();
        this.hideExtractedData();
    }

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showError('Please select an image file.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showError('Image file too large. Please select an image under 5MB.');
            return;
        }

        await this.processImage(file);
    }

    async processImage(imageFile) {
        this.showLoading();
        this.hideError();

        try {
            const extractedText = await this.performOCR(imageFile);
            const parsedData = this.parseInsuranceData(extractedText);
            
            if (parsedData && Object.keys(parsedData).length > 0) {
                this.extractedData = parsedData;
                this.displayExtractedData(parsedData);
            } else {
                this.showError('Could not extract insurance information from the image. Please ensure the card is clearly visible and try again.');
            }
        } catch (error) {
            console.error('OCR processing error:', error);
            
            // More specific error handling
            if (error.message.includes('file type') || error.message.includes('E216')) {
                this.showError('Image format not supported. Please try a different image or use manual entry.');
            } else if (error.message.includes('OCR API error: 429')) {
                this.showError('OCR service temporarily busy. Please wait a moment and try again.');
            } else if (error.message.includes('OCR API error: 401')) {
                this.showError('OCR service authentication error. Please try manual entry.');
            } else {
                this.showError('Failed to process the image. Please try again or use manual entry.');
            }
        } finally {
            this.hideLoading();
        }
    }

    async performOCR(imageFile) {
        const formData = new FormData();
        formData.append('apikey', this.OCR_API_KEY);
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');
        formData.append('OCREngine', '2');
        formData.append('filetype', 'JPG'); // Explicit file type for OCR.space
        
        // Ensure proper filename with extension
        let fileName = imageFile.name || 'insurance-card.jpg';
        if (!fileName.match(/\.(jpg|jpeg|png|gif|bmp)$/i)) {
            const fileType = imageFile.type || 'image/jpeg';
            const extension = fileType.split('/')[1] || 'jpg';
            fileName = `insurance-card.${extension}`;
        }
        
        formData.append('file', imageFile, fileName);

        const response = await fetch(this.OCR_API_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`OCR API error: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.IsErroredOnProcessing) {
            console.error('OCR API detailed error:', result);
            throw new Error(`OCR processing error: ${result.ErrorMessage}`);
        }
        
        // Additional validation
        if (!result.ParsedResults || result.ParsedResults.length === 0) {
            throw new Error('No text could be extracted from the image');
        }

        return result.ParsedResults[0]?.ParsedText || '';
    }

    parseInsuranceData(text) {
        const data = {};
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        
        // Common patterns for Canadian insurance cards
        const patterns = {
            memberID: [
                /(?:member|member id|id|policy|certificate)[\s#:]*([A-Z0-9-]{6,15})/i,
                /\b([A-Z]{2,3}[0-9]{6,10})\b/i,
                /\b([0-9]{8,12})\b/
            ],
            groupNumber: [
                /(?:group|grp|group no|group number)[\s#:]*([A-Z0-9-]{3,12})/i,
                /\b(GRP[A-Z0-9-]{3,10})\b/i
            ],
            provider: [
                /\b(canada life|great-west life|manulife|sun life|blue cross|desjardins|industrial alliance|medavie)\b/i
            ],
            expiryDate: [
                /(?:exp|expiry|expires|valid until)[\s:]*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})/i,
                /\b([0-9]{1,2}[\/\-][0-9]{2,4})\b/,
                /\b([0-9]{4}[\/\-][0-9]{1,2}[\/\-][0-9]{1,2})\b/
            ],
            planNumber: [
                /(?:plan|plan no|plan number)[\s#:]*([A-Z0-9-]{3,12})/i
            ]
        };

        // Extract data using patterns
        for (const [field, fieldPatterns] of Object.entries(patterns)) {
            for (const pattern of fieldPatterns) {
                for (const line of lines) {
                    const match = line.match(pattern);
                    if (match) {
                        data[field] = match[1].trim();
                        break;
                    }
                }
                if (data[field]) break;
            }
        }

        // Validate extracted member ID format
        if (data.memberID) {
            data.memberID = this.validateMemberID(data.memberID);
        }

        // Validate and format expiry date
        if (data.expiryDate) {
            data.expiryDate = this.validateExpiryDate(data.expiryDate);
            data.isExpired = this.isCardExpired(data.expiryDate);
        }

        // Map provider names to standard format
        if (data.provider) {
            data.provider = this.standardizeProviderName(data.provider);
        }

        return data;
    }

    validateMemberID(memberID) {
        // Remove spaces and normalize
        const cleaned = memberID.replace(/\s+/g, '').toUpperCase();
        
        // Basic validation - should be alphanumeric with possible hyphens
        if (/^[A-Z0-9-]{6,15}$/.test(cleaned)) {
            return cleaned;
        }
        return memberID; // Return original if validation fails
    }

    validateExpiryDate(dateStr) {
        const cleanDate = dateStr.replace(/[^\d\/\-]/g, '');
        
        // Try to parse different date formats
        const formats = [
            /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/, // MM/DD/YYYY or MM-DD-YYYY
            /^(\d{1,2})[\/\-](\d{2,4})$/, // MM/YYYY
            /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/ // YYYY/MM/DD
        ];

        for (const format of formats) {
            const match = cleanDate.match(format);
            if (match) {
                if (match.length === 4) { // MM/DD/YYYY format
                    const [, month, day, year] = match;
                    const fullYear = year.length === 2 ? `20${year}` : year;
                    return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${fullYear}`;
                } else if (match.length === 3) { // MM/YYYY format
                    const [, month, year] = match;
                    const fullYear = year.length === 2 ? `20${year}` : year;
                    return `${month.padStart(2, '0')}/01/${fullYear}`;
                }
            }
        }
        
        return dateStr; // Return original if parsing fails
    }

    isCardExpired(dateStr) {
        try {
            const [month, day, year] = dateStr.split('/');
            const expiryDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            return expiryDate < new Date();
        } catch {
            return false; // If we can't parse the date, assume not expired
        }
    }

    standardizeProviderName(provider) {
        const mappings = {
            'canada life': 'Canada Life',
            'great-west life': 'Great-West Life',
            'manulife': 'Manulife',
            'sun life': 'Sun Life Financial',
            'blue cross': 'Blue Cross',
            'desjardins': 'Desjardins Insurance',
            'industrial alliance': 'Industrial Alliance',
            'medavie': 'Medavie Blue Cross'
        };

        const normalized = provider.toLowerCase();
        for (const [key, value] of Object.entries(mappings)) {
            if (normalized.includes(key)) {
                return value;
            }
        }
        
        return provider; // Return original if no mapping found
    }

    displayExtractedData(data) {
        const dataFields = document.getElementById('dataFields');
        dataFields.innerHTML = '';

        const fieldLabels = {
            provider: 'Insurance Provider',
            memberID: 'Member ID',
            groupNumber: 'Group Number',
            planNumber: 'Plan Number',
            expiryDate: 'Expiry Date'
        };

        for (const [key, value] of Object.entries(data)) {
            if (key === 'isExpired') continue; // Skip this meta field
            
            const field = document.createElement('div');
            field.className = 'data-field';
            
            const label = fieldLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
            let displayValue = value;
            
            // Add warning for expired cards
            if (key === 'expiryDate' && data.isExpired) {
                displayValue += ' ⚠️ EXPIRED';
                field.style.color = '#dc2626';
            }
            
            field.innerHTML = `
                <span class="data-label">${label}:</span>
                <span class="data-value">${displayValue}</span>
            `;
            
            dataFields.appendChild(field);
        }

        document.getElementById('extractedData').style.display = 'block';
    }

    useExtractedData() {
        if (!this.extractedData) {
            this.showError('No data to use. Please scan a card first.');
            return;
        }

        // Store data in session storage
        sessionStorage.setItem('scannedInsuranceData', JSON.stringify(this.extractedData));
        sessionStorage.setItem('insuranceValidated', 'true');

        // Redirect to search form with validation flag
        window.location.href = 'search.html?scanned=true';
    }

    editAndContinue() {
        if (!this.extractedData) {
            this.showError('No data to edit. Please scan a card first.');
            return;
        }

        // Store data for editing
        sessionStorage.setItem('scannedInsuranceData', JSON.stringify(this.extractedData));
        sessionStorage.setItem('insuranceValidated', 'partial');

        // Redirect to search form
        window.location.href = 'search.html?scanned=edit';
    }

    showLoading() {
        document.getElementById('loadingState').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loadingState').style.display = 'none';
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    hideError() {
        document.getElementById('errorMessage').style.display = 'none';
    }

    hideExtractedData() {
        document.getElementById('extractedData').style.display = 'none';
    }
}

// Initialize the scanner when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new InsuranceCardScanner();
});

// Handle page visibility to manage camera resources
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, stop camera to save resources
        const video = document.getElementById('video');
        if (video && video.srcObject) {
            const tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
    }
});