

const { before, describe } = require('node:test');
const request = require('supertest');
const BASE_URL = 'http://localhost:3000'; 


describe('API Tests', () => {
    const PUUID1 = null; // Initialize PUUID variable
    const tagLine1 = 'GLHF'; // 
    const gameName1 = 'CorruptCosmonaut'; // 


    beforeAll(async () => {
        // intialize the database with a player
        await request(BASE_URL).post('api/getPlayer').send({ gameName: 'RocketEscape', tagLine: 'GLHF', region: americas })


    });



    
    describe('POST /api/getPlayer', () =>{
        it('should return existing player data', async () => {
            const response = await request(BASE_URL)
                .post('/api/getPlayer')
                .send({ gameName: 'RocketEscape', tagLine: 'GLHF', region: 'americas' }); // Replace with actual PUUID for testing
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('playerData');
            expect(response.body.playerData).toHaveProperty('gameName', 'RocketEscape');
            expect(response.body.playerData).toHaveProperty('tagLine', 'GLHF');
            expect(response.body.playerData).toHaveProperty('puuid', 'JVoi3ouOBbEKAq8br-HQ5twNfppvUydFQQPZMmfM0hZPUSeplHRpgoqUhxg8lfIvlh3QzoVKFzILig');

        });
    });


    describe('POST /api/getPlayer with new player', () => {
        it('should create a new player and return the data', async () => {
            const response = await request(BASE_URL)
                .post('/api/getPlayer')
                .send({ gameName: gameName1, tagLine: tagLine1, region: 'americas' });
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('playerData');
            expect(response.body.playerData).toHaveProperty('gameName', gameName1);
            expect(response.body.playerData).toHaveProperty('tagLine', tagLine1);
            expect(response.body.playerData).toHaveProperty('puuid', 'zHmeb_JI_l_TtkISS6y92WBWscwyS4ozF_FR8oR6rqN2iBJtN4FmeoBnsfdxOjSzvJ9AcNRiXZNWsw'); // Check if PUUID is present
        });
    });


});

