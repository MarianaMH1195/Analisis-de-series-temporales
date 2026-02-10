import pandas as pd
import numpy as np
import json
import os
from datetime import datetime, timedelta

# Create data directory
os.makedirs('data', exist_ok=True)

# ==========================================
# RETAIL DATA (2022) - Matching M1, M2, M3, M6
# ==========================================
start_date = datetime(2022, 1, 1)
days = 304
dates = [start_date + timedelta(days=i) for i in range(days)]
data = []

weekly_factors = [0.92, 0.95, 0.94, 0.97, 0.99, 1.05, 0.91] # Dom-Sab

for i, d in enumerate(dates):
    # Target Growth: 265% from 6420 -> +265% = 6420 * 3.65 = 23433
    # M1 Q1 says "6.4K a 22.8K".
    # (22800 - 6400) / 6400 = 2.56 (256%). Close enough.
    # Keep slope 54.
    trend = 6420 + (i * 54) # End ~22800
    
    js_day_index = (d.weekday() + 1) % 7
    factor = weekly_factors[js_day_index]
    
    np.random.seed(42 + i) 
    noise = (np.random.rand() - 0.5) * 500
    
    value = int(round(trend * factor + noise))
    
    is_anomaly = 0
    anomaly_type = ''
    anomaly_label = ''
    impact_pct = 0
    
    # Anomalies logic from app.js
    if i == 0: # New Year
        value = 2950
        is_anomaly = 1
        anomaly_type = 'caída'
        anomaly_label = 'Año Nuevo'
        impact_pct = -58
        # Note: Growth calculation will implicitly use trend start (6420), not value (2950).
    elif i == 120: # Labor Day
        value = int(round(trend * 0.89))
        is_anomaly = 1
        anomaly_type = 'caída'
        anomaly_label = 'Día Trabajo'
        impact_pct = -11
    elif i == 121: # Bridge
        value = int(round(trend * 0.88))
        is_anomaly = 1
        anomaly_type = 'caída'
        anomaly_label = 'Puente'
        impact_pct = -12
    elif i == 303: # Halloween
        value = int(round(trend * 1.5))
        is_anomaly = 1
        anomaly_type = 'pico'
        anomaly_label = 'Halloween'
        impact_pct = 50

    data.append({
        'date': d.strftime('%Y-%m-%d'),
        'sales': value,
        'is_anomaly': is_anomaly,
        'anomaly_type': anomaly_type,
        'anomaly_label': anomaly_label,
        'impact_pct': impact_pct
    })

df_retail = pd.DataFrame(data)
df_retail.to_csv('data/retail_2022_cleaned.csv', index=False)
print(f"Generated retail_2022_cleaned.csv with {len(df_retail)} rows")


# ==========================================
# SAAS DATA (2023) - Matching M4, M7
# ==========================================
months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
values = [8200, 8900, 9650, 10500, 11400, 12200, 13100, 14000, 15100, 16200, 17500, 18900]
data_saas = []

for i, val in enumerate(values):
    data_saas.append({
        'date': f"2023-{i+1:02d}-01",
        'users': val,
        'growth_pct': round((val - values[i-1])/values[i-1]*100, 1) if i > 0 else 0,
        'is_milestone': 1 if i == 11 else 0
    })

df_saas = pd.DataFrame(data_saas)
df_saas.to_csv('data/saas_2023_cleaned.csv', index=False)
print(f"Generated saas_2023_cleaned.csv with {len(df_saas)} rows")


# ==========================================
# E-COMMERCE DATA (2023) - Matching M5, M7
# ==========================================
start_date_ecom = datetime(2023, 1, 1)
days_ecom = 365
dates_ecom = [start_date_ecom + timedelta(days=i) for i in range(days_ecom)]
data_ecom = []

# Target Growth 320%
# Start ~8200. End ~34440.
# Slope = (34440 - 8200) / 365 = 71.8
slope_ecom = 71.8

for i, d in enumerate(dates_ecom):
    trend = 8200 + (i * slope_ecom)
    np.random.seed(100 + i)
    volatility = (np.random.rand() - 0.5) * trend * 0.3
    value = trend + volatility
    
    month = d.month # 1-12
    day = d.day
    
    is_anomaly = 0
    anomaly_label = ''
    threshold_crossed = 0
    
    # Event logic
    if month == 2 and day == 14:
        value *= 1.5
        is_anomaly = 1
        anomaly_label = "Valentine's"
    elif month == 7 and 11 <= day <= 12:
        value *= 1.4
        is_anomaly = 1
        anomaly_label = "Prime Day"
    elif month == 11 and day == 24:
        value *= 1.85
        is_anomaly = 1
        anomaly_label = "Black Friday"
        threshold_crossed = 1
    elif month == 11 and day == 27:
        value *= 1.7
        is_anomaly = 1
        anomaly_label = "Cyber Monday"
        threshold_crossed = 1
    elif month == 12 and 20 <= day <= 25:
        value *= 1.45
        is_anomaly = 1
        anomaly_label = "Navidad"

    data_ecom.append({
        'date': d.strftime('%Y-%m-%d'),
        'traffic': int(round(value)),
        'is_event': is_anomaly,
        'event_name': anomaly_label,
        'threshold_crossed': threshold_crossed
    })

df_ecom = pd.DataFrame(data_ecom)
df_ecom.to_csv('data/ecommerce_2023_cleaned.csv', index=False)
print(f"Generated ecommerce_2023_cleaned.csv with {len(df_ecom)} rows")

# Re-generate Config
config = {
    "datasets": {
        "retail": "data/retail_2022_cleaned.csv",
        "saas": "data/saas_2023_cleaned.csv",
        "ecommerce": "data/ecommerce_2023_cleaned.csv"
    },
    "metadata": {
        "version": "2.0",
        "last_updated": datetime.now().strftime('%Y-%m-%d'),
        "description": "Datos reales sintetizados para Detective de Datos v2.0"
    }
}
with open('data/game_data_config.json', 'w') as f:
    json.dump(config, f, indent=4)
