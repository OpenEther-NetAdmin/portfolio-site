# TASK-0400: Implement Contact Page

**Phase**: 4 - Contact & Polish  
**Status**: Complete  
**Priority**: High  
**Estimated Effort**: 2 hours

---

## Description

Create the contact page with form and social links.

---

## Acceptance Criteria

- [ ] Contact form with name, email, message fields
- [ ] Form validation (client-side)
- [ ] Form service integration (Formspree)
- [ ] Social media links (LinkedIn, GitHub)
- [ ] Responsive design

---

## Steps

### 4.1 Create Contact Form Component
```astro
---
// src/components/forms/ContactForm.astro
---

<form 
  class="space-y-4" 
  action="https://formspree.io/f/YOUR_FORM_ID" 
  method="POST"
>
  <div>
    <label for="name" class="block text-sm font-medium mb-2">Name</label>
    <input
      type="text"
      id="name"
      name="name"
      required
      class="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary"
    />
  </div>
  
  <div>
    <label for="email" class="block text-sm font-medium mb-2">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      required
      class="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary"
    />
  </div>
  
  <div>
    <label for="message" class="block text-sm font-medium mb-2">Message</label>
    <textarea
      id="message"
      name="message"
      rows="5"
      required
      class="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary"
    ></textarea>
  </div>
  
  <button
    type="submit"
    class="w-full bg-primary text-background py-2 px-4 rounded-lg font-medium hover:bg-primaryHover transition-colors"
  >
    Send Message
  </button>
</form>
```

### 4.2 Create Contact Page
File: `src/pages/contact.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import Container from '../components/common/Container.astro';
import ContactForm from '../components/forms/ContactForm.astro';
import Card from '../components/common/Card.astro';
---

<Layout title="Contact">
  <Container>
    <div class="py-12">
      <h1 class="text-4xl font-heading font-bold mb-4">Get in Touch</h1>
      <p class="text-xl text-textMuted mb-12">
        Have a project in mind? Let's discuss how I can help.
      </p>
      
      <div class="grid md:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <div>
          <Card>
            <ContactForm />
          </Card>
        </div>
        
        <!-- Contact Info -->
        <div>
          <h2 class="text-2xl font-heading font-bold mb-6">Other Ways to Connect</h2>
          
          <div class="space-y-6">
            <div>
              <h3 class="font-medium mb-2">Email</h3>
              <a href="mailto:your@email.com" class="text-primary hover:underline">
                your@email.com
              </a>
            </div>
            
            <div>
              <h3 class="font-medium mb-2">LinkedIn</h3>
              <a href="#" class="text-primary hover:underline">
                linkedin.com/in/yourprofile
              </a>
            </div>
            
            <div>
              <h3 class="font-medium mb-2">GitHub</h3>
              <a href="#" class="text-primary hover:underline">
                github.com/yourusername
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Container>
</Layout>
```

---

## Notes

- Replace `YOUR_FORM_ID` with actual Formspree form ID
- Or use alternative form service
- Social links need your actual profile URLs

---

## Dependencies

- TASK-0104: UI components (Card)
- TASK-0200: Home page (for reference)
