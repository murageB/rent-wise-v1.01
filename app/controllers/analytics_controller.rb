class AnalyticsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_date_range, only: [:dashboard, :financial, :occupancy, :maintenance, :export]

  def dashboard
    @analytics_service = AnalyticsService.new(current_user, @start_date, @end_date)
    
    # Key Performance Indicators
    @kpis = @analytics_service.kpis
    
    # Charts data
    @revenue_trend = @analytics_service.revenue_trend
    @occupancy_trend = @analytics_service.occupancy_trend
    @maintenance_trend = @analytics_service.maintenance_trend
    
    # Top performing properties
    @top_properties = @analytics_service.top_properties
    
    # Recent activity
    @recent_payments = @analytics_service.recent_payments
    @recent_maintenance = @analytics_service.recent_maintenance
  end

  def financial
    @analytics_service = AnalyticsService.new(current_user, @start_date, @end_date)
    
    @financial_summary = @analytics_service.financial_summary
    @revenue_breakdown = @analytics_service.revenue_breakdown
    @expense_breakdown = @analytics_service.expense_breakdown
    @cash_flow = @analytics_service.cash_flow
    @rent_collection_rate = @analytics_service.rent_collection_rate
    @average_rent = @analytics_service.average_rent
  end

  def occupancy
    @analytics_service = AnalyticsService.new(current_user, @start_date, @end_date)
    
    @occupancy_summary = @analytics_service.occupancy_summary
    @vacancy_trend = @analytics_service.vacancy_trend
    @turnover_analysis = @analytics_service.turnover_analysis
    @lease_expirations = @analytics_service.lease_expirations
  end

  def maintenance
    @analytics_service = AnalyticsService.new(current_user, @start_date, @end_date)
    
    @maintenance_summary = @analytics_service.maintenance_summary
    @maintenance_by_priority = @analytics_service.maintenance_by_priority
    @maintenance_by_property = @analytics_service.maintenance_by_property
    @response_time_analysis = @analytics_service.response_time_analysis
    @cost_analysis = @analytics_service.maintenance_cost_analysis
  end

  def property_analytics
    @property = Property.find(params[:id])
    @analytics_service = AnalyticsService.new(current_user, @start_date, @end_date, @property)
    
    @property_kpis = @analytics_service.property_kpis(@property)
    @property_revenue = @analytics_service.property_revenue(@property)
    @property_occupancy = @analytics_service.property_occupancy(@property)
    @property_maintenance = @analytics_service.property_maintenance(@property)
  end

  def export
    @analytics_service = AnalyticsService.new(current_user, @start_date, @end_date)
    
    respond_to do |format|
      format.csv do
        send_data @analytics_service.export_csv(params[:report_type]), 
                  filename: "#{params[:report_type]}_report_#{Date.today}.csv"
      end
      
      format.pdf do
        render pdf: "#{params[:report_type]}_report_#{Date.today}",
               template: "analytics/export_pdf",
               layout: "pdf",
               disposition: "attachment"
      end
    end
  end

  def real_time
    @analytics_service = AnalyticsService.new(current_user)
    
    render json: {
      total_revenue: @analytics_service.total_revenue,
      occupancy_rate: @analytics_service.occupancy_rate,
      pending_maintenance: @analytics_service.pending_maintenance_count,
      overdue_payments: @analytics_service.overdue_payments_count,
      active_tenants: @analytics_service.active_tenants_count
    }
  end

  private

  def set_date_range
    @end_date = params[:end_date]&.to_date || Date.today
    @start_date = params[:start_date]&.to_date || @end_date - 30.days
  end
end 