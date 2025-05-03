import { useEffect, useState } from "react";

import "./App.css";
import axios, { Axios } from "axios";

function App() {
  const [Isopen, setIsopen] = useState(false);
  const [products, setProduucts] = useState([]);
  const [filterProducts, setFilterProduucts] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    brand: "",
  });
  const [error, setError] = useState("");


  const handleSearchValue = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filterData = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue) ||
        product.brand.toLowerCase().includes(searchValue)
    );
    setFilterProduucts(filterData);
  };

  const openpopup = () => {
    setIsopen(true);
  };
  const toHide = () => {
    setIsopen(false);
    
  };

  const getAllProducts = async () => {
    axios.get("http://localhost:2003/products").then((res) => {
      
      setProduucts(res.data);
      setFilterProduucts(res.data);
    });
  };

  const handleData = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

   
    setError("");

    // Validate inputs
    if (!productData.name || !productData.category || !productData.brand) {
      setError("All fields are required!");
      return; // Stop execution if validation fails
    }

    // Check if updating an existing product
    if (productData.productId) {
      axios
        .patch(
          `http://localhost:2003/products/${productData.productId}`,
          productData
        )
        .then((res) => {
          console.log("Product updated:", res.data);
          setProductData({ name: "", category: "", brand: "" }); // Reset the form
          getAllProducts(); // Fetch updated products
          setIsopen(false); // Close the popup
        })
        .catch((err) => {
          console.error("Error updating product:", err);
          setError("Failed to update product. Please try again.");
        });
    } else {
      // Adding a new product
      axios
        .post("http://localhost:2003/products", productData)
        .then((res) => {

          console.log("Product added:", res.data);
          setProductData({ name: "", category: "", brand: "" }); // Reset the form
          getAllProducts(); // Fetch updated products
          setIsopen(false); // Close the popup
        })
        .catch((err) => {
          console.error("Error adding product:", err);
          setError("Failed to add product. Please try again.");
        });
    }
  };

  const handleDelete = async (productId) => {
    axios.delete(`http://localhost:2003/products/${productId}`).then((res) => {
      setProduucts(res.data);
      // setFilterProduucts(res.data);
      getAllProducts();
    });
  };

  const handleupdate = (product) => {
    setProductData(product);
    setIsopen(true);
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <section className="mainConatinare">
      <h1>Do your best as much as possible</h1>

      <div className="searchBoX">
        <h3>SearchBox</h3>
        <input
          className="searchInput"
          type="text"
          id="search"
          onChange={handleSearchValue}
          name="search-value"
          placeholder="search here! "
        />
        <button onClick={openpopup} className="addBtn">
          Add
        </button>
      </div>
      <div className="dataBox">
        <h3>dataBox</h3>
        {Isopen && (
          <div className="add_Edit_btn insertion_Container">
            <button className="close" onClick={toHide}>
              Hide
            </button>
            <h1>data to be added or updated</h1>
            <p>{error && <span className="error">{error}</span>}</p>

            <div className="innerContainer">
              <label htmlFor="name">Name</label>
              <br />
              <input
                value={productData.name}
                onChange={handleData}
                type="text"
                name="name"
                id="name"
              />
              <br />
              <label htmlFor="category">Catagory</label>
              <br />
              <input
                onChange={handleData}
                value={productData.category}
                type="text"
                name="category"
                id="category"
              />
              <br />
              <label htmlFor="brand">Brand</label>
              <br />
              <input
                onChange={handleData}
                value={productData.brand}
                type="text"
                name="brand"
                id="brand"
              />
              <br />
              <button onClick={handleSubmit} className="Edit_btn">
                {productData.productId ? "Update product" : " Add Item"}
              </button>
            </div>
          </div>
        )}
        <br />
        <br />

        <table className="table">
          <thead>
            <tr>
              <th>ProductId</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterProducts &&
              filterProducts.map((key) => {
                return (
                  <tr key={key.productId}>
                    <td>{key.productId}</td>
                    <td>{key.name}</td>
                    <td>{key.category}</td>
                    <td>{key.brand}</td>
                    <td>
                      <button
                        onClick={() => handleupdate(key)}
                        className="editbtn"
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(key.productId)}
                        className="deletbtn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default App;
