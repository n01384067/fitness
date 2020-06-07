const express = require("express");
const routinesRouter = express.Router();

routinesRouter.use((req, res, next) => {
  console.log("A request is being made to /routines");

  next();
});

routinesRouter.get("/", (req, res) => {
  res.send({
    routines: [],
  });
});

async function getAllRoutines() {
  try {
    const { routines } = await client.query(`
        SELECT *
        FROM routines
        JOIN routine_activities.id ON routines.id
      `);
    return routines;
  } catch (error) {
    throw error;
  }
}
async function getPublicRoutines() {
  try {
    const { routines } = await client.query(`
        SELECT *
        FROM routines
        WHERE public = true
        JOIN routine_activities.id ON routines.id
      `);
    return routines;
  } catch (error) {
    throw error;
  }
}
async function getAllRoutinesByUser(username) {
  try {
    const { routines } = await client.query(`
        SELECT *
        FROM routines
        WHERE id = ${username}
        JOIN routine_activities.id ON routines.id
      `);
    return routines;
  } catch (error) {
    throw error;
  }
}
async function getPublicRoutinesByUser(username) {
  try {
    const { rows: routines } = await client.query(`
      SELECT *
      FROM routines 
      WHERE public = true 
      AND id = ${username}
      JOIN routine_activities.id ON routines.id;
    `);
    const routines = await Promise.all(
      routineIds.map((routine) => getRoutineById(routine.id))
    );
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity(activityId) {
  try {
    const { rows: routines } = await client.query(`
          SELECT *
          FROM routines 
          WHERE public = true;
          AND "activityId" = ${activityId}
          JOIN routine_activities.id ON routines.id
        `);
    const routines = await Promise.all(
      routineIds.map((routine) => getRoutineById(routine.id))
    );
    return routines;
  } catch (error) {
    throw error;
  }
}

async function createRoutine({ creatorId, public, name, goal }) {
  try {
    const {
      rows: [routines],
    } = await client.query(
      `
          INSERT INTO routines(creatorId, public, name, goal) 
          VALUES($2, $3, $4, $5)
          RETURNING *;
        `,
      [creatorId, public, name, goal]
    );
  } catch (error) {
    throw error;
  }
}

async function updateRoutine(routineId, fields = {}) {
  const activities = fields;
  delete fields.activities;
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(",");
}
try {
  if (setString.length > 0) {
    await client.query(
      `
        UPDATE routines
        SET ${setString}
        WHERE id=${routineId}
        RETURNING *;
      `,
      Object.values(fields)
    );
  }
  if (activities === undefined) {
    return await getRoutinesById(routineId);
  }
  const activities = await createActivity(activity);
  const routineListIdString = routineList
    .map((tag) => `${routine.id}`)
    .join(", ");
  await client.query(
    `
      DELETE FROM routines
      WHERE "routineId"
      NOT IN (${routineListIdString})
      AND "routineId"=$2;
    `,
    [activityId]
  );
  await addTagsToPost(postId, tagList);
  return await getPostById(postId);
} catch (error) {
  throw error;
}

module.exports = routinesRouter;
