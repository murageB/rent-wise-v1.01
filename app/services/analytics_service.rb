require 'csv'

class AnalyticsService
  attr_reader :user, :start_date, :end_date, :property

  def initialize(user, start_date = nil, end_date = nil, property = nil)
    @user = user
    @start_date = start_date || 30.days.ago.to_date
    @end_date = end_date || Date.today
    @property = property
  end

  # Key Performance Indicators
  def kpis
    {
      total_revenue: total_revenue,
      occupancy_rate: occupancy_rate,
      average_rent: average_rent,
      rent_collection_rate: rent_collection_rate,
      maintenance_completion_rate: maintenance_completion_rate,
      tenant_satisfaction_score: tenant_satisfaction_score
    }
  end

  # Financial Analytics
  def financial_summary
    {
      total_revenue: total_revenue,
      total_expenses: total_expenses,
      net_income: total_revenue - total_expenses,
      gross_margin: gross_margin,
      operating_expense_ratio: operating_expense_ratio
    }
  end

  def revenue_breakdown
    {
      rent_revenue: rent_revenue,
      water_bill_revenue: water_bill_revenue,
      late_fees: late_fees,
      other_income: other_income
    }
  end

  def expense_breakdown
    {
      maintenance_costs: maintenance_costs,
      utilities: utilities_costs,
      insurance: insurance_costs,
      property_taxes: property_taxes,
      other_expenses: other_expenses
    }
  end

  def cash_flow
    monthly_cash_flow = []
    current_date = @start_date.beginning_of_month
    
    while current_date <= @end_date
      month_start = current_date.beginning_of_month
      month_end = current_date.end_of_month
      
      monthly_cash_flow << {
        month: current_date.strftime("%B %Y"),
        revenue: monthly_revenue(month_start, month_end),
        expenses: monthly_expenses(month_start, month_end),
        net_cash_flow: monthly_revenue(month_start, month_end) - monthly_expenses(month_start, month_end)
      }
      
      current_date = current_date + 1.month
    end
    
    monthly_cash_flow
  end

  # Revenue Analytics
  def revenue_trend
    daily_revenue = []
    current_date = @start_date
    
    while current_date <= @end_date
      daily_revenue << {
        date: current_date.strftime("%Y-%m-%d"),
        revenue: daily_revenue(current_date)
      }
      current_date = current_date + 1.day
    end
    
    daily_revenue
  end

  def total_revenue
    scope = base_scope
    scope.joins(:rent_payments)
         .where(rent_payments: { payment_date: @start_date..@end_date })
         .sum('rent_payments.amount')
  end

  def rent_revenue
    scope = base_scope
    scope.joins(:rent_payments)
         .where(rent_payments: { payment_date: @start_date..@end_date })
         .sum('rent_payments.amount')
  end

  def water_bill_revenue
    scope = base_scope
    scope.joins(units: :water_bills)
         .where(water_bills: { paid_date: @start_date..@end_date })
         .sum('water_bills.total_amount')
  end

  def late_fees
    # Calculate late fees based on overdue payments
    overdue_payments = RentPayment.where(
      payment_date: @start_date..@end_date,
      status: 'overdue'
    )
    
    overdue_payments.sum { |payment| calculate_late_fee(payment) }
  end

  # Occupancy Analytics
  def occupancy_summary
    total_units = total_units_count
    occupied_units = occupied_units_count
    
    {
      total_units: total_units,
      occupied_units: occupied_units,
      vacant_units: total_units - occupied_units,
      occupancy_rate: total_units > 0 ? (occupied_units.to_f / total_units * 100).round(2) : 0,
      average_tenancy_duration: average_tenancy_duration
    }
  end

  def occupancy_trend
    monthly_occupancy = []
    current_date = @start_date.beginning_of_month
    
    while current_date <= @end_date
      month_start = current_date.beginning_of_month
      month_end = current_date.end_of_month
      
      total_units = units_in_period(month_start, month_end).count
      occupied_units = occupied_units_in_period(month_start, month_end).count
      
      monthly_occupancy << {
        month: current_date.strftime("%B %Y"),
        total_units: total_units,
        occupied_units: occupied_units,
        occupancy_rate: total_units > 0 ? (occupied_units.to_f / total_units * 100).round(2) : 0
      }
      
      current_date = current_date + 1.month
    end
    
    monthly_occupancy
  end

  def vacancy_trend
    occupancy_trend.map do |data|
      {
        month: data[:month],
        vacancy_rate: 100 - data[:occupancy_rate]
      }
    end
  end

  def turnover_analysis
    {
      total_turnovers: total_turnovers,
      average_turnover_rate: average_turnover_rate,
      turnover_by_property: turnover_by_property,
      reasons_for_turnover: reasons_for_turnover
    }
  end

  def lease_expirations
    upcoming_expirations = Tenant.where(
      lease_end_date: Date.today..6.months.from_now
    ).includes(:unit, :property)
    
    upcoming_expirations.group_by_month(:lease_end_date, format: "%B %Y")
                       .count
  end

  # Maintenance Analytics
  def maintenance_summary
    total_requests = maintenance_requests_count
    completed_requests = completed_maintenance_count
    
    {
      total_requests: total_requests,
      completed_requests: completed_requests,
      pending_requests: total_requests - completed_requests,
      completion_rate: total_requests > 0 ? (completed_requests.to_f / total_requests * 100).round(2) : 0,
      average_response_time: average_response_time,
      average_completion_time: average_completion_time
    }
  end

  def maintenance_trend
    monthly_maintenance = []
    current_date = @start_date.beginning_of_month
    
    while current_date <= @end_date
      month_start = current_date.beginning_of_month
      month_end = current_date.end_of_month
      
      requests = maintenance_requests_in_period(month_start, month_end)
      
      monthly_maintenance << {
        month: current_date.strftime("%B %Y"),
        total_requests: requests.count,
        completed_requests: requests.where.not(completed_date: nil).count,
        high_priority_requests: requests.where(priority: 'high').count
      }
      
      current_date = current_date + 1.month
    end
    
    monthly_maintenance
  end

  def maintenance_by_priority
    scope = base_scope
    scope.joins(:maintenance_requests)
         .where(maintenance_requests: { created_at: @start_date..@end_date })
         .group('maintenance_requests.priority')
         .count
  end

  def maintenance_by_property
    scope = base_scope
    scope.joins(:maintenance_requests)
         .where(maintenance_requests: { created_at: @start_date..@end_date })
         .group('properties.name')
         .count
  end

  def response_time_analysis
    completed_requests = MaintenanceRequest.where.not(completed_date: nil)
                                         .where(created_at: @start_date..@end_date)
    
    response_times = completed_requests.map do |request|
      (request.completed_date - request.created_at) / 1.day
    end
    
    {
      average_response_time: response_times.sum / response_times.count,
      fastest_response: response_times.min,
      slowest_response: response_times.max,
      response_time_distribution: response_time_distribution(response_times)
    }
  end

  # Property-specific Analytics
  def property_kpis(property)
    {
      total_revenue: property_revenue(property),
      occupancy_rate: property_occupancy_rate(property),
      maintenance_requests: property_maintenance_count(property),
      average_rent: property_average_rent(property),
      tenant_satisfaction: property_tenant_satisfaction(property)
    }
  end

  def property_revenue(property)
    property.units.joins(:rent_payments)
            .where(rent_payments: { payment_date: @start_date..@end_date })
            .sum('rent_payments.amount')
  end

  def property_occupancy(property)
    total_units = property.units.count
    occupied_units = property.units.joins(:tenant).count
    
    {
      total_units: total_units,
      occupied_units: occupied_units,
      vacancy_rate: total_units > 0 ? ((total_units - occupied_units).to_f / total_units * 100).round(2) : 0
    }
  end

  def property_maintenance(property)
    requests = property.maintenance_requests.where(created_at: @start_date..@end_date)
    
    {
      total_requests: requests.count,
      completed_requests: requests.where.not(completed_date: nil).count,
      pending_requests: requests.where(completed_date: nil).count,
      average_completion_time: calculate_average_completion_time(requests)
    }
  end

  # Top Performers
  def top_properties
    scope = base_scope
    scope.joins(:units)
         .joins('LEFT JOIN rent_payments ON rent_payments.unit_id = units.id')
         .where(rent_payments: { payment_date: @start_date..@end_date })
         .group('properties.id, properties.name')
         .order('SUM(rent_payments.amount) DESC')
         .limit(5)
         .pluck('properties.name, SUM(rent_payments.amount)')
  end

  # Recent Activity
  def recent_payments
    RentPayment.includes(:tenant, :unit)
               .where(payment_date: @start_date..@end_date)
               .order(payment_date: :desc)
               .limit(10)
  end

  def recent_maintenance
    MaintenanceRequest.includes(:property, :unit, :tenant)
                      .where(created_at: @start_date..@end_date)
                      .order(created_at: :desc)
                      .limit(10)
  end

  # Export functionality
  def export_csv(report_type)
    case report_type
    when 'financial'
      export_financial_csv
    when 'occupancy'
      export_occupancy_csv
    when 'maintenance'
      export_maintenance_csv
    else
      export_general_csv
    end
  end

  # Real-time metrics
  def total_revenue
    scope = base_scope
    scope.joins(:rent_payments)
         .sum('rent_payments.amount')
  end

  def occupancy_rate
    total_units = total_units_count
    occupied_units = occupied_units_count
    
    total_units > 0 ? (occupied_units.to_f / total_units * 100).round(2) : 0
  end

  def pending_maintenance_count
    scope = base_scope
    scope.joins(:maintenance_requests)
         .where(maintenance_requests: { status: 'pending' })
         .count
  end

  def overdue_payments_count
    RentPayment.where('payment_date < ?', Date.today)
               .where(status: 'pending')
               .count
  end

  def active_tenants_count
    Tenant.where(status: 'active').count
  end

  private

  def base_scope
    if @property
      Property.where(id: @property.id)
    else
      Property.all
    end
  end

  def total_units_count
    scope = base_scope
    scope.joins(:units).count
  end

  def occupied_units_count
    scope = base_scope
    scope.joins(units: :tenant).count
  end

  def maintenance_requests_count
    scope = base_scope
    scope.joins(:maintenance_requests)
         .where(maintenance_requests: { created_at: @start_date..@end_date })
         .count
  end

  def completed_maintenance_count
    scope = base_scope
    scope.joins(:maintenance_requests)
         .where(maintenance_requests: { created_at: @start_date..@end_date })
         .where.not(maintenance_requests: { completed_date: nil })
         .count
  end

  def average_rent
    scope = base_scope
    scope.joins(:units)
         .average('units.rent_amount') || 0
  end

  def rent_collection_rate
    total_expected = total_expected_rent
    total_collected = total_revenue
    
    total_expected > 0 ? (total_collected.to_f / total_expected * 100).round(2) : 0
  end

  def maintenance_completion_rate
    total_requests = maintenance_requests_count
    completed_requests = completed_maintenance_count
    
    total_requests > 0 ? (completed_requests.to_f / total_requests * 100).round(2) : 0
  end

  def tenant_satisfaction_score
    # Placeholder for tenant satisfaction calculation
    # This would typically come from tenant surveys or feedback
    85.5
  end

  def total_expenses
    # Placeholder for expense calculation
    # This would include maintenance costs, utilities, insurance, etc.
    maintenance_costs + utilities_costs + insurance_costs + property_taxes + other_expenses
  end

  def maintenance_costs
    # Placeholder for maintenance cost calculation
    5000.0
  end

  def utilities_costs
    # Placeholder for utilities cost calculation
    2000.0
  end

  def insurance_costs
    # Placeholder for insurance cost calculation
    1500.0
  end

  def property_taxes
    # Placeholder for property tax calculation
    3000.0
  end

  def other_expenses
    # Placeholder for other expenses
    1000.0
  end

  def gross_margin
    total_revenue > 0 ? ((total_revenue - total_expenses).to_f / total_revenue * 100).round(2) : 0
  end

  def operating_expense_ratio
    total_revenue > 0 ? (total_expenses.to_f / total_revenue * 100).round(2) : 0
  end

  def other_income
    # Placeholder for other income sources
    500.0
  end

  def daily_revenue(date)
    RentPayment.where(payment_date: date).sum(:amount)
  end

  def monthly_revenue(start_date, end_date)
    RentPayment.where(payment_date: start_date..end_date).sum(:amount)
  end

  def monthly_expenses(start_date, end_date)
    # Placeholder for monthly expenses calculation
    5000.0
  end

  def units_in_period(start_date, end_date)
    Unit.where(created_at: start_date..end_date)
  end

  def occupied_units_in_period(start_date, end_date)
    Unit.joins(:tenant).where(tenants: { lease_start_date: start_date..end_date })
  end

  def maintenance_requests_in_period(start_date, end_date)
    MaintenanceRequest.where(created_at: start_date..end_date)
  end

  def total_turnovers
    Tenant.where(lease_end_date: @start_date..@end_date).count
  end

  def average_turnover_rate
    total_units = total_units_count
    total_turnovers > 0 ? (total_turnovers.to_f / total_units * 100).round(2) : 0
  end

  def turnover_by_property
    Tenant.joins(unit: :property)
          .where(lease_end_date: @start_date..@end_date)
          .group('properties.name')
          .count
  end

  def reasons_for_turnover
    # Placeholder for turnover reasons analysis
    {
      'Lease Expiration' => 60,
      'Tenant Request' => 25,
      'Property Issues' => 10,
      'Other' => 5
    }
  end

  def average_tenancy_duration
    tenants = Tenant.where.not(lease_start_date: nil, lease_end_date: nil)
    return 0 if tenants.empty?
    
    total_duration = tenants.sum do |tenant|
      (tenant.lease_end_date - tenant.lease_start_date).to_i / 365.0
    end
    
    (total_duration / tenants.count).round(2)
  end

  def average_response_time
    completed_requests = MaintenanceRequest.where.not(completed_date: nil)
                                         .where(created_at: @start_date..@end_date)
    
    return 0 if completed_requests.empty?
    
    total_time = completed_requests.sum do |request|
      (request.completed_date - request.created_at) / 1.day
    end
    
    (total_time / completed_requests.count).round(2)
  end

  def average_completion_time
    average_response_time
  end

  def response_time_distribution(response_times)
    {
      '0-1 days' => response_times.count { |t| t <= 1 },
      '1-3 days' => response_times.count { |t| t > 1 && t <= 3 },
      '3-7 days' => response_times.count { |t| t > 3 && t <= 7 },
      '7+ days' => response_times.count { |t| t > 7 }
    }
  end

  def property_occupancy_rate(property)
    total_units = property.units.count
    occupied_units = property.units.joins(:tenant).count
    
    total_units > 0 ? (occupied_units.to_f / total_units * 100).round(2) : 0
  end

  def property_maintenance_count(property)
    property.maintenance_requests.where(created_at: @start_date..@end_date).count
  end

  def property_average_rent(property)
    property.units.average(:rent_amount) || 0
  end

  def property_tenant_satisfaction(property)
    # Placeholder for property-specific tenant satisfaction
    88.0
  end

  def calculate_late_fee(payment)
    days_overdue = (Date.today - payment.payment_date).to_i
    payment.amount * 0.05 * (days_overdue / 30.0).ceil
  end

  def total_expected_rent
    scope = base_scope
    scope.joins(:units)
         .sum('units.rent_amount')
  end

  def calculate_average_completion_time(requests)
    completed_requests = requests.where.not(completed_date: nil)
    return 0 if completed_requests.empty?
    
    total_time = completed_requests.sum do |request|
      (request.completed_date - request.created_at) / 1.day
    end
    
    (total_time / completed_requests.count).round(2)
  end

  def export_financial_csv
    CSV.generate(headers: true) do |csv|
      csv << ['Date', 'Revenue', 'Expenses', 'Net Income']
      
      cash_flow.each do |month|
        csv << [month[:month], month[:revenue], month[:expenses], month[:net_cash_flow]]
      end
    end
  end

  def export_occupancy_csv
    CSV.generate(headers: true) do |csv|
      csv << ['Month', 'Total Units', 'Occupied Units', 'Vacancy Rate (%)']
      
      occupancy_trend.each do |month|
        csv << [month[:month], month[:total_units], month[:occupied_units], month[:occupancy_rate]]
      end
    end
  end

  def export_maintenance_csv
    CSV.generate(headers: true) do |csv|
      csv << ['Month', 'Total Requests', 'Completed Requests', 'High Priority Requests']
      
      maintenance_trend.each do |month|
        csv << [month[:month], month[:total_requests], month[:completed_requests], month[:high_priority_requests]]
      end
    end
  end

  def export_general_csv
    CSV.generate(headers: true) do |csv|
      csv << ['Metric', 'Value']
      csv << ['Total Revenue', total_revenue]
      csv << ['Occupancy Rate (%)', occupancy_rate]
      csv << ['Average Rent', average_rent]
      csv << ['Rent Collection Rate (%)', rent_collection_rate]
      csv << ['Maintenance Completion Rate (%)', maintenance_completion_rate]
    end
  end

  # Missing methods referenced in controller
  def maintenance_cost_analysis
    {
      total_maintenance_cost: maintenance_costs,
      cost_by_priority: maintenance_cost_by_priority,
      cost_by_property: maintenance_cost_by_property,
      average_cost_per_request: average_maintenance_cost_per_request
    }
  end

  def maintenance_cost_by_priority
    # Placeholder for maintenance cost by priority
    {
      'high' => 3000.0,
      'medium' => 1500.0,
      'low' => 500.0
    }
  end

  def maintenance_cost_by_property
    # Placeholder for maintenance cost by property
    Property.all.map { |property| [property.name, rand(1000..5000).to_f] }.to_h
  end

  def average_maintenance_cost_per_request
    total_requests = maintenance_requests_count
    total_requests > 0 ? (maintenance_costs / total_requests).round(2) : 0
  end
end 