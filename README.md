### Application

Get the application code using git or the zip from github:

```
git clone https://github.com/previa/localization.git
```

Extract the zip if needed.

```
npm run deploy
```

This command will install all needed dependencies, compile the project and start the application.
All logs can be found in the `/app/pozyx.log file`

When the connection with the DB (MySQL) is refused make sure app/config/config.js contains the correct values for following parameters.

```
config.dbHost = ‘localhost’;
config.dbUser = ‘root’;
config.dbPassword = ‘test’;
config.dbPort = 3306;
```

The application runs on port 8080 by default, this can be changed by changing following line in the `/app/config/config.js` file.

```
config.port = 8080;
```

The login info for the application is the following:

```
user: admin
password: admin
```
