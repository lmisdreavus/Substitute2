const fs = require('fs');

async function scrapeMoves() {
    console.log("Starting PokeAPI Move Scraper...");
    try {
        // 1. Get the list of all moves
        // Note: As of Gen 9, there are around 900+ moves. We fetch up to 1000 to be safe.
        const listResponse = await fetch('https://pokeapi.co/api/v2/move?limit=1000');
        const listData = await listResponse.json();
        const moveUrls = listData.results.map(m => m.url);

        console.log(`Found ${moveUrls.length} moves to process.`);

        const movesDatabase = [];
        let count = 0;

        // Process in batches so we don't overwhelm the API
        const batchSize = 50;
        for (let i = 0; i < moveUrls.length; i += batchSize) {
            const batchUrls = moveUrls.slice(i, i + batchSize);
            const batchPromises = batchUrls.map(async (url) => {
                try {
                    const res = await fetch(url);
                    if (!res.ok) return null;
                    const moveData = await res.json();

                    // Extract Korean name
                    const krNameObj = moveData.names.find(n => n.language.name === 'ko');
                    if (!krNameObj) return null; // Skip if no Korean translation exists

                    const name = krNameObj.name;

                    // Extract Korean flavor text (preferably from the latest version)
                    let flavorText = "";
                    const krFlavorTexts = moveData.flavor_text_entries.filter(f => f.language.name === 'ko');
                    if (krFlavorTexts.length > 0) {
                        // Get the last one, which is usually the newest generation
                        flavorText = krFlavorTexts[krFlavorTexts.length - 1].flavor_text;
                        // Clean up control characters
                        flavorText = flavorText.replace(/[\n\f\r]/g, ' ');
                    }

                    // Extract Type
                    let type = "노말"; // Default
                    if (moveData.type) {
                        const typeUrl = moveData.type.url;
                        const typeRes = await fetch(typeUrl);
                        if (typeRes.ok) {
                            const typeData = await typeRes.json();
                            const krTypeObj = typeData.names.find(n => n.language.name === 'ko');
                            if (krTypeObj) type = krTypeObj.name;
                        }
                    }

                    // Extract Damage Class (Category)
                    let category = "물리"; // Default
                    if (moveData.damage_class) {
                        const className = moveData.damage_class.name;
                        if (className === 'physical') category = '물리';
                        else if (className === 'special') category = '특수';
                        else if (className === 'status') category = '변화';
                    }

                    return {
                        name: name,
                        type: type,
                        category: category,
                        power: moveData.power || "-",
                        accuracy: moveData.accuracy || "-",
                        pp: moveData.pp || "-",
                        description: flavorText
                    };
                } catch (err) {
                    console.error(`Failed to process URL ${url}`, err.message);
                    return null;
                }
            });

            const batchResults = await Promise.all(batchPromises);
            for (const result of batchResults) {
                if (result) {
                    movesDatabase.push(result);
                }
            }

            count += batchResults.length;
            console.log(`Processed ${count}/${moveUrls.length} moves...`);
        }

        console.log(`Successfully scraped ${movesDatabase.length} moves.`);

        fs.writeFileSync('moves.json', JSON.stringify(movesDatabase, null, 2), 'utf8');
        console.log("Saved to moves.json!");

    } catch (error) {
        console.error("Fatal Error during scraping:", error);
    }
}

scrapeMoves();
