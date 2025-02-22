import config from './config';
import mongoose from 'mongoose';
import User from './models/User';
import {randomUUID} from 'node:crypto';
import Picture from './models/Picture';

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('users');
        await db.dropCollection('pictures');
    } catch (e) {
        console.log('Collections were not present, skipping the drop ');
    }

    const [john, harry] = await User.create(
        {
            email: "john@gmail.com",
            password: "123",
            role: "user",
            displayName: "John Doe",
            avatar: "fixtures/john.jpg",
            token: randomUUID(),
        },
        {
            email: "harry@gmail.com",
            password: "123",
            role: "user",
            displayName: "Harry Doe",
            avatar: "fixtures/harry.jpg",
            token: randomUUID(),
        },
        {
            email: "jane@gmail.com",
            password: "123",
            role: "admin",
            displayName: "Jane Smith",
            avatar: "fixtures/jane.jpg",
            token: randomUUID(),
        },
    );

    await Picture.create(
        {
            user: john._id,
            name: `Smokin'`,
            image: '/fixtures/cat1.jpg'
        },
        {
            user: john._id,
            name: 'Shocked',
            image: '/fixtures/cat2.jpg'
        },
        {
            user: john._id,
            name: 'Silly',
            image: '/fixtures/cat3.jpg'
        },
        {
            user: john._id,
            name: 'glass cat',
            image: '/fixtures/cat4.jpg'
        },
        {
            user: john._id,
            name: 'hat cat',
            image: '/fixtures/cat5.jpg'
        },
        {
            user: harry._id,
            name: 'Chill',
            image: '/fixtures/dog1.jpg'
        },
        {
            user: harry._id,
            name: 'Angry',
            image: '/fixtures/dog2.jpg'
        },
        {
            user: harry._id,
            name: 'Suspicious',
            image: '/fixtures/dog3.jpg'
        },
        {
            user: harry._id,
            name: 'calm',
            image: '/fixtures/dog4.jpg'
        },
        {
            user: harry._id,
            name: 'gardener',
            image: '/fixtures/dog5.jpg'
        },
    );

    await db.close();
};

run().catch(console.error);