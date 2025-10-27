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


    constructor({title, description, price}: {title: string, description: string, price: number}) {
        this.validatePrice(price);
        this.validateTitle(title);
        this.title = title;
        this.description = description;
        this.price = price;
    }


    update(title: string, description: string, price: number) {

        this.validatePrice(price);
        this.validateTitle(title);

        this.title = title;
        this.description = description;
        this.price = price;
    }

    private validateTitle(title: string) {
        if (title.length < 3) {
            throw new Error("titre trop court");
        }
    }

    private validatePrice(price: number) {
        if (price <= 0) {
            throw new Error("le prix doit être supérieur à 0");
        }

        if (price > 10000) {
            throw new Error("le prix doit être inférieur à 10000");
        }


    }





}