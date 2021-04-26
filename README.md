# Projekt zespołowy - SPAMBOT
## _Eryk Podborny, Mateusz Obidowski, Krzysztof Łagoda_

![N|Solid](https://panel.medicalsoftware.pl/resources/technologie/nodejs.svg)

## Wykorzystane moduły

- bcryptjs
- body-parser
- dotenv
- express
- jsonwebtoken
- mongoose
- mailgun-js

## Link do Azure App Service
### https://spamboot.azurewebsites.net/

## Wdrożenie
1. Utworzenie Azure App Service<br/>
![app](https://github.com/Trzmielu/Projekt_Zespolowy/blob/main/screenshots/appservice.jpg?raw=true)
2. Utworzenie bazy danych MongoDB<br/>
![db](https://github.com/Trzmielu/Projekt_Zespolowy/blob/main/screenshots/db.jpg?raw=true)
3. Dodanie odpowiedniego workflow oraz secretów do repozytorium<br/>
![workflow](https://github.com/Trzmielu/Projekt_Zespolowy/blob/main/screenshots/workflow.jpg?raw=true)
![secrets](https://github.com/Trzmielu/Projekt_Zespolowy/blob/main/screenshots/secrets.jpg?raw=true)
4. Push do repozytorium z aplikacją<br/>
5. Deploy do Azure za pomocą Github Actions<br/>
![deploy](https://github.com/Trzmielu/Projekt_Zespolowy/blob/main/screenshots/deploy.jpg?raw=true)
7. Dodanie zmiennych środowiskowych do App Service<br/>
![env](https://github.com/Trzmielu/Projekt_Zespolowy/blob/main/screenshots/env_var.jpg?raw=true)

## Testy Obciążeniowe
- GET /
![GET /](https://github.com/Trzmielu/Projekt_Zespolowy/blob/main/screenshots/GET%20home.png?raw=true)
- GET /api/portal
![GET /api/portal](https://github.com/Trzmielu/Projekt_Zespolowy/blob/main/screenshots/GET%20api_portal.png?raw=true)
- GET /portal.html
![GET portal.html](https://github.com/Trzmielu/Projekt_Zespolowy/blob/main/screenshots/GET%20portal_html.png?raw=true)
- POST /api/register
![POST api/register](https://github.com/Trzmielu/Projekt_Zespolowy/blob/main/screenshots/POST%20api_register.png?raw=true)
- POST /api/login
![POST api/login](https://github.com/Trzmielu/Projekt_Zespolowy/blob/main/screenshots/POST%20api_login.png?raw=true)
- POST /api/sendMail
![POST api/sendMail](https://github.com/Trzmielu/Projekt_Zespolowy/blob/main/screenshots/POST%20api_sendmail.png?raw=true)