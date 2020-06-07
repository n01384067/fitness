const {
  createUser,
  getUser,
  getAllActivities,
  createActivity,
  updateActivity,
  getAllRoutines,
  getPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  addActivityToRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
} = require("..db");

async function droptables() {
  try {
    console.log("Dropping Tables...");
    await client.query(`
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS activities;
        DROP TABLE IF EXISTS routines;
        DROP TABLE IF EXISTS routineactivities;
        `);
    console.log("Finished dropping tables!");
  } catch (error) {
    console.log("error dropiing dem tables");
    throw error;
  }
}

async function createinitialusers() {
  try {
    console.log("starting to create users...");
    await createUser({
      id: "1",
      username: "john",
      password: "password",
    });
    await createUser({
      id: "2",
      username: "jacob",
      password: "123456",
    });
    await createUser({
      id: "3",
      username: "jingle",
      password: "78910",
    });
    console.log("finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("starting to build tables...");
    await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
        );
        CREATE TABLE activities(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            description TEXT NOT NULL
        )
        CREATE TABLE routines (
            id SERIAL PRIMARY KEY,
            "creatorID" INTEGER FOREIGN KEY,
            public BOOLEAN DEFAULT false,
            name VARCHAR(255) UNIQUE NOT NULL,
            goal TEXT NOT NULL
        );
        CREATE TABLE routine_activities(
            id SERIAL PRIMARY KEY,
            "routineId" INTEGER FOREIGN KEY,
            "activityId" INTEGER FOREIGN KEY,
            duration INTEGER,
            count INTEGER
        )
        `);
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database");
  } catch (error) {
    console.log("error testing database");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
