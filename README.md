# About
Create a nodejs app with different configurations for prod and dev environments. In this application you'll create a REST API to handle a book directory

# How to run
Clone this repo
```bash
  git clone https://github.com/arthurgrigoletto/arthurgrigoletto-avantica.git

  cd arthurgrigoletto-avantica
```

Install dependencies

```bash
  yarn
```

At this point, you need to have docker installed, if you have postgres and redis installed locally skip this step.

```bash
  docker-compose up -d
```

Copy our envs and orm config file.

```bash
  cp .env.example .env && cp ormconfig.example.json ormconfig.json
```
If you running postgres and redis locally, replace username, password, database values to match with your configuration.

Run the migrations

```bash
  yarn typeorm migration:run
```

Run the app
```
  yarn start:dev
```

For production, all you have to do is configuring environment variables and ormconfig correctly, and use commands:
```bash
  yarn build

  yarn start
```

This will build our application, generate a compile javascript code and run the build app.

# Routes and documentation
With the application running you can access all routes and documentation at: [`http://localhost:3000/api-docs`](http://localhost:3000/api-docs)
