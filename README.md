# Uruchamianie aplikacji w trybie developerskim

1. Wybrać odpowiednią wersję, wersja do pobrania z brancha master jest wersją developerską. Aby pobrać wersję pod deployment należy pobrać release
2. Zaintalować node.js i npm najlepiej w wersjach odpowiednio v25.3.0 i 11.7.0
3. Wejść w folder zawierający część front-endową aplikacji i wykonać komendę npm i
4. Po zakończeniu pracy komendy wykonać komendę npm start
5. Uruchomić serwer bazy danych PostgreSQL (Polecam program PGAdmin)
6. Uruchomić w bazie danych skrypt podany w plikach projektu
7. Uruchomić wybrane IDE i otworzyć w nim część back-endową 
8. Uruchomić Projekt w IDE (Wymagana java 21)
9. Projekt powinien dzialać na portach 3000 i 8080 oraz 5432 dla bazy danych



# Uruchamianie aplikacji w trybie deploymentu lokalnie

1. Pobrać najnowszy release
2. Zainstalować pliki back-endowe na wybranym serwerze akceptującym aplikacje javy w formacie JRE 
3. Zainstalować pliki front-endowe na wybranym serwerze akceptującym aplikacje webowe
4. Zainstalować na serwerze bazy danych PostgreSQL Plik zawierający zrzut struktury bazy danych
5. Upewnić się, że aplikacje dzialają na portach 3000, 8080 i 5432 oraz są hostowane w tym samym środowisku sieciowym

# Uruchamianie aplikacji w trybie deploymentu normalnie

1. Pobrać najnowszy release
2. Wykonać instrukcje podane do uruchomienia aplikacji w trybie developerskim
3. Podać w części front-endowej w pliku package.json adres serwera back-endu jako proxy
4. Podać adres serwera bazy danych w pliku application.properties oraz podać parametry polaczenia
5. Wykonać w części front-endowej komendę npm build, w katalogu build powinny się pojawić pliki, które musimy zainstalować na serwerze docelowym front-endu
6. Wykonać instrukcję mvn package, i uruchomić na serwerze back-endu plik znajdujący się w katalogu target w formacie JAR
7. Uruchomić serwer bazy danych na adresie wskazanym w konfiguracji back-endu