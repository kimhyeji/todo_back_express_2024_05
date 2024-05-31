import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
const port = 3000;

app.use(cors(corsOptions));
app.use(express.json());

const pool = mysql.createPool({
    host: "localhost",
    user: "korad",
    password: "kor123414",
    database: "todo_2024_05",
    waitForConnections: true,
    queueLimit: 0,
    dateStrings: true,
});

var corsOptions = {
    origin: "https://cdpn.io",
    optionsSuccessStatus: 200
}


// 생성
app.post("/:user_code/todos", async (req, res) => {
    const { user_code } = req.params;

    const {content, performDate, is_completed = 0} = req.body;

    if ( !content ) {
        res.status(404).json({
            resultCode: "F-1",
            msg: "content required"
        });
    }

    if ( !performDate ) {
        res.status(404).json({
            resultCode: "F-1",
            msg: "performDate required"
        });
    }

    const [[lastTodoRow]] = await pool.query(
        `
        SELECT no
        FROM todo
        WHERE user_code = ?
        ORDER BY id DESC
        LIMIT 1
        `,
        [user_code]
    );

    const no = lastTodoRow?.no + 1 || 1;

    const [insertTodos] = await pool.query(
        `
            INSERT INTO todo
            SET regDate = NOW(),
            modifyDate = NOW(),
            user_code = ?,
            no = ?,
            performDate = ?,
            content = ?,
            is_completed = ?
        `,
        [user_code, no, performDate, content, is_completed]
    );

    const [[ createdTodoRow ]] = await pool.query(
        `
        SELECT *
        FROM todo
        WHERE id = ?
        `,
        [insertTodos.insertId]
    );

    res.json({
        resultCode: "S-1",
        msg: `${createdTodoRow.id}번 할 일을 생성 하였습니다.`,
        data: createdTodoRow
    });
});


// 리스트 조회
app.get("/:user_code/todos", async (req, res) => {
    const { user_code } = req.params;

    const [rows] = await pool.query(
        `
        SELECT *
        FROM todo
        WHERE user_code = ?
        ORDER BY id DESC
        `,
        [user_code]
    );

    res.json({
        resultCode: "S-1",
        msg: "성공",
        data: rows
    });
});


// 단건 조회
app.get("/:user_code/todos/:no", async (req, res) => {
    const { user_code, no } = req.params;

    const [[ todoRow ]] = await pool.query(
        `
        SELECT *
        FROM todo
        WHERE user_code = ?
        AND no = ?
        `,
        [user_code, no]
    );

    if ( todoRow == undefined ) {
        res.status(404).json({
            resultCode: "F-1",
            msg: "not found",
        });
        return;
    }

    res.json({
        resultCode: "S-1",
        msg: "성공",
        data: todoRow
    });
});


// 삭제
app.delete("/:user_code/todos/:no", async (req, res) => {
    const { user_code, no } = req.params;

    const [[ todoRow ]] = await pool.query(
        `
        SELECT *
        FROM todo
        WHERE user_code = ?
        AND no = ?
        `,
        [user_code, no]
    );

    if ( todoRow == undefined ) {
        res.status(404).json({
            resultCode: "F-1",
            msg: "not found",
        });
        return;
    }

    await pool.query(
        `
        DELETE FROM todo
        WHERE user_code = ?
        AND no = ?
        `
        ,[user_code, no]
    );

    res.json({
        resultCode: "S-1",
        msg: `${no}번 할 일을 삭제하였습니다.`
    });
});



app.get("/todos", (req, res) => {
    res.json([{ id: 1 }, { id: 2 }]);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});