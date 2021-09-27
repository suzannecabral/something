import { ProductList } from "./Products/Product";
import NewProduct from "./Products/Form";

// const Product = { Products, NewProduct, ProductList };
const Product = { NewProduct, ProductList };

export default Product; // bundled

// individual
export { NewProduct, ProductList };
