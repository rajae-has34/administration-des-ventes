# test_path.py
from pathlib import Path

# Chemin vers le build React
index_path = Path(__file__).resolve().parent / 'frontend' / 'build' / 'index.html'

print("Chemin recherché :", index_path)
print("Existe ?", index_path.exists())
