<template>
  <footer class="footer">
    <div class="container footer-grid">
      <div class="brand">
        <h3>S HATYAI</h3>
        <p>Experience the ultimate comfort and elegance in Hatyai.</p>
      </div>
      <div>
        <h4>Navigate</h4>
        <ul>
          <li><a href="#highlights">Highlights</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#location">Location</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <p>123 Luxury Rd, Hatyai</p>
        <p>info@shatyai.com</p>
      </div>
    </div>
    <p class="copyright">&copy; 2026 S HATYAI HOTEL. All rights reserved.</p>
  </footer>
</template>

<style scoped>
.footer {
  background: #1a1a1a;
  color: #a0a0a0;
  padding: 80px 0 40px;
  border-top: 2px solid var(--color-accent);
}
.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 40px;
}
.brand h3 { color: var(--color-accent); margin-bottom: 10px; font-family: var(--font-serif); }
h4 { color: white; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.9rem; }
ul { list-style: none; }
li a { color: #a0a0a0; text-decoration: none; transition: 0.3s; }
li a:hover { color: var(--color-accent); }
.copyright { text-align: center; font-size: 0.7rem; border-top: 1px solid #333; padding-top: 20px; }
</style>
