import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "rtzsaka6vivj2zp1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "uouzm6x4rrhvncyk",
    password: "cwvaniku2qtf1rxg",
    database: "f8jzk2c43t9ennzr",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', async(req, res) => {
    let sql = `SELECT authorId, firstName, lastName 
                        FROM q_authors
                        ORDER BY lastName`;
    const [rows] = await pool.query(sql);
    let sql2 = `SELECT DISTINCT category 
                        FROM q_quotes
                        ORDER BY category`;
    const [rows2] = await pool.query(sql2);
    console.log(rows2);
    res.render('index', {
        "authors": rows,
        "categories": rows2
    });
});

app.get("/dbTest", async(req, res) => {
    try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});//dbTest

app.get('/searchByKeyword', async(req, res) => {
    let keyword = req.query.keyword;
    let sql = `SELECT authorId, firstName, lastName, quote
                        FROM q_quotes 
                        NATURAL JOIN q_authors
                        WHERE quote LIKE ?`;
    let sqlParams = [`%${keyword}%`];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes": rows});
})

app.get('/searchByAuthor', async(req, res) => {
    let userAuthorId = req.query.authorId;
    let sql = `SELECT authorId, firstName, lastName, quote
                        FROM q_quotes 
                        NATURAL JOIN q_authors
                        WHERE authorId = ?`;
    let sqlParams = [userAuthorId];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes": rows});
})

app.get('/searchByCategory', async(req, res) => {
    let userCategory = req.query.categoryName;
    let sql = `SELECT authorId, firstName, lastName, quote
                        FROM q_quotes 
                        NATURAL JOIN q_authors
                        WHERE category = ?`;
    let sqlParams = [userCategory];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes": rows});
})

app.get('/searchByLikes', async (req, res) => {
    let min_likes = req.query.min_likes;
    let max_likes = req.query.max_likes;

    let sql = `SELECT authorId, firstName, lastName, quote
                        FROM q_quotes
                        NATURAL JOIN q_authors
                        WHERE likes BETWEEN ? AND ?`;
    let sqlParams = [min_likes, max_likes];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes": rows});
})

app.get('/api/author/:id', async (req, res) => {
    let authorId = req.params.id;
    let sql = `SELECT *
                        FROM q_authors
                        WHERE authorId = ?`;
    const [rows] = await pool.query(sql, [authorId]);
    res.send(rows);
})

app.listen(3000, ()=>{
    console.log("Express server running")
})