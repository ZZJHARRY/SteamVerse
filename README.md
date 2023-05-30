# SteamVerse

Team members: Zijian Zhang, Guo Cheng, Jun Wang, Tangchao Chen

## Introduction: 

The video game industry has experienced significant growth over the years, with Steam being one of the most popular gaming platforms for PC gamers. As the number of games on Steam increases, it becomes challenging for users to keep track of popular games and make informed decisions about which games to purchase or play. Therefore, our Steam game review website aims to solve this problem by providing detailed statistics for games lying in various categories.

Our website will offer an extensive collection of popular games on Steam since 1997, which is determined based on the number of reviews they received. Users will be able to access a wide range of information about each game, including operating system requirements, release dates, ratings, and reviews from other users. This information will help users make informed decisions about which games to play.
Architecture

## Tech Stacks:
**Kaggle & Google Image** - Data source: We used the Steam Game dataset from Kaggle and images from Google as our data sources.

**Colab** - Data Processing, EDA: We utilized Google Colab for EDA and data processing to deal with some missing data and outliers.

**MySQL & AWS RDS** - Database: Then, for the database, we decided to use MySQL and AWS RDS to store the data and define the structures for the relations in our database.

**Express.js** - Backend, Routes: For our website, we use Express.js as our backend server, and we implemented our REST API using the express server.

**React.js** - Frontend, User Interface: For the user interface, we chose React as the frontend architecture.

**Node.js** - JavaScript Runtime Environment: We have also used Node.js to provide us with the JavaScript Runtime Environment.

**MUI** - Website theme manager: Last but not least, we spent some time learning about MUI, which is a powerful tool for react website design, and we utilized MUI to make our website more visually engaging.

## Application Architecture:
Our application is composed of two main components, the client which interacts with the users and the server which interacts with the database.

Under the client folder, we have index.js that creates and renders App, the root element of our application. In App.js, we define the root and its children which are 6 different pages implemented in xxxPage.js in src/pages. We use React Router’s BrowserRouter and Routes components to map various paths to each of the 6 pages. We also use AppBar and Drawer components with lists items defined in listitems.js to create an interactive navigation bar common to all pages. The navigation bar uses hyperlinks to allow us to navigate between pages. The Pages defined under src/pages make API calls to get the required data and display data using AppCard and LazyTable, which are defined under the src/components folder. LazyTable.js provides a paginated MUI table that fetch data from the specified routes, paginate it using specified page limit, and render it using specified column attributes. AppCard.js uses the Modal and Card components from MUI to render a pop up window that shows basic information about an app specified by app id. src/image contains a game image that will be used on our homepage. Config.json contains information about server host and port.

Under the server folder we have server.js, route.js, and config.js. In server.js, we use express to define our various API endpoints and provide their handlers that we implemented in routes.js. In route.js, we create MySQL connection using database credentials provided in config.json and define 9 routes, which are handlers that process requests, fetch data from the database, and return data back to the requester via an HTTP response. Config.json contains server host and port as well as credentials needed to access AWS RDS database.
The package. json file in both client and server finder contains metadata such as a name, version, and dependencies of our application. 

## Main architecture of our application:
### Frontend: **client/**
- src/components
	- AppCard.js
	- LazyTable.js
- src/pages
	- HomePage.js
	- RecommendationPage.js
	-GamesPage.js
	- SystemPage.js
	- UsersPage.js
	-FilteringPage.js
- src/images
- App.js
- listItems.js
- index.js
- config.json

### Backend: **server/**
- route.js
- server.js
- config.json

## Set Up Instruction

1. Download the whole package to your local machine.

2. Navigate to the directory of **client/**

3. Run

```sh
$ npm install
```
to install necessary packages.  **Note that we need to do 'npm install' separately for the backend later.**

4. Run

```sh
$ npm install @mui/icons-material
```
to install other packages for a frontend dependency.

5. Run

```sh
$ npm start
```

6. Open a new tab in terminal, and navigate to the directory of **server/**, and run

```sh
$ npm install
```
to install necessary packages.

5. Run

```sh
$ npm start
```
to start the AWS RDS & MySQL backend.

