

const { before, describe } = require('node:test');
const request = require('supertest');
const BASE_URL = 'http://localhost:3000'; 


// describe('getPlayer unit tests', () => {
//     const PUUID1 = null; // Initialize PUUID variable
//     const tagLine1 = 'GLHF'; // 
//     const gameName1 = 'CorruptCosmonaut'; // 


//     beforeAll(async () => {
//         // intialize the database with a player
//         await request(BASE_URL).post('/api/getPlayer').send({ gameName: 'RocketEscape', tagLine: 'GLHF', region: 'americas' })


//     });



    
//     describe('POST /api/getPlayer with already queried player', () =>{
//         it('should return existing player data', async () => {
//             const response = await request(BASE_URL)
//                 .post('/api/getPlayer')
//                 .send({ gameName: 'RocketEscape', tagLine: 'GLHF', region: 'americas' }); // Replace with actual PUUID for testing
            
//             expect(response.status).toBe(200);
//             expect(response.body).toHaveProperty('playerData');
//             expect(response.body.playerData).toHaveProperty('gameName', 'RocketEscape');
//             expect(response.body.playerData).toHaveProperty('tagLine', 'GLHF');
//             expect(response.body.playerData).toHaveProperty('puuid', 'JVoi3ouOBbEKAq8br-HQ5twNfppvUydFQQPZMmfM0hZPUSeplHRpgoqUhxg8lfIvlh3QzoVKFzILig');

//         });
//     });


//     describe('POST /api/getPlayer with new player', () => {
//         it('should create a new player and return the data', async () => {
//             const response = await request(BASE_URL)
//                 .post('/api/getPlayer')
//                 .send({ gameName: gameName1, tagLine: tagLine1, region: 'americas' });
            
//             expect(response.status).toBe(200);
//             expect(response.body).toHaveProperty('playerData');
//             expect(response.body.playerData).toHaveProperty('gameName', gameName1);
//             expect(response.body.playerData).toHaveProperty('tagLine', tagLine1);
//             expect(response.body.playerData).toHaveProperty('puuid', 'zHmeb_JI_l_TtkISS6y92WBWscwyS4ozF_FR8oR6rqN2iBJtN4FmeoBnsfdxOjSzvJ9AcNRiXZNWsw'); // Check if PUUID is present
//             expect(response.body.playerData).toHaveProperty('Region', 'na1'); // Check if region is present
//         });
//     });

//     describe('POST /api/getPlayer with no data', () => {
//         it('should return an error for empty player data', async () => {
//             const response = await request(BASE_URL)
//                 .post('/api/getPlayer')
//                 .send({ gameName: '', tagLine: '', region: 'americas' });
            
//             expect(response.status).toBe(400); // Assuming 400 for bad request
//             expect(response.body).toHaveProperty('error');
//         });
//     });

//     describe('POST /api/getPlayer with missing data', () => {
//         it('should return an error for invalid player data', async () => {
//             const response = await request(BASE_URL)
//                 .post('/api/getPlayer')
//                 .send({ gameName: '2', tagLine: '1' });
            
//             expect(response.status).toBe(400); // Assuming 400 for bad request
//             expect(response.body).toHaveProperty('error');
//         });
//     });

//     describe('POST /api/getPlayer with invalid region', () => {
//         it('should return an error for invalid region', async () => {
//             const response = await request(BASE_URL)
//                 .post('/api/getPlayer')
//                 .send({ gameName: gameName1, tagLine: tagLine1, region: 'invalidRegion' });
            
//             expect(response.status).toBe(400); // Assuming 400 for bad request
//             expect(response.body).toHaveProperty('error');
//         });
//     });

//     describe('POST /api/getPlayer with no game name', () => {
//         it('should return an error for invalid game name', async () => {
//             const response = await request(BASE_URL)
//                 .post('/api/getPlayer')
//                 .send({ gameName: '', tagLine: tagLine1, region: 'americas' });
            
//             expect(response.status).toBe(400); // Assuming 400 for bad request
//             expect(response.body).toHaveProperty('error');
//         });
//     });

//     describe('POST /api/getPlayer with no tag line', () => {
//         it('should return an error for invalid tag line', async () => {
//             const response = await request(BASE_URL)
//                 .post('/api/getPlayer')
//                 .send({ gameName: gameName1, tagLine: '', region: 'americas' });
            
//             expect(response.status).toBe(400); // Assuming 400 for bad request
//             expect(response.body).toHaveProperty('error');
//         });
//     });

//     describe('POST /api/getPlayer with no data', () => {
//         it('should return an error for invalid region', async () => {
//             const response = await request(BASE_URL)
//                 .post('/api/getPlayer')
//                 .send({});
            
//             expect(response.status).toBe(400); // Assuming 400 for bad request
//             expect(response.body).toHaveProperty('error');
//         });
//     });


// });


describe('[player]/Mastery unit tests', () => {
    const PUUID1 = null; // Initialize PUUID variable
    const tagLine1 = 'GLHF'; // 
    const gameName1 = 'CorruptCosmonaut'; // 

    beforeAll(async () => {
        // intialize the database with a player
        await request(BASE_URL).post('/api/getPlayer').send({ gameName: 'RocketEscape', tagLine: 'GLHF', region: 'americas' })
        await request(BASE_URL).get('/api/RocketEscape-GLHF/Mastery').send({ gameName: 'RocketEscape', tagLine: 'GLHF', region: 'americas' })
        await request(BASE_URL).post('/api/getPlayer').send({ gameName: gameName1, tagLine: tagLine1, region: 'americas' })


    });


    describe('GET /api/player/mastery with already queried player', () =>{
        it('should return existing player data', async () => {
            const response = await request(BASE_URL)
                .get('/api/RocketEscape-GLHF/Mastery')
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true); // Check if playerData is an array
            expect(response.body.length).toBeGreaterThan(0); // Check if playerData is not empty
            expect(response.body[0]).toHaveProperty('championId'); // Check if championId is present
            expect(response.body[0]).toHaveProperty('championLevel'); // Check if championLevel is present
            expect(response.body[0]).toHaveProperty('championPoints'); // Check if championPoints is present

            

        });
    });

    describe('GET /api/player/mastery with no saved mastery data', () => {
        it('should query the riot api and return the data', async () => {
            const response = await request(BASE_URL)
                .get('/api/RocketEscape-GLHF/Mastery')
            
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true); // Check if playerData is an array
                expect(response.body.length).toBeGreaterThan(0); // Check if playerData is not empty
                expect(response.body[0]).toHaveProperty('championId'); // Check if championId is present
                expect(response.body[0]).toHaveProperty('championLevel'); // Check if championLevel is present
                expect(response.body[0]).toHaveProperty('championPoints'); // Check if championPoints is present
        });
    });

});




// describe('[player]/MatchHistory unit tests', () => {
//     const PUUID1 = null; // Initialize PUUID variable
//     const tagLine1 = 'GLHF'; // 
//     const gameName1 = 'CorruptCosmonaut'; // 

//     beforeAll(async () => {
//         // intialize the database with a player
//         await request(BASE_URL).post('api/getPlayer').send({ gameName: 'RocketEscape', tagLine: 'GLHF', region: 'americas' })
//         await request(BASE_URL).get('api/RocketEscape#GLHF/MatchHistory').send({ gameName: 'RocketEscape', tagLine: 'GLHF', region: 'americas' })
//         await request(BASE_URL).post('api/getPlayer').send({ gameName: gameName1, tagLine: tagLine1, region: 'americas' })


//     });

// });

