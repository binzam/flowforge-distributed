import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div>
      <div>
        <p className="text-sm text-green">Welcome to</p>
        <h1 className="text-dark-green mt-1 text-4xl font-bold">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-green">
          Manage your orders, inventory, and fulfillments
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to={"orders"}>
          <div className="p-6 rounded-lg border bg-cream border-light-green">
            <p className="text-sm text-green">Quick Link</p>
            <h3 className="text-dark-green mt-2 text-lg font-semibold">
              Orders
            </h3>
            <p className="mt-1 text-sm text-green">
              View and manage all orders
            </p>
          </div>
        </Link>
        <Link to={"inventory"}>
          <div className="p-6 rounded-lg border bg-cream border-light-green">
            <p className="text-sm text-green">Quick Link</p>
            <h3 className="text-dark-green mt-2 text-lg font-semibold">
              Inventory
            </h3>
            <p className="mt-1 text-sm text-green">
              Track product inventory levels
            </p>
          </div>
        </Link>
        <Link to={"fulfillments"}>
          <div className="p-6 rounded-lg border bg-cream border-light-green">
            <p className="text-sm text-green">Quick Link</p>
            <h3 className="text-dark-green mt-2 text-lg font-semibold">
              Fulfillments
            </h3>
            <p className="mt-1 text-sm text-green">
              Monitor order fulfillments
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};
export default AdminDashboard;
