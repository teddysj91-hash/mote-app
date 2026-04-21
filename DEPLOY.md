# Tenue — Slik deployer du

## Hva du trenger
- En GitHub-konto (gratis)
- En Vercel-konto (gratis — logg inn med GitHub på vercel.com)
- En Anthropic API-nøkkel (fra console.anthropic.com)

## Steg 1: Last opp til GitHub
1. Gå til github.com og lag et nytt repository ("tenue-app", privat er fint)
2. Åpne Terminal i **tenue-app**-mappen og kjør:

```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DITT-BRUKERNAVN/tenue-app.git
git push -u origin main
```

## Steg 2: Deploy til Vercel
1. Gå til vercel.com → "Add New Project"
2. Importer GitHub-repoet "tenue-app"
3. Vercel oppdager automatisk at det er Vite — bare trykk "Deploy"
4. **Viktig:** Gå til prosjektets "Settings" → "Environment Variables"
5. Legg til: `ANTHROPIC_API_KEY` = din nøkkel fra console.anthropic.com
6. Trykk "Redeploy" (under Deployments-fanen)

## Ferdig!
Du får en URL som `tenue-app.vercel.app` — send denne til hvem du vil.
Appen fungerer på mobil og desktop. API-nøkkelen din er trygt skjult.

## Kostnad
- Vercel: Gratis (hobby tier)
- Anthropic API: ca. $0.003 per melding (Sonnet) — 1000 meldinger = ~$3
- Total: tilnærmet gratis for testing

## Lokal utvikling
Hvis du vil kjøre lokalt for å teste endringer:
```
npm install
npm run dev
```
(Husk å lage en `.env`-fil med API-nøkkelen for lokal testing med serverless functions.)
