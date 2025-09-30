function renderTermsPage() {
    hideAllPages();
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <section class="container my-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 id="termsTitle">📋 Algemene Voorwaarden</h2>
                <button class="btn btn-outline-secondary" onclick="showHomePage()" id="backToHomeTerms">← Terug naar Home</button>
            </div>

            <div class="card">
                <div class="card-body">
                    <div class="terms-content">
                        <h4>1. Algemene Bepalingen</h4>
                        <p>Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten tussen Tech4Rent en de huurder.</p>

                        <h4>2. Huurovereenkomst</h4>
                        <p>De huurovereenkomst komt tot stand op het moment van reservering en betaling.</p>
                        
                        <h4>3. Betalingen</h4>
                        <p>Alle betalingen dienen vooraf te worden voldaan. Wij accepteren de volgende betaalmethoden:</p>
                        <ul>
                            <li>Creditcard (Visa, Mastercard)</li>
                            <li>Bankoverschrijving</li>
                            <li>Online betalingen</li>
                        </ul>

                        <h4>4. Levering & Ophalen</h4>
                        <p>Producten worden binnen 24 uur geleverd na bevestiging van de betaling.</p>

                        <h4>5. Annulering & Restitutie</h4>
                        <p>Annuleringen zijn mogelijk tot 24 uur voor de geplande levering. Restituties worden verwerkt binnen 5-7 werkdagen.</p>

                        <h4>6. Aansprakelijkheid</h4>
                        <p>De huurder is verantwoordelijk voor schade aan de gehuurde producten tijdens de huurperiode.</p>

                        <h4>7. Privacy & Gegevensbescherming</h4>
                        <p>Wij beschermen uw persoonsgegevens volgens de AVG wetgeving. Creditcardgegevens worden niet opgeslagen.</p>

                        <h4>8. Contact</h4>
                        <p>Voor vragen: <a href="mailto:info@tech4rent.com">info@tech4rent.com</a> of +597 445812</p>
                    </div>
                </div>
            </div>
        </section>
    `;
    mainContent.style.display = 'block';
    currentPage = 'terms';
    updateLanguage();
}