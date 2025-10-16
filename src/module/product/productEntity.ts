import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({nullable: true, type: "float"})
    public price: number;

    @Column({type: "varchar", length: 255})
    public title: string;

    @Column({type: "text", nullable: true})
    public description: string;

}