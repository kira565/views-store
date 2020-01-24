import {Connection, createConnection} from "typeorm";
import {ViewsEntity} from "./ViewsEntity";
import {Layers} from "./layers";
import {Objects} from "./objects";


describe('Testing db connection', () => {
    let connection: Connection;


    beforeAll(async () => {
        connection = await createConnection()
    });


    test('db is defined after filling', async () => {
        const viewsRep = connection.getRepository(ViewsEntity);
        await  viewsRep.save({
            id: 1,
            name: "anyViewName",
            index: 1,
            roll: 20.91039276,
            pitch: 5.58994007,
            heading: 179.98199463,
            camera_position_id: 1,
            url: 'https://anyurl.com',
            world_id: "Earth1"
        });
        const loadedRep = await viewsRep.find();
        expect(loadedRep).toBeDefined()
    });

    test('Views + Layers and objects many-to-many Relation work fine', async () => {
        const viewsRep = connection.getRepository(ViewsEntity);
        const layersRep = connection.getRepository(Layers);
        const objectsRep = connection.getRepository(Objects);

        await Promise.all([
            viewsRep.save({
                id: 1,
                name: "anyViewName",
                index: 1,
                roll: 20.91039276,
                pitch: 5.58994007,
                heading: 179.98199463,
                camera_position_id: 1,
                url: 'https://anyurl.com',
                world_id: "Earth1"
            }),
            layersRep.save({
                id: 1
            }),
            objectsRep.save({
                id: 1
            })
        ]).then(() => {
            let relations = viewsRep.find({relations: ["layers", "objects"]});
            expect(relations).toBeDefined();
        });
    });


    test('CHECK INDEX', async () => {
                await expect(connection.getRepository(ViewsEntity).save({
                        id: 1,
                        name: "anyViewName",
                        index: -2,
                        roll: 20.91039276,
                        pitch: 5.58994007,
                        heading: 179.98199463,
                        camera_position_id: 1,
                        url: 'https://anyurl.com',
                        world_id: "Earth1"
                    }
                )).rejects.toThrowError('SQLITE_CONSTRAINT: CHECK constraint failed: CHK_dd161c7f0eae968dde4b1bbb90');

            });
});