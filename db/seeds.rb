# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

puts "Creating sample data..."

# Create sample properties
property1 = Property.find_or_create_by!(name: "Sunset Apartments") do |p|
  p.address = "123 Sunset Blvd, Los Angeles, CA"
  p.property_type = "Apartment Complex"
  p.total_units = 24
end

property2 = Property.find_or_create_by!(name: "Downtown Lofts") do |p|
  p.address = "456 Main St, Downtown, CA"
  p.property_type = "Loft Building"
  p.total_units = 12
end

puts "Properties created: #{Property.count}"

# Create sample units
unit1 = Unit.find_or_create_by!(unit_number: "A101") do |u|
  u.property_id = property1.id
  u.unit_type = "1 Bedroom"
  u.rent_amount = 1500.00
  u.occupied = true
end

unit2 = Unit.find_or_create_by!(unit_number: "A102") do |u|
  u.property_id = property1.id
  u.unit_type = "2 Bedroom"
  u.rent_amount = 2000.00
  u.occupied = true
end

unit3 = Unit.find_or_create_by!(unit_number: "B201") do |u|
  u.property_id = property2.id
  u.unit_type = "Studio"
  u.rent_amount = 1200.00
  u.occupied = false
end

puts "Units created: #{Unit.count}"

# Create sample users (tenants)
tenant_user1 = User.find_or_create_by!(email: "tenant1@example.com") do |u|
  u.name = "John Doe"
  u.role = "tenant"
  u.phone = "+1234567890"
  u.password = "password123"
  u.password_confirmation = "password123"
end

tenant_user2 = User.find_or_create_by!(email: "tenant2@example.com") do |u|
  u.name = "Jane Smith"
  u.role = "tenant"
  u.phone = "+1234567891"
  u.password = "password123"
  u.password_confirmation = "password123"
end

puts "Users created: #{User.count}"

# Create sample tenants (tenant records)
tenant1 = Tenant.find_or_create_by!(user: tenant_user1, unit: unit1) do |t|
  t.lease_start_date = Date.new(2024, 1, 1)
  t.lease_end_date = Date.new(2024, 12, 31)
  t.rent_amount = 1500.00
  t.status = "active"
end

tenant2 = Tenant.find_or_create_by!(user: tenant_user2, unit: unit2) do |t|
  t.lease_start_date = Date.new(2024, 2, 1)
  t.lease_end_date = Date.new(2025, 1, 31)
  t.rent_amount = 2000.00
  t.status = "active"
end

puts "Tenants created: #{Tenant.count}"

# Create sample maintenance requests
MaintenanceRequest.find_or_create_by!(title: "Leaky Faucet") do |mr|
  mr.property = property1
  mr.unit = unit1
  mr.tenant = tenant1
  mr.description = "Kitchen faucet is leaking and needs repair"
  mr.priority = "medium"
  mr.status = "pending"
  mr.requested_date = DateTime.now - 2.days
end

MaintenanceRequest.find_or_create_by!(title: "Broken AC") do |mr|
  mr.property = property1
  mr.unit = unit2
  mr.tenant = tenant2
  mr.description = "Air conditioning unit not working properly"
  mr.priority = "high"
  mr.status = "in_progress"
  mr.requested_date = DateTime.now - 1.day
end

MaintenanceRequest.find_or_create_by!(title: "Light Bulb Replacement") do |mr|
  mr.property = property2
  mr.unit = unit3
  mr.tenant = tenant1
  mr.description = "Several light bulbs need replacement in common areas"
  mr.priority = "low"
  mr.status = "completed"
  mr.requested_date = DateTime.now - 5.days
  mr.completed_date = DateTime.now - 1.day
end

puts "Maintenance Requests created: #{MaintenanceRequest.count}"

# Create sample rent payments
RentPayment.find_or_create_by!(reference_number: "RP001") do |rp|
  rp.tenant = tenant1
  rp.unit = unit1
  rp.amount = 1500.00
  rp.payment_date = Date.current - 15.days
  rp.payment_method = "bank_transfer"
  rp.status = "paid"
end

RentPayment.find_or_create_by!(reference_number: "RP002") do |rp|
  rp.tenant = tenant2
  rp.unit = unit2
  rp.amount = 2000.00
  rp.payment_date = Date.current - 10.days
  rp.payment_method = "credit_card"
  rp.status = "paid"
end

RentPayment.find_or_create_by!(reference_number: "RP003") do |rp|
  rp.tenant = tenant1
  rp.unit = unit1
  rp.amount = 1500.00
  rp.payment_date = Date.current
  rp.payment_method = "bank_transfer"
  rp.status = "pending"
end

puts "Rent Payments created: #{RentPayment.count}"

# Create sample blog articles
puts "Creating blog articles..."

articles_data = [
  {
    title: "From React to Rails: The Great Migration",
    content: "Our journey from a React-based frontend to a full Rails application was both challenging and rewarding. We discovered that Rails' convention-over-configuration approach significantly reduced our development time while maintaining the flexibility we needed for our property management platform.

The migration involved several key phases:
1. Setting up the Rails environment with proper asset pipeline configuration
2. Converting React components to Rails views with ERB templates
3. Implementing Turbo and Stimulus for dynamic interactions
4. Optimizing database queries and improving performance

The result was a more maintainable codebase with better SEO capabilities and faster page loads. Rails' built-in security features also gave us peace of mind when handling sensitive property and tenant data.",
    author: "RentWise Team",
    published_at: 1.week.ago,
    medium_url: "https://medium.com/@rentwise/from-react-to-rails-the-great-migration",
    featured: true
  },
  {
    title: "Blockchain Integration: Quorum Revolution",
    content: "Integrating blockchain technology into our property management platform was a game-changer. We chose Hyperledger Besu (formerly Quorum) for its enterprise-grade features and privacy capabilities.

Key benefits we've achieved:
- Immutable property records and transaction history
- Smart contracts for automated rent collection and maintenance requests
- Enhanced security and transparency for all stakeholders
- Reduced fraud and improved trust between landlords and tenants

The implementation required careful consideration of:
- Network architecture and node management
- Smart contract development and deployment
- Integration with existing Rails backend
- User experience design for blockchain interactions

Our blockchain integration has set us apart in the property management industry, providing unprecedented levels of transparency and automation.",
    author: "RentWise Team",
    published_at: 3.days.ago,
    medium_url: "https://medium.com/@rentwise/blockchain-integration-quorum-revolution",
    featured: true
  },
  {
    title: "Production Deployment: Scaling Success",
    content: "Taking RentWise from development to production required careful planning and robust infrastructure. We implemented a comprehensive deployment strategy that ensures high availability and scalability.

Our production setup includes:
- Docker containerization for consistent environments
- Load balancing and auto-scaling capabilities
- Database optimization and caching strategies
- Monitoring and alerting systems
- Automated backup and disaster recovery

Performance optimizations we implemented:
- Database query optimization and indexing
- Asset compression and CDN integration
- Background job processing for heavy operations
- Caching strategies for frequently accessed data

The result is a production-ready platform that can handle thousands of properties and users while maintaining excellent performance and reliability.",
    author: "RentWise Team",
    published_at: 1.day.ago,
    medium_url: "https://medium.com/@rentwise/production-deployment-scaling-success",
    featured: false
  },
  {
    title: "The Future of Property Management Technology",
    content: "As we look ahead, the property management industry is poised for significant technological transformation. Our vision for RentWise includes:

Emerging Technologies:
- AI-powered predictive maintenance
- IoT integration for smart building management
- Virtual reality property tours
- Advanced analytics and reporting

Industry Trends:
- Increased focus on sustainability and energy efficiency
- Growing demand for contactless property management
- Integration with smart city initiatives
- Enhanced tenant experience through technology

We're committed to staying at the forefront of these developments, continuously improving our platform to meet the evolving needs of property managers and tenants alike.",
    author: "RentWise Team",
    published_at: 6.hours.ago,
    medium_url: "https://medium.com/@rentwise/future-of-property-management-technology",
    featured: false
  }
]

articles_data.each do |article_data|
  Article.create!(article_data)
end

puts "Created #{Article.count} blog articles"

puts "Sample data created successfully!"
puts "Properties: #{Property.count}"
puts "Units: #{Unit.count}"
puts "Users: #{User.count}"
puts "Tenants: #{Tenant.count}"
puts "Maintenance Requests: #{MaintenanceRequest.count}"
puts "Rent Payments: #{RentPayment.count}"
