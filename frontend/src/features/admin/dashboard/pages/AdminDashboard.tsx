const AdminDashboard = () => {
  return (
    <div>
      <div>
        <p className="text-sm" style={{ color: "var(--brand-green)" }}>
          Welcome to
        </p>
        <h1
          className="mt-1 text-4xl font-bold"
          style={{ color: "var(--brand-dark-green)" }}
        >
          Admin Dashboard
        </h1>
        <p className="mt-2" style={{ color: "var(--brand-green)" }}>
          Manage your orders, inventory, and fulfillments
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: "var(--brand-cream)",
            borderColor: "var(--brand-light-green)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--brand-green)" }}>
            Quick Link
          </p>
          <h3
            className="mt-2 text-lg font-semibold"
            style={{ color: "var(--brand-dark-green)" }}
          >
            Orders
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--brand-green)" }}>
            View and manage all orders
          </p>
        </div>

        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: "var(--brand-cream)",
            borderColor: "var(--brand-light-green)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--brand-green)" }}>
            Quick Link
          </p>
          <h3
            className="mt-2 text-lg font-semibold"
            style={{ color: "var(--brand-dark-green)" }}
          >
            Inventory
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--brand-green)" }}>
            Track product inventory levels
          </p>
        </div>

        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: "var(--brand-cream)",
            borderColor: "var(--brand-light-green)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--brand-green)" }}>
            Quick Link
          </p>
          <h3
            className="mt-2 text-lg font-semibold"
            style={{ color: "var(--brand-dark-green)" }}
          >
            Fulfillments
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--brand-green)" }}>
            Monitor order fulfillments
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
