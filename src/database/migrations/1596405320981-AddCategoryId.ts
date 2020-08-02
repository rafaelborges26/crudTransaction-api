import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AddCategoryId1596405320981 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

      await queryRunner.addColumn(
        'transactions',
        new TableColumn(
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: true
          }
        )
      )


      await queryRunner.createForeignKey('transactions', new TableForeignKey({
        name: 'TransactionCategory', //name da FK
        columnNames: ['category_id'], //campo nessa tabela
        referencedColumnNames: ['id'], //campo da outra tabela
        referencedTableName: 'categories', //nome da outra tabela
        onDelete: 'SET NULL',  //restricted, não deixa o user ser apagado. - set null, seta o campo como null - cascade: deletou o usuario deleta todos os agendamentos que ele ta associado
        onUpdate: 'CASCADE',
    }) )




    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropForeignKey('transactions', 'TransactionCategory')

      await queryRunner.dropColumn('transactions', 'category_id')



    }

}
