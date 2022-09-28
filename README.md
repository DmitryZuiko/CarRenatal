# Car Rental

## Installation

1.Install from github:
```bash
$ gh repo clone DmitryZuiko/CarRenatal
```
2.Change configuration in db.ts file on yours; 

3.Create the table in your database:
```sql
CREATE TABLE booking (
    id SERIAL PRIMARY KEY,
    startedAt DATE,
    endedAt DATE,
    carId VARCHAR(30), 
    userId VARCHAR(30),
    cost INT
);
```

3.Install dependencies
```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Swagger

```
http://localhost:3000/swagger/
```

