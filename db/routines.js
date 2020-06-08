const { client } = require("../db/client");

async function getAllRoutines() {
  try {
    const { rows } = await client.query(`
        SELECT *
        FROM routines
      `);
    return rows;
  } catch (error) {
    throw error;
  }
}
async function getPublicRoutines() {
  try {
    const { rows } = await client.query(`
        SELECT *
        FROM routines
        WHERE public = true
      `);
    return rows;
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
    // const routines = await Promise.all(
    //   routineIds.map((routine) => getRoutineById(routine.id))
    // );
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutineActivities(activityId) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(`
      SELECT *
      FROM routine_activities
        JOIN routines ON routines.id = routine_activities."routineId"
      WHERE routine_activities.id = ${activityId}
    `);
    return routine_activity;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function createRoutine({ creatorId, public, name, goal }) {
  try {
    const {
      rows: [routines],
    } = await client.query(
      `
          INSERT INTO routines("creatorId", public, name, goal) 
          VALUES($1, $2, $3, $4)
          RETURNING *;
        `,
      [creatorId, public, name, goal]
    );
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById({ routineId }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      SELECT *
      FROM routines
      WHERE id=$1;
    `,
      [routineId]
    );
    console.log(routine);
    if (!routine) {
      throw {
        name: "RoutineNotFound",
        message: "Could not find a routine with that routineId",
      };
    }

    return routine;
  } catch (error) {
    throw error;
  }
}

async function updateRoutine(routineId, fields = {}) {
  delete fields.activities;
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(",");

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
      .map((activities) => `${routine.id}`)
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
    await addActivityToRoutine(routineId, activityList);
    return await getPublicRoutinesByUser(routineId);
  } catch (error) {
    throw error;
  }
}
async function updateRoutineActivities(id, fields) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }
  console.log(setString, id);
  try {
    const { rows: routine_activities } = await client.query(
      `
        UPDATE routine_activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
      Object.values(fields)
    );
    console.log(routine_activities);
    return routine_activities;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  getAllRoutines,
  getAllRoutinesByUser,
  getPublicRoutines,
  getPublicRoutineActivities,
  getPublicRoutinesByUser,
  updateRoutine,
  createRoutine,
  updateRoutineActivities,
  getRoutineById,
};
