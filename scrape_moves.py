import urllib.request
import json
import ssl
import sys

def fetch_json(url):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=ctx) as response:
        return json.loads(response.read().decode('utf-8'))

def scrape():
    print("Fetching type name mappings...")
    type_map = {}
    type_list = fetch_json('https://pokeapi.co/api/v2/type?limit=30')
    for t in type_list['results']:
        td = fetch_json(t['url'])
        kr_names = [n['name'] for n in td['names'] if n['language']['name'] == 'ko']
        if kr_names:
            type_map[t['name']] = kr_names[0]
            
    print("Fetching move list...")
    list_data = fetch_json('https://pokeapi.co/api/v2/move?limit=1000')
    urls = [m['url'] for m in list_data['results']]
    print(f"Found {len(urls)} moves.")
    
    moves = []
    count = 0
    for url in urls:
        try:
            data = fetch_json(url)
            
            kr_names = [n['name'] for n in data['names'] if n['language']['name'] == 'ko']
            if not kr_names:
                continue
            name = kr_names[0]
            
            kr_flavor = [f['flavor_text'] for f in data['flavor_text_entries'] if f['language']['name'] == 'ko']
            flavor_text = kr_flavor[-1].replace('\n', ' ').replace('\f', ' ').replace('\r', ' ') if kr_flavor else ""
            
            type_name = "노말"
            if data['type'] and data['type']['name'] in type_map:
                type_name = type_map[data['type']['name']]
            
            cat = "물리"
            if data['damage_class']:
                c_name = data['damage_class']['name']
                if c_name == 'physical': cat = '물리'
                elif c_name == 'special': cat = '특수'
                elif c_name == 'status': cat = '변화'
                
            moves.append({
                "name": name,
                "type": type_name,
                "category": cat,
                "power": data['power'] if data['power'] is not None else "-",
                "accuracy": data['accuracy'] if data['accuracy'] is not None else "-",
                "pp": data['pp'] if data['pp'] is not None else "-",
                "description": flavor_text
            })
            count += 1
            if count % 50 == 0:
                print(f"Processed {count} moves...")
        except Exception as e:
            print(f"Error skipping {url}: {e}")
            
    with open('moves.json', 'w', encoding='utf-8') as f:
        json.dump(moves, f, ensure_ascii=False, indent=2)
    print("Saved moves.json successfully!")

if __name__ == '__main__':
    scrape()
