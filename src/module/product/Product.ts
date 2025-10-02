import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({nullable: true, type: "float"})
    public price: number;

    @Column()
    public title: string;

    @Column()
    public description: string;

}