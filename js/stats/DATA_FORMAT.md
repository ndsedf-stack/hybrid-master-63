# 📦 FORMAT DES DONNÉES

## 🎯 Format Standard (`completedSessions`)

Toutes les données d'entraînement sont stockées dans `localStorage` sous la clé `completedSessions`.

### Structure JSON :
```json
[
  {
    "date": "2024-11-25",
    "exercises": [
      {
        "name": "Bench Press",
        "muscle": "Pecs",
        "sets": [
          { "reps": 10, "weight": 80 },
          { "reps": 8, "weight": 85 }
        ]
      },
      {
        "name": "Squat",
        "muscle": "Legs",
        "sets": [
          { "reps": 12, "weight": 100 }
        ]
      }
    ]
  }
]
```

## 🔄 Migration Automatique

Le système migre automatiquement les anciennes données de `workout_history` vers `completedSessions`.

### Ancien format (workout_history) :
```json
[
  {
    "date": "2024-11-25",
    "week": 48,
    "completed": true,
    "exercises": [...]
  }
]
```

### Nouveau format (completedSessions) :
```json
[
  {
    "date": "2024-11-25",
    "exercises": [...]
  }
]
```

## 📥 Import de Données

Pour importer des données existantes :

1. Ouvrir la console (F12)
2. Exécuter :
```javascript
const myData = [
  {
    date: "2024-11-25",
    exercises: [
      {
        name: "Bench Press",
        muscle: "Pecs",
        sets: [{ reps: 10, weight: 80 }]
      }
    ]
  }
];

localStorage.setItem('completedSessions', JSON.stringify(myData));
location.reload();
```

## ✅ Validation

Vérifier que les données sont bien importées :
```javascript
const sessions = JSON.parse(localStorage.getItem('completedSessions'));
console.log(`${sessions.length} sessions chargées`);
```
