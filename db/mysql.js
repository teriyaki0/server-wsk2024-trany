// import mysql from "mysql2/promise";

// const connection = await mysql.createConnection({
//   host: "sql7.freesqldatabase.com",
//   database: "sql7727461",
//   user: "sql7727461",
//   password: "I9mlqiJ9pB",
// });

// connection.connect((err) => {
//   if (err) {
//     console.log("error: ", err);
//     return;
//   } else {
//     console.log("Success connection DB");
//   }
// });

// export default connection;

import mysql from 'mysql2/promise';

const config = {
  host: 'sql7.freesqldatabase.com',
  database: 'sql7727461',
  user: 'sql7727461',
  password: 'I9mlqiJ9pB',
};

async function createConnectionWithRetry(retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const connection = await mysql.createConnection(config);
      console.log('Success connection DB');
      return connection;
    } catch (err) {
      console.log(`Attempt ${attempt} failed:`, err.message);
      if (attempt < retries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('All attempts failed.');
        throw err; // Если все попытки не удались, выбрасываем ошибку
      }
    }
  }
}

// Создаем соединение с повторными попытками
const connection = await createConnectionWithRetry();

export default connection;
