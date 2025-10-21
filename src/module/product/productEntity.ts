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

    constructor(price: number, title: string, description: string) {

        this.validatePrice(price);
        this.validateTitle(title);

        this.title = title;
        this.description = description;
        this.price = price;
    }

    update(price: number, title: string, description: string): void {
        this.validatePrice(price);
        this.validateTitle(title);

        this.price = price;
        this.title = title;
        this.description = description;
    }

    private validatePrice(price: number): void {
        if (price < 0) {
            throw new Error("le prix doit être supérieur à 0");
        }

        if (price > 10000) {
            throw new Error("le prix doit être inférieur à 10000");
        }
    }

    private validateTitle(title: string): void {
        if (title.length <= 2) {
            throw new Error("titre trop court");
        }

    }

}