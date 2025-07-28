// Storage utility for cross-device compatibility
class StorageManager {
    constructor() {
        this.storage = this.getAvailableStorage();
        this.memoryStorage = new Map();
    }

    getAvailableStorage() {
        try {
            const testKey = '__storage_test__';
            sessionStorage.setItem(testKey, 'test');
            sessionStorage.removeItem(testKey);
            return sessionStorage;
        } catch (e) {
            console.warn('SessionStorage not available, using memory fallback:', e.message);
            return null;
        }
    }

    setItem(key, value) {
        try {
            if (this.storage) {
                this.storage.setItem(key, value);
            } else {
                this.memoryStorage.set(key, value);
            }
            return true;
        } catch (e) {
            console.error('Storage setItem failed:', e);
            this.memoryStorage.set(key, value);
            return false;
        }
    }

    getItem(key) {
        try {
            if (this.storage) {
                return this.storage.getItem(key);
            } else {
                return this.memoryStorage.get(key) || null;
            }
        } catch (e) {
            console.error('Storage getItem failed:', e);
            return this.memoryStorage.get(key) || null;
        }
    }

    removeItem(key) {
        try {
            if (this.storage) {
                this.storage.removeItem(key);
            }
            this.memoryStorage.delete(key);
        } catch (e) {
            console.error('Storage removeItem failed:', e);
            this.memoryStorage.delete(key);
        }
    }
}

// Global storage manager instance
const storageManager = new StorageManager();

class InsuranceCardScanner {
    constructor() {
        this.OCR_API_KEY = 'K83328912888957';
        this.OCR_API_URL = 'https://api.ocr.space/parse/image';
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.extractedData = null;
        
        // Cross-device functionality
        this.isMobileMode = false;
        this.sessionId = null;
        this.peerConnection = null;
        this.dataChannel = null;
        
        this.checkForCrossDeviceMode();
        this.initializeEventListeners();
    }

    checkForCrossDeviceMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const sessionId = urlParams.get('session');
        
        if (mode === 'mobile' && sessionId) {
            this.isMobileMode = true;
            this.sessionId = sessionId;
            console.log('Mobile cross-device mode activated for session:', sessionId);
            
            // Initialize mobile WebRTC connection
            setTimeout(() => this.initializeMobileWebRTC(), 1000);
            
            // Update UI to show mobile mode
            this.updateUIForMobileMode();
        }
    }

    updateUIForMobileMode() {
        // Update header to indicate mobile mode
        const title = document.querySelector('.scanner-title');
        const subtitle = document.querySelector('.scanner-subtitle');
        
        if (title) {
            title.textContent = '📱 Phone Scanning Mode';
        }
        if (subtitle) {
            subtitle.textContent = 'Scan your insurance card - data will be sent to your desktop';
        }
        
        // Add mobile indicator
        const scannerContainer = document.querySelector('.scanner-container');
        if (scannerContainer && !document.getElementById('mobileIndicator')) {
            const indicator = document.createElement('div');
            indicator.id = 'mobileIndicator';
            indicator.style.cssText = `
                background: #3b82f6;
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                margin-bottom: 16px;
                text-align: center;
                font-size: 14px;
                font-weight: 600;
            `;
            indicator.textContent = '📡 Connected to desktop - ready to scan';
            scannerContainer.insertBefore(indicator, scannerContainer.firstChild);
        }
    }

    async initializeMobileWebRTC() {
        try {
            console.log('Initializing mobile WebRTC connection...');
            
            // Check WebRTC support first
            if (typeof RTCPeerConnection === 'undefined') {
                throw new Error('WebRTC not supported in this browser');
            }
            
            // Get the offer from session storage (stored by desktop)
            const offerData = storageManager.getItem(`offer_${this.sessionId}`);
            if (!offerData) {
                console.error('No offer found for session:', this.sessionId);
                this.showError('Failed to connect to desktop. Please try scanning the QR code again.');
                return;
            }
            
            const { offer } = JSON.parse(offerData);
            if (!offer || !offer.type || !offer.sdp) {
                throw new Error('Invalid offer data received');
            }
            
            // Create peer connection with multiple STUN servers for reliability
            this.peerConnection = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' },
                    { urls: 'stun:stun.cloudflare.com:3478' }
                ],
                iceCandidatePoolSize: 10
            });
            
            // Monitor connection state
            this.peerConnection.onconnectionstatechange = () => {
                console.log('Connection state:', this.peerConnection.connectionState);
                switch (this.peerConnection.connectionState) {
                    case 'connected':
                        this.updateMobileStatus('connected', '📡 Connected to desktop');
                        break;
                    case 'disconnected':
                        this.updateMobileStatus('error', '⚠️ Connection lost');
                        break;
                    case 'failed':
                        this.updateMobileStatus('error', '❌ Connection failed');
                        this.showError('Connection to desktop failed. Please try again.');
                        break;
                }
            };

            // Handle data channel from desktop
            this.peerConnection.ondatachannel = (event) => {
                this.dataChannel = event.channel;
                this.dataChannel.onopen = () => {
                    console.log('Mobile data channel opened');
                    this.updateMobileStatus('connected', '📡 Connected to desktop - ready to scan');
                };
                this.dataChannel.onclose = () => {
                    console.log('Mobile data channel closed');
                    this.updateMobileStatus('error', '📡 Connection closed');
                };
                this.dataChannel.onerror = (error) => {
                    console.error('Data channel error:', error);
                    this.updateMobileStatus('error', '❌ Data channel error');
                };
            };
            
            // Handle ICE candidates
            this.peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    this.storeIceCandidate(event.candidate, 'mobile');
                }
            };
            
            // Set remote description (offer) and create answer
            await this.peerConnection.setRemoteDescription(offer);
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            
            // Store answer for desktop to retrieve
            storageManager.setItem(`answer_${this.sessionId}`, JSON.stringify({
                answer: answer,
                timestamp: Date.now()
            }));
            
            // Get any ICE candidates from desktop
            this.checkForRemoteIceCandidates();
            
            console.log('Mobile WebRTC connection initialized');
            
            // Set connection timeout
            setTimeout(() => {
                if (this.peerConnection && this.peerConnection.connectionState !== 'connected') {
                    console.warn('WebRTC connection timeout');
                    this.updateMobileStatus('error', '⏱️ Connection timeout');
                    this.showError('Connection to desktop timed out. Please try scanning the QR code again.');
                }
            }, 30000); // 30 second timeout
            
        } catch (error) {
            console.error('Failed to initialize mobile WebRTC:', error);
            
            // Provide specific error messages
            let errorMessage = 'Failed to connect to desktop.';
            if (error.message.includes('WebRTC not supported')) {
                errorMessage = 'Your browser doesn\'t support cross-device communication. Please use a modern browser like Chrome, Firefox, or Safari.';
            } else if (error.message.includes('Invalid offer')) {
                errorMessage = 'Invalid connection data. Please scan the QR code again.';
            } else if (error.message.includes('network')) {
                errorMessage = 'Network connection issue. Please check your internet connection and try again.';
            }
            
            this.updateMobileStatus('error', '❌ Connection failed');
            this.showError(errorMessage);
        }
    }

    checkForRemoteIceCandidates() {
        const candidateInterval = setInterval(() => {
            const candidates = storageManager.getItem(`ice_candidates_host_${this.sessionId}`);
            if (candidates) {
                const candidateList = JSON.parse(candidates);
                candidateList.forEach(async (candidate) => {
                    try {
                        await this.peerConnection.addIceCandidate(candidate);
                    } catch (error) {
                        console.error('Error adding ICE candidate:', error);
                    }
                });
                storageManager.removeItem(`ice_candidates_host_${this.sessionId}`);
                clearInterval(candidateInterval);
            }
        }, 1000);
        
        // Stop checking after 30 seconds
        setTimeout(() => clearInterval(candidateInterval), 30000);
    }

    storeIceCandidate(candidate, role) {
        const key = `ice_candidates_${role}_${this.sessionId}`;
        const existing = storageManager.getItem(key);
        const candidates = existing ? JSON.parse(existing) : [];
        candidates.push(candidate);
        storageManager.setItem(key, JSON.stringify(candidates));
    }

    updateMobileStatus(type, message) {
        const indicator = document.getElementById('mobileIndicator');
        if (indicator) {
            indicator.textContent = message;
            if (type === 'connected') {
                indicator.style.background = '#10b981';
            } else if (type === 'sending') {
                indicator.style.background = '#f59e0b';
            } else if (type === 'error') {
                indicator.style.background = '#ef4444';
            }
        }
    }

    initializeEventListeners() {
        document.getElementById('startCamera').addEventListener('click', () => this.startCamera());
        document.getElementById('captureBtn').addEventListener('click', () => this.captureImage());
        document.getElementById('retakeBtn').addEventListener('click', () => this.retakePhoto());
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
            this.showError('Camera access is required to scan your insurance card. Please allow camera access and try again.');
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

        // Show flash effect and success message
        this.showCaptureConfirmation();

        // Convert to blob and process
        this.canvas.toBlob(async (blob) => {
            // Store the captured image data for preview
            this.capturedImageBlob = blob;
            
            // Show captured image preview
            this.showCapturedImagePreview(blob);
            
            // Add brief delay before processing to let user see the confirmation
            setTimeout(async () => {
                try {
                    // Optimize image for OCR processing
                    const optimizedFile = await this.optimizeImageForOCR(blob);
                    await this.processImage(optimizedFile);
                } catch (error) {
                    console.error('Image optimization error:', error);
                    this.showError('Failed to optimize image for processing. Please try again.');
                }
            }, 1500);
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
        
        // Remove success message and preview
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.remove();
        }
        
        const capturedPreview = document.getElementById('capturedPreview');
        if (capturedPreview) {
            capturedPreview.remove();
        }
        
        // Clear stored image data
        this.capturedImageBlob = null;
    }


    async processImage(imageFile) {
        this.showLoading('📤 Uploading image to OCR service...');
        this.hideError();

        try {
            // Step 1: Upload and OCR processing with retry feedback
            const extractedText = await this.performOCR(imageFile, 1, 3, (attempt, maxRetries, status) => {
                if (attempt > 1) {
                    this.showLoading(`🔄 Retry ${attempt-1}/${maxRetries-1}: ${status}`);
                } else {
                    this.showLoading('📤 Uploading image to OCR service...');
                }
            });
            console.log('=== OCR EXTRACTION RESULTS ===');
        console.log('Raw OCR Text:', extractedText);
        console.log('Text length:', extractedText.length);
        console.log('================================');
            
            // Step 2: Parse the extracted data
            this.showLoading('🔍 Analyzing insurance card data...');
            await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause for UX
            
            const parsedData = this.parseInsuranceData(extractedText);
            
            // Step 3: Validate and display results
            this.showLoading('✅ Finalizing card information...');
            await new Promise(resolve => setTimeout(resolve, 300)); // Brief pause for UX
            
            if (parsedData && Object.keys(parsedData).length > 0) {
                this.extractedData = parsedData;
                this.displayExtractedData(parsedData);
            } else {
                this.showError('Could not extract insurance information from the image. Please ensure the card is clearly visible and try again.');
            }
        } catch (error) {
            console.error('OCR processing error:', error);
            
            // Enhanced error handling for specific OCR error codes
            if (error.message.includes('Image file is too large')) {
                this.showError('Image is too large for processing. Please try taking a photo from further away.');
            } else if (error.message.includes('Image file is too small')) {
                this.showError('Image is too small. Please ensure the insurance card fills most of the camera view.');
            } else if (error.message.includes('Invalid file type')) {
                this.showError('Invalid image format. Please take a new photo and try again.');
            } else if (error.message.includes('timed out after multiple attempts')) {
                this.showError('OCR processing timed out. Please ensure good lighting and try with a clearer image of your card.');
            } else if (error.message.includes('No text could be extracted')) {
                this.showError('Could not read text from the image. Please ensure the card is clearly visible, well-lit, and in focus.');
            } else if (error.message.includes('E101')) {
                this.showError('Processing timed out. Please try again with better lighting and a clearer image.');
            } else if (error.message.includes('E102') || error.message.includes('E103')) {
                this.showError('Image processing failed. Please ensure the card is flat, well-lit, and clearly visible.');
            } else if (error.message.includes('file type') || error.message.includes('E216')) {
                this.showError('Image format not supported. Please take a new photo and try again.');
            } else if (error.message.includes('OCR API error: 429')) {
                this.showError('OCR service is temporarily busy. Please wait a moment and try again.');
            } else if (error.message.includes('OCR API error: 401')) {
                this.showError('OCR service authentication error. Please try manual entry.');
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                this.showError('Network connection issue. Please check your internet connection and try again.');
            } else {
                this.showError('Failed to process the image. Please ensure good lighting and try again, or use manual entry.');
            }
        } finally {
            this.hideLoading();
        }
    }

    async performOCR(imageFile, attempt = 1, maxRetries = 3, progressCallback = null) {
        // Validate image before processing
        try {
            this.validateImageForOCR(imageFile);
        } catch (validationError) {
            throw validationError;
        }
        
        // Choose OCR engine based on attempt (Engine 1 is more reliable)
        const ocrEngine = attempt <= 2 ? '1' : '2';
        
        const formData = new FormData();
        formData.append('apikey', this.OCR_API_KEY);
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');
        formData.append('OCREngine', ocrEngine);
        formData.append('filetype', 'JPG');
        formData.append('detectOrientation', 'true'); // Help with rotated cards
        
        // Ensure proper filename with extension
        let fileName = imageFile.name || 'insurance-card.jpg';
        if (!fileName.match(/\.(jpg|jpeg|png|gif|bmp)$/i)) {
            const fileType = imageFile.type || 'image/jpeg';
            const extension = fileType.split('/')[1] || 'jpg';
            fileName = `insurance-card.${extension}`;
        }
        
        formData.append('file', imageFile, fileName);

        try {
            console.log(`OCR attempt ${attempt}/${maxRetries} using Engine ${ocrEngine}`);
            
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
                const errorMsg = Array.isArray(result.ErrorMessage) ? result.ErrorMessage[0] : result.ErrorMessage;
                
                // Check for specific timeout error (E101)
                if (errorMsg && errorMsg.includes('E101')) {
                    if (attempt < maxRetries) {
                        console.log(`Timeout error (E101), retrying... (${attempt}/${maxRetries})`);
                        if (progressCallback) {
                            progressCallback(attempt + 1, maxRetries, 'Processing timed out, trying again...');
                        }
                        // Wait before retry with exponential backoff
                        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                        return this.performOCR(imageFile, attempt + 1, maxRetries, progressCallback);
                    } else {
                        throw new Error('OCR service timed out after multiple attempts. Please try with a clearer image.');
                    }
                }
                
                // Check for other specific errors
                if (errorMsg && (errorMsg.includes('E102') || errorMsg.includes('E103'))) {
                    if (attempt < maxRetries) {
                        console.log(`OCR processing error, retrying with different engine... (${attempt}/${maxRetries})`);
                        if (progressCallback) {
                            progressCallback(attempt + 1, maxRetries, 'Trying with different OCR engine...');
                        }
                        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                        return this.performOCR(imageFile, attempt + 1, maxRetries, progressCallback);
                    }
                }
                
                throw new Error(`OCR processing error: ${errorMsg}`);
            }
            
            // Additional validation
            if (!result.ParsedResults || result.ParsedResults.length === 0) {
                if (attempt < maxRetries) {
                    console.log(`No text extracted, retrying... (${attempt}/${maxRetries})`);
                    if (progressCallback) {
                        progressCallback(attempt + 1, maxRetries, 'No text found, adjusting settings...');
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                    return this.performOCR(imageFile, attempt + 1, maxRetries, progressCallback);
                } else {
                    throw new Error('No text could be extracted from the image after multiple attempts');
                }
            }

            console.log(`OCR successful on attempt ${attempt}`);
            return result.ParsedResults[0]?.ParsedText || '';
            
        } catch (networkError) {
            // Handle network errors with retry
            if (attempt < maxRetries && (networkError.message.includes('fetch') || networkError.message.includes('network'))) {
                console.log(`Network error, retrying... (${attempt}/${maxRetries})`);
                if (progressCallback) {
                    progressCallback(attempt + 1, maxRetries, 'Connection issue, retrying...');
                }
                await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
                return this.performOCR(imageFile, attempt + 1, maxRetries, progressCallback);
            }
            throw networkError;
        }
    }

    parseInsuranceData(text) {
        const data = {};
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        
        // Common patterns for Canadian insurance cards
        const patterns = {
            memberName: [
                // Direct name patterns with labels
                /(?:name|member name|cardholder|member|employee name)[\s:]*([A-Z][a-z]+(?:\s+[A-Z]?[a-z]+)*)/i,
                /(?:employee|covered person|beneficiary)[\s:]*([A-Z][a-z]+(?:\s+[A-Z]?[a-z]+)*)/i,
                // Names on separate lines (more flexible)
                /^([A-Z][A-Z\s]*[A-Z])$/,  // All caps names
                /^([A-Z][a-z]+(?:\s+[A-Z][a-z]*){1,3})$/,  // Title case names
                // Names with prefixes (more flexible)
                /(?:mr|ms|mrs|dr|miss)[\s\.]*([A-Z][a-z]+(?:\s+[A-Z]?[a-z]*)*)/i,
                // Common name formats on insurance cards
                /([A-Z][a-z]+[,\s]+[A-Z][a-z]+)/,  // "Last, First" format
                /([A-Z][a-z]{1,}(?:\s+[A-Z](?:\.|[a-z]{1,}))*\s+[A-Z][a-z]{1,})/,  // "First M. Last" format
                // Generic name-like patterns (broader)
                /\b([A-Z][a-z]{1,}(?:\s+[A-Z]?[a-z]{1,}){1,3})\b/,
                // Single name fallback
                /\b([A-Z][a-z]{3,})\b/
            ],
            memberID: [
                // Labeled member ID patterns (more comprehensive)
                /(?:member|member id|id|policy|certificate|plan id)[\s#:]*([A-Z0-9-]{6,25})/i,
                // IDs ending with -00 or similar
                /(?:member|member id|id)[\s#:]*([A-Z0-9-]+-[0-9]{2,3})/i,
                // Standard formats with better boundary detection
                /\b([A-Z]{2,4}[0-9]{6,12}-?[0-9]{0,3})\b/i,
                /\b([0-9]{8,16}-?[0-9]{0,3})\b/,
                // Complex IDs with multiple segments including trailing numbers
                /\b([A-Z0-9]{2,4}[-\s][A-Z0-9]{3,8}[-\s][A-Z0-9]{2,8})\b/i,
                // IDs with trailing segments (like -00)
                /\b([A-Z0-9]{3,}[-][0-9]{2,3})\b/i,
                // Generic alphanumeric with dashes (catch-all)
                /\b([A-Z0-9-]{8,25})\b/i
            ],
            groupNumber: [
                /(?:group|grp|group no|group number)[\s#:]*([A-Z0-9-]{3,12})/i,
                /\b(GRP[A-Z0-9-]{3,10})\b/i
            ],
            provider: [
                /\b(canada life|great-west life|manulife|sun life|blue cross|desjardins|industrial alliance|medavie|greenshield|green shield|gsc)\b/i
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

        // Extract data using patterns with enhanced logging
        console.log('OCR Text Lines for parsing:', lines);
        
        for (const [field, fieldPatterns] of Object.entries(patterns)) {
            console.log(`\nExtracting field: ${field}`);
            
            for (let i = 0; i < fieldPatterns.length; i++) {
                const pattern = fieldPatterns[i];
                console.log(`  Trying pattern ${i + 1}:`, pattern);
                
                for (const line of lines) {
                    const match = line.match(pattern);
                    if (match) {
                        console.log(`    Pattern matched on line: "${line}"`);
                        console.log(`    Raw match:`, match[1]);
                        
                        let extractedValue = match[1].trim();
                        
                        // Special handling for names
                        if (field === 'memberName') {
                            extractedValue = this.validateAndFormatName(extractedValue);
                            if (!extractedValue) {
                                console.log(`    Name validation failed, trying next match`);
                                continue; // Skip invalid names
                            }
                        }
                        
                        console.log(`    Final extracted value: "${extractedValue}"`);
                        data[field] = extractedValue;
                        break;
                    }
                }
                if (data[field]) {
                    console.log(`  ✓ Successfully extracted ${field}: "${data[field]}"`);
                    break;
                }
            }
            
            if (!data[field]) {
                console.log(`  ✗ Failed to extract ${field}`);
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
    
    // Validate and format extracted names
    validateAndFormatName(name) {
        if (!name || name.length < 2) return null;
        
        console.log('Validating name:', name);
        
        // Clean up the name
        let cleanName = name.trim().replace(/[,\s]+/g, ' ');
        
        // Remove only strongly insurance-specific words (more targeted exclusion)
        const strongExcludeWords = /^(card|insurance|policy|plan|group|exp|expires|id|number|coverage|benefits)$/i;
        const words = cleanName.split(/\s+/);
        
        // Filter out only standalone insurance words, not names that contain them
        const filteredWords = words.filter(word => !strongExcludeWords.test(word));
        
        if (filteredWords.length === 0) {
            console.log('Name rejected: all words were insurance terms');
            return null;
        }
        
        // More flexible validation - allow 1-4 words
        if (filteredWords.length > 4) {
            console.log('Name rejected: too many words');
            return null;
        }
        
        // Validate each word looks like it could be a name part (more permissive)
        const validWords = filteredWords.filter(word => {
            // Allow shorter words (like "Li", "Wu", etc.) and more characters
            return word.length >= 1 && /^[A-Za-z][A-Za-z'.-]*$/.test(word) && word.length <= 20;
        });
        
        if (validWords.length === 0) {
            console.log('Name rejected: no valid word patterns');
            return null;
        }
        
        // Use all valid words even if some were filtered
        const finalName = validWords.map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        
        console.log('Name accepted:', finalName);
        return finalName;
    }

    validateMemberID(memberID) {
        console.log('Validating member ID:', memberID);
        
        // Preserve original formatting but clean up excessive spaces
        const cleaned = memberID.replace(/\s{2,}/g, ' ').trim().toUpperCase();
        
        // Extended validation - alphanumeric with hyphens, spaces, and longer length (up to 25 chars)
        if (/^[A-Z0-9\s-]{6,25}$/.test(cleaned)) {
            console.log('Member ID accepted (with spaces):', cleaned);
            return cleaned;
        }
        
        // If validation fails, try removing spaces and keeping only alphanumeric + hyphens
        const spacesRemoved = cleaned.replace(/\s+/g, '');
        if (/^[A-Z0-9-]{6,25}$/.test(spacesRemoved)) {
            console.log('Member ID accepted (spaces removed):', spacesRemoved);
            return spacesRemoved;
        }
        
        console.log('Member ID validation failed, returning original:', memberID);
        return memberID; // Return original if all validation fails
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
            'medavie': 'Medavie Blue Cross',
            'greenshield': 'Green Shield Canada',
            'green shield': 'Green Shield Canada',
            'gsc': 'Green Shield Canada'
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
            memberName: 'Member Name',
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

        // Check if we're in mobile mode - send data via WebRTC
        if (this.isMobileMode && this.dataChannel && this.dataChannel.readyState === 'open') {
            this.sendDataToDesktop();
            return;
        }

        // Normal desktop mode - store locally and redirect
        const timestamp = Date.now();
        const dataWithSecurity = {
            ...this.extractedData,
            _timestamp: timestamp,
            _verified: true,
            _checksum: this.generateChecksum(this.extractedData, timestamp)
        };

        // Store data in session storage with security markers
        sessionStorage.setItem('scannedInsuranceData', JSON.stringify(dataWithSecurity));
        sessionStorage.setItem('insuranceValidated', 'true');
        sessionStorage.setItem('_scanTimestamp', timestamp.toString());

        // Redirect to search form with validation flag
        window.location.href = 'search.html?scanned=true';
    }

    sendDataToDesktop() {
        try {
            console.log('Sending insurance data to desktop...', this.extractedData);
            this.updateMobileStatus('sending', '📤 Sending data to desktop...');
            
            // Send the extracted data via WebRTC
            this.dataChannel.send(JSON.stringify(this.extractedData));
            
            // Show success message
            this.updateMobileStatus('connected', '✅ Data sent successfully!');
            
            // Hide the action buttons
            const actionButtons = document.querySelector('#extractedData .btn');
            if (actionButtons) {
                actionButtons.parentElement.innerHTML = `
                    <div style="text-align: center; padding: 16px; background: #f0fdf4; border-radius: 8px; color: #059669;">
                        <strong>✅ Insurance data sent to desktop!</strong><br>
                        <small>You can now close this tab and return to your desktop.</small>
                    </div>
                `;
            }
            
            // Optional: Close after delay
            setTimeout(() => {
                if (confirm('Data sent successfully! Close this tab?')) {
                    window.close();
                }
            }, 3000);
            
        } catch (error) {
            console.error('Failed to send data to desktop:', error);
            this.updateMobileStatus('error', '❌ Failed to send data');
            this.showError('Failed to send data to desktop. Please try again.');
        }
    }

    editAndContinue() {
        if (!this.extractedData) {
            this.showError('No data to edit. Please scan a card first.');
            return;
        }
        
        // In mobile mode, just send the data - editing happens on desktop
        if (this.isMobileMode && this.dataChannel && this.dataChannel.readyState === 'open') {
            this.sendDataToDesktop();
            return;
        }

        // Normal desktop mode - store locally and redirect
        const timestamp = Date.now();
        const dataWithSecurity = {
            ...this.extractedData,
            _timestamp: timestamp,
            _verified: true,
            _checksum: this.generateChecksum(this.extractedData, timestamp)
        };

        // Store data for editing with security markers
        sessionStorage.setItem('scannedInsuranceData', JSON.stringify(dataWithSecurity));
        sessionStorage.setItem('insuranceValidated', 'partial');
        sessionStorage.setItem('_scanTimestamp', timestamp.toString());

        // Redirect to search form
        window.location.href = 'search.html?scanned=edit';
    }

    showLoading(step = 'Processing your insurance card...') {
        const loadingElement = document.getElementById('loadingState');
        loadingElement.style.display = 'block';
        
        // Update loading text with current step
        const loadingText = loadingElement.querySelector('p');
        if (loadingText) {
            loadingText.textContent = step;
        }
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

    showCaptureConfirmation() {
        // Create flash effect
        const flashOverlay = document.createElement('div');
        flashOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: white;
            z-index: 9999;
            opacity: 0.8;
            pointer-events: none;
        `;
        document.body.appendChild(flashOverlay);
        
        // Remove flash after animation
        setTimeout(() => {
            document.body.removeChild(flashOverlay);
        }, 200);
        
        // Show success message
        this.showSuccessMessage('📸 Photo captured successfully!');
        
        // Play camera shutter sound (if supported)
        this.playCaptureSound();
    }
    
    showCapturedImagePreview(blob) {
        const videoContainer = document.querySelector('.video-container');
        
        // Remove any existing preview
        const existingPreview = document.getElementById('capturedPreview');
        if (existingPreview) {
            existingPreview.remove();
        }
        
        // Create preview element
        const previewContainer = document.createElement('div');
        previewContainer.id = 'capturedPreview';
        previewContainer.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            width: 80px;
            height: 60px;
            border: 2px solid #10b981;
            border-radius: 8px;
            overflow: hidden;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 10;
        `;
        
        const previewImg = document.createElement('img');
        previewImg.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;
        
        // Convert blob to data URL for preview
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
        };
        reader.readAsDataURL(blob);
        
        previewContainer.appendChild(previewImg);
        videoContainer.appendChild(previewContainer);
    }
    
    showSuccessMessage(message) {
        // Remove any existing success message
        const existingSuccess = document.getElementById('successMessage');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        const successElement = document.createElement('div');
        successElement.id = 'successMessage';
        successElement.style.cssText = `
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #059669;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            text-align: center;
            font-weight: 600;
            animation: slideIn 0.3s ease-out;
        `;
        successElement.textContent = message;
        
        // Add animation keyframes if not already added
        if (!document.getElementById('successAnimation')) {
            const style = document.createElement('style');
            style.id = 'successAnimation';
            style.textContent = `
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Insert before error message
        const errorElement = document.getElementById('errorMessage');
        errorElement.parentNode.insertBefore(successElement, errorElement);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (successElement.parentNode) {
                successElement.remove();
            }
        }, 3000);
    }
    
    playCaptureSound() {
        // Try to play a simple beep sound using Web Audio API
        try {
            const AudioContextClass = window.AudioContext || window['webkitAudioContext'];
            if (AudioContextClass) {
                const audioContext = new AudioContextClass();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            }
        } catch (error) {
            console.log('Audio feedback not available:', error);
        }
    }

    // Optimize image for OCR processing by resizing and compressing
    async optimizeImageForOCR(blob) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            img.onload = () => {
                // Calculate optimal dimensions for OCR (max 800x600, maintain aspect ratio)
                const maxWidth = 800;
                const maxHeight = 600;
                let { width, height } = img;
                
                // Calculate scaling factor
                const scaleX = maxWidth / width;
                const scaleY = maxHeight / height;
                const scale = Math.min(scaleX, scaleY, 1); // Don't upscale
                
                // Set optimized dimensions
                const newWidth = Math.floor(width * scale);
                const newHeight = Math.floor(height * scale);
                
                canvas.width = newWidth;
                canvas.height = newHeight;
                
                // Use high-quality scaling for better OCR results
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                // Draw resized image
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                
                // Convert to optimized blob with higher compression for OCR
                canvas.toBlob((optimizedBlob) => {
                    if (optimizedBlob) {
                        // Create file with proper name and type
                        const optimizedFile = new File(
                            [optimizedBlob], 
                            'optimized-insurance-card.jpg', 
                            { type: 'image/jpeg' }
                        );
                        
                        console.log(`Image optimized: ${Math.round(blob.size/1024)}KB → ${Math.round(optimizedBlob.size/1024)}KB`);
                        resolve(optimizedFile);
                    } else {
                        reject(new Error('Failed to create optimized image'));
                    }
                }, 'image/jpeg', 0.6); // Higher compression for OCR
            };
            
            img.onerror = () => reject(new Error('Failed to load image for optimization'));
            img.src = URL.createObjectURL(blob);
        });
    }
    
    // Validate image before OCR processing
    validateImageForOCR(file) {
        // Check file size (max 1MB)
        if (file.size > 1024 * 1024) {
            throw new Error('Image file is too large. Please try with a smaller image.');
        }
        
        // Check minimum size (too small images don't OCR well)
        if (file.size < 10 * 1024) {
            throw new Error('Image file is too small. Please ensure the card is clearly visible.');
        }
        
        // Check file type
        if (!file.type.startsWith('image/')) {
            throw new Error('Invalid file type. Please use an image file.');
        }
        
        return true;
    }

    // Security enhancement: Generate checksum to prevent data tampering
    generateChecksum(data, timestamp) {
        const dataString = JSON.stringify(data) + timestamp.toString();
        let hash = 0;
        if (dataString.length === 0) return hash;
        for (let i = 0; i < dataString.length; i++) {
            const char = dataString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
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