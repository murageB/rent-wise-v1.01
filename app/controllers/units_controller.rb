class UnitsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_unit, only: [:show, :edit, :update, :destroy]

  def index
    @units = Unit.all
  end

  def show
  end

  def new
    @unit = Unit.new
  end

  def create
    @unit = Unit.new(unit_params)
    if @unit.save
      redirect_to @unit, notice: 'Unit was successfully created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @unit.update(unit_params)
      redirect_to @unit, notice: 'Unit was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @unit.destroy
    redirect_to units_url, notice: 'Unit was successfully deleted.'
  end

  private
    def set_unit
      @unit = Unit.find(params[:id])
    end

    def unit_params
      params.require(:unit).permit(:unit_number, :unit_type, :rent_amount, :property_id)
    end
end
