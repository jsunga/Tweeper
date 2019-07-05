# Tweeper
- Twitter clone full stack project
- Demo URL (Amazon EC2): http://13.52.178.103/

# Development
- React.js
- Node.js/Express.js
- PostgreSQL

# Screenshots
![alt text](https://i.imgur.com/QF6vFNP.png)
![alt text](https://i.imgur.com/F2UIU7K.png)
![alt text](https://i.imgur.com/KeE8k87.png)
![alt text](https://i.imgur.com/rO8I3gX.png)
![alt text](https://i.imgur.com/9O2RfwE.png)
![alt text](https://i.imgur.com/3FG1TYZ.png)
![alt text](https://i.imgur.com/z0WNyXd.png)
![alt text](https://i.imgur.com/U8A5ppg.png)

# How to install Repository

Clone the repo:

```sh
git clone https://github.com/jsunga/Tweeper.git
```

# How to Build and Set Up

- Navigate to root repo and run the following command to download all dependencies Express:

```sh
npm install
```

- Navigate to the /client and run the following command to download all dependencies for React:

```sh
npm install
```

- Navigate back to the root repo and create a new file .env
- Set up the .env file with correct variables (username, password, port, database_name)

```sh
LOCAL_DATABASE_URL=postgres://username:password@localhost:port/database_name
BACKEND_URL=http://localhost:5000/api
SESSION_SECRET=CATKEYBOARD
```

- Migrate the database using Sequelize:

```sh
npm run db:migrate
```

# How to Run

- Run backend API in development by running the following command from root repo:

```sh
npm run start:dev
```

- Open a new terminal and navigate to /client and run the following command to run React

```sh
npm start
```
