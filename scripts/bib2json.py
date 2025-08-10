import bibtexparser
import json

# Load BibTeX file
with open('mypapers.bib', encoding='utf-8') as bibtex_file:
    bib_database = bibtexparser.load(bibtex_file)

# Convert BibTeX entries to JSON format
publications_json = []
for entry in bib_database.entries:
    publication = {
        'type': entry.get('ENTRYTYPE', ''),
        'authors': entry.get('author', ''),
        'title': entry.get('title', ''),
        'venue': entry.get('journal', entry.get('booktitle', '')),
        'year': entry.get('year', entry.get('date', '')),
        'note': entry.get('note', ''),
        'issn': entry.get('issn', ''),
        'doi': entry.get('doi', ''),
        'url': entry.get('url', ''),
        'volume': entry.get('volume', ''),
        'pages': entry.get('pages', ''),
        'abstract': entry.get('abstract', ''),
        'language': entry.get('language', ''),
        'aknotes': entry.get('aknotes', ''),
        'keywords': entry.get('keywords', '')
    }
    publications_json.append(publication)

# Save JSON data
with open('publications.json', 'w', encoding='utf-8') as json_file:
    json.dump(publications_json, json_file, indent=2, ensure_ascii=False)

print('BibTeX converted to JSON successfully!')
