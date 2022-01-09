const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) =>{
    mysql.getConnection((error,conn) =>
    {
        if(error){
            return res.status(500).send({error:error})
        }
        conn.query('SELECT U.name as username, L.id,B.name, L.date_loan, CASE WHEN returned = 0 THEN "Não devolvido" WHEN returned = 1 THEN "devolvido" ELSE "não emprestado" END as returned FROM loan L, book B, user U where B.id = L.id_book and L.id_user_receiver = U.id',
        (error, result, fields) =>
        {
            conn.release();
            if(error)
            {
                return res.status(500).send({
                    error:error
                })

            }
            return res.status(200).send({response:result})

        });
    })
});

router.post('/', (req,res,next) => {
    
    mysql.getConnection((error, conn)=>
    {
        if(error){return res.status(500).send({error:error})}
        conn.query('INSERT INTO loan(id_user_receiver, id_book, returned, date_loan) VALUES(?,?,?,?)',
        [req.body.id_user_receiver, req.body.id_book, req.body.returned, req.body.date_loan] ,
        (error, result, field) =>
        {
                conn.release();
                if(error){return res.status(500).send({error:error})}
                return res.status(200).send({response: result})
               
        });
    })

       
    
} );


router.post('/returned', (req,res,next) => {
    
    mysql.getConnection((error, conn)=>
    {
        if(error){return res.status(500).send({error:error})}
        conn.query('UPDATE loan SET returned = 1 WHERE id_book = ?',
        [req.body.id_book] ,
        (error, result, field) =>
        {
                conn.release();
                if(error){return res.status(500).send({error:error})}
                return res.status(200).send({response: result})
               
        });
    })

       
    
} );
module.exports = router;