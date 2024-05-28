# Northcoders News API

## Setting Up The Application

Certain files will need to be created in the root directory of the application before it will run. 
These are detailed below.

### Development Environment

`.env.development` provides environment variables for the development environment.  
You will need to set the `PGDATABASE` variable in this file which specifies the name of the 
development psql database. For example: 

`PGDATABASE=nc_news`

### Testing Environment

`.env.test` provides environment variables for the testing environment.
You will need to set the `PGDATABASE` variable in this file which specifies the name
of the test psql database. For example:

`PGDATABASE=nc_news_test`