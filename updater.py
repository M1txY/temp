import requests
from bs4 import BeautifulSoup
import json

url = "https://www.kalbap.com/731tyq3o87l/home/kalbap"
response = requests.get(url)

if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'html.parser')

    divs = soup.find_all('div', id='hann')
    films = []

    # URL de base pour compléter les liens
    base_url = "https://www.kalbap.com"

    for div in divs:
        a_tag = div.find('a', href=True)
        if a_tag:
            title = a_tag.get_text(strip=True)  # Récupère le texte du lien (nom du film)
            href = base_url + a_tag['href']     # Lien complet

            films.append({
                "title": title,
                "href": href
            })

    # Conversion en JSON
    films_json = json.dumps(films, ensure_ascii=False, indent=4)

    print(films_json)
else:
    print(f"Impossible d'accéder à la page. Code HTTP : {response.status_code}")
