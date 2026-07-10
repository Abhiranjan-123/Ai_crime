from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = "mongodb://127.0.0.1:27017"
client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=2000)
db = client.fir_system

LOCATION_GPS = {
    "begusarai,singhaul": [25.4320, 86.1180],
    "singhaul": [25.4320, 86.1180],
    "main market": [25.4150, 86.1290],
    "bus stand": [25.4210, 86.1320],
    "station road": [25.4120, 86.1240],
    "gd college": [25.4250, 86.1150]
}
DEFAULT_COORDS = [25.4182, 86.1260]

@app.get("/api/ai/analytics")
async def get_live_analytics():
    try:
        await client.admin.command('ping')
        cursor = db.firs.find({})
        firs = await cursor.to_list(length=2000)
    except Exception as e:
        print(f"Database offline: {e}")
        firs = []

    # System Fallback
    if not firs:
        return {
            "hotspots": {"Main Market": 1},
            "crime_breakdown": {"Robbery": 1, "Murder": 0, "Others": 0},
            "patrol_graph_data": {"Main Market": 5},
            "route_sequence_labels": ["Start (HQ)", "1. Main Market"],
            "route_sequence_durations": [0, 45],
            "festival_alert_data": {"Main Market": 85, "Station Road": 40}, # Simulated congestion indices
            "womens_safety_risk_zones": ["Main Market"],
            "patrol_route": [DEFAULT_COORDS, [25.4150, 86.1290]],
            "live_alerts": ["⚠️ Running in baseline mode. Populate MongoDB to update metrics."],
            "raw_coordinates_map": [{"name": "Main Market", "coords": [25.4150, 86.1290], "count": 1, "primary_crime": "Robbery"}]
        }

    df = pd.DataFrame(firs)
    df['clean_loc'] = df['location'].str.lower().str.strip()
    
    if 'crimeType' not in df.columns:
        df['crimeType'] = 'Others'
    df['crimeType_clean'] = df['crimeType'].str.title().str.strip()

    # 1. Graph 1: Crime Predicted Categories
    robbery_count = int(df[df['crimeType_clean'] == 'Robbery'].shape[0])
    murder_count = int(df[df['crimeType_clean'] == 'Murder'].shape[0])
    others_count = int(df.shape[0] - (robbery_count + murder_count))
    crime_breakdown = {"Robbery": robbery_count, "Murder": murder_count, "Others": others_count}

    hotspot_counts = df['location'].value_counts().to_dict()

    # 2. Graph 2: Route Durations & Sequential Progressions
    top_locations = df['clean_loc'].value_counts().index.tolist()
    generated_route = [DEFAULT_COORDS]
    route_labels = ["HQ Station"]
    route_durations = [0]
    
    step_idx = 1
    for loc in top_locations:
        if loc in LOCATION_GPS:
            generated_route.append(LOCATION_GPS[loc])
            route_labels.append(f"{step_idx}. {loc.title()}")
            route_durations.append(15 + (hotspot_counts[loc] * 20))
            step_idx += 1

    # 3. NEW FEATURE: FESTIVAL ALERT CONGESTION GRAPH DATA PULL
    # Calculates crowding vulnerabilities based on location types + density weights
    festival_alert_distribution = {}
    for loc, count in hotspot_counts.items():
        loc_title = loc.title()
        # High transit/market public spaces dynamically hit maximum crowd thresholds
        if "market" in loc or "bus" in loc or "station" in loc:
            festival_alert_distribution[loc_title] = 50 + (count * 15)  # Heavy seasonal footprint
        else:
            festival_alert_distribution[loc_title] = 20 + (count * 10)

    # General parameters preparation
    patrol_hours_distribution = {}
    raw_coordinates_map = []
    for loc, count in hotspot_counts.items():
        clean_key = loc.lower().strip()
        loc_df = df[df['clean_loc'] == clean_key]
        primary_crime = loc_df['crimeType_clean'].value_counts().index[0] if not loc_df.empty else "General"
        patrol_hours_distribution[loc.title()] = 2 + (count * 3)
        
        raw_coordinates_map.append({
            "name": loc.title(),
            "coords": LOCATION_GPS.get(clean_key, DEFAULT_COORDS),
            "count": int(count),
            "primary_crime": primary_crime
        })

    womens_risk_locations = []
    if 'incidentTime' in df.columns:
        df['is_night'] = df['incidentTime'].apply(lambda t: 1 if t and isinstance(t, str) and (int(t.split(':')[0]) >= 18 or int(t.split(':')[0]) <= 4) else 0)
        night_counts = df[df['is_night'] == 1]['clean_loc'].value_counts()
        for loc, count in night_counts.items():
            womens_risk_locations.append(loc.title())

    live_alerts = [f"⚠️ CRIME RISK INCOMING: {loc.title()} requires immediate tactical presence." for loc, count in hotspot_counts.items() if count >= 2]
    
    # Inject an explicit automated notice for areas registering high festival overcrowding indexes
    for loc, density in festival_alert_distribution.items():
        if density >= 65:
            live_alerts.insert(0, f"🎉 FESTIVAL CROWD ALERT: High density pedestrian threat predicted at {loc} ({density}% Congestion Risk). Spike in minor theft anticipated.")

    return {
        "hotspots": hotspot_counts,
        "crime_breakdown": crime_breakdown,
        "patrol_graph_data": patrol_hours_distribution,
        "route_sequence_labels": route_labels,
        "route_sequence_durations": route_durations,
        "festival_alert_data": festival_alert_distribution, # Export to frontend interface layout
        "womens_safety_risk_zones": womens_risk_locations,
        "patrol_route": generated_route,
        "live_alerts": live_alerts if live_alerts else ["ℹ️ Analytics synced. Normal security matrix levels detected."],
        "raw_coordinates_map": raw_coordinates_map
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)