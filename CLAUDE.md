# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

My-Dietitian is a static HTML/CSS/JavaScript website that connects Canadians with dietitians covered by their employee health benefits. The site includes:

- Landing page with assessment form (main flow)
- Thank you page for form submissions
- Archive folder with unused features (search flow, contest page, results)

## Architecture

### Current Structure (Updated 2025)
- **Static Site**: Pure HTML/CSS/JavaScript with no build system or backend
- **Form Integration**: Custom HTML form with multi-service submission architecture
- **Data Handling**: Multi-service architecture with SheetMonkey (data storage), Formspree (backup email), and EmailJS (custom email templates)
- **Client-side Logic**: Vanilla JavaScript handles form validation, phone formatting, and UI interactions

### Key Files & Directories
- `index.html`: Main landing page with custom assessment form
- `html/thank-you.html`: Form submission confirmation with auto-redirect
- `html/health811-redirect.html`: Redirect page for users without insurance benefits
- `js/main.js`: Core JavaScript with multi-service form submission logic
- `js/emailjs-send.js`: EmailJS integration module for custom email templates
- `js/email-config.js`: EmailJS configuration (API keys and service IDs)
- `email_templates/`: HTML email templates (book_appointment.html, post_form.html, etc.)
- `archive/`: Legacy unused features (search flow, contest pages, results)

### Form Architecture
**Primary Flow**: Custom HTML form → Thank you page
**Backend Systems**:
- **SheetMonkey**: Data storage and backup (`https://api.sheetmonkey.io/form/9MoRQbyaVfkrCsZGZW3Mt2`)
- **Formspree**: Email notifications (`xeozkgvr` endpoint → my.dietician.ca@gmail.com)
- **EmailJS**: Custom HTML email templates with professional styling

**Multi-Service Submission Logic**:
- Parallel submissions to all three services for redundancy
- Requires at least one successful submission to proceed
- Custom error handling and success tracking

### Email System Architecture
**Professional Email Templates**: Located in `/email_templates/`
- Responsive HTML email design with My-Dietitian branding
- Dynamic content insertion (user name, assessment data)
- Professional styling with green color scheme (#22c55e)
- Mobile-optimized layouts with fallback styles

**Email Workflow**:
1. **Assessment Submission** → Professional welcome email with next steps
2. **Insurance Verification** → Appointment booking template
3. **Follow-up** → Post-appointment and reminder emails

## Development Workflow

### Testing Changes
- Open HTML files directly in browser (no build system required)
- **Form Testing**: Test custom form submission and validation
- **EmailJS**: Use `testEmailDebug()` and `testEmailJSSend()` console functions for email testing
- **Multi-Service Testing**: Check browser console for parallel submission results
- Verify responsive design across mobile/desktop breakpoints

### Debugging Tools
- **Console Functions**: `testEmailDebug()` and `testEmailJSSend()` available globally
- **Session Storage**: Submission results stored for debugging (`submissionSuccess`, `submissionError`)
- **Multi-Service Status**: Check individual service success/failure in browser console

### Deployment
- Static files served directly (GitHub Pages, Netlify, etc.)
- No compilation or build steps required
- Domain: mydietician.ca (referenced in redirects and links)
- **Email Service Dependencies**: EmailJS, Formspree, and SheetMonkey must remain configured

### Configuration Requirements
- **EmailJS**: Requires `js/email-config.js` with valid API keys
- **Service URLs**: SheetMonkey and Formspree endpoints in `js/main.js`

## Key Constraints

- **No Build System**: Direct HTML/CSS/JS files only
- **Mobile-First**: Responsive design required for Canadian mobile users
- **Custom Form Primary**: Main user journey through custom HTML assessment form
- **Multi-Service Dependencies**: EmailJS, SheetMonkey, and Formspree must all remain configured
- **Canadian Focus**: Phone formatting, province selection, and insurance-specific language
- **Professional Email Templates**: Maintain consistent branding across email communications

## Common Development Tasks

### Form Flow Testing
```bash
# Open in browser and test complete flow
open index.html
# Check console for multi-service submission results
# Test EmailJS with: testEmailDebug() in browser console
```

### Email Template Updates
- Edit HTML templates in `/email_templates/`
- Templates use dynamic variables like `{{name}}`, `{{email}}`
- Test changes with `testEmailJSSend()` browser console function
- Professional styling maintained with green theme (#22c55e)

### Service Configuration
- **EmailJS config**: Update `js/email-config.js`
- **Form endpoints**: Update URLs in `js/main.js`