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
.footer {
  background-color: var(--dark-color);
  color: var(--white);
  margin-top: 50px;
  padding: 40px 0 20px;
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
  color: var(--primary-color);
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section a {
  color: var(--white);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: var(--primary-color);
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-links a {
  font-size: 1.5rem;
  text-decoration: none;
  color: var(--white);
  transition: transform 0.3s;
}

.social-links a:hover {
  transform: translateY(-3px);
  color: var(--primary-color);
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>