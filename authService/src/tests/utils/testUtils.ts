import { DataSource } from "typeorm";

function truncateAllTables(connection: DataSource) {
  const entities = connection.entityMetadatas; // returns an array of all entities

  // loop through all entities and truncate
  entities.forEach(async (entity) => {
    const repository = connection.getRepository(entity.name);

    await repository.clear();
  });
}

export default truncateAllTables;
