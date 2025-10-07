function renderAboutPage() {
    hideAllPages();
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <section class="container my-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 id="aboutTitle">👥 Over Ons</h2>
                <button class="btn btn-outline-secondary" onclick="showHomePage()" id="backToHomeAbout">← Terug naar Home</button>
            </div>

            <div class="card mb-4">
                <div class="card-body">
                    <h4>Ons Verhaal</h4>
                    <p>
                        Wat begon als een simpele schoolopdracht, groeide uit tot een veelbelovend avontuur. 
                        Wij zijn vijf studenten die op 1 januari 2025 met passie en enthousiasme besloten 
                        om onze gezamenlijke creatie om te zetten in een echte onderneming.
                    </p>
                    <p>
                        Gedreven door ambitie en een gedeelde visie, hebben we de sprong gewaagd en onze 
                        startup opgericht. Sindsdien zetten we ons dagelijks in om onze ideeën verder te 
                        ontwikkelen, klanten te helpen en impact te maken.
                    </p>
                    <p>
                        Welkom bij ons verhaal. We staan nog aan het begin, maar de energie is groot en de toekomst veelbelovend.
                    </p>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5>Ons Team</h5>
                            <ul class="list-unstyled">
                                <li>🎓 <strong>Student 1</strong> – CEO & Marketing</li>
                                <li>💻 <strong>Student 2</strong> – IT & Web Developer</li>
                                <li>⚙️ <strong>Student 3</strong> – Operations Manager</li>
                                <li>💰 <strong>Student 4</strong> – Finance & Administratie</li>
                                <li>🤝 <strong>Student 5</strong> – Klantenservice & Support</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5>Missie & Visie</h5>
                            <p><strong>Missie:</strong> Betaalbare en kwalitatieve technologie toegankelijk maken voor iedereen.</p>
                            <p><strong>Visie:</strong> Binnen 5 jaar uitgroeien tot het meest vertrouwde verhuurbedrijf van laptops en gaming gear in Suriname.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5>Openingstijden</h5>
                            <p>
                                <strong>Maandag – Vrijdag:</strong> 08:00 – 17:00<br>
                                <strong>Zaterdag:</strong> 09:00 – 13:00<br>
                                <strong>Zondag:</strong> Gesloten
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5>Contact Informatie</h5>
                            <p>
                                <i class="fas fa-envelope me-2"></i> <strong>Email:</strong> info@tech4rent.com<br>
                                <i class="fas fa-phone me-2"></i> <strong>Telefoon:</strong> +597 445812<br>
                                <i class="fas fa-map-marker-alt me-2"></i> <strong>Adres:</strong> Paramaribo, Suriname
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mt-4">
                <div class="card-body">
                    <h5>Onze Locatie</h5>
                    <div class="map-container">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1988.1234567890123!2d-55.12345678901234!3d5.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMDcnMjguNCJOIDU1wrAwNyc0OC40Ilc!5e0!3m2!1snl!2snl!4v1234567890123!5m2!1snl!2snl" 
                                width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </div>
        </section>
    `;
    mainContent.style.display = 'block';
    currentPage = 'about';
    updateLanguage();

}
