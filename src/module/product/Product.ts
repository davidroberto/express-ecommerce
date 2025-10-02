import {Entity, Column, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({nullable: true, type: "float"})
    public price: float;

    @Column()
    public title: string;

    @Column()
    public description: string;

}