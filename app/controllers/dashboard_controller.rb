class DashboardController < ApplicationController
  before_action :authenticate_user!
  
  def index
    # For now, we'll use a simple role system
    # In a real app, you'd have a role field in the User model
    @user_role = determine_user_role
    @properties = Property.all
    @units = Unit.all
    @tenants = Tenant.all
    @maintenance_requests = MaintenanceRequest.all
    @rent_payments = RentPayment.all
    
    case @user_role
    when 'landlord'
      render 'landlord_dashboard'
    when 'caretaker'
      render 'caretaker_dashboard'
    when 'tenant'
      render 'tenant_dashboard'
    else
      render 'default_dashboard'
    end
  end
  
  private
  
  def determine_user_role
    # Simple role determination - in real app, this would come from User model
    # For now, we'll use the first character of email as role indicator
    if current_user.email.start_with?('landlord')
      'landlord'
    elsif current_user.email.start_with?('caretaker')
      'caretaker'
    elsif current_user.email.start_with?('tenant')
      'tenant'
    else
      'landlord' # Default to landlord for testing
    end
  end
end 