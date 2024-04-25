import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: 100, nullable: false })
  name: string

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  price: number

  @Column({ type: "int", nullable: false })
  quantity: number
}
