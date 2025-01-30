const handleSubmit = async (e) => {
  e.preventDefault();

  // Reset the error message initially
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
