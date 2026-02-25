# Pranav Gawai – Portfolio

A minimal, modern, and dark-themed personal portfolio website built with React, Vite, and Tailwind CSS. This portfolio showcases my education, experience, projects, and skills in a clean, responsive interface



## 🚀 Features

- **Beautiful Hero Section**: Eye-catching introduction with profile, social links, and a live Spotify "Now Playing" card.
- **Experience Timeline**: Modern, interactive timeline for work and internship experience.
- **Projects Gallery**: Highlighted projects with tech stack icons, status badges, and quick links.
- **Education Cards**: Elegant cards for academic background.
- **Skills Cloud**: Categorized badges for languages, frameworks, databases, and tools.
- **Leadership & Recognition**: Stylish cards for awards and leadership roles.
- **Contact Modal**: Easy-to-use modal for reaching out.
- **Dark/Light Theme**: Seamless theme switching with system preference support.
- **Mobile Responsive**: Fully responsive and touch-friendly design.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, custom CSS animations
- **Icons**: Lucide React, custom SVGs
- **Integrations**: Spotify API (live music card), EmailJS (contact form)

## 📦 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pranavgawaii/pranav-gawai-portfolio.git
   cd pranav-gawai-portfolio
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your Spotify API credentials (see the Spotify integration section below).
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Open in your browser:**
   - Visit [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal).

## 🎵 Spotify Integration

- Displays your currently playing or last played track from Spotify.
- Requires a Spotify Developer App and refresh token. See the code comments for setup instructions.

## 📁 Folder Structure

```
├── components/         # Reusable React components
├── public/             # Static assets (images, logos, etc.)
├── src/                # Providers, types, and utilities
├── App.tsx             # Main app entry
├── constants.tsx       # Data for experience, education, projects, etc.
├── globals.css         # Global styles
├── index.html          # HTML template
├── package.json        # Project metadata and scripts
└── ...
```

## ✨ Customization

- **Profile & Socials**: Edit your info in `constants.tsx`.
- **Experience, Projects, Education**: Add or update entries in `constants.tsx`.
- **Theme**: Tweak colors and styles in `globals.css` or Tailwind config.
- **Images**: Replace images in the `public/` folder.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> Designed and developed by Pranav Gawai. Built for performance, clarity, and a great user experience.
