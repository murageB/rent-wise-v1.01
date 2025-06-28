class PropertiesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_property, only: %i[ show edit update destroy ]

  # GET /properties or /properties.json
  def index
    @properties = Property.all.order(created_at: :desc)
  end

  # GET /properties/1 or /properties/1.json
  def show
  end

  # GET /properties/new
  def new
    @property = Property.new
  end

  # GET /properties/1/edit
  def edit
  end

  # POST /properties or /properties.json
  def create
    @property = Property.new(property_params)

    respond_to do |format|
      if @property.save
        format.html { redirect_to @property, notice: "Property '#{@property.name}' was successfully created." }
        format.json { render :show, status: :created, location: @property }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @property.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /properties/1 or /properties/1.json
  def update
    respond_to do |format|
      if @property.update(property_params)
        format.html { redirect_to @property, notice: "Property '#{@property.name}' was successfully updated." }
        format.json { render :show, status: :ok, location: @property }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @property.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /properties/1 or /properties/1.json
  def destroy
    property_name = @property.name
    
    respond_to do |format|
      if @property.destroy
        format.html { redirect_to properties_path, status: :see_other, notice: "Property '#{property_name}' was successfully deleted." }
        format.json { head :no_content }
      else
        format.html { redirect_to @property, alert: "Unable to delete property. Please ensure all units and tenants are removed first." }
        format.json { render json: { error: "Unable to delete property" }, status: :unprocessable_entity }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_property
      @property = Property.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to properties_path, alert: "Property not found."
    end

    # Only allow a list of trusted parameters through.
    def property_params
      params.require(:property).permit(:name, :address, :property_type, :status, :total_units)
    end
end
