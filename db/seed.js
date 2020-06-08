const { getAllRoutines, createRoutine } = require("../db/index");
const { client } = require("../db/client");
const { createUser, getAllUsers } = require("../db/users");
const { addActivityToRoutine } = require("../db/routine_activities");
const { createActivity, getAllActivities } = require("../db/activities");
require("../db");

async function dropTables() {
  try {
    console.log("Dropping Tables...");
    await client.query(`
    DROP TABLE IF EXISTS routine_activities;
      DROP TABLE IF EXISTS routines;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS activities;
        `);
    console.log("Finished dropping tables!");
  } catch (error) {
    console.log("error dropiing dem tables");
    throw error;
  }
}

async function createInitialUsers() {
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

async function createIntialActivity() {
  try {
    await createActivity({
      name: "jogging",
      description: "running, but not really",
    });
    await createActivity({
      name: "weightlifting",
      description: "pump the iron",
    });
    await createActivity({
      name: "meditation",
      description: "an excuse to do nothing",
    });
  } catch (error) {
    throw error;
  }
}

async function createIntialRoutineActivity() {
  try {
    await addActivityToRoutine({
      routineId: 1,
      activityId: 1,
      count: 1,
      duration: 30,
    });
    await addActivityToRoutine({
      routineId: 2,
      activityId: 2,
      count: 20,
      duration: 10,
    });
    await addActivityToRoutine({
      routineId: 3,
      activityId: 3,
      count: 1,
      duration: 30,
    });
  } catch (error) {
    throw error;
  }
}

async function createInitialRoutines() {
  try {
    const [john, jacob, jingle] = await getAllUsers();

    await createRoutine({
      creatorId: john.id,
      public: true,
      name: "Johns Post",
      goal: "Not be obese",
    });
    await createRoutine({
      creatorId: jacob.id,
      public: true,
      name: "Jacobs Post",
      goal: "I wanna look good",
    });
    await createRoutine({
      creatorId: jingle.id,
      public: true,
      name: "Jingles Post",
      goal: "Have a healthy mind",
    });
    await createRoutine({
      creatorId: jingle.id,
      public: false,
      name: "Jingles Second Post",
      goal: "Minding my own business",
    });
  } catch (error) {
    throw error;
  }
}

async function createTables() {
  try {
    console.log("starting to build tables...");
    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
    CREATE TABLE routines (
        id SERIAL PRIMARY KEY,
        "creatorId" INTEGER REFERENCES users(id),
        public BOOLEAN DEFAULT false,
        name VARCHAR(255) UNIQUE NOT NULL,
        goal TEXT NOT NULL
    );
     CREATE TABLE activities (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      description VARCHAR(255) NOT NULL
    );
    CREATE TABLE routine_activities (
      id SERIAL PRIMARY KEY,
      "routineId" INTEGER REFERENCES routines(id),
      "activityId" INTEGER REFERENCES activities(id),
      duration INTEGER,
      count INTEGER,
      UNIQUE ("routineId", "activityId")
     );
  `);
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Res:", users);
    console.log("Calling getAllRoutines");
    const routines = await getAllRoutines();
    console.log("Res:", routines);
    console.log("Calling getUserById");
    console.log("Calling getAllActivites");
    const activities = await getAllActivities();
    console.log("Res:", activities);
    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error testingDB");
    throw error;
  }
}
async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createIntialActivity();
    await createInitialRoutines();
    await createIntialRoutineActivity();
  } catch (error) {
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
