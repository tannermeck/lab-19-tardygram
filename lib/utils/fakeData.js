const { image } = require('faker');
const faker = require('faker');

const users = () => {
    return {
        github_name: faker.name.firstName(),
        github_avatar_url: faker.image.imageUrl()
    }
}

const grams = (name) => {
    return {
        username: name,
        photo_url: faker.image.imageUrl(),
        caption: faker.lorem.sentence(),
    }
}

const tags = (numberString) => {
    return {
        tag: faker.random.word(),
        grams_id: numberString
    }
}
module.exports = { users, grams, tags }

