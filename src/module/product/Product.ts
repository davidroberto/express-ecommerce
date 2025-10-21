import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    private id: number;

    @Column({nullable: true, type: "float"})
    private price: number;

    @Column({type: "varchar", length: 255})
    private title: string;

    @Column({type: "text", nullable: true})
    private description: string;


    constructor(title: string, description: string, price: number) {

        this.validateTitle(title);
        this.validatePrice(price);

        this.title = title;
        this.description = description;
        this.price = price;
    }

    update(title: string, description: string, price: number) {

        this.validateTitle(title);
        this.validatePrice(price);

        this.title = title;
        this.description = description;
        this.price = price;
    }

    private validateTitle(title: string) {
        if (title.length < 2) {
            throw new Error("Title must be at least 2 characters long");
        }
    }

    private validatePrice(price: number): void {
        if (price <= 0) {
            throw new Error("Price must be greater than 0");
        }

        if (price > 10000) {
            throw new Error("Price must be less than 10000");
        }


    }



}