import { DataSource } from "typeorm"

import { Injectable } from "@nestjs/common"

@Injectable()
export class TestService {
  constructor(private dataSource: DataSource) {}

  public async cleanDatabase(): Promise<void> {
    try {
      const entities = this.dataSource.entityMetadatas
      const tableNames = entities.map((entity) => `"${entity.tableName}"`)
      tableNames.forEach(async (table) => await this.dataSource.query(`DELETE FROM ${table};`))
    } catch (error) {
      throw new Error(`ERROR: Cleaning test database: ${error}`)
    }
  }
}
