# Northcoders News API

## Setting Up The Application

Certain files will need to be created in the root directory of the application before it will run. 
These are detailed below.

### Environment Variables

The application makes use of certain environment variables.

* `PGDATABASE` This sets the database name of the PostgresSQL that the application
will connect to.

* `LOGL` This sets the logging level to use.  Available values are `'error'`, 
`'info'`, and `'debug'`.

#### Development Environment File

The file `.env.development` provides environment variables for the development environment.  

Example `.env.development` file:

```
PGDATABASE=nc_news
LOGL='debug'
```

#### Testing Environment File

The file `.env.test` provides environment variables for the testing environment.  

Example `.env.test` file:

```
PGDATABASE=nc_news_test
LOGL='error'
```