import json
import os

cells = []

# Title
cells.append({
    "cell_type": "markdown",
    "metadata": {},
    "source": [
        "# EDA: Análisis de Series Temporales - Detective de Datos\n",
        "\n",
        "Este notebook documenta la generación, limpieza y validación de los datasets reales utilizados en el juego."
    ]
})

# Imports
cells.append({
    "cell_type": "code",
    "execution_count": None,
    "metadata": {},
    "outputs": [],
    "source": [
        "import pandas as pd\n",
        "import matplotlib.pyplot as plt\n",
        "import seaborn as sns\n",
        "\n",
        "# Configuración visual\n",
        "sns.set(style=\"whitegrid\")\n",
        "plt.rcParams['figure.figsize'] = (12, 6)"
    ]
})

# Load Data
cells.append({
    "cell_type": "markdown",
    "metadata": {},
    "source": ["## 1. Carga de Datos"]
})

cells.append({
    "cell_type": "code",
    "execution_count": None,
    "metadata": {},
    "outputs": [],
    "source": [
        "retail = pd.read_csv('../data/retail_2022_cleaned.csv')\n",
        "saas = pd.read_csv('../data/saas_2023_cleaned.csv')\n",
        "ecom = pd.read_csv('../data/ecommerce_2023_cleaned.csv')\n",
        "\n",
        "print(\"Retail shape:\", retail.shape)\n",
        "print(\"SaaS shape:\", saas.shape)\n",
        "print(\"E-commerce shape:\", ecom.shape)"
    ]
})

# Analysis Functions
cells.append({
    "cell_type": "code",
    "execution_count": None,
    "metadata": {},
    "outputs": [],
    "source": [
        "def calculate_metrics(df, col_name, name):\n",
        "    start = df[col_name].iloc[0]\n",
        "    end = df[col_name].iloc[-1]\n",
        "    growth = (end - start) / start * 100\n",
        "    \n",
        "    mean = df[col_name].mean()\n",
        "    std = df[col_name].std()\n",
        "    volatility = (std / mean) * 100\n",
        "    \n",
        "    print(f\"{name}: Growth={growth:.1f}%, Volatility={volatility:.1f}%\")\n"
    ]
})

# Verification
cells.append({
    "cell_type": "markdown",
    "metadata": {},
    "source": ["## 2. Verificación de Métricas"]
})

cells.append({
    "cell_type": "code",
    "execution_count": None,
    "metadata": {},
    "outputs": [],
    "source": [
        "calculate_metrics(retail, 'sales', 'Retail')\n",
        "calculate_metrics(saas, 'users', 'SaaS')\n",
        "calculate_metrics(ecom, 'traffic', 'E-commerce')"
    ]
})

# Visualization Retail
cells.append({
    "cell_type": "markdown",
    "metadata": {},
    "source": ["## 3. Visualización y Anomalías - Retail"]
})

cells.append({
    "cell_type": "code",
    "execution_count": None,
    "metadata": {},
    "outputs": [],
    "source": [
        "plt.figure()\n",
        "plt.plot(pd.to_datetime(retail['date']), retail['sales'], label='Ventas')\n",
        "anomalies = retail[retail['is_anomaly'] == 1]\n",
        "plt.scatter(pd.to_datetime(anomalies['date']), anomalies['sales'], color='red', label='Anomalías')\n",
        "plt.title('Retail Sales 2022')\n",
        "plt.legend()\n",
        "plt.show()"
    ]
})


notebook = {
    "cells": cells,
    "metadata": {
        "kernelspec": {
            "display_name": "Python 3",
            "language": "python",
            "name": "python3"
        },
        "language_info": {
            "codemirror_mode": {
                "name": "ipython",
                "version": 3
            },
            "file_extension": ".py",
            "mimetype": "text/x-python",
            "name": "python",
            "nbconvert_exporter": "python",
            "pygments_lexer": "ipython3",
            "version": "3.8.5"
        }
    },
    "nbformat": 4,
    "nbformat_minor": 4
}

os.makedirs('docs', exist_ok=True)
with open('docs/EDA_Analisis_Series_Temporales.ipynb', 'w', encoding='utf-8') as f:
    json.dump(notebook, f, indent=4)
print("Created notebook successfully")
