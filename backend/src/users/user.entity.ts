import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity()
export class User {
  @PrimaryColumn({ type: "varchar", length: 30 })
  username: string

  @Column({ type: "varchar", length: 40, nullable: false })
  name: string

  @Column({ type: "varchar", length: 128, nullable: false })
  encrypted_password: string
}
