# Docker, MySQL, and phpMyAdmin

The project uses **MySQL 8.4**. phpMyAdmin is included as a local-only browser
interface to that database; it is not PostgreSQL or phpPgAdmin.

## Database login

The `.env.example` local-development credentials are:

| Purpose | Username | Password | Database |
| --- | --- | --- | --- |
| App/database user (use this in phpMyAdmin) | `portfolio` | `portfolioralph` | `portfolio` |
| MySQL administrator | `root` | `portfolioniralph` | `portfolio` |

The workspace's `.env` currently contains placeholder values
(`change-this-local-password` and `change-this-local-root-password`), which do
not match the existing database volume. Open `.env` with `notepad .env` and set
`MYSQL_PASSWORD=portfolioralph` and `MYSQL_ROOT_PASSWORD=portfolioniralph` to
match the database created from `.env.example`. For a fresh database, replace
these sample passwords with your own before its first start. Do not use sample
passwords outside local development.

phpMyAdmin uses the MySQL account you enter on its login screen. Use the
`portfolio` account for normal database browsing. The `root` account has
administrator privileges; avoid using it for routine work.

If you change either password in your local `.env`, use the updated value
instead. MySQL only applies its initial credentials when it initializes a new
database volume. Changing passwords in `.env` does not change credentials in an
already-initialized database.

## Start the services

Open PowerShell, go to the project directory, then run:

```powershell
cd "C:\Users\Ralph Laurence\Downloads\Enginnering Prompt"
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
```

Set the two passwords as described above, save `.env`, then run
the following command:

```powershell
docker compose up --build -d
```

MySQL reads its initial credentials only when the database volume is created.
Later changes to `.env` do not change passwords stored in an existing database.
Then open:

- Website and API: <http://localhost:8080>
- phpMyAdmin: <http://localhost:8081>

Sign in to phpMyAdmin with username `portfolio` and password `portfolioralph`,
then select the `portfolio` database. For the MySQL administrator account, use
username `root` and password `portfolioniralph`. phpMyAdmin is bound to
`127.0.0.1`, so it is only published on the local machine.

## Docker commands

Run these from the project directory:

```powershell
# Show running containers and health
docker compose ps

# Follow logs for all services (Ctrl+C exits the log view, not the services)
docker compose logs -f

# Follow a specific service's logs
docker compose logs -f web
docker compose logs -f db
docker compose logs -f phpmyadmin

# Restart the running services
docker compose restart

# Stop containers but preserve saved database contents
docker compose down

# Start again without rebuilding
docker compose up -d

# Rebuild the site/API image and start every service
docker compose up --build -d
```

## Open a MySQL command prompt

```powershell
docker compose exec db mysql -uportfolio -p portfolio
```

When prompted, enter `portfolioralph`. Then, at the `mysql>` prompt:

```sql
SHOW TABLES;
SELECT id, name, email, subject, created_at
FROM contact_messages
ORDER BY created_at DESC;
exit
```

To connect as the MySQL administrator instead:

```powershell
docker compose exec db mysql -uroot -p portfolio
```

When prompted, enter `portfolioniralph`.

## Remove containers and data

Stop containers but keep the database volume and saved contact messages:

```powershell
docker compose down
```

Stop the containers **and permanently delete the database volume and all saved
contact messages**:

```powershell
docker compose down -v
```
