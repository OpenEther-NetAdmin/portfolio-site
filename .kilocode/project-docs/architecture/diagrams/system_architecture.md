# OpenEther System Architecture

## High-Level Architecture

```mermaid
graph TB
    subgraph "User Layer"
        Browser[Web Browser]
        Mobile[Mobile Device]
    end

    subgraph "Internet"
        DNS[DNS]
    end

    subgraph "VPS Hosting"
        Nginx[Nginx Web Server]
        StaticFiles[Static HTML/CSS/JS]
        Assets[Images/Fonts]
    end

    subgraph "Build System"
        Astro[Astro Build]
        MDX[MDX Content]
        Tailwind[Tailwind CSS]
    end

    subgraph "External Services"
        FormService[Form Service<br/>Formspree]
    end

    Browser --> DNS
    Mobile --> DNS
    DNS --> Nginx
    Nginx --> StaticFiles
    Nginx --> Assets
    
    Astro --> StaticFiles
    Astro --> Assets
    MDX --> Astro
    Tailwind --> Astro
    
    Browser --> FormService
```

## Page Routes

```mermaid
graph LR
    Home[Home<br/>/] --> Portfolio[Portfolio<br/>/portfolio]
    Home --> Blog[Blog<br/>/blog]
    Home --> Services[Services<br/>/services]
    Home --> Contact[Contact<br/>/contact]
    
    Blog --> Post[Blog Post<br/>/blog/:slug]
```

## Component Hierarchy

```mermaid
graph TB
    subgraph "Layout Components"
        Header[Header<br/>Navigation]
        Footer[Footer]
        SEO[SEO Meta Tags]
    end

    subgraph "Pages"
        HomePage[Home Page]
        PortfolioPage[Portfolio Page]
        BlogPage[Blog Index]
        PostPage[Blog Post]
        ServicesPage[Services Page]
        ContactPage[Contact Page]
    end

    subgraph "UI Components"
        Button[Button]
        Card[Card]
        Badge[Badge]
        ContactForm[Contact Form]
    end

    Header --> HomePage
    Header --> PortfolioPage
    Header --> BlogPage
    Header --> ServicesPage
    Header --> ContactPage
    
    Footer --> HomePage
    Footer --> PortfolioPage
    Footer --> BlogPage
    Footer --> ServicesPage
    Footer --> ContactPage
    
    SEO --> HomePage
    SEO --> PortfolioPage
    SEO --> BlogPage
    SEO --> PostPage
    SEO --> ServicesPage
    SEO --> ContactPage
    
    Button --> HomePage
    Button --> ServicesPage
    Button --> ContactPage
    
    Card --> PortfolioPage
    Card --> BlogPage
    
    ContactForm --> ContactPage
    Badge --> PortfolioPage
    Badge --> BlogPage
```

## Deployment Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Git as Git Repository
    participant VPS as VPS Server
    participant Nginx
    participant You

    Dev->>Git: Push code changes
    Git->>VPS: Deploy via Git hook
    VPS->>Nginx: Build Astro static site
    Nginx->>VPS: Serve static files
    
    Note over Dev,VPS: Static Site - No Runtime Required
    
    participant User as Visitor
    User->>Nginx: Request page
    Nginx-->>User: Static HTML response
    
    Note over User,You: Form Submission
    User->>FormService: Submit contact form
    FormService->>You: Email notification
```

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Astro 5.x | Static site generation |
| Styling | Tailwind CSS | Dark theme styling |
| Content | MDX | Blog posts in Markdown |
| Icons | Lucide | Lightweight icons |
| Fonts | Google Fonts | Inter font family |
| Hosting | VPS + Nginx | Static file serving |
| Forms | Formspree | Contact form handling |
