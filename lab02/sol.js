
import dayjs from 'dayjs'
import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('/Users/ambros/Desktop/WAI/wa1-lab-2026/wa1-lab-2026/lab02/films.db', (err) => {
    if (err)
        console.log("Error in opening database")
    else
        console.log("Database connected successfully")
})

function Film(id, title, watchDate, userId = 1, isFavorite = false, rating = null) {
    if (id != null && title != null && (rating == null || (rating >= 1 && rating <= 5))) {
        this.id = id
        this.title = title
        this.isFavorite = isFavorite
        this.watchDate = dayjs(watchDate)
        this.rating = rating
        this.userId = userId

        this.toString = () => {
            return 'Id: ' + this.id + ', Title: ' + this.title + ', Favorite: ' + this.isFavorite + ', Watch date: '
                + this.watchDate.format('MMMM DD, YYYY') + ', Rating: ' + this.rating + ', User: ' + this.userId
        }

        this.updateRating = (newRating) => {
            if (newRating == null || (newRating >= 1 && newRating <= 5))
                this.rating = newRating
        }
    }
}

function FilmLibrary() {
    this.getAllFilms = () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films'
            db.all(sql, [], (err, rows) => {
                if (err) reject(err)
                else {
                    const films = rows.map(row => new Film(
                        row.id,
                        row.title,
                        row.watchDate,
                        row.userid,
                        row.isFavorite === 1,
                        row.rating))
                    resolve(films)
                }
            })
        })
    }

    this.getAllFavFilms = () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE isFavorite==1'
            db.all(sql, [], (err, rows) => {
                if (err) reject(err)
                else {
                    const films = rows.map(row => new Film(
                        row.id,
                        row.title,
                        row.watchDate,
                        row.userid,
                        row.isFavorite === 1,
                        row.rating))
                    resolve(films)
                }
            })
        })
    }

    this.getFilmsBefore = (date) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE watchDate<?'
            db.all(sql, [date], (err, rows) => {
                if (err) reject(err)
                else {
                    const films = rows.map(row => new Film(
                        row.id,
                        row.title,
                        row.watchDate,
                        row.userid,
                        row.isFavorite === 1,
                        row.rating))
                    resolve(films)
                }
            })
        })
    }

    this.getFilmsMatching = (pattern) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE title LIKE ?'
            db.all(sql, [`%${pattern}%`], (err, rows) => {
                if (err) reject(err)
                else {
                    const films = rows.map(row => new Film(
                        row.id,
                        row.title,
                        row.watchDate,
                        row.userid,
                        row.isFavorite === 1,
                        row.rating))
                    resolve(films)
                }
            })
        })
    }

    this.addFilm = (film) => {
        return new Promise((resolve, reject) => {
            const sql = ` INSERT INTO films(title, isFavorite, rating, watchDate, userId)
                          VALUES (?, ?, ?, ?, ?)`;
            const params = [
                film.title,
                film.isFavorite ? 1 : 0,
                film.rating,
                film.watchDate ? film.watchDate.format('YYYY-MM-DD') : null,
                film.userId
            ];
            db.run(sql, params, function (err) {
                if (err) {
                    console.log("Insert failed");
                    reject(err);
                } else {
                    console.log("Film inserted successfully");
                    resolve(this.lastID);
                }
            })
        })
    }

    this.removeFilm = (id) => {
        return new Promise((resolve, reject) => {
            const sql = ` DELETE FROM films
                          WHERE id==?`;
            db.run(sql, id, function (err) {
                if (err) {
                    console.log("Remove failed");
                    reject(err);
                } else {
                    console.log("Film removed successfully");
                    resolve(this.lastID);
                }
            })
        })
    }

    this.updateAllDates = () => {
        return new Promise((resolve, reject) => {
            const sql = ` UPDATE films
                          SET watchDate=?`;
            db.run(sql, null, function (err) {
                if (err) {
                    console.log("Update failed");
                    reject(err);
                } else {
                    console.log("Film updated successfully");
                    resolve(this.lastID);
                }
            })
        })
    }
}

async function main() {

    const lib = new FilmLibrary()

    console.log('getAllFilms')
    const films = await lib.getAllFilms()
    for (const f of films) {
        console.log(f.toString())
    }

    console.log('getAllFavFilms')
    const favFilms = await lib.getAllFavFilms()
    for (const f of favFilms) {
        console.log(f.toString())
    }

    console.log('getFilmsBefore March 17, 2026')
    const before17Films = await lib.getFilmsBefore('2026-03-17')
    for (const f of before17Films) {
        console.log(f.toString())
    }

    console.log('getFilmsMatching "t" == films that contain a "t" in the title')
    const matchingFilms = await lib.getFilmsMatching('t')
    for (const f of matchingFilms) {
        console.log(f.toString())
    }

    const f1 = new Film(0, 'uno', '2026-02-27', 11)
    lib.addFilm(f1)
    const filmsAfterInsert = await lib.getAllFilms()
    for (const f of filmsAfterInsert) {
        console.log(f.toString())
    }

    lib.removeFilm(6)
    const filmsAfterRemove = await lib.getAllFilms()
    for (const f of filmsAfterRemove) {
        console.log(f.toString())
    }

    lib.updateAllDates()
    const filmsAfterUpdate = await lib.getAllFilms()
    for (const f of filmsAfterUpdate) {
        console.log(f.toString())
    }


    db.close()

}

main()
