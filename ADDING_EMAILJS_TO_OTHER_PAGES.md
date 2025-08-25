# Adding EmailJS to Additional HTML Pages

If you need to add EmailJS functionality to other HTML pages in your project, follow these steps:

## For any HTML page with forms:

### 1. Add EmailJS CDN to the HTML head:
```html
<head>
    <!-- Other head content -->
    <script type="text/javascript" src="https://cdn.emailjs.com/dist/email.min.js"></script>
</head>
```

### 2. Load the configuration and helper scripts:
```html
<script src="../js/email-config.js"></script>
<script src="../js/emailjs-send.js"></script>
```
*Note: Adjust the path based on your file location relative to the js folder*

### 3. Initialize EmailJS:
```html
<script>
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined' && typeof EMAILJS_PUBLIC_KEY !== 'undefined' && EMAILJS_PUBLIC_KEY !== '<YOUR_EMAILJS_PUBLIC_KEY>') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log('✅ EmailJS initialized successfully');
    } else {
        console.warn('⚠️ EmailJS not initialized. Please configure EMAILJS_PUBLIC_KEY in email-config.js');
    }
</script>
```

### 4. Add form submission handler:
```html
<script>
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('your-form-id');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const result = await sendContactForm(new FormData(this));
                console.log('✅ Email sent successfully:', result);
                
                // Show success message or redirect
                alert('Thank you! Your submission has been sent.');
                // or window.location.href = 'thank-you.html';
                
            } catch (error) {
                console.error('❌ Email sending failed:', error);
                alert('Sorry, there was an error sending your message. Please try again.');
            }
        });
    }
});
</script>
```

## Example for archive/search.html

If you want to enable EmailJS for the search form, add this to the bottom of `html/archive/search.html`:

```html
<!-- EmailJS Scripts -->
<script type="text/javascript" src="https://cdn.emailjs.com/dist/email.min.js"></script>
<script src="../../js/email-config.js"></script>
<script src="../../js/emailjs-send.js"></script>
<script>
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined' && typeof EMAILJS_PUBLIC_KEY !== 'undefined' && EMAILJS_PUBLIC_KEY !== '<YOUR_EMAILJS_PUBLIC_KEY>') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    // Handle search form submission
    document.addEventListener('DOMContentLoaded', function() {
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                try {
                    // Send via EmailJS
                    const result = await sendContactForm(new FormData(this));
                    console.log('✅ Search form sent via EmailJS:', result);
                    
                    // Then proceed with normal form action (redirect to results)
                    window.location.href = this.action + '?' + new URLSearchParams(new FormData(this)).toString();
                    
                } catch (error) {
                    console.error('❌ EmailJS failed, continuing with normal form submission:', error);
                    // Continue with normal form submission even if email fails
                    window.location.href = this.action + '?' + new URLSearchParams(new FormData(this)).toString();
                }
            });
        }
    });
</script>
```

## Creating Custom EmailJS Templates

For different forms, you may want to create different EmailJS templates:

1. **Assessment Form Template** (already configured)
   - Template ID: Use for the main contact/assessment form
   - Variables: name, email, phone, etc.

2. **Search Form Template** (if needed)
   - Create a new template in EmailJS dashboard
   - Variables: name, email, phone, location, insurance, specialty, member_id, group_number
   - Update `js/emailjs-send.js` to support different template IDs

3. **Generic Contact Template**
   - Simple template for basic contact forms
   - Variables: name, email, message

## Advanced Usage

### Using Different Templates:
```javascript
// Use specific template
await sendFormViaEmailJS(formData, {
    templateId: 'template_search_form', // Override default template
    message: 'New search form submission'
});
```

### Custom Template Parameters:
```javascript
await sendFormViaEmailJS(formData, {
    templateParams: {
        form_type: 'search',
        priority: 'high',
        custom_field: 'custom_value'
    }
});
```

## Path References

When adding EmailJS to HTML files in subdirectories, make sure to use the correct relative paths:

- From `/html/`: use `../js/email-config.js`
- From `/html/archive/`: use `../../js/email-config.js`
- From root `/`: use `js/email-config.js`

## Testing

After adding EmailJS to any page:

1. Open browser console
2. Run `testEmailJSConfig()` to verify setup
3. Submit the form and check console for success/error messages
4. Check EmailJS dashboard for delivery logs
