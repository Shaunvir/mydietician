# EmailJS setup and integration guide for this repo

This document explains how to integrate EmailJS into this repository and wire it to the existing front-end files (placeholders are used where you must insert your own values).

Summary
- Goal: Send form data and HTML email templates using EmailJS from the browser.
- Applies to this repo's files: `email_templates/`, `js/email-config.js`, and the site pages in the root and `html/` folder.

Checklist (requirements derived from your request)
- [ ] Create an EmailJS account and service. (instructions included)
- [ ] Create an email template in EmailJS and record Template ID.
- [ ] Obtain your EmailJS Public Key (User ID) and Service ID.
- [ ] Add EmailJS client SDK to the site (CDN or npm). 
- [ ] Configure `js/email-config.js` with your public key and IDs (example provided).
- [ ] Add a small send handler (example for `js/main.js`) that uses `emailjs.sendForm` or `emailjs.send`.

Placeholders you must replace
- <YOUR_EMAILJS_PUBLIC_KEY> — the key shown in EmailJS dashboard (previously called user ID)
- <YOUR_EMAILJS_SERVICE_ID> — the service identifier (e.g. `service_xxx`)
- <YOUR_EMAILJS_TEMPLATE_ID> — the template identifier (e.g. `template_xxx`)
- <RECIPIENT_EMAIL> — optional if you use a hard-coded recipient in the template
- <FORM_ID_OR_ELEMENT> — the id of the form element you post from
- {{template_variable}} — template variables in EmailJS templates (example: `user_name`, `message`, `html_body`)

Quick mapping to this repo
- HTML templates for emails: `email_templates/book_appointment.html`, `email_templates/post_form.html` — you can copy parts of these to your EmailJS template body or send them as a template parameter.
- Client config file: `js/email-config.js` — we'll show an example to add init code here.
- Site JS entrypoints: `js/main.js`, `js/thank-you.js` — include send logic where forms are handled.

Step-by-step integration

1) Create an EmailJS account and add a service
- Go to https://www.emailjs.com and sign up / sign in.
- In Dashboard > Email Services, add the service you will use (Gmail, Outlook, or a custom SMTP provider). Copy the Service ID (it looks like `service_xxx`).

2) Create a template in EmailJS
- Dashboard > Email Templates > New Template.
- Create the email body and subject. Use variables for dynamic values, for example:

  Subject: New contact from {{user_name}}

  HTML body (example):
  <div>
    <p><strong>Name:</strong> {{user_name}}</p>
    <p><strong>Email:</strong> {{user_email}}</p>
    <p><strong>Message:</strong></p>
    <div>{{message}}</div>
    <hr />
    <div>{{html_body}}</div> <!-- optional: send pre-rendered HTML from your repo templates -->
  </div>

- Save the template and copy the Template ID (`template_xxx`).

3) Obtain your Public Key (User ID)
- From the EmailJS dashboard, go to Integration (or Account) to find your Public Key (starts with `user_` or a public key string). Substitute it into <YOUR_EMAILJS_PUBLIC_KEY>.

4) Add EmailJS client library to your site
- CDN quick option: add this script tag into the site head (put in your common header or in `index.html` and other html pages):

  <script type="text/javascript" src="https://cdn.emailjs.com/dist/email.min.js"></script>
  <script>
    (function(){
      emailjs.init('<YOUR_EMAILJS_PUBLIC_KEY>');
    })();
  </script>

- npm option (if you build with a bundler):
  - npm install emailjs-com
  - import emailjs from 'emailjs-com';
  - emailjs.init('<YOUR_EMAILJS_PUBLIC_KEY>');

Note: EmailJS's public key is safe to put in client code by design, but keep any SMTP credentials on a server if you need strict secrecy.

5) Configure `js/email-config.js` (example)
- Replace values with your real IDs. This repo already has `js/email-config.js`; update or create the following content there.

Example content for `js/email-config.js` (replace placeholders):

// Example - do not commit secret server credentials here
const EMAILJS_PUBLIC_KEY = '<YOUR_EMAILJS_PUBLIC_KEY>';
const EMAILJS_SERVICE_ID = '<YOUR_EMAILJS_SERVICE_ID>';
const EMAILJS_TEMPLATE_ID = '<YOUR_EMAILJS_TEMPLATE_ID>';

// If you're using CDN, call emailjs.init in the page after the CDN script loads.
// If you're bundling, init like: emailjs.init(EMAILJS_PUBLIC_KEY);

export { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID };

6) Add send logic: example for a contact form
- Suppose you have a form in a page (for example `html/` pages or `index.html`) with id `contact-form` and fields: `user_name`, `user_email`, `message`.
- Add this code to `js/main.js` (or create a small module and import it). Replace placeholders.

Example send handler (browser, using CDN or emailjs global):

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form'); // <FORM_ID_OR_ELEMENT>
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Option A: send whole form (works when input names match your EmailJS template variables)
    emailjs.sendForm('<YOUR_EMAILJS_SERVICE_ID>', '<YOUR_EMAILJS_TEMPLATE_ID>', form)
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        // optional: redirect to thank-you, show message, etc.
        window.location.href = '/thank-you.html';
      }, function(error) {
        console.error('FAILED...', error);
        // show error to user
      });

    // Option B: send custom object (if you need to preprocess values)
    // const templateParams = {
    //   user_name: form.querySelector('[name="user_name"]').value,
    //   user_email: form.querySelector('[name="user_email"]').value,
    //   message: form.querySelector('[name="message"]').value,
    //   html_body: '<p>Optional HTML content</p>'
    // };
    // emailjs.send('<YOUR_EMAILJS_SERVICE_ID>', '<YOUR_EMAILJS_TEMPLATE_ID>', templateParams)
    //   .then(...)
  });
});

7) Using repo HTML email templates as body content
- The repo contains `email_templates/post_form.html` and `email_templates/book_appointment.html`.
- To send one of these as HTML inside the email, you can load it (fetch) and pass as a template param `html_body`.

Example (inline fetch + send):

async function sendWithRepoTemplate(form) {
  // fetch the template file as text (relative to site root)
  const html = await fetch('/email_templates/post_form.html').then(r => r.text());

  const templateParams = {
    user_name: form.querySelector('[name="user_name"]').value,
    user_email: form.querySelector('[name="user_email"]').value,
    message: form.querySelector('[name="message"]').value,
    html_body: html
  };

  return emailjs.send('<YOUR_EMAILJS_SERVICE_ID>', '<YOUR_EMAILJS_TEMPLATE_ID>', templateParams);
}

Notes:
- EmailJS templates also support conditionals and HTML. If you paste `post_form.html` content into the EmailJS template body, you can refer to variables by their names.
- Keep relative paths in the fetch correct when testing locally.

8) Testing locally
- If you open `index.html` directly in a browser (file://) some browsers block fetch requests. Prefer serving with a local static server (Live Server extension in VS Code or `python -m http.server 8000` from project root).
- Use the browser console to inspect the EmailJS send responses.
- Check EmailJS Dashboard > Email Logs to see received messages and errors.

9) Troubleshooting
- "Invalid credentials" or 403: ensure the Public Key and IDs are correct and you initialized the SDK.
- Variables empty in the received email: make sure input `name` attributes in your form exactly match template variable names.
- CORS/fetch issues when loading local HTML templates: serve files over http, not file://.

10) Security and best practices
- EmailJS Public Key is intended to be used client-side. Don't put private SMTP credentials in client code.
- For heavy usage or sensitive workflows, implement server-side sending and keep secrets on the server.

Appendix: Minimal example files

- Example `email-config.js` (ES module)

// js/email-config.js
const EMAILJS_PUBLIC_KEY = '<YOUR_EMAILJS_PUBLIC_KEY>';
const EMAILJS_SERVICE_ID = '<YOUR_EMAILJS_SERVICE_ID>';
const EMAILJS_TEMPLATE_ID = '<YOUR_EMAILJS_TEMPLATE_ID>';

export { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID };

- Example snippet to include in an HTML page (CDN)

<!-- in the <head> or before your main script -->
<script type="text/javascript" src="https://cdn.emailjs.com/dist/email.min.js"></script>
<script>
  emailjs.init('<YOUR_EMAILJS_PUBLIC_KEY>');
</script>

- Example EmailJS template (copy into EmailJS UI):

Subject: New contact from {{user_name}}

<div>
  <p><strong>Name:</strong> {{user_name}}</p>
  <p><strong>Email:</strong> {{user_email}}</p>
  <p>{{message}}</p>
  <hr/>
  <div>{{html_body}}</div>
</div>

Verification checklist (when done)
- [ ] I created an EmailJS service and template and recorded the IDs.
- [ ] I updated `js/email-config.js` with my real values.
- [ ] I added the CDN script to pages where forms live (or installed package via npm and initialized in bundle).
- [ ] Submit form from the site and confirm the message appears in EmailJS logs and the recipient inbox.

If you want, I can also:
- Add a small `js/emailjs-send.js` module and wire it into `js/main.js` with the exact form IDs in your HTML, or
- Update `js/email-config.js` in-place with the proper structure and a README snippet for deployment.

Notes about assumptions
- I assumed you are serving the site statically and prefer a CDN integration (fastest to set up). If you use a bundler or a server-side build, tell me and I will adapt the instructions and provide a small module or edit files directly.
- I assumed form field names are not yet matched to EmailJS variables; the guide shows how to map them.

---

That's it — the file above gives concrete steps and repo-specific examples. Replace the placeholders with your EmailJS values and test with the forms you already have in `html/` and the `email_templates/` directory.
