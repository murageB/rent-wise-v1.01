class WaterBillsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_water_bill, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!

  def index
    @water_bills = case current_user.role
    when 'landlord'
      WaterBill.includes(:unit, :tenant).all
    when 'caretaker'
      WaterBill.includes(:unit, :tenant).all
    when 'tenant'
      WaterBill.includes(:unit, :tenant).where(tenant: current_user.tenant)
    else
      WaterBill.none
    end
  end

  def show
  end

  def new
    @water_bill = WaterBill.new
    @units = Unit.all
    @tenants = Tenant.all
  end

  def create
    @water_bill = WaterBill.new(water_bill_params)
    
    if @water_bill.save
      redirect_to @water_bill, notice: 'Water bill was successfully created.'
    else
      @units = Unit.all
      @tenants = Tenant.all
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @units = Unit.all
    @tenants = Tenant.all
  end

  def update
    if @water_bill.update(water_bill_params)
      redirect_to @water_bill, notice: 'Water bill was successfully updated.'
    else
      @units = Unit.all
      @tenants = Tenant.all
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @water_bill.destroy
    redirect_to water_bills_url, notice: 'Water bill was successfully deleted.'
  end

  def mark_as_paid
    @water_bill = WaterBill.find(params[:id])
    @water_bill.update(paid: true, paid_date: Date.current, disconnected: false, reconnection_fee: 0)
    redirect_to @water_bill, notice: 'Water bill marked as paid.'
  end

  private

  def set_water_bill
    @water_bill = WaterBill.find(params[:id])
  end

  def water_bill_params
    params.require(:water_bill).permit(:unit_id, :tenant_id, :billing_period, 
                                      :current_reading, :previous_reading, 
                                      :rate_per_unit, :due_date, :paid, :reconnection_fee, :disconnected)
  end

  def authorize_user!
    unless ['landlord', 'caretaker', 'tenant'].include?(current_user.role)
      redirect_to root_path, alert: 'Access denied.'
    end
  end
end 