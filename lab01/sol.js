
import dayjs from 'dayjs'

function Film(id, title, watchDate, userId=1, favorite=false, rating=null) {
    if (id!=null && title!=null && (rating==null || (rating>=1 && rating<=5))) {
        this.id = id
        this.title = title
        this.favorite = favorite
        this.watchDate = dayjs(watchDate)
        this.rating = rating
        this.userId = userId

        this.toString = () => { return 'Id: ' + this.id + ', Title: ' + this.title + ', Favorite: ' + this.favorite + ', Watch date: '
                            + this.watchDate.format('MMMM DD, YYYY') + ', Rating: ' + this.rating + ', User: ' + this.userId }
        
        this.updateRating = (newRating) => {
            if (newRating==null || (newRating>=1 && newRating<=5))
                this.rating=newRating
        }
    }
}

function FilmLibrary() {
    this.library=[]

    this.addFilm = (film) => {
        this.library.push(film)
    }

    this.getFilms = () => {
        const films = []
        for (const f of this.library) {
            films.push(f.toString())
        }
        return films
    }

    this.decreasingRatingSort = () => {
        const newLib = this.library.sort((a,b) => b.rating-a.rating)
        const films = []
        for (const f of newLib) {
            films.push(f.toString())
        }
        return films
    }

    this.removeFilm = (id) => {
        // let film = null
        // for (const f of this.library) {
        //     if (f.id==id) film = f
        // }
        // const ind = this.library.indexOf(film)
        // if (ind!=-1) this.library.splice(ind, 1)
        
        const newLib = this.library.filter((f) => {return f.id!==id})
        this.library = newLib
    }

    this.updateRating = (id, newRating) => {
        for (const f of this.library) {
            if (f.id==id) {
                f.updateRating(newRating)
                break
            }
        }
    }
}

const f1 = new Film(1, 'uno', '2026-02-27', 11);
const f2 = new Film(2, 'due', '2026-02-28', 7, true, 3);
const f3 = new Film(3, 'tre', '2026-02-29', 2, false, 5);
const f4 = new Film(4, 'quattro', '2026-02-30', 3, true, 1);

console.log(f1)
console.log(f2)
console.log(f3)
console.log(f4)

const lib = new FilmLibrary()
lib.addFilm(f1)
lib.addFilm(f2)
lib.addFilm(f3)
lib.addFilm(f4)

console.log('films')
const films = lib.getFilms()
for (const f of films) {
    console.log(f)
}

console.log('decreasingRatingSortedFilms')
const decreasingRatingSortedFilms = lib.decreasingRatingSort()
for (const f of decreasingRatingSortedFilms) {
    console.log(f)
}

console.log('filmsAfterRemove id 3')
lib.removeFilm(3)
const filmsAfterRemove = lib.getFilms()
for (const f of filmsAfterRemove) {
    console.log(f)
}

console.log('filmsAfterUpdate id 2 with rating 1')
lib.updateRating(2, 1)
const filmsAfterUpdate = lib.getFilms()
for (const f of filmsAfterUpdate) {
    console.log(f)
}