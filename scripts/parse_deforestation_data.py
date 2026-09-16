"""
Parse GFW Tree Cover Loss Excel files for North Eastern Region (8 states, 95 districts)
and export normalized stats JSON to API and web packages.
"""

import os
import json
import pandas as pd

NE_STATES = [
    'Arunachal Pradesh', 'Assam', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Sikkim', 'Tripura'
]

def parse_deforestation_data():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    sub1_path = os.path.join(base_dir, "..", "packages", "shared", "archive-2", "Subnational 1 tree cover loss.xlsx")
    sub2_path = os.path.join(base_dir, "..", "packages", "shared", "archive-2", "Subnational 2 tree cover loss.xlsx")

    df1 = pd.read_excel(sub1_path)
    df1_ne = df1[(df1['threshold'] == 30) & (df1['subnational1'].isin(NE_STATES))]

    df2 = pd.read_excel(sub2_path)
    df2_ne = df2[(df2['threshold'] == 30) & (df2['subnational1'].isin(NE_STATES))]

    states_data = {}
    for _, row in df1_ne.iterrows():
        st_name = str(row['subnational1']).strip()
        extent_2000 = float(row.get('extent_2000_ha', 0) or 0)
        area = float(row.get('area_ha', 0) or 0)
        annual_loss = {str(yr): float(row.get(f'tc_loss_ha_{yr}', 0) or 0) for yr in range(2001, 2021)}
        cum_loss = sum(annual_loss.values())
        loss_pct = (cum_loss / extent_2000 * 100) if extent_2000 > 0 else 0.0
        states_data[st_name] = {
            'name': st_name,
            'type': 'state',
            'area_ha': round(area, 2),
            'extent_2000_ha': round(extent_2000, 2),
            'cumulative_loss_ha': round(cum_loss, 2),
            'forest_loss_pct': round(loss_pct, 2),
            'annual_loss': {k: round(v, 2) for k, v in annual_loss.items()}
        }

    districts_data = {}
    for _, row in df2_ne.iterrows():
        dist_name = str(row['subnational2']).strip()
        st_name = str(row['subnational1']).strip()
        extent_2000 = float(row.get('extent_2000_ha', 0) or 0)
        area = float(row.get('area_ha', 0) or 0)
        annual_loss = {str(yr): float(row.get(f'tc_loss_ha_{yr}', 0) or 0) for yr in range(2001, 2021)}
        cum_loss = sum(annual_loss.values())
        loss_pct = (cum_loss / extent_2000 * 100) if extent_2000 > 0 else 0.0
        districts_data[dist_name] = {
            'name': dist_name,
            'type': 'district',
            'state': st_name,
            'area_ha': round(area, 2),
            'extent_2000_ha': round(extent_2000, 2),
            'cumulative_loss_ha': round(cum_loss, 2),
            'forest_loss_pct': round(loss_pct, 2),
            'annual_loss': {k: round(v, 2) for k, v in annual_loss.items()}
        }

    result = {
        'states': states_data,
        'districts': districts_data
    }

    api_data_dir = os.path.join(base_dir, "..", "packages", "api", "src", "data")
    web_data_dir = os.path.join(base_dir, "..", "apps", "web", "src", "data")
    os.makedirs(api_data_dir, exist_ok=True)
    os.makedirs(web_data_dir, exist_ok=True)

    p1 = os.path.join(api_data_dir, "ner_deforestation_stats.json")
    p2 = os.path.join(web_data_dir, "ner_deforestation_stats.json")

    with open(p1, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2)
    with open(p2, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2)

    print(f"Exported deforestation stats: {len(states_data)} states, {len(districts_data)} districts.")

if __name__ == "__main__":
    parse_deforestation_data()
