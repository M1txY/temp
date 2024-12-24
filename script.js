// Initialiser les icônes Lucide
lucide.createIcons();

// Charger les données des films et séries
fetch('movies_data.json')
    .then(response => {
        if (!response.ok) throw new Error("Erreur lors du chargement du fichier JSON");
        return response.json();
    })
    .then(data => {
        const movies = data.data.items.filter(item => item.type === 'movie');
        const tvShows = data.data.items.filter(item => item.type === 'tv');

        const searchBar = document.getElementById('search-bar');
        const moviesSuggestions = document.getElementById('movies-suggestions');
        const tvSuggestions = document.getElementById('tv-suggestions');

        // Écouteur pour rechercher des films ou séries
        searchBar.addEventListener('input', () => {
            const query = searchBar.value.toLowerCase();
            moviesSuggestions.innerHTML = '';
            tvSuggestions.innerHTML = '';

            const filteredMovies = movies.filter(movie =>
                movie.title.toLowerCase().includes(query)
            );
            updateSuggestions(moviesSuggestions, filteredMovies, "film");

            const filteredTvShows = tvShows.filter(show =>
                show.title.toLowerCase().includes(query)
            );
            updateTvSuggestions(tvSuggestions, filteredTvShows);
        });

        // Mettre à jour la liste des suggestions pour les films
        function updateSuggestions(container, items, icon) {
            if (items.length > 0) {
                items.forEach(item => {
                    if (item.paths && item.paths.length > 0) {
                        // Construire l'URL du film
                        const movieUrl = `https://cdn.unsealab.com${item.paths[0]}`;
                        const suggestionItem = document.createElement('div');
                        suggestionItem.classList.add('suggestion-item');
        
                        suggestionItem.innerHTML = `
                            <div class="media-info">
                                <i data-lucide="${icon}"></i>
                                <span class="movie-title">${item.title}</span>
                            </div>
                            <div class="action-links">
                                <a href="vlc://${movieUrl}" class="action-link">
                                    <i data-lucide="play-circle"></i> VLC
                                </a>
                                <a href="${movieUrl}" target="_blank" class="action-link">
                                    <i data-lucide="eye"></i> Voir
                                </a>
                            </div>
                        `;
                        container.appendChild(suggestionItem);
                    } else {
                        console.error(`Données manquantes pour le film : ${item.title}`);
                    }
                });
                lucide.createIcons();
            } else {
                container.innerHTML = `<div class="suggestion-item"><span>Aucun résultat trouvé</span></div>`;
            }
        }
        

        // Mettre à jour la liste des suggestions pour les séries
        function updateTvSuggestions(container, items) {
            if (items.length > 0) {
                items.forEach(item => {
                    if (item.id && item.paths && item.paths.length > 0) {
                        const suggestionItem = document.createElement('div');
                        suggestionItem.classList.add('suggestion-item');

                        const seasons = extractSeasonsAndEpisodes(item.paths);

                        suggestionItem.innerHTML = `
                            <div class="media-info">
                                <i data-lucide="tv"></i>
                                <span class="movie-title">${item.title}</span>
                            </div>
                            <div class="seasons-list">
                                ${Object.entries(seasons).map(([season, episodes]) => `
                                    <div class="season">
                                        <strong>Saison ${season}</strong>
                                        <ul class="episode-list">
                                            ${episodes.map(ep => {
                                                const episodeUrl = `https://cdn.unsealab.com${ep.path}`;
                                                return `
                                                    <li>
                                                        <a href="vlc://${episodeUrl}" class="action-link">
                                                            <i data-lucide="play"></i> Épisode ${ep.number}
                                                        </a>
                                                    </li>
                                                `;
                                            }).join('')}
                                        </ul>
                                    </div>
                                `).join('')}
                            </div>
                        `;
                        container.appendChild(suggestionItem);
                    } else {
                        console.error(`Données manquantes pour la série : ${item.title}`);
                    }
                });
                lucide.createIcons();
            } else {
                container.innerHTML = `<div class="suggestion-item"><span>Aucune série trouvée</span></div>`;
            }
        }

        // Extraire les saisons et épisodes des chemins
        function extractSeasonsAndEpisodes(paths) {
            const seasons = {};
            paths.forEach(path => {
                const match = path.match(/seasons\/(\d+)\/(\d+)\.mp4$/);
                if (match) {
                    const season = match[1];
                    const episode = match[2];
                    if (!seasons[season]) seasons[season] = [];
                    seasons[season].push({ number: episode, path });
                }
            });
            return seasons;
        }
    })
    .catch(error => console.error('Erreur:', error));
