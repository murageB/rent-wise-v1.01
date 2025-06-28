class WaterBill < ApplicationRecord
  belongs_to :unit
  belongs_to :tenant

  validates :unit_id, :tenant_id, :billing_period, :current_reading, :previous_reading, :rate_per_unit, :due_date, presence: true
  validates :reconnection_fee, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  def total_due
    total = (usage_amount.to_f * rate_per_unit.to_f)
    total += reconnection_fee.to_f if disconnected?
    total
  end
end 