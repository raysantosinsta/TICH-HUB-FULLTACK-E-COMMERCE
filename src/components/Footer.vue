<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>ShopHub</h3>
          <p>Your one-stop shop for amazing products</p>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Shipping Info</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Contact Info</h4>
          <ul>
            <li>📞 +1 234 567 890</li>
            <li>✉️ info@shophub.com</li>
            <li>📍 123 Main St, City</li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Follow Us</h4>
          <div class="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Twitter">🐦</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 ShopHub. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* Estilos específicos do footer - sem duplicação de variáveis globais */
.footer {
  background-color: var(--dark-color);
  margin-top: 50px;
  padding: 40px 0 20px;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 15px;
  color: var(--gold-primary);
}

.footer-section h3 {
  font-size: 1.5rem;
}

.footer-section h4 {
  font-size: 1.1rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 8px;
  color: var(--white-soft);
  opacity: 0.8;
}

.footer-section a {
  color: var(--white-soft);
  text-decoration: none;
  transition: all 0.3s ease;
}

.footer-section a:hover {
  color: var(--gold-primary);
  transform: translateX(5px);
  display: inline-block;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-links a {
  font-size: 1.5rem;
  text-decoration: none;
  color: var(--white-soft);
  transition: all 0.3s ease;
  display: inline-block;
}

.social-links a:hover {
  transform: translateY(-3px);
  color: var(--gold-primary);
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  color: var(--white-soft);
  opacity: 0.7;
  font-size: 0.9rem;
}

/* Responsividade específica do footer */
@media (max-width: 768px) {
  .footer {
    margin-top: 40px;
    padding: 30px 0 15px;
  }
  
  .footer-content {
    gap: 25px;
  }
  
  .footer-section h3 {
    font-size: 1.3rem;
  }
  
  .footer-section h4 {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .footer {
    margin-top: 30px;
    padding: 25px 0 15px;
  }
  
  .footer-content {
    gap: 20px;
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .footer-section a:hover {
    transform: translateX(0);
  }
}
</style>