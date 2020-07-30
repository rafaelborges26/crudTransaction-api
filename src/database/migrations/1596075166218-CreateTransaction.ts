import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export default class CreateTransaction1596075166218 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.createTable(
        new Table({
          name: 'transactions',
          columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'value',
            type: 'numeric',
          },
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: true
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
        },
        {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
        },

          ]

        })

      )

      await queryRunner.createForeignKey('transactions', new TableForeignKey({
        name: 'TransactionCategory', //name da FK
        columnNames: ['category_id'], //campo nessa tabela
        referencedColumnNames: ['id'], //campo da outra tabela
        referencedTableName: 'categorys', //nome da outra tabela
        onDelete: 'SET NULL',  //restricted, não deixa o user ser apagado. - set null, seta o campo como null - cascade: deletou o usuario deleta todos os agendamentos que ele ta associado
        onUpdate: 'CASCADE',
    }) )


      }


    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropTable('transactions')
    }

}
