const express = require('express')
const app = express()
const db = require('./config/database')
app.use(express.json())


app.get('/', function (req, res) {
    res.send('Movies')
})

//get all films
app.get('/api/films', (req, res) => {
    db.any('SELECT * FROM movies.film')
        .then(data => {
            res.send(data)
        })
        .catch(error => {
            console.error('Error:', error);
        });
})

//Film by id
app.get('/api/films/:filmId', async (req, res) => {
    const filmId = req.params.filmId

    try {
        const film = await db.oneOrNone('SELECT * FROM movies.film WHERE film_id = $1', [filmId])
        if (film) {
            res.json(film)
        } else {
            res.status(404).json({ error: 'Film not found' })
        }
    } catch (error) {
        console.error(' Error getting information about the film:', error)
        res.status(500).json({ error: 'Server Error' })
    }
})


//Insert new film
app.post('/api/insert_film', async (req, res) => {
    const { title, description, release_year, language_id, actor, category } = req.body;
    try {
        const newFilm = await db.one(`INSERT INTO movies.film(title, description, release_year, language_id, last_update) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *`,
            [title, description, release_year, language_id])

        const film_id = newFilm.film_id
        const actor_id = req.body.actor;
        const category_id = req.body.category;

        console.log(film_id);

        const existingActor = await db.oneOrNone('SELECT * FROM movies.actor WHERE actor_id = $1', [actor_id]);
        const existingCategory = await db.oneOrNone('SELECT * FROM movies.category WHERE category_id = $1', [actor_id]);

        if (existingActor) {
            await db.none('INSERT INTO movies.film_actor (actor_id, film_id, last_update) VALUES ($1, $2, CURRENT_TIMESTAMP)', [actor_id, film_id])
            res.status(200).json({ message: 'Film was added' })
        }

        else if (existingCategory) {
            await db.none('INSERT INTO movies.film_category (category_id, film_id, last_update) VALUES ($1, $2, CURRENT_TIMESTAMP)', [category_id, film_id])
            res.status(200).json({ message: 'Film was added' })
        }
    } catch (error) {
        console.error(' Error when adding an film:', error)
        res.status(500).json({ error: 'Server error' })
    }

})

//Update film data
app.put('/api/update_film/:filmId', async (req, res) => {
    const { title, description, release_year, language_id } = req.body;
    const filmId = req.params.filmId;
    try {
        const existingFilm = await db.oneOrNone('SELECT * FROM movies.film WHERE film_id = $1', [filmId]);
        if (existingFilm && title.length > 0 && release_year.length > 0 && description.length > 0 && language_id.length > 0) {
            await db.none('UPDATE movies.film SET title = $1, release_year = $2, description = $3, language_id = $4 WHERE film_id = $5', [title, release_year, description, language_id, filmId])
            const existingFilm = await db.oneOrNone('SELECT * FROM movies.film WHERE film_id = $1', [filmId]);
            res.status(200).json({ film_data: existingFilm, message: 'Film was updated' })
        }
    }
    catch (error) {
        console.error(' Error when updating an film:', error)
        res.status(500).json({ error: 'Server error' })
    }
})

//Delete film

app.delete('/api/delete_film/:id', async (req, res) => {
    const filmId = req.params.id
    try {
        const existingFilm = await db.oneOrNone('SELECT * FROM movies.film WHERE film_Id = $1', [filmId])
        if (existingFilm) {
            const relatedActor = await db.any('SELECT * FROM movies.film_actor WHERE film_id = $1', [filmId])
            const relatedCategory = await db.any('SELECT * FROM movies.film_category WHERE film_id = $1', [filmId])

            if (relatedActor.length > 0 && relatedCategory.length > 0) {
                await db.none('DELETE FROM movies.film_actor * WHERE film_id = $1', [filmId])
                await db.none('DELETE FROM movies.film_category * WHERE film_id = $1', [filmId])
            }

            await db.none('DELETE FROM movies.film WHERE film_id = $1', [filmId])
            res.status(200).json({message: ' Film successfully deleted' })
        } else {
                res.status(404).json({ error: 'Film not found' })
            } 
        
    } catch (error) {
            console.error(' Error on deleting an film:', error)
            res.status(500).json({ error: ' Server Error' })
        }
    })

app.listen(8080, () => {
    console.log(`Server is running on port 8080.`);
});