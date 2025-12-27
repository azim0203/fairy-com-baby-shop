// Footer Component with Business Details
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>🧚 fairy.com</h3>
                        <p><strong>ANISH SHAIKH</strong> - Proprietor</p>
                        <p>Your trusted destination for quality baby products in Surat, Gujarat.</p>
                        <div className="footer-social">
                            <a href="https://wa.me/919173610588" aria-label="WhatsApp">💬</a>
                            <a href="tel:+919173610588" aria-label="Call">📞</a>
                            <a href="#" aria-label="Instagram">📸</a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">All Products</Link></li>
                            <li><Link to="/products?category=toys">Toys</Link></li>
                            <li><Link to="/products?category=clothes">Clothes</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Customer Service</h4>
                        <ul className="footer-links">
                            <li><a href="#">Track Order</a></li>
                            <li><a href="#">Returns Policy</a></li>
                            <li><a href="#">Shipping Info</a></li>
                            <li><Link to="/admin">Admin Login</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Contact Us</h4>
                        <ul className="footer-links">
                            <li>📍 Shop N.1, Opp. Ansari Clinic,<br />Nr. Ali Masjid, Tirupati Nagar,<br />Unn, Surat - 394210</li>
                            <li>📞 <a href="tel:+919173610588">+91 9173610588</a></li>
                            <li>🕐 9 AM - 9 PM</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2024 fairy.com | ANISH SHAIKH - Baby Shop. All rights reserved. Made with ❤️ in Surat</p>
                </div>
            </div>
        </footer>
    );
}
