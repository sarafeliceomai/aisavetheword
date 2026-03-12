document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const poemContainer = document.getElementById('poem-container');

    async function loadBlocks(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return data.blocks;
        } catch (error) {
            console.error(`Errore nel caricamento di ${url}:`, error);
            return [];
        }
    }

    function getRandomItem(array) {
        if (!array || array.length === 0) return '';
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    async function generatePoem() {
        // Disabilita il pulsante mentre elabora
        generateBtn.disabled = true;
        generateBtn.textContent = "Cercando ispirazione...";
        poemContainer.style.opacity = 0;

        try {
            // Carica tutti i blocchi parallelamente
            const [openings, middles, endings] = await Promise.all([
                loadBlocks('data/openings.json'),
                loadBlocks('data/middles.json'),
                loadBlocks('data/endings.json')
            ]);

            // Seleziona un frammento casuale da ogni array
            const part1 = getRandomItem(openings);
            const part2 = getRandomItem(middles);
            const part3 = getRandomItem(endings);

            // Costruisci la poesia
            const poem = `${part1}\n\n${part2}\n\n${part3}`;

            // Visualizza la poesia con un piccolo delay per l'effetto fade-in
            setTimeout(() => {
                poemContainer.innerHTML = `<p>${poem.replace(/\n/g, '<br>')}</p>`;
                poemContainer.style.opacity = 1;
            }, 300);

        } catch (error) {
            poemContainer.innerHTML = `<p>C'è stato un piccolo intoppo tecnico, ma la speranza rimane intatta. Riprova.</p>`;
            poemContainer.style.opacity = 1;
        } finally {
            // Riabilita il pulsante
            generateBtn.disabled = false;
            generateBtn.textContent = "Riaccendi la Speranza";
        }
    }

    generateBtn.addEventListener('click', generatePoem);
});
