import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    private id: number;

    @Column({type: "varchar", length: 255})
    private title: string;

    @Column({type: "text", nullable: true})
    private description: string;

    @Column({type: "varchar", length: 255})
    private color: string;

    constructor(title: string, description: string, color: string) {

        if (title.length <= 0) {
            throw new Error("Title cannot be empty");
        }

        if (description.length <= 0) {
            throw new Error("Description cannot be empty");
        }

        if (title.length > 200) {
            throw new Error("Title length exceeds 200 characters");
        }

        if (description.length > 300) {
            throw new Error("Description length exceeds 300 characters");
        }

        if (color !== "red" && color !== "blue" && color !== "green" && color !== "yellow") {
            throw new Error("Invalid color. Allowed colors are: red, blue, green, yellow");
        }

        this.title = title;
        this.description = description;
        this.color = color;
    }
}