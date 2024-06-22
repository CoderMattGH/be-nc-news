# Northcoders News API

Northcoders News API is a restful back-end element to the Northcoders News application.  
Northcoders News is a social news web application where users can read and post 
articles, as well as comment and search.

The API is currently hosted at `https://nc-news-api.codermatt.com/api/` which
will provide a list of public endpoints to interact with.

## Installation

### Requirements

For installation, you will need to have the following applications installed:

* `node.js` <i>[minimum version v21.6.2]</i>

  https://nodejs.org/en/download/package-manager

* `psql (PostgreSQL)` <i>[minimum version v16.2]</i>

  https://www.postgresql.org/download/

### Clone and Install

* Make a new directory and clone the repository by running the command:
  
  `git clone https://github.com/CoderMattGH/be-nc-news.git`

* Install any <b>node.js</b> packages by running:
  
  `npm install`

  from the application root directory.

### Set Environment Variables

The application makes use of certain environment variables which will need to
be set before it will run.

* `PGDATABASE` This sets the database name of the PostgreSQL that the application
will connect to.

* `LOGL` This sets the logging level to use.  Available values are `'error'`, 
`'info'`, and `'debug'`.

* `DATABASE_URL` This variable is used to specify the URL of the PostgreSQL database. 
  
  <i>Note: `DATABASE_URL` should only be used in the `.env.production` file.</i>

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

#### Production Environment File

The file `.env.production` provides environment variables for the production environment.  

Example `.env.production` file:

```
DATABASE_URL=postgres://username:password@my_url.com:5432/db-name
LOGL='error'
```

### Run Init Scripts

Now we have performed the previous tasks, we are ready to run some scripts to
initialise the application.

#### Setup and Seed Local Database

* Setup the local PostgreSQL database by running:
   
  `npm run setup-dbs`

* Next, seed the local database by running the following command:

  `npm run seed`

## Running the Application

We should now be ready to run the application.  This can be achieved by executing:

 `npm start`

 You should now see a prompt with:

 ```
 Successfully listening on port 9090
 ```

 You can now start interacting with the API by querying its endpoints.

 Its public endpoints will be provided as a JSON object which you can view by sending 
a GET request to: `http://localhost:9090/api` -- <i>assuming default port number and host address.</i>

## Testing and Development

### Preparing the Environment

In order to facilitate testing and development, we need to initialise `husky` by running: 
  
  `npm run prepare-dev`

### Testing

We should now be free to run the tests by executing:
  
`npm test`