# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

My-Dietitian is a static HTML/CSS/JavaScript website that connects Canadians with dietitians covered by their employee health benefits. The site includes:

- Landing page with assessment form (main flow)
- Thank you page for form submissions
- Archive folder with unused features (search flow, contest page, results)

## Architecture

### Core Structure
- **Static Site**: Pure HTML/CSS/JavaScript with no build system or backend
- **Form Handling**: Uses Formspree (form submissions) and SheetMonkey (data collection)
- **Client-side Logic**: All form validation, filtering, and interactions handled via vanilla JavaScript
- **External Integrations**: Calendly for appointment booking, insurance card OCR scanning

### Key Files
- `index.html`: Main landing page with hero section, benefits, and assessment form (with phone validation)
- `thank-you.html`: Form submission confirmation page
- `archive/`: Contains unused files (search.html, results.html, contest.html)

### Form Endpoints
- **Assessment Form**: Formspree endpoint `xeozkgvr` (my.dietician.ca@gmail.com) for all consultations

### JavaScript Architecture
Main page contains inline JavaScript for:
- Form validation with real-time error display (including Canadian phone format)
- Canadian phone number formatting: (XXX) XXX-XXXX with real-time input masking
- External API integration (Formspree)
- Dynamic UI behaviors and smooth scrolling

## Development Workflow

### Testing Changes
- Open HTML files directly in browser (no build system required)
- Test form submissions in development (endpoints work in dev)
- Verify responsive design across mobile/desktop breakpoints

### Deployment
- Static files served directly (GitHub Pages, Netlify, etc.)
- No compilation or build steps required
- Domain: mydietician.ca (referenced in redirects and links)

### Form Configuration
- Formspree handles email notifications with auto-responses
- Form validation uses vanilla JavaScript with inline error display
- Phone number field enforces Canadian format with real-time formatting
- All form submissions go to single email endpoint (my.dietician.ca@gmail.com)

## Key Constraints

- **No Build System**: Direct HTML/CSS/JS files only
- **Mobile-First**: Responsive design required for Canadian mobile users
- **Single Form Flow**: Simplified assessment form is the main user journey
- **Phone Validation**: Canadian phone format (XXX) XXX-XXXX enforced with real-time formatting
- **Form Dependencies**: Formspree service must remain functional for email delivery