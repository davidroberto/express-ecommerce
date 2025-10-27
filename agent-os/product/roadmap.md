# Product Roadmap

1. [ ] **Product Catalog CRUD** — Implement complete product entity with create, read, update, and delete operations exposed through REST endpoints. Include basic validation (name, description, price, stock quantity) and proper error handling. `S`

2. [ ] **Product Category System** — Add categories entity with many-to-many relationship to products. Implement category CRUD endpoints and ability to filter products by category. Introduces relational data modeling and join queries. `S`

3. [ ] **User Registration & Authentication** — Build user entity with secure password hashing (bcrypt), registration endpoint with validation, and login endpoint returning JWT tokens. Includes basic middleware for token verification. `M`

4. [ ] **Shopping Cart Functionality** — Create cart system allowing authenticated users to add/remove/update product quantities. Implement cart persistence in database with cart items relationship. Handle stock validation when adding items. `M`

5. [ ] **Checkout & Order Creation** — Build order placement flow that converts cart to order, validates inventory availability, decrements stock, and creates order with line items. Implement within database transaction to ensure data consistency. `L`

6. [ ] **Order History & Retrieval** — Add endpoints for customers to view their order history with filtering options (date range, status). Implement proper query optimization and pagination. Include order detail view with line items and product information. `S`

7. [ ] **Role-Based Authorization** — Extend user system with roles (customer, admin) and implement authorization middleware. Restrict admin-only endpoints (product management) and ensure users can only access their own orders. `M`

8. [ ] **Admin Dashboard APIs** — Create admin-specific endpoints for viewing all orders, updating order status, viewing inventory levels, and accessing user management. Implement filtering, sorting, and pagination for large datasets. `M`

9. [ ] **Product Search & Filtering** — Add advanced product query capabilities including text search (name, description), price range filtering, category filtering, and sorting options. Optimize queries for performance. `S`

10. [ ] **Order Status Workflow** — Implement order lifecycle state machine with transitions (pending → processing → shipped → delivered). Add admin endpoints to progress orders through states with validation rules and timestamp tracking. `M`

11. [ ] **Inventory Management** — Build inventory tracking system with low-stock alerts, bulk stock updates, and inventory history logging. Add admin endpoints for restocking and viewing inventory movement reports. `M`

12. [ ] **Email Notifications** — Integrate email service for order confirmations, shipping notifications, and password reset flows. Implement templating system and queue mechanism for reliable delivery. `L`

> Notes
> - Roadmap ordered by technical dependencies: entities → authentication → stateful operations → authorization → advanced features
> - Each item represents a complete, testable feature with both backend logic and API endpoints
> - Early features (1-3) establish foundation for database, API patterns, and authentication
> - Mid-stage features (4-7) build core e-commerce functionality
> - Advanced features (8-12) add business-critical capabilities and polish
> - Total estimated time: 12-16 weeks for complete implementation
> - Students can stop after any item with a functional, demonstrable feature set
