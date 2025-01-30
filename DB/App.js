  const express=require('express')
  const Mysql= require('mysql2');
  const cors=require('cors');
  const app=express();
  const PORT=2003;
  

app.use(express.json());
app.use(cors())
  const dbConnection = Mysql.createPool({
    user: "milk@apo",
    database: "myproduct",
    password: "12345678",
    connectionLimit: 10,
    host: "localhost"
  });


  dbConnection.getConnection((err,connection)=>{
    if (err) throw err
    console.log('database connnected successfully!')
    connection.release();
  })



app.listen(PORT,(req,res)=>{
console.log(`your server is listenining you on por ${PORT}`)
});

app.get('/products', (req,res)=>{
const select = 'SELECT *FROM products';
dbConnection.query(select,(err,result)=>{
  if (err) return res.json(err);
  return res.json(result);
     })
})
app.post('/products',(req,res)=>{
 const insert= "INSERT INTO products(`name`, `category`, `brand`) VALUES (?, ?, ?)";

  const values =[req.body.name,req.body.category,req.body.brand]
  dbConnection.query(insert,values, (err,req, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
})




app.patch("/products/:productId", (req, res) => {
  const productId = Number(req.params.productId);
  const Update =
    "UPDATE products SET `name` = ?, `category` = ?, `brand` = ? WHERE productId = ?";;
  dbConnection.query(
    Update,
    [req.body.name, req.body.category, req.body.BRAND, productId],
    (err, result) => {
      if (err) return res.json(err);
      return res.json(result);
    }
  );
});
app.delete("/products/:productId", (req, res) => {
  const productId = Number(req.params.productId);
  const Delete ='DELETE FROM products  WHERE productId=?';
  dbConnection.query(Delete, productId, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});
